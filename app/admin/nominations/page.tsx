"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getActiveUser } from "@/lib/auth-helpers";
import { INITIAL_NOMINATIONS, INITIAL_MEMBERS, ClubNomination, ClubMember } from "@/lib/mock-data";

export default function AdminNominationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [nominations, setNominations] = useState<ClubNomination[]>([]);
  const [profiles, setProfiles] = useState<ClubMember[]>([]);
  const [message, setMessage] = useState("");

  const loadProfiles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, department, year, role")
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        setProfiles(data as ClubMember[]);
      } else {
        setProfiles(INITIAL_MEMBERS);
      }
    } catch {
      setProfiles(INITIAL_MEMBERS);
    }
  }, []);

  const loadNominations = useCallback(async () => {
    let loaded: ClubNomination[] = [];
    try {
      const { data, error } = await supabase
        .from("nominations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        loaded = data as ClubNomination[];
      }
    } catch {
      // ignore
    }

    // Also include any locally submitted nominations
    if (typeof window !== "undefined") {
      const localStr = localStorage.getItem("local_pending_nominations");
      if (localStr) {
        try {
          const localNoms = JSON.parse(localStr) as ClubNomination[];
          const existingIds = new Set(loaded.map((n) => n.id));
          const unique = localNoms.filter((n) => !existingIds.has(n.id));
          loaded = [...unique, ...loaded];
        } catch {
          // ignore
        }
      }
    }

    if (loaded.length === 0) {
      loaded = INITIAL_NOMINATIONS;
    }

    setNominations(loaded);
  }, []);

  const checkAdmin = useCallback(async () => {
    const user = await getActiveUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "admin" && user.role !== "coordinator") {
      setMessage("You are not authorized to access this administration page.");
      setLoading(false);
      return;
    }

    setAuthorized(true);
    await loadProfiles();
    await loadNominations();
    setLoading(false);
  }, [router, loadProfiles, loadNominations]);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  function getProfile(userId: string) {
    return profiles.find((p) => p.id === userId);
  }

  async function updateStatus(nominationId: string, status: "approved" | "rejected") {
    setMessage("");

    const activeUser = await getActiveUser();
    if (activeUser && !activeUser.isDemo) {
      try {
        await supabase
          .from("nominations")
          .update({
            status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", nominationId);
      } catch (err) {
        console.warn("Supabase nomination status update note:", err);
      }
    }

    // Also update in local storage if present
    if (typeof window !== "undefined") {
      const localStr = localStorage.getItem("local_pending_nominations");
      if (localStr) {
        try {
          const localNoms = JSON.parse(localStr) as ClubNomination[];
          const updated = localNoms.map((n) =>
            n.id === nominationId ? { ...n, status } : n
          );
          localStorage.setItem("local_pending_nominations", JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
    }

    setNominations((curr) =>
      curr.map((n) => (n.id === nominationId ? { ...n, status } : n))
    );

    setMessage(
      status === "approved" ? "Nomination has been approved!" : "Nomination has been rejected."
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
        <p className="text-slate-400">Verifying nomination access...</p>
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
            Nomination Verification
          </h1>

          <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
            Review peer nominations submitted by members for Board positions, verify their qualifications, and approve or reject.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-950/30 p-4 text-sm font-medium text-cyan-300">
            {message}
          </div>
        )}

        {nominations.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-slate-400">No member nominations have been submitted yet.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {nominations.map((nom) => {
              const nominator = getProfile(nom.nominator_id);
              const nominee = getProfile(nom.nominee_id);

              return (
                <div
                  key={nom.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-xl"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Board Position Nominated For
                      </span>
                      <h2 className="mt-1 text-2xl font-bold text-cyan-300">{nom.position}</h2>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3.5 py-1 text-xs font-bold capitalize ${getStatusStyle(
                        nom.status
                      )}`}
                    >
                      {nom.status === "approved"
                        ? "✓ Approved"
                        : nom.status === "rejected"
                        ? "✕ Rejected"
                        : "⏳ Pending Review"}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Nominated By
                      </p>
                      <p className="mt-1 text-base font-bold text-white">
                        {nominator?.name || nominator?.email || "Club Member"}
                      </p>
                      <p className="text-xs text-slate-400">{nominator?.department || "SATI Student"}</p>
                    </div>

                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                        Candidate Nominee
                      </p>
                      <p className="mt-1 text-base font-bold text-white">
                        {nominee?.name || nominee?.email || "Club Member"}
                      </p>
                      <p className="text-xs text-slate-400">{nominee?.department || "SATI Student"}</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/5 bg-slate-900/40 p-5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Reason for Nomination
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">
                      {nom.reason}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-slate-500">
                      Submitted: {new Date(nom.created_at).toLocaleDateString()}
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateStatus(nom.id, "approved")}
                        disabled={nom.status === "approved"}
                        className="rounded-xl bg-emerald-400 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        ✓ Approve Nomination
                      </button>

                      <button
                        onClick={() => updateStatus(nom.id, "rejected")}
                        disabled={nom.status === "rejected"}
                        className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}