export default function HomePage() {
  return (
    <main>
      <div className="card">
        <h1>Whop Itinerary Builder</h1>
        <p className="muted">
          Use the dashboard route inside Whop to create trips, and the experience route for customers.
        </p>
        <p>
          Dashboard route: <code>/dashboard/[companyId]</code>
        </p>
        <p>
          Customer route: <code>/experience/[experienceId]</code>
        </p>
      </div>
    </main>
  );
}
