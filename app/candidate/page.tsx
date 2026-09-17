"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getActiveUser } from "@/lib/auth-helpers";
import { INITIAL_MEMBERS, INITIAL_CONTRIBUTIONS, INITIAL_NOMINATIONS, ClubContribution, ClubNomination } from "@/lib/mock-data";

type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  department: string | null;
  year: string | null;
  bio: string | null;
};

export default function CandidatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [contributions, setContributions] = useState<ClubContribution[]>([]);
  const [nominations, setNominations] = useState<ClubNomination[]>([]);
  const [message, setMessage] = useState("");

  const loadCandidate = useCallback(async () => {
    const activeUser = await getActiveUser();

    if (!activeUser) {
      router.push("/login");
      return;
    }

    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const selectedId = params.get("id");
    const targetUserId = selectedId || activeUser.id;

    // 1. Try fetching profile from Supabase
    let loadedProfile: Profile | null = null;
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, name, email, department, year, bio")
        .eq("id", targetUserId)
        .maybeSingle();

      if (profileData) {
        loadedProfile = profileData;
      }
    } catch (err) {
      console.warn("Supabase fetch candidate profile err:", err);
    }

    // Fallback to activeUser or INITIAL_MEMBERS
    if (!loadedProfile) {
      if (activeUser.id === targetUserId) {
        loadedProfile = {
          id: activeUser.id,
          name: activeUser.name,
          email: activeUser.email,
          department: activeUser.department ?? "Engineering",
          year: activeUser.year ?? "Student Member",
          bio: activeUser.bio ?? "Active Wiki Club SATI Member.",
        };
      } else {
        const found = INITIAL_MEMBERS.find((m) => m.id === targetUserId);
        if (found) {
          loadedProfile = {
            id: found.id,
            name: found.name,
            email: found.email,
            department: found.department,
            year: found.year,
            bio: found.bio,
          };
        }
      }
    }

    if (!loadedProfile) {
      setMessage("This member profile could not be found.");
      setLoading(false);
      return;
    }

    setProfile(loadedProfile);

    // 2. Fetch approved contributions
    try {
      const { data: contribData } = await supabase
        .from("contributions")
        .select("*")
        .eq("user_id", targetUserId)
        .eq("status", "approved")
        .order("contribution_date", { ascending: false });

      if (contribData && contribData.length > 0) {
        setContributions(contribData as ClubContribution[]);
      } else {
        const fallbackContribs = INITIAL_CONTRIBUTIONS.filter(
          (c) => c.user_id === targetUserId && c.status === "approved"
        );
        setContributions(fallbackContribs);
      }
    } catch {
      const fallbackContribs = INITIAL_CONTRIBUTIONS.filter(
        (c) => c.user_id === targetUserId && c.status === "approved"
      );
      setContributions(fallbackContribs);
    }

    // 3. Fetch approved nominations
    try {
      const { data: nomData } = await supabase
        .from("nominations")
        .select("*")
        .eq("nominee_id", targetUserId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (nomData && nomData.length > 0) {
        setNominations(nomData as ClubNomination[]);
      } else {
        const fallbackNoms = INITIAL_NOMINATIONS.filter(
          (n) => n.nominee_id === targetUserId && n.status === "approved"
        );
        setNominations(fallbackNoms);
      }
    } catch {
      const fallbackNoms = INITIAL_NOMINATIONS.filter(
        (n) => n.nominee_id === targetUserId && n.status === "approved"
      );
      setNominations(fallbackNoms);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadCandidate();
  }, [loadCandidate]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading candidate portfolio...</p>
      </main>
    );
  }

  if (message || !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Member Not Found</h1>
          <p className="mt-4 text-slate-400">
            {message || "This member profile could not be found."}
          </p>
          <Link
            href="/members"
            className="mt-6 inline-block text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            ← Back to Members Directory
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <Link
            href="/members"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            ← Back to Members
          </Link>

          <Link
            href="/elections"
            className="text-xs text-slate-400 hover:text-white transition"
          >
            Go to Elections →
          </Link>
        </div>

        {/* Profile Card */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl font-bold text-cyan-400 border border-cyan-400/20">
              {(profile.name || profile.email || "M")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="flex-1">
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
                Verified Candidate Portfolio
              </span>

              <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
                {profile.name || "Unnamed Member"}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2.5">
                {profile.department && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs text-cyan-300">
                    {profile.department}
                  </span>
                )}

                {profile.year && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs text-slate-300">
                    {profile.year}
                  </span>
                )}
              </div>
            </div>
          </div>

          {profile.bio && (
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="leading-relaxed text-slate-300 text-sm">
                {profile.bio}
              </p>
            </div>
          )}

          {profile.email && (
            <p className="mt-4 text-xs font-mono text-slate-500">
              {profile.email}
            </p>
          )}
        </div>

        {/* Contributions Section */}
        <section className="mt-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Documented Work
              </span>
              <h2 className="mt-1 text-3xl font-bold">Approved Contributions</h2>
            </div>

            <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1 text-xs font-bold text-emerald-300">
              ✓ {contributions.length} Verified Submissions
            </span>
          </div>

          {contributions.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">This member has no approved contributions yet.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {contributions.map((contribution) => (
                <div
                  key={contribution.id}
                  className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-6 transition"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {contribution.title}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-cyan-400">
                        {contribution.category}
                      </p>
                    </div>

                    <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-400">
                      ✓ Verified
                    </span>
                  </div>

                  {contribution.description && (
                    <p className="mt-4 text-sm leading-relaxed text-slate-300">
                      {contribution.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                    {contribution.contribution_date && (
                      <p className="text-xs text-slate-500">
                        Date: {contribution.contribution_date}
                      </p>
                    )}

                    {contribution.evidence_url && (
                      <a
                        href={contribution.evidence_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
                      >
                        View Verification Proof ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Nominations Section */}
        <section className="mt-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Community Endorsements
            </span>
            <h2 className="mt-1 text-3xl font-bold">Approved Nominations</h2>
            <p className="mt-2 text-sm text-slate-400">
              Board nominations approved by authorized club coordinators.
            </p>
          </div>

          {nominations.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">No approved nominations yet for this member.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {nominations.map((nomination) => (
                <div
                  key={nomination.id}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Nominated for Position</p>
                      <h3 className="mt-0.5 text-xl font-bold text-cyan-300">
                        {nomination.position}
                      </h3>
                    </div>

                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-400">
                      ✓ Approved
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-slate-500">Reason</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">
                      {nomination.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Verification Notice */}
        <div className="mt-12 rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-6">
          <h2 className="font-bold text-cyan-300 text-sm">
            Evidence-Based Transparency Guarantee
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            This portfolio separates verified contributions from unverified claims. It
            is designed to give SATI members transparent information about a candidate&apos;s
            real, documented work before voting in Board elections.
          </p>
        </div>
      </div>
    </main>
  );
}