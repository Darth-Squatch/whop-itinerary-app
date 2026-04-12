"use client";

import { useState } from "react";

export function CreateTripForm({ companyId }: { companyId: string }) {
  const [form, setForm] = useState({
    title: "",
    destination: "",
    description: "",
    startDate: "",
    endDate: "",
    experienceId: ""
  });
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Saving...");

    const response = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, companyId })
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Something went wrong.");
      return;
    }

    setMessage("Trip created. Refresh to see it in the list.");
    setForm({ title: "", destination: "", description: "", startDate: "", endDate: "", experienceId: "" });
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Create a trip</h2>
      <p className="muted">Paste the experience ID that this itinerary belongs to.</p>
      <div className="grid two">
        <input placeholder="Trip title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
        <input placeholder="Experience ID (exp_xxx)" value={form.experienceId} onChange={(e) => setForm({ ...form, experienceId: e.target.value })} />
        <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
      </div>
      <div style={{ marginTop: 12 }}>
        <textarea placeholder="Trip description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div style={{ marginTop: 12 }}>
        <button type="submit">Create trip</button>
      </div>
      {message ? <p className="muted">{message}</p> : null}
    </form>
  );
}
