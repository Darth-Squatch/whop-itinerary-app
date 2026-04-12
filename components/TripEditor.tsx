"use client";

import { useMemo, useState } from "react";

type ItemType = "HOTEL" | "FLIGHT" | "ACTIVITY" | "RESTAURANT" | "TRANSPORTATION" | "RESERVATION" | "NOTE" | "CUSTOM";

type Trip = {
  id: string;
  title: string;
  destination: string;
  description?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  startDate?: string | null;
  endDate?: string | null;
  creatorUserId: string;
  days: {
    id: string;
    dayNumber: number;
    title: string;
    date?: string | null;
    summary?: string | null;
    sortOrder: number;
    items: {
      id: string;
      timeLabel?: string | null;
      title: string;
      type: ItemType;
      location?: string | null;
      notes?: string | null;
      externalLink?: string | null;
      sortOrder: number;
    }[];
  }[];
};

const emptyItem = (sortOrder: number) => ({
  title: "",
  type: "CUSTOM" as ItemType,
  timeLabel: "",
  location: "",
  notes: "",
  externalLink: "",
  sortOrder
});

export function TripEditor({ trip, canEdit }: { trip: Trip; canEdit: boolean }) {
  const [state, setState] = useState(trip);
  const [message, setMessage] = useState("");

  const nextDayNumber = useMemo(() => state.days.length + 1, [state.days.length]);

  function addDay() {
    setState({
      ...state,
      days: [
        ...state.days,
        {
          id: crypto.randomUUID(),
          dayNumber: nextDayNumber,
          title: `Day ${nextDayNumber}`,
          date: "",
          summary: "",
          sortOrder: state.days.length,
          items: [emptyItem(0)].map((item) => ({ id: crypto.randomUUID(), ...item }))
        }
      ]
    });
  }

  async function save(status?: Trip["status"]) {
    setMessage("Saving...");

    const payload = {
      title: state.title,
      destination: state.destination,
      description: state.description ?? "",
      startDate: state.startDate ?? "",
      endDate: state.endDate ?? "",
      status: status ?? state.status,
      days: state.days.map((day, dayIndex) => ({
        id: day.id,
        dayNumber: day.dayNumber,
        title: day.title,
        date: day.date ?? "",
        summary: day.summary ?? "",
        sortOrder: dayIndex,
        items: day.items.map((item, itemIndex) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          timeLabel: item.timeLabel ?? "",
          location: item.location ?? "",
          notes: item.notes ?? "",
          externalLink: item.externalLink ?? "",
          sortOrder: itemIndex
        }))
      }))
    };

    const response = await fetch(`/api/trips/${state.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Save failed.");
      return;
    }

    setState(data.trip);
    setMessage(status === "PUBLISHED" ? "Published." : "Saved.");
  }

  return (
    <div className="card">
      <div className="row">
        <div>
          <label>Trip title</label>
          <input value={state.title} disabled={!canEdit} onChange={(e) => setState({ ...state, title: e.target.value })} />
        </div>
        <div>
          <label>Destination</label>
          <input value={state.destination} disabled={!canEdit} onChange={(e) => setState({ ...state, destination: e.target.value })} />
        </div>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <div>
          <label>Start date</label>
          <input type="date" value={state.startDate?.slice(0, 10) ?? ""} disabled={!canEdit} onChange={(e) => setState({ ...state, startDate: e.target.value })} />
        </div>
        <div>
          <label>End date</label>
          <input type="date" value={state.endDate?.slice(0, 10) ?? ""} disabled={!canEdit} onChange={(e) => setState({ ...state, endDate: e.target.value })} />
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <label>Description</label>
        <textarea value={state.description ?? ""} disabled={!canEdit} onChange={(e) => setState({ ...state, description: e.target.value })} />
      </div>
      <p className="muted">Status: {state.status}</p>

      {state.days.map((day, dayIndex) => (
        <div className="card" key={day.id} style={{ background: "#f9fafb", marginTop: 16 }}>
          <div className="row">
            <div>
              <label>Day title</label>
              <input
                value={day.title}
                disabled={!canEdit}
                onChange={(e) => {
                  const days = [...state.days];
                  days[dayIndex] = { ...day, title: e.target.value };
                  setState({ ...state, days });
                }}
              />
            </div>
            <div>
              <label>Date</label>
              <input
                type="date"
                value={day.date?.slice(0, 10) ?? ""}
                disabled={!canEdit}
                onChange={(e) => {
                  const days = [...state.days];
                  days[dayIndex] = { ...day, date: e.target.value };
                  setState({ ...state, days });
                }}
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Summary</label>
            <textarea
              value={day.summary ?? ""}
              disabled={!canEdit}
              onChange={(e) => {
                const days = [...state.days];
                days[dayIndex] = { ...day, summary: e.target.value };
                setState({ ...state, days });
              }}
            />
          </div>

          {day.items.map((item, itemIndex) => (
            <div className="card" key={item.id} style={{ marginTop: 12 }}>
              <div className="row">
                <input
                  placeholder="Time"
                  value={item.timeLabel ?? ""}
                  disabled={!canEdit}
                  onChange={(e) => {
                    const days = [...state.days];
                    days[dayIndex].items[itemIndex] = { ...item, timeLabel: e.target.value };
                    setState({ ...state, days });
                  }}
                />
                <input
                  placeholder="Activity title"
                  value={item.title}
                  disabled={!canEdit}
                  onChange={(e) => {
                    const days = [...state.days];
                    days[dayIndex].items[itemIndex] = { ...item, title: e.target.value };
                    setState({ ...state, days });
                  }}
                />
                <select
                  value={item.type}
                  disabled={!canEdit}
                  onChange={(e) => {
                    const days = [...state.days];
                    days[dayIndex].items[itemIndex] = { ...item, type: e.target.value as ItemType };
                    setState({ ...state, days });
                  }}
                >
                  {[
                    "HOTEL",
                    "FLIGHT",
                    "ACTIVITY",
                    "RESTAURANT",
                    "TRANSPORTATION",
                    "RESERVATION",
                    "NOTE",
                    "CUSTOM"
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="row" style={{ marginTop: 12 }}>
                <input
                  placeholder="Location"
                  value={item.location ?? ""}
                  disabled={!canEdit}
                  onChange={(e) => {
                    const days = [...state.days];
                    days[dayIndex].items[itemIndex] = { ...item, location: e.target.value };
                    setState({ ...state, days });
                  }}
                />
                <input
                  placeholder="External link"
                  value={item.externalLink ?? ""}
                  disabled={!canEdit}
                  onChange={(e) => {
                    const days = [...state.days];
                    days[dayIndex].items[itemIndex] = { ...item, externalLink: e.target.value };
                    setState({ ...state, days });
                  }}
                />
              </div>
              <div style={{ marginTop: 12 }}>
                <textarea
                  placeholder="Notes"
                  value={item.notes ?? ""}
                  disabled={!canEdit}
                  onChange={(e) => {
                    const days = [...state.days];
                    days[dayIndex].items[itemIndex] = { ...item, notes: e.target.value };
                    setState({ ...state, days });
                  }}
                />
              </div>
            </div>
          ))}

          {canEdit ? (
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  const days = [...state.days];
                  days[dayIndex] = {
                    ...day,
                    items: [...day.items, { id: crypto.randomUUID(), ...emptyItem(day.items.length) }]
                  };
                  setState({ ...state, days });
                }}
              >
                Add item
              </button>
            </div>
          ) : null}
        </div>
      ))}

      {canEdit ? (
        <div className="row" style={{ marginTop: 12 }}>
          <button type="button" className="secondary" onClick={addDay}>
            Add day
          </button>
          <button type="button" onClick={() => save("DRAFT")}>
            Save draft
          </button>
          <button type="button" onClick={() => save("PUBLISHED")}>
            Publish
          </button>
        </div>
      ) : (
        <p className="muted">Read-only. Only the original creator can make changes.</p>
      )}

      {message ? <p className="muted">{message}</p> : null}
    </div>
  );
}
