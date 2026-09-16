"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Election = {
  id: string;
  title: string;
  description: string | null;
  status: string;
};

type Position = {
  id: string;
  position_name: string;
};

type Candidate = {
  id: string;
  candidate_id: string;
  position_id: string;
};

type Profile = {
  id: string;
  name: string | null;
};

type Vote = {
  position_id: string;
  candidate_id: string;
};

export default function ElectionResultsPage() {
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState<Election | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const { data: electionData, error: electionError } =
      await supabase
        .from("elections")
        .select("*")
        .eq("status", "closed")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (electionError) {
      setMessage(electionError.message);
      setLoading(false);
      return;
    }

    if (!electionData) {
      setMessage("No completed election results are available yet.");
      setLoading(false);
      return;
    }

    setElection(electionData);

    const { data: positionData } = await supabase
      .from("election_positions")
      .select("id, position_name")
      .eq("election_id", electionData.id)
      .order("created_at", { ascending: true });

    setPositions(positionData ?? []);

    const { data: candidateData } = await supabase
      .from("election_candidates")
      .select("id, candidate_id, position_id")
      .eq("election_id", electionData.id);

    setCandidates(candidateData ?? []);

    const candidateIds = (candidateData ?? []).map(
      (candidate) => candidate.candidate_id
    );

    if (candidateIds.length > 0) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", candidateIds);

      setProfiles(profileData ?? []);
    }

    const { data: voteData, error: voteError } = await supabase
      .from("election_votes")
      .select("position_id, candidate_id")
      .eq("election_id", electionData.id);

    if (voteError) {
      setMessage(voteError.message);
    } else {
      setVotes(voteData ?? []);
    }

    setLoading(false);
  }

  function getVoteCount(candidateId: string, positionId: string) {
    return votes.filter(
      (vote) =>
        vote.candidate_id === candidateId &&
        vote.position_id === positionId
    ).length;
  }

  function getProfile(candidateId: string) {
    return profiles.find(
      (profile) => profile.id === candidateId
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">
          Loading results...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">

        <a
          href="/dashboard"
          className="text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Dashboard
        </a>

        <h1 className="mt-10 text-5xl font-bold">
          Election Results
        </h1>

        {message && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5 text-slate-300">
            {message}
          </div>
        )}

        {election && (
          <>
            <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
              <p className="text-sm uppercase tracking-wider text-cyan-400">
                Completed Election
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {election.title}
              </h2>

              {election.description && (
                <p className="mt-3 text-slate-400">
                  {election.description}
                </p>
              )}
            </div>

            <div className="mt-10 space-y-6">
              {positions.map((position) => {
                const positionCandidates = candidates.filter(
                  (candidate) =>
                    candidate.position_id === position.id
                );

                return (
                  <section
                    key={position.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6"
                  >
                    <h2 className="text-2xl font-bold">
                      {position.position_name}
                    </h2>

                    <div className="mt-5 space-y-3">
                      {positionCandidates.map((candidate) => {
                        const profile = getProfile(
                          candidate.candidate_id
                        );

                        const count = getVoteCount(
                          candidate.candidate_id,
                          position.id
                        );

                        return (
                          <div
                            key={candidate.id}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900 p-5"
                          >
                            <div>
                              <p className="font-bold">
                                {profile?.name || "Candidate"}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-2xl font-bold text-cyan-400">
                                {count}
                              </p>

                              <p className="text-xs text-slate-500">
                                votes
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}