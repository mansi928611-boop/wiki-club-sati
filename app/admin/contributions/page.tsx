"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Contribution = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string | null;
  contribution_date: string | null;
  evidence_url: string | null;
  status: string;
  created_at: string;
};

export default function AdminContributionsPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();

    if (
      !profile ||
      (profile.role !== "admin" && profile.role !== "coordinator")
    ) {
      setMessage("You are not authorized to access this page.");
      setLoading(false);
      return;
    }

    setAuthorized(true);
    await loadContributions();
    setLoading(false);
  }

  async function loadContributions() {
    const { data, error } = await supabase
      .from("contributions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setContributions(data ?? []);
  }

  async function updateStatus(
    contributionId: string,
    status: "approved" | "rejected"
  ) {
    setMessage("");

    const { error } = await supabase
      .from("contributions")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contributionId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setContributions((current) =>
      current.map((contribution) =>
        contribution.id === contributionId
          ? { ...contribution, status }
          : contribution
      )
    );

    setMessage(
      status === "approved"
        ? "Contribution approved."
        : "Contribution rejected."
    );
  }

  function getStatusStyle(status: string) {
    if (status === "approved") {
      return "border-green-400/30 bg-green-400/10 text-green-400";
    }

    if (status === "rejected") {
      return "border-red-400/30 bg-red-400/10 text-red-400";
    }

    return "border-yellow-400/30 bg-yellow-400/10 text-yellow-400";
  }

  function getStatusText(status: string) {
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return "Pending";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Checking admin access...</p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Access Denied</h1>

          <p className="mt-4 text-slate-400">
            {message}
          </p>

          <a
            href="/dashboard"
            className="mt-6 inline-block text-cyan-400 hover:text-cyan-300"
          >
            ← Back to Dashboard
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <a
          href="/dashboard"
          className="text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Dashboard
        </a>

        <h1 className="mt-10 text-5xl font-bold">
          Contribution Verification
        </h1>

        <p className="mt-4 text-slate-400">
          Review member contributions and verify their work.
        </p>

        {message && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            {message}
          </div>
        )}

        {contributions.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-slate-400">
              No contributions have been submitted yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {contributions.map((contribution) => (
              <div
                key={contribution.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {contribution.title}
                    </h2>

                    <p className="mt-2 text-sm text-cyan-400">
                      {contribution.category}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      contribution.status
                    )}`}
                  >
                    {getStatusText(contribution.status)}
                  </span>
                </div>

                <p className="mt-5 leading-7 text-slate-300">
                  {contribution.description}
                </p>

                {contribution.contribution_date && (
                  <p className="mt-4 text-sm text-slate-500">
                    Date: {contribution.contribution_date}
                  </p>
                )}

                {contribution.evidence_url && (
                  <a
                    href={contribution.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    View Evidence →
                  </a>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      updateStatus(contribution.id, "approved")
                    }
                    disabled={contribution.status === "approved"}
                    className="rounded-xl bg-green-400 px-5 py-2 font-semibold text-slate-950 transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(contribution.id, "rejected")
                    }
                    disabled={contribution.status === "rejected"}
                    className="rounded-xl bg-red-400 px-5 py-2 font-semibold text-slate-950 transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Reject
                  </button>
                </div>

                <p className="mt-4 break-all text-xs text-slate-600">
                  Member ID: {contribution.user_id}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}