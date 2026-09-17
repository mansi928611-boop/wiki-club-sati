"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getActiveUser, logOutUser, UserSession } from "@/lib/auth-helpers";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserSession | null>(null);

  const checkUser = useCallback(async () => {
    const activeUser = await getActiveUser();

    if (!activeUser) {
      router.push("/login");
      return;
    }

    setUser(activeUser);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  async function handleLogout() {
    await logOutUser();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="text-slate-400 text-sm">Loading member dashboard...</p>
        </div>
      </main>
    );
  }

  const isAdmin = user?.role === "coordinator" || user?.role === "admin";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Top Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Wiki Club SATI Portal
              </span>

              {user?.isDemo && (
                <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/20">
                  Demo Session
                </span>
              )}
            </div>

            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
              Welcome, {user?.name || "Member"}
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              {user?.email} {user?.department ? `• ${user.department}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 transition"
            >
              Public Home
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-400/30 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-400/10 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/profile"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">👤</span>
              <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                Edit →
              </span>
            </div>
            <h2 className="mt-4 text-xl font-bold">My Profile</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Manage your club profile, bio, department, and academic year.
            </p>
          </Link>

          <Link
            href="/contributions"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">⚡</span>
              <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                Submit →
              </span>
            </div>
            <h2 className="mt-4 text-xl font-bold">Contributions</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Submit and track your verified workshops, coding, and club work.
            </p>
          </Link>

          <Link
            href="/members"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">👥</span>
              <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                Directory →
              </span>
            </div>
            <h2 className="mt-4 text-xl font-bold">Members Directory</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Explore Wiki Club SATI members and view their verified portfolios.
            </p>
          </Link>

          <Link
            href="/nominations"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">📜</span>
              <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                Nominate →
              </span>
            </div>
            <h2 className="mt-4 text-xl font-bold">Board Nominations</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Nominate active peers for Board positions based on contributions.
            </p>
          </Link>

          <Link
            href="/elections"
            className="group rounded-2xl border border-cyan-400/30 bg-cyan-950/20 p-6 transition hover:border-cyan-400/60"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">🗳️</span>
              <span className="text-xs font-bold text-cyan-300 group-hover:translate-x-1 transition-transform">
                Vote Now →
              </span>
            </div>
            <h2 className="mt-4 text-xl font-bold text-cyan-300">Board Elections</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Review candidates and cast your democratic ballot in active elections.
            </p>
          </Link>

          <Link
            href="/election-results"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">📊</span>
              <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                Results →
              </span>
            </div>
            <h2 className="mt-4 text-xl font-bold">Election Results</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              View transparent tallies and elected leaders from completed cycles.
            </p>
          </Link>

          <Link
            href="/candidate"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">🎖️</span>
              <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                Portfolio →
              </span>
            </div>
            <h2 className="mt-4 text-xl font-bold">My Candidate Portfolio</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              View your public verified record and approved nominations.
            </p>
          </Link>

          {/* Admin Panels for Coordinators */}
          {isAdmin && (
            <>
              <Link
                href="/admin/contributions"
                className="group rounded-2xl border border-purple-400/30 bg-purple-950/20 p-6 transition hover:border-purple-400/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">✅</span>
                  <span className="text-xs font-bold text-purple-300 group-hover:translate-x-1 transition-transform">
                    Verify →
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold text-purple-300">
                  Verify Contributions
                </h2>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Review submitted member work and approve evidence.
                </p>
              </Link>

              <Link
                href="/admin/nominations"
                className="group rounded-2xl border border-purple-400/30 bg-purple-950/20 p-6 transition hover:border-purple-400/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📋</span>
                  <span className="text-xs font-bold text-purple-300 group-hover:translate-x-1 transition-transform">
                    Review →
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold text-purple-300">
                  Manage Nominations
                </h2>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Review peer nominations for Board positions.
                </p>
              </Link>

              <Link
                href="/admin/elections"
                className="group rounded-2xl border border-purple-400/30 bg-purple-950/20 p-6 transition hover:border-purple-400/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">⚙️</span>
                  <span className="text-xs font-bold text-purple-300 group-hover:translate-x-1 transition-transform">
                    Admin →
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold text-purple-300">
                  Election Management
                </h2>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Create elections, configure Board positions, and assign candidates.
                </p>
              </Link>
            </>
          )}
        </div>

        {/* Account Info Pill */}
        <div className="mt-10 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Role</p>
            <p className="mt-0.5 text-base font-bold text-cyan-400 capitalize">
              {user?.role}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400">Authenticated as</p>
            <p className="text-xs font-mono text-slate-300">{user?.email}</p>
          </div>
        </div>
      </div>
    </main>
  );
}