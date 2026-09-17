"use client";

import { useState } from "react";
import Link from "next/link";

interface ClubEvent {
  id: string;
  title: string;
  category: "Workshop" | "Hackathon" | "Meetup" | "Talk";
  date: string;
  time: string;
  location: string;
  description: string;
  speaker?: string;
  attendeesCount: number;
  status: "Upcoming" | "Completed";
}

const EVENTS_DATA: ClubEvent[] = [
  {
    id: "evt-01",
    title: "Open Source & Git Mastery Bootcamp",
    category: "Workshop",
    date: "October 10, 2026",
    time: "2:00 PM - 5:00 PM IST",
    location: "Computer Center Lab 2, SATI Campus",
    speaker: "Wiki Club Tech Leads",
    description: "Hands-on workshop covering Git branching, merge conflicts, pull requests, and contributing your first code to an open-source repository.",
    attendeesCount: 48,
    status: "Upcoming",
  },
  {
    id: "evt-02",
    title: "SATI Hackfest 2026: Campus Innovations",
    category: "Hackathon",
    date: "October 24-25, 2026",
    time: "10:00 AM onwards",
    location: "SATI Central Auditorium & Virtual",
    speaker: "Faculty & Industry Mentors",
    description: "24-hour campus hackathon solving challenges in campus navigation, study archives, student transport, and digital library resources.",
    attendeesCount: 92,
    status: "Upcoming",
  },
  {
    id: "evt-03",
    title: "Wikipedia Edit-a-thon: Regional Heritage",
    category: "Meetup",
    date: "November 05, 2026",
    time: "3:00 PM - 6:00 PM IST",
    location: "Seminar Hall 1, IT Dept",
    speaker: "Senior Wikipedia Contributors",
    description: "Collaborative editing sprint enriching Wikipedia articles about historical monuments, archaeology, and educational landmarks in and around Vidisha.",
    attendeesCount: 35,
    status: "Upcoming",
  },
  {
    id: "evt-04",
    title: "Modern Web Architecture with Next.js & React 19",
    category: "Talk",
    date: "September 12, 2026",
    time: "4:00 PM - 5:30 PM IST",
    location: "Google Meet / Hybrid",
    speaker: "Alumni Software Engineers",
    description: "Deep dive into React Server Components, server actions, client performance optimization, and building fullstack applications.",
    attendeesCount: 78,
    status: "Completed",
  },
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [rsvpdEvents, setRsvpdEvents] = useState<Record<string, boolean>>({});
  const [activeModalEvent, setActiveModalEvent] = useState<ClubEvent | null>(null);

  const categories = ["All", "Workshop", "Hackathon", "Meetup", "Talk"];

  const filteredEvents = EVENTS_DATA.filter((event) => {
    if (selectedCategory === "All") return true;
    return event.category === selectedCategory;
  });

  function toggleRsvp(eventId: string) {
    setRsvpdEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Navigation */}
        <div className="flex items-center justify-between pb-8 border-b border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            ← Back to Home
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <Link href="/about" className="text-slate-400 hover:text-white transition">About</Link>
            <Link href="/projects" className="text-slate-400 hover:text-white transition">Projects</Link>
            <Link href="/wiki" className="text-slate-400 hover:text-white transition">Wiki</Link>
            <Link
              href="/login"
              className="rounded-full bg-cyan-400 px-4 py-1.5 font-bold text-slate-950 text-xs hover:bg-cyan-300 transition"
            >
              Member Login
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="rounded-full bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
              Campus Calendar
            </span>

            <h1 className="mt-4 text-5xl font-extrabold tracking-tight">
              Events & Workshops
            </h1>

            <p className="mt-4 text-lg text-slate-400 max-w-2xl">
              Join interactive coding sessions, Wikipedia editing sprints, and hackathons
              hosted by Wiki Club SATI throughout the academic year.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-right">
            <p className="text-2xl font-bold text-cyan-400">50+ Events</p>
            <p className="text-xs text-slate-400">Organized since inception</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                selectedCategory === cat
                  ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat === "All" ? "All Events" : `${cat}s`}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {filteredEvents.map((event) => {
            const isRsvpd = !!rsvpdEvents[event.id];

            return (
              <div
                key={event.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:border-cyan-400/40 hover:bg-white/[0.06]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-400/20">
                      {event.category}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        event.status === "Upcoming"
                          ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                          : "bg-slate-700/50 text-slate-400"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold group-hover:text-cyan-300 transition">
                    {event.title}
                  </h3>

                  <p className="mt-3 text-slate-400 leading-relaxed line-clamp-3">
                    {event.description}
                  </p>

                  <div className="mt-6 space-y-2 text-sm text-slate-300 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">📅</span>
                      <span>{event.date} • {event.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">📍</span>
                      <span>{event.location}</span>
                    </div>

                    {event.speaker && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-cyan-400">🎙️</span>
                        <span>Host: {event.speaker}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                  <span className="text-xs text-slate-400">
                    👥 {event.attendeesCount + (isRsvpd ? 1 : 0)} attending
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveModalEvent(event)}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
                    >
                      Details
                    </button>

                    {event.status === "Upcoming" && (
                      <button
                        onClick={() => toggleRsvp(event.id)}
                        className={`rounded-xl px-5 py-2 text-xs font-bold transition ${
                          isRsvpd
                            ? "bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20"
                            : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                        }`}
                      >
                        {isRsvpd ? "✓ Registered" : "RSVP Now"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Event Details Modal */}
        {activeModalEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-slate-900 p-8 shadow-2xl">
              <button
                onClick={() => setActiveModalEvent(null)}
                aria-label="Close modal"
                className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>

              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-400/20">
                {activeModalEvent.category}
              </span>

              <h2 className="mt-4 text-2xl font-bold">{activeModalEvent.title}</h2>

              <p className="mt-4 text-slate-300 leading-relaxed">
                {activeModalEvent.description}
              </p>

              <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                <p><strong className="text-white">Date & Time:</strong> {activeModalEvent.date}, {activeModalEvent.time}</p>
                <p><strong className="text-white">Venue:</strong> {activeModalEvent.location}</p>
                {activeModalEvent.speaker && (
                  <p><strong className="text-white">Mentor/Lead:</strong> {activeModalEvent.speaker}</p>
                )}
                <p><strong className="text-white">Prerequisites:</strong> Bring your laptop with VS Code or web browser installed.</p>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  Close
                </button>

                {activeModalEvent.status === "Upcoming" && (
                  <button
                    onClick={() => {
                      toggleRsvp(activeModalEvent.id);
                      setActiveModalEvent(null);
                    }}
                    className={`rounded-xl px-6 py-2.5 text-sm font-bold transition ${
                      rsvpdEvents[activeModalEvent.id]
                        ? "bg-emerald-400 text-slate-950"
                        : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                    }`}
                  >
                    {rsvpdEvents[activeModalEvent.id] ? "Cancel Registration" : "Confirm RSVP"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}