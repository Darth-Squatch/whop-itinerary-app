import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTripSchema } from "@/lib/validators";
import { requireCompanyAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createTripSchema.parse(body);
    const { userId } = await requireCompanyAdmin(parsed.companyId);

    const trip = await prisma.trip.create({
      data: {
        companyId: parsed.companyId,
        experienceId: parsed.experienceId,
        creatorUserId: userId,
        title: parsed.title,
        destination: parsed.destination,
        description: parsed.description || null,
        startDate: parsed.startDate ? new Date(parsed.startDate) : null,
        endDate: parsed.endDate ? new Date(parsed.endDate) : null,
        days: {
          create: [
            {
              dayNumber: 1,
              title: "Day 1",
              sortOrder: 0,
              items: {
                create: [
                  {
                    title: "Start planning",
                    type: "NOTE",
                    notes: "Add your first activity here.",
                    sortOrder: 0
                  }
                ]
              }
            }
          ]
        }
      }
    });

    return NextResponse.json({ trip });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create trip." },
      { status: 400 }
    );
  }
}
