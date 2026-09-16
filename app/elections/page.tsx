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
  election_id: string;
  position_name: string;
  description: string | null;
};

type Candidate = {
  id: string;
  position_id: string;
  candidate_id: string;
};

type Profile = {
  id: string;
  name: string | null;
  department: string | null;
  year: string | null;
  bio: string | null;
};

export default function ElectionsPage() {
  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState<Election[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadElections();
  }, []);

  async function loadElections() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("elections")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setElections(data ?? []);

    if (data && data.length > 0) {
      await loadElectionData(data[0].id);
    }

    setLoading(false);
  }

  async function loadElectionData(electionId: string) {
    setSelectedElection(electionId);
    setMessage("");

    const { data: positionData } = await supabase
      .from("election_positions")
      .select("*")
      .eq("election_id", electionId)
      .order("created_at", { ascending: true });

    setPositions(positionData ?? []);

    const { data: candidateData } = await supabase
      .from("election_candidates")
      .select("*")
      .eq("election_id", electionId);

    setCandidates(candidateData ?? []);

    const candidateIds = (candidateData ?? []).map(
      (candidate) => candidate.candidate_id
    );

    if (candidateIds.length === 0) {
      setProfiles([]);
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, name, department, year, bio")
      .in("id", candidateIds);

    setProfiles(profileData ?? []);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const { data: existingVotes } = await supabase
      .from("election_votes")
      .select("position_id, candidate_id")
      .eq("election_id", electionId)
      .eq("voter_id", session.user.id);

    const voteMap: Record<string, string> = {};

    (existingVotes ?? []).forEach((vote) => {
      voteMap[vote.position_id] = vote.candidate_id;
    });

    setVotes(voteMap);
  }

  async function castVote(positionId: string) {
    const candidateId = votes[positionId];

    if (!candidateId) {
      setMessage("Please select a candidate first.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("election_votes").insert({
      election_id: selectedElection,
      position_id: positionId,
      candidate_id: candidateId,
      voter_id: session.user.id,
    });

    if (error) {
      if (error.code === "23505") {
        setMessage("You have already voted for this position.");
      } else {
        setMessage(error.message);
      }

      return;
    }

    setMessage("Vote recorded successfully.");
  }

  function getProfile(candidateId: string) {
    return profiles.find((profile) => profile.id === candidateId);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading elections...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">

        <a
          href="/dashboard"
          className="text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Dashboard
        </a>

        <h1 className="mt-10 text-5xl font-bold">
          Board Elections
        </h1>

        <p className="mt-4 text-lg text-slate-400">
          Review candidates and cast your vote.
        </p>

        {message && (
          <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-cyan-300">
            {message}
          </div>
        )}

        {elections.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <h2 className="text-2xl font-bold">
              No Active Election
            </h2>
          </div>
        ) : (
          <>
            {elections.length > 1 && (
              <select
                value={selectedElection}
                onChange={(e) => loadElectionData(e.target.value)}
                className="mt-8 w-full rounded-xl bg-slate-900 px-4 py-3"
              >
                {elections.map((election) => (
                  <option key={election.id} value={election.id}>
                    {election.title}
                  </option>
                ))}
              </select>
            )}

            <div className="mt-8 space-y-8">
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
                    <h2 className="text-3xl font-bold">
                      {position.position_name}
                    </h2>

                    {position.description && (
                      <p className="mt-2 text-slate-400">
                        {position.description}
                      </p>
                    )}

                    <div className="mt-6 space-y-4">
                      {positionCandidates.map((candidate) => {
                        const profile = getProfile(
                          candidate.candidate_id
                        );

                        return (
                          <label
                            key={candidate.id}
                            className="flex cursor-pointer items-center gap-4 rounded-xl border border-white/10 bg-slate-900 p-5 hover:border-cyan-400/40"
                          >
                            <input
                              type="radio"
                              name={`position-${position.id}`}
                              checked={
                                votes[position.id] ===
                                candidate.candidate_id
                              }
                              onChange={() =>
                                setVotes((current) => ({
                                  ...current,
                                  [position.id]:
                                    candidate.candidate_id,
                                }))
                              }
                            />

                            <div className="flex-1">
                              <p className="text-lg font-bold">
                                {profile?.name || "Candidate"}
                              </p>

                              <p className="text-sm text-slate-400">
                                {profile?.department || ""}
                                {profile?.year
                                  ? ` • ${profile.year}`
                                  : ""}
                              </p>
                            </div>

                            <a
                              href={`/candidate?id=${candidate.candidate_id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-sm text-cyan-400"
                            >
                              Portfolio
                            </a>
                          </label>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => castVote(position.id)}
                      className="mt-6 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300"
                    >
                      Cast Vote
                    </button>
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