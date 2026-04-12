import { prisma } from "@/lib/prisma";
import { requireCompanyAdmin } from "@/lib/auth";
import { CreateTripForm } from "@/components/CreateTripForm";
import { TripEditor } from "@/components/TripEditor";

export default async function DashboardPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;

  try {
    const { userId } = await requireCompanyAdmin(companyId);
    const trips = await prisma.trip.findMany({
      where: { companyId },
      include: {
        days: {
          orderBy: { sortOrder: "asc" },
          include: { items: { orderBy: { sortOrder: "asc" } } }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return (
      <main>
        <div className="card">
          <h1>Itinerary dashboard</h1>
          <p className="muted">Only the original creator can edit a trip. Other admins can view it here.</p>
          <p>Company ID: {companyId}</p>
          <p>Your user ID: {userId}</p>
        </div>

        <CreateTripForm companyId={companyId} />

        {trips.length === 0 ? (
          <div className="card">
            <p className="muted">No trips yet. Create your first one above.</p>
          </div>
        ) : null}

        {trips.map((trip) => (
          <TripEditor
            key={trip.id}
            canEdit={trip.creatorUserId === userId}
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
        ))}
      </main>
    );
  } catch (error) {
    return (
      <main>
        <div className="card">
          <h1>Admin access required</h1>
          <p className="muted">{error instanceof Error ? error.message : "Could not verify access."}</p>
        </div>
      </main>
    );
  }
}
