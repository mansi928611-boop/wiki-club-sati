"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  department: string | null;
  year: string | null;
  bio: string | null;
};

type Contribution = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  contribution_date: string | null;
};

type Nomination = {
  id: string;
  position: string;
  reason: string;
  created_at: string;
};

export default function CandidatePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCandidate();
  }, []);

  async function loadCandidate() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const selectedId = params.get("id");

    const userId = selectedId || session.user.id;

    const { data: profileData, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, name, email, department, year, bio")
        .eq("id", userId)
        .maybeSingle();

    if (profileError) {
      setMessage(profileError.message);
      setLoading(false);
      return;
    }

    if (!profileData) {
      setMessage("Member profile not found.");
      setLoading(false);
      return;
    }

    const { data: contributionData, error: contributionError } =
      await supabase
        .from("contributions")
        .select(
          "id, title, category, description, contribution_date"
        )
        .eq("user_id", userId)
        .eq("status", "approved")
        .order("contribution_date", {
          ascending: false,
        });

    if (contributionError) {
      setMessage(contributionError.message);
    }

    const { data: nominationData, error: nominationError } =
      await supabase
        .from("nominations")
        .select(
          "id, position, reason, created_at"
        )
        .eq("nominee_id", userId)
        .eq("status", "approved")
        .order("created_at", {
          ascending: false,
        });

    if (nominationError) {
      console.error(
        "Nomination loading error:",
        nominationError
      );
    }

    setProfile(profileData);
    setContributions(contributionData ?? []);
    setNominations(nominationData ?? []);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">
          Loading candidate portfolio...
        </p>
      </main>
    );
  }

  if (message || !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Member Not Found
          </h1>

          <p className="mt-4 text-slate-400">
            {message || "This member profile could not be found."}
          </p>

          <a
            href="/members"
            className="mt-6 inline-block text-cyan-400 hover:text-cyan-300"
          >
            ← Back to Members
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <a
          href="/members"
          className="text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Members
        </a>

        {/* PROFILE */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-3xl font-bold text-cyan-400">
              {(profile.name || profile.email || "M")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                Member Portfolio
              </p>

              <h1 className="mt-2 text-5xl font-bold">
                {profile.name || "Unnamed Member"}
              </h1>

              <div className="mt-4 flex flex-wrap gap-3">
                {profile.department && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                    {profile.department}
                  </span>
                )}

                {profile.year && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                    {profile.year}
                  </span>
                )}
              </div>
            </div>
          </div>

          {profile.bio && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="leading-8 text-slate-300">
                {profile.bio}
              </p>
            </div>
          )}

          {profile.email && (
            <p className="mt-5 text-sm text-slate-500">
              {profile.email}
            </p>
          )}
        </div>

        {/* CONTRIBUTIONS */}
        <section className="mt-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                Verified Work
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Approved Contributions
              </h2>
            </div>

            <span className="w-fit rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-400">
              {contributions.length} Verified
            </span>
          </div>

          {contributions.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">
                This member has no approved contributions yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {contributions.map((contribution) => (
                <div
                  key={contribution.id}
                  className="rounded-2xl border border-green-400/20 bg-white/5 p-6"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {contribution.title}
                      </h3>

                      <p className="mt-2 text-sm text-cyan-400">
                        {contribution.category}
                      </p>
                    </div>

                    <span className="w-fit rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-xs font-semibold text-green-400">
                      ✓ Verified
                    </span>
                  </div>

                  {contribution.description && (
                    <p className="mt-4 leading-7 text-slate-300">
                      {contribution.description}
                    </p>
                  )}

                  {contribution.contribution_date && (
                    <p className="mt-4 text-sm text-slate-500">
                      Date: {contribution.contribution_date}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* NOMINATIONS */}
        <section className="mt-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Community Recognition
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Approved Nominations
            </h2>

            <p className="mt-3 text-slate-400">
              Nominations approved by authorized club coordinators.
            </p>
          </div>

          {nominations.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">
                No approved nominations yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {nominations.map((nomination) => (
                <div
                  key={nomination.id}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Nominated for
                      </p>

                      <h3 className="mt-1 text-xl font-semibold text-cyan-400">
                        {nomination.position}
                      </h3>
                    </div>

                    <span className="w-fit rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-xs font-semibold text-green-400">
                      ✓ Approved
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm text-slate-500">
                      Reason
                    </p>

                    <p className="mt-2 leading-7 text-slate-300">
                      {nomination.reason}
                    </p>
                  </div>

                  <p className="mt-4 text-xs text-slate-600">
                    Approved nomination submitted on{" "}
                    {new Date(
                      nomination.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* VERIFICATION NOTE */}
        <div className="mt-12 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
          <h2 className="font-semibold text-cyan-400">
            Evidence-Based Candidate Profile
          </h2>

          <p className="mt-2 leading-7 text-slate-400">
            This portfolio separates verified contributions and
            approved nominations from unverified submissions. It
            is designed to give members transparent information
            about a candidate's documented work.
          </p>
        </div>
      </div>
    </main>
  );
}