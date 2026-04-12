import { requireExperienceAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TripViewer } from "@/components/TripViewer";

export default async function ExperiencePage({ params }: { params: Promise<{ experienceId: string }> }) {
  const { experienceId } = await params;

  try {
    await requireExperienceAccess(experienceId);

    const trip = await prisma.trip.findUnique({
      where: { experienceId },
      include: {
        days: {
          orderBy: { sortOrder: "asc" },
          include: { items: { orderBy: { sortOrder: "asc" } } }
        }
      }
    });

    if (!trip || trip.status !== "PUBLISHED") {
      return (
        <main>
          <div className="card">
            <h1>Itinerary not ready</h1>
            <p className="muted">This trip has not been published yet.</p>
          </div>
        </main>
      );
    }

    return (
      <TripViewer
        trip={{
          ...trip,
          startDate: trip.startDate?.toISOString() ?? null,
          endDate: trip.endDate?.toISOString() ?? null,
          days: trip.days.map((day) => ({
            ...day,
            date: day.date?.toISOString() ?? null,
            items: day.items.map((item) => ({ ...item }))
          }))
        }}
      />
    );
  } catch (error) {
    return (
      <main>
        <div className="card">
          <h1>Access denied</h1>
          <p className="muted">{error instanceof Error ? error.message : "Could not verify your membership."}</p>
        </div>
      </main>
    );
  }
}
