"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Nomination = {
  id: string;
  nominator_id: string;
  nominee_id: string;
  position: string;
  reason: string;
  status: string;
  created_at: string;
};

type Profile = {
  id: string;
  name: string | null;
  email: string | null;
};

export default function AdminNominationsPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
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

    await loadProfiles();
    await loadNominations();

    setLoading(false);
  }

  async function loadProfiles() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email")
      .order("name", { ascending: true });

    if (error) {
      setMessage(error.message);
      return;
    }

    setProfiles(data ?? []);
  }

  async function loadNominations() {
    const { data, error } = await supabase
      .from("nominations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setNominations(data ?? []);
  }

  function getProfile(userId: string) {
    return profiles.find((profile) => profile.id === userId);
  }

  async function updateStatus(
    nominationId: string,
    status: "approved" | "rejected"
  ) {
    setMessage("");

    const { error } = await supabase
      .from("nominations")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", nominationId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setNominations((current) =>
      current.map((nomination) =>
        nomination.id === nominationId
          ? { ...nomination, status }
          : nomination
      )
    );

    setMessage(
      status === "approved"
        ? "Nomination approved."
        : "Nomination rejected."
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
        <p className="text-slate-400">
          Checking nomination access...
        </p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Access Denied
          </h1>

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
          Nomination Review
        </h1>

        <p className="mt-4 text-slate-400">
          Review member nominations for Wiki Club SATI board positions.
        </p>

        {message && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            {message}
          </div>
        )}

        {nominations.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-slate-400">
              No nominations have been submitted yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {nominations.map((nomination) => {
              const nominator = getProfile(nomination.nominator_id);
              const nominee = getProfile(nomination.nominee_id);

              return (
                <div
                  key={nomination.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Board Position
                      </p>

                      <h2 className="mt-1 text-2xl font-semibold text-cyan-400">
                        {nomination.position}
                      </h2>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        nomination.status
                      )}`}
                    >
                      {getStatusText(nomination.status)}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Nominated By
                      </p>

                      <p className="mt-2 font-semibold">
                        {nominator?.name ||
                          nominator?.email ||
                          "Unknown Member"}
                      </p>

                      {nominator?.email && nominator?.name && (
                        <p className="mt-1 text-sm text-slate-500">
                          {nominator.email}
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Nominee
                      </p>

                      <p className="mt-2 font-semibold">
                        {nominee?.name ||
                          nominee?.email ||
                          "Unknown Member"}
                      </p>

                      {nominee?.email && nominee?.name && (
                        <p className="mt-1 text-sm text-slate-500">
                          {nominee.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-slate-500">
                      Reason for Nomination
                    </p>

                    <p className="mt-2 leading-7 text-slate-300">
                      {nomination.reason}
                    </p>
                  </div>

                  <p className="mt-5 text-xs text-slate-600">
                    Submitted:{" "}
                    {new Date(
                      nomination.created_at
                    ).toLocaleString()}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        updateStatus(
                          nomination.id,
                          "approved"
                        )
                      }
                      disabled={nomination.status === "approved"}
                      className="rounded-xl bg-green-400 px-5 py-2 font-semibold text-slate-950 transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          nomination.id,
                          "rejected"
                        )
                      }
                      disabled={nomination.status === "rejected"}
                      className="rounded-xl bg-red-400 px-5 py-2 font-semibold text-slate-950 transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Reject
                    </button>
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