"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getActiveUser, UserSession } from "@/lib/auth-helpers";
import { INITIAL_MEMBERS, ClubMember, ClubNomination } from "@/lib/mock-data";

export default function NominationsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [nomineeId, setNomineeId] = useState("");
  const [position, setPosition] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadMembers = useCallback(async () => {
    const user = await getActiveUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setCurrentUser(user);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, department, year, bio, role")
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        setMembers(data as ClubMember[]);
      } else {
        setMembers(INITIAL_MEMBERS);
      }
    } catch {
      setMembers(INITIAL_MEMBERS);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  async function submitNomination() {
    setMessage("");

    if (!nomineeId || !position || !reason.trim()) {
      setMessage("Please fill in all required fields (Nominee, Board Position, Reason).");
      return;
    }

    setSaving(true);

    const activeUser = await getActiveUser();

    if (!activeUser) {
      router.push("/login");
      return;
    }

    if (nomineeId === activeUser.id) {
      setMessage("You cannot nominate yourself. Peer nominations must come from fellow members.");
      setSaving(false);
      return;
    }

    // 1. Try Supabase
    if (!activeUser.isDemo) {
      try {
        const { error } = await supabase.from("nominations").insert({
          nominator_id: activeUser.id,
          nominee_id: nomineeId,
          position,
          reason: reason.trim(),
          status: "pending",
        });

        if (error) {
          if (error.code === "23505") {
            setMessage("You have already nominated this member for this position.");
            setSaving(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Supabase nomination insert note:", err);
      }
    }

    // 2. Save locally in demo storage so coordinator review panel can see it!
    if (typeof window !== "undefined") {
      const newNom: ClubNomination = {
        id: `nom-${Date.now()}`,
        nominator_id: activeUser.id,
        nominee_id: nomineeId,
        position,
        reason: reason.trim(),
        status: "pending",
        created_at: new Date().toISOString(),
      };
      const existing = localStorage.getItem("local_pending_nominations");
      const list: ClubNomination[] = existing ? JSON.parse(existing) : [];
      localStorage.setItem("local_pending_nominations", JSON.stringify([newNom, ...list]));
    }

    setMessage("Nomination submitted successfully! It is now pending coordinator review.");
    setNomineeId("");
    setPosition("");
    setReason("");
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading nominations portal...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            ← Back to Dashboard
          </Link>

          <Link
            href="/elections"
            className="text-xs text-slate-400 hover:text-white transition"
          >
            Active Elections →
          </Link>
        </div>

        <div className="mt-8">
          <span className="rounded-full bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
            Democratic Elections
          </span>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
            Nominate a Member
          </h1>

          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Nominate a fellow Wiki Club SATI member for an executive board position based on
            their verified work and active contributions.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-xl">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Nominee (Fellow Member) *
              </label>

              <select
                value={nomineeId}
                onChange={(e) => setNomineeId(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
              >
                <option value="">Select a member to nominate</option>
                {members
                  .filter((m) => m.id !== currentUser?.id)
                  .map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name || member.email} ({member.department || "SATI"})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Board Position *
              </label>

              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
              >
                <option value="">Select position</option>
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Technical Head">Technical Head</option>
                <option value="Design Head">Design Head</option>
                <option value="Event Head">Event Head</option>
                <option value="Content & Documentation Head">Content & Documentation Head</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Why are you nominating this member? *
              </label>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Highlight specific workshops, coding contributions, or leadership qualities you have observed..."
                rows={5}
                className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
              />
            </div>

            <button
              onClick={submitNomination}
              disabled={saving}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 font-bold text-slate-950 transition hover:opacity-95 disabled:opacity-50 shadow-md shadow-cyan-400/20"
            >
              {saving ? "Submitting Nomination..." : "Submit Board Nomination"}
            </button>

            {message && (
              <p className="rounded-xl border border-cyan-400/30 bg-cyan-950/30 p-3.5 text-center text-sm text-cyan-300">
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-6">
          <h2 className="font-bold text-cyan-300 text-sm">
            How Nominations & Verification Work
          </h2>

          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-400">
            <li>• Nominate members based on verifiable work, not popularity.</li>
            <li>• Coordinators cross-reference nominees with their approved contributions log.</li>
            <li>• Nominees with approved records appear on the official ballot during elections.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}