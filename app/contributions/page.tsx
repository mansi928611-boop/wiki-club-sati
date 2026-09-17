"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getActiveUser, UserSession } from "@/lib/auth-helpers";
import { INITIAL_CONTRIBUTIONS, ClubContribution } from "@/lib/mock-data";

export default function ContributionsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const [contributions, setContributions] = useState<ClubContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchContributions = useCallback(async (userId: string) => {
    // 1. Try Supabase
    let loaded: ClubContribution[] = [];
    try {
      const { data, error } = await supabase
        .from("contributions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        loaded = data as ClubContribution[];
      }
    } catch (err) {
      console.warn("Supabase fetch contributions err:", err);
    }

    // 2. Merge with locally saved contributions from localStorage (for demo or RLS fallback)
    if (typeof window !== "undefined") {
      const localSaved = localStorage.getItem(`local_contributions_${userId}`);
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved) as ClubContribution[];
          // prepend unique local ones
          const existingIds = new Set(loaded.map((c) => c.id));
          const uniqueLocal = parsed.filter((c) => !existingIds.has(c.id));
          loaded = [...uniqueLocal, ...loaded];
        } catch {
          // ignore
        }
      }
    }

    // 3. If still empty, use INITIAL_CONTRIBUTIONS for demo user
    if (loaded.length === 0) {
      const mockMatches = INITIAL_CONTRIBUTIONS.filter((c) => c.user_id === userId);
      if (mockMatches.length > 0) {
        loaded = mockMatches;
      }
    }

    setContributions(loaded);
  }, []);

  const loadContributions = useCallback(async () => {
    const user = await getActiveUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setCurrentUser(user);
    await fetchContributions(user.id);
    setLoading(false);
  }, [router, fetchContributions]);

  useEffect(() => {
    loadContributions();
  }, [loadContributions]);

  async function submitContribution() {
    setMessage("");

    if (!title.trim() || !category || !description.trim()) {
      setMessage("Please fill in all required fields (Title, Category, Description).");
      return;
    }

    setSaving(true);

    const activeUser = await getActiveUser();

    if (!activeUser) {
      router.push("/login");
      return;
    }

    const newContrib: ClubContribution = {
      id: `contrib-${Date.now()}`,
      user_id: activeUser.id,
      title: title.trim(),
      category,
      description: description.trim(),
      contribution_date: date || new Date().toISOString().split("T")[0],
      evidence_url: evidenceUrl.trim() || undefined,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    // 1. Try Supabase insert if real user
    if (!activeUser.isDemo) {
      try {
        await supabase.from("contributions").insert({
          user_id: activeUser.id,
          title: newContrib.title,
          category: newContrib.category,
          description: newContrib.description,
          contribution_date: newContrib.contribution_date || null,
          evidence_url: newContrib.evidence_url || null,
          status: "pending",
        });
      } catch (err) {
        console.warn("Supabase insert note:", err);
      }
    }

    // 2. Always persist to localStorage for instant UI update & demo durability
    if (typeof window !== "undefined") {
      const storageKey = `local_contributions_${activeUser.id}`;
      const existing = localStorage.getItem(storageKey);
      const parsedList: ClubContribution[] = existing ? JSON.parse(existing) : [];
      localStorage.setItem(storageKey, JSON.stringify([newContrib, ...parsedList]));
    }

    setMessage("Contribution submitted successfully! It is now pending coordinator verification.");
    setTitle("");
    setCategory("");
    setDescription("");
    setDate("");
    setEvidenceUrl("");

    await fetchContributions(activeUser.id);
    setSaving(false);
  }

  function getStatusStyle(status: string) {
    if (status === "approved") {
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    }
    if (status === "rejected") {
      return "border-rose-400/30 bg-rose-400/10 text-rose-300";
    }
    return "border-amber-400/30 bg-amber-400/10 text-amber-300";
  }

  function getStatusText(status: string) {
    if (status === "approved") return "✓ Approved";
    if (status === "rejected") return "✕ Rejected";
    return "⏳ Pending Verification";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading contributions...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            ← Back to Dashboard
          </Link>

          <Link
            href="/candidate"
            className="text-xs text-slate-400 hover:text-white transition"
          >
            View Public Portfolio →
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="rounded-full bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
              Work Log
            </span>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
              My Club Contributions
            </h1>

            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Record workshops, code contributions, event organizing, or designs you have contributed to Wiki Club SATI.
            </p>
          </div>

          {currentUser && (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-right">
              <span className="text-xs text-slate-400">Logged as</span>
              <p className="text-sm font-bold text-cyan-300">{currentUser.name}</p>
            </div>
          )}
        </div>

        {/* Add Contribution Form */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-xl">
          <h2 className="text-2xl font-bold">Add New Contribution</h2>
          <p className="mt-1 text-xs text-slate-400">
            All submitted contributions are reviewed by club coordinators for election portfolio verification.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Contribution Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Conducted Web Development & Git Workshop"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
              >
                <option value="">Select category</option>
                <option value="Event Organization">Event Organization</option>
                <option value="Technical">Technical & Coding</option>
                <option value="Design">Design & Branding</option>
                <option value="Content">Content & Documentation</option>
                <option value="Outreach">Outreach & Publicity</option>
                <option value="Volunteering">Volunteering</option>
                <option value="Leadership">Leadership & Mentorship</option>
                <option value="Project">Open Source Project</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail what you accomplished, the impact on participants, and your role..."
                rows={4}
                className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-300">
                  Contribution Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-300">
                  Evidence / Verification Link
                </label>
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://github.com/... or Google Drive"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <button
              onClick={submitContribution}
              disabled={saving}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 font-bold text-slate-950 transition hover:opacity-95 disabled:opacity-50 shadow-md shadow-cyan-400/20"
            >
              {saving ? "Submitting Contribution..." : "Submit for Verification"}
            </button>

            {message && (
              <p className="rounded-xl border border-cyan-400/30 bg-cyan-950/30 p-3.5 text-center text-sm text-cyan-300">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Contribution History */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Contribution History</h2>
            <span className="text-xs text-slate-400">
              {contributions.length} Submissions Logged
            </span>
          </div>

          {contributions.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">
                You haven&apos;t submitted any contributions yet. Fill out the form above to log your work!
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {contributions.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/30"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="mt-1 text-xs font-semibold text-cyan-400">
                        {item.category}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {item.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                    {item.contribution_date && (
                      <p className="text-xs text-slate-500">
                        Date: {item.contribution_date}
                      </p>
                    )}

                    {item.evidence_url && (
                      <a
                        href={item.evidence_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
                      >
                        View Attached Evidence ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}