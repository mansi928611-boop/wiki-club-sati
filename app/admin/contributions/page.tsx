"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getActiveUser } from "@/lib/auth-helpers";
import { INITIAL_CONTRIBUTIONS, ClubContribution } from "@/lib/mock-data";

export default function AdminContributionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [contributions, setContributions] = useState<ClubContribution[]>([]);
  const [message, setMessage] = useState("");

  const loadContributions = useCallback(async () => {
    let loaded: ClubContribution[] = [];

    try {
      const { data, error } = await supabase
        .from("contributions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        loaded = data as ClubContribution[];
      }
    } catch {
      // ignore
    }

    // Also check any locally submitted contributions from all demo users
    if (typeof window !== "undefined") {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("local_contributions_")) {
          try {
            const raw = localStorage.getItem(key);
            if (raw) {
              const items = JSON.parse(raw) as ClubContribution[];
              const existingIds = new Set(loaded.map((c) => c.id));
              const unique = items.filter((c) => !existingIds.has(c.id));
              loaded = [...unique, ...loaded];
            }
          } catch {
            // ignore
          }
        }
      }
    }

    if (loaded.length === 0) {
      loaded = INITIAL_CONTRIBUTIONS;
    }

    setContributions(loaded);
  }, []);

  const checkAdmin = useCallback(async () => {
    const user = await getActiveUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "admin" && user.role !== "coordinator") {
      setMessage("You are not authorized to access this verification page.");
      setLoading(false);
      return;
    }

    setAuthorized(true);
    await loadContributions();
    setLoading(false);
  }, [router, loadContributions]);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  async function updateStatus(contributionId: string, status: "approved" | "rejected") {
    setMessage("");

    const activeUser = await getActiveUser();
    if (activeUser && !activeUser.isDemo) {
      try {
        await supabase
          .from("contributions")
          .update({
            status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", contributionId);
      } catch (err) {
        console.warn("Supabase contribution status update note:", err);
      }
    }

    // Also update any localStorage entries
    if (typeof window !== "undefined") {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("local_contributions_")) {
          try {
            const raw = localStorage.getItem(key);
            if (raw) {
              const items = JSON.parse(raw) as ClubContribution[];
              const updated = items.map((c) =>
                c.id === contributionId ? { ...c, status } : c
              );
              localStorage.setItem(key, JSON.stringify(updated));
            }
          } catch {
            // ignore
          }
        }
      }
    }

    setContributions((curr) =>
      curr.map((c) => (c.id === contributionId ? { ...c, status } : c))
    );

    setMessage(
      status === "approved"
        ? "Contribution marked as Approved! It is now visible on the member's verified portfolio."
        : "Contribution marked as Rejected."
    );
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Verifying coordinator access...</p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="mt-4 text-slate-400">{message}</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-xl bg-cyan-400 px-6 py-2.5 font-bold text-slate-950"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            ← Back to Dashboard
          </Link>

          <Link
            href="/admin/elections"
            className="text-xs text-slate-400 hover:text-white transition"
          >
            Election Management →
          </Link>
        </div>

        <div className="mt-8">
          <span className="rounded-full bg-purple-400/10 px-3.5 py-1 text-xs font-semibold text-purple-300 border border-purple-400/20">
            Coordinator Review
          </span>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
            Contribution Verification
          </h1>

          <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
            Verify workshops, code pull requests, and designs submitted by club members.
            Approved contributions are permanently indexed in candidate portfolios.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-950/30 p-4 text-sm font-medium text-cyan-300">
            {message}
          </div>
        )}

        {contributions.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-slate-400">No member contributions have been logged yet.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {contributions.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-xl"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{item.title}</h2>
                    <p className="mt-1 text-xs font-semibold text-cyan-400">{item.category}</p>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3.5 py-1 text-xs font-bold capitalize ${getStatusStyle(
                      item.status
                    )}`}
                  >
                    {item.status === "approved"
                      ? "✓ Approved"
                      : item.status === "rejected"
                      ? "✕ Rejected"
                      : "⏳ Pending Verification"}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  {item.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                  {item.contribution_date && (
                    <p className="text-xs text-slate-400">
                      Date Logged: {item.contribution_date}
                    </p>
                  )}

                  {item.evidence_url && (
                    <a
                      href={item.evidence_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
                    >
                      View Submitted Proof ↗
                    </a>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
                  <p className="text-xs text-slate-500 font-mono">
                    Member ID: {item.user_id}
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateStatus(item.id, "approved")}
                      disabled={item.status === "approved"}
                      className="rounded-xl bg-emerald-400 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      ✓ Approve Contribution
                    </button>

                    <button
                      onClick={() => updateStatus(item.id, "rejected")}
                      disabled={item.status === "rejected"}
                      className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}