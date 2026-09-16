"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    setEmail(session.user.email ?? "");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();

    setRole(profile?.role ?? "member");
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading dashboard...</p>
      </main>
    );
  }

  const isAdmin = role === "coordinator" || role === "admin";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Wiki Club SATI
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Member Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              {email}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-red-400/30 px-5 py-3 text-red-300 hover:bg-red-400/10"
          >
            Logout
          </button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <a
            href="/profile"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/40 hover:bg-cyan-400/5"
          >
            <h2 className="text-xl font-bold">My Profile</h2>
            <p className="mt-2 text-sm text-slate-400">
              Manage your club profile and information.
            </p>
          </a>

          <a
            href="/contributions"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/40 hover:bg-cyan-400/5"
          >
            <h2 className="text-xl font-bold">Contributions</h2>
            <p className="mt-2 text-sm text-slate-400">
              Submit and track your club contributions.
            </p>
          </a>

          <a
            href="/members"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/40 hover:bg-cyan-400/5"
          >
            <h2 className="text-xl font-bold">Members</h2>
            <p className="mt-2 text-sm text-slate-400">
              Explore Wiki Club SATI members.
            </p>
          </a>

          <a
            href="/nominations"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/40 hover:bg-cyan-400/5"
          >
            <h2 className="text-xl font-bold">Nominations</h2>
            <p className="mt-2 text-sm text-slate-400">
              Nominate members for Board positions.
            </p>
          </a>

          <a
            href="/elections"
            className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 transition hover:border-cyan-400/40"
          >
            <h2 className="text-xl font-bold">Board Elections</h2>
            <p className="mt-2 text-sm text-slate-400">
              View candidates and vote in active elections.
            </p>
          </a>

          <a
            href="/election-results"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/40 hover:bg-cyan-400/5"
          >
            <h2 className="text-xl font-bold">Election Results</h2>
            <p className="mt-2 text-sm text-slate-400">
              View completed election results.
            </p>
          </a>

          <a
            href="/candidate"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/40 hover:bg-cyan-400/5"
          >
            <h2 className="text-xl font-bold">My Candidate Portfolio</h2>
            <p className="mt-2 text-sm text-slate-400">
              View your verified contributions and profile.
            </p>
          </a>

          {isAdmin && (
            <>
              <a
                href="/admin/contributions"
                className="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-6 transition hover:border-purple-400/40"
              >
                <h2 className="text-xl font-bold">
                  Manage Contributions
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Review and approve member contributions.
                </p>
              </a>

              <a
                href="/admin/nominations"
                className="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-6 transition hover:border-purple-400/40"
              >
                <h2 className="text-xl font-bold">
                  Manage Nominations
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Review and approve nominations.
                </p>
              </a>

              <a
                href="/admin/elections"
                className="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-6 transition hover:border-purple-400/40"
              >
                <h2 className="text-xl font-bold">
                  Election Management
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Create elections, positions, and candidates.
                </p>
              </a>
            </>
          )}

        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-500">
            Your account role
          </p>

          <p className="mt-1 text-lg font-semibold text-cyan-400 capitalize">
            {role}
          </p>
        </div>

      </div>
    </main>
  );
}