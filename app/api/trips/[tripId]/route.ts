import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateTripSchema } from "@/lib/validators";
import { requireCompanyAdmin } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const { tripId } = await params;
    const existingTrip = await prisma.trip.findUnique({ where: { id: tripId } });

    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    }

    const { userId } = await requireCompanyAdmin(existingTrip.companyId);

    if (existingTrip.creatorUserId !== userId) {
      return NextResponse.json(
        { error: "Only the original creator can edit this trip." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = updateTripSchema.parse(body);

    await prisma.$transaction(async (tx) => {
      await tx.trip.update({
        where: { id: tripId },
        data: {
          title: parsed.title,
          destination: parsed.destination,
          description: parsed.description,
          startDate: parsed.startDate ? new Date(parsed.startDate) : null,
          endDate: parsed.endDate ? new Date(parsed.endDate) : null,
          status: parsed.status,
          publishedAt: parsed.status === "PUBLISHED" ? new Date() : null
        }
      });

      if (parsed.days) {
        await tx.tripItem.deleteMany({ where: { day: { tripId } } });
        await tx.tripDay.deleteMany({ where: { tripId } });

        for (const day of parsed.days) {
          await tx.tripDay.create({
            data: {
              tripId,
              dayNumber: day.dayNumber,
              title: day.title,
              date: day.date ? new Date(day.date) : null,
              summary: day.summary,
              sortOrder: day.sortOrder,
              items: {
                create: day.items.map((item) => ({
                  timeLabel: item.timeLabel || null,
                  title: item.title,
                  type: item.type,
                  location: item.location || null,
                  notes: item.notes || null,
                  externalLink: item.externalLink || null,
                  sortOrder: item.sortOrder
                }))
              }
            }
          });
        }
      }
    });

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        days: {
          orderBy: { sortOrder: "asc" },
          include: { items: { orderBy: { sortOrder: "asc" } } }
        }
      }
    });

    return NextResponse.json({
      trip: {
        ...trip,
        startDate: trip?.startDate?.toISOString() ?? null,
        endDate: trip?.endDate?.toISOString() ?? null,
        days: trip?.days.map((day) => ({
          ...day,
          date: day.date?.toISOString() ?? null,
          items: day.items
        }))
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update trip." },
      { status: 400 }
    );
  }
}
