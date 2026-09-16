"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Member = {
  id: string;
  name: string | null;
  email: string | null;
};

export default function NominationsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [nomineeId, setNomineeId] = useState("");
  const [position, setPosition] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email")
      .order("name", { ascending: true });

    if (error) {
      setMessage(error.message);
    } else {
      setMembers(data ?? []);
    }

    setLoading(false);
  }

  async function submitNomination() {
    setMessage("");

    if (!nomineeId || !position || !reason) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    if (nomineeId === session.user.id) {
      setMessage("You cannot nominate yourself.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("nominations").insert({
      nominator_id: session.user.id,
      nominee_id: nomineeId,
      position,
      reason,
      status: "pending",
    });

    if (error) {
      if (error.code === "23505") {
        setMessage(
          "You have already nominated this member for this position."
        );
      } else {
        setMessage(error.message);
      }
    } else {
      setMessage("Nomination submitted successfully!");

      setNomineeId("");
      setPosition("");
      setReason("");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading members...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <a
          href="/dashboard"
          className="text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Dashboard
        </a>

        <h1 className="mt-10 text-5xl font-bold">
          Nominate a Member
        </h1>

        <p className="mt-4 text-slate-400">
          Nominate a fellow Wiki Club SATI member for a board position
          based on their contributions and work.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Nominee *
              </label>

              <select
                value={nomineeId}
                onChange={(e) => setNomineeId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
              >
                <option value="">Select a member</option>

                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name || member.email || "Unnamed Member"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Board Position *
              </label>

              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
              >
                <option value="">Select position</option>
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Technical Head">Technical Head</option>
                <option value="Design Head">Design Head</option>
                <option value="Event Head">Event Head</option>
                <option value="Content Head">Content Head</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Why are you nominating this member? *
              </label>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the contribution or work you have observed..."
                rows={6}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <button
              onClick={submitNomination}
              disabled={saving}
              className="w-full rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
            >
              {saving ? "Submitting..." : "Submit Nomination"}
            </button>

            {message && (
              <p className="rounded-xl border border-white/10 bg-black/20 p-4 text-center text-sm text-slate-300">
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
          <h2 className="font-semibold text-cyan-400">
            How nominations work
          </h2>

          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>• Nominate members based on observed work and contribution.</li>
            <li>• Each member can submit one nomination per member and position.</li>
            <li>• Nominations are initially marked as pending.</li>
            <li>• Election administrators can review nominations later.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}