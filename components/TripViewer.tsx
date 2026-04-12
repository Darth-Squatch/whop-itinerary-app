type TripViewerProps = {
  trip: {
    title: string;
    destination: string;
    description?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    days: {
      id: string;
      title: string;
      date?: string | null;
      summary?: string | null;
      items: {
        id: string;
        timeLabel?: string | null;
        title: string;
        type: string;
        location?: string | null;
        notes?: string | null;
        externalLink?: string | null;
      }[];
    }[];
  };
};

export function TripViewer({ trip }: TripViewerProps) {
  return (
    <main>
      <div className="card">
        <h1>{trip.title}</h1>
        <p className="muted">{trip.destination}</p>
        <p>
          {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "TBD"} - {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : "TBD"}
        </p>
        {trip.description ? <p>{trip.description}</p> : null}
      </div>

      {trip.days.map((day) => (
        <div className="card" key={day.id}>
          <h2>{day.title}</h2>
          {day.date ? <p className="muted">{new Date(day.date).toLocaleDateString()}</p> : null}
          {day.summary ? <p>{day.summary}</p> : null}
          {day.items.map((item) => (
            <div key={item.id} style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12, marginTop: 12 }}>
              <strong>
                {item.timeLabel ? `${item.timeLabel} - ` : ""}
                {item.title}
              </strong>
              <p className="muted">{item.type}</p>
              {item.location ? <p>Location: {item.location}</p> : null}
              {item.notes ? <p>{item.notes}</p> : null}
              {item.externalLink ? (
                <p>
                  <a href={item.externalLink} target="_blank" rel="noreferrer">
                    Open link
                  </a>
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
