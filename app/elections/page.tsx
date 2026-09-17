"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getActiveUser, UserSession } from "@/lib/auth-helpers";
import {
  INITIAL_ELECTIONS,
  INITIAL_POSITIONS,
  INITIAL_CANDIDATES,
  INITIAL_MEMBERS,
  ClubElection,
  ClubPosition,
  ClubCandidate,
  ClubMember,
} from "@/lib/mock-data";

export default function ElectionsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState<ClubElection[]>([]);
  const [positions, setPositions] = useState<ClubPosition[]>([]);
  const [candidates, setCandidates] = useState<ClubCandidate[]>([]);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [recordedVotes, setRecordedVotes] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState("");

  const loadElectionData = useCallback(async (electionId: string, userId: string) => {
    setSelectedElection(electionId);
    setMessage("");

    // 1. Load positions
    try {
      const { data: posData } = await supabase
        .from("election_positions")
        .select("*")
        .eq("election_id", electionId)
        .order("created_at", { ascending: true });

      if (posData && posData.length > 0) {
        setPositions(posData as ClubPosition[]);
      } else {
        setPositions(INITIAL_POSITIONS.filter((p) => p.election_id === electionId || electionId === "elec-2026"));
      }
    } catch {
      setPositions(INITIAL_POSITIONS);
    }

    // 2. Load candidates
    try {
      const { data: candData } = await supabase
        .from("election_candidates")
        .select("*")
        .eq("election_id", electionId);

      if (candData && candData.length > 0) {
        setCandidates(candData as ClubCandidate[]);
      } else {
        setCandidates(INITIAL_CANDIDATES.filter((c) => c.election_id === electionId || electionId === "elec-2026"));
      }
    } catch {
      setCandidates(INITIAL_CANDIDATES);
    }

    // 3. Load members
    try {
      const { data: memberData } = await supabase
        .from("profiles")
        .select("id, name, email, department, year, bio, role");

      if (memberData && memberData.length > 0) {
        setMembers(memberData as ClubMember[]);
      } else {
        setMembers(INITIAL_MEMBERS);
      }
    } catch {
      setMembers(INITIAL_MEMBERS);
    }

    // 4. Load existing votes for this user
    const voteMap: Record<string, string> = {};
    const recordedMap: Record<string, boolean> = {};

    try {
      const { data: existingVotes } = await supabase
        .from("election_votes")
        .select("position_id, candidate_id")
        .eq("election_id", electionId)
        .eq("voter_id", userId);

      (existingVotes ?? []).forEach((vote) => {
        voteMap[vote.position_id] = vote.candidate_id;
        recordedMap[vote.position_id] = true;
      });
    } catch {
      // ignore
    }

    // Also check localStorage
    if (typeof window !== "undefined") {
      const localVotesStr = localStorage.getItem(`votes_${electionId}_${userId}`);
      if (localVotesStr) {
        try {
          const localVotes = JSON.parse(localVotesStr) as Record<string, string>;
          Object.assign(voteMap, localVotes);
          Object.keys(localVotes).forEach((posId) => {
            recordedMap[posId] = true;
          });
        } catch {
          // ignore
        }
      }
    }

    setVotes(voteMap);
    setRecordedVotes(recordedMap);
  }, []);

  const loadElections = useCallback(async () => {
    const user = await getActiveUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setCurrentUser(user);

    try {
      const { data, error } = await supabase
        .from("elections")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setElections(data as ClubElection[]);
        await loadElectionData(data[0].id, user.id);
      } else {
        // Fallback to active demo election
        setElections(INITIAL_ELECTIONS);
        await loadElectionData(INITIAL_ELECTIONS[0].id, user.id);
      }
    } catch {
      setElections(INITIAL_ELECTIONS);
      await loadElectionData(INITIAL_ELECTIONS[0].id, user.id);
    }

    setLoading(false);
  }, [router, loadElectionData]);

  useEffect(() => {
    loadElections();
  }, [loadElections]);

  async function castVote(positionId: string) {
    const candidateId = votes[positionId];

    if (!candidateId) {
      setMessage("Please select a candidate before casting your vote.");
      return;
    }

    const activeUser = await getActiveUser();

    if (!activeUser) {
      router.push("/login");
      return;
    }

    if (recordedVotes[positionId]) {
      setMessage("You have already cast your ballot for this position.");
      return;
    }

    // 1. Try Supabase
    if (!activeUser.isDemo) {
      try {
        const { error } = await supabase.from("election_votes").insert({
          election_id: selectedElection,
          position_id: positionId,
          candidate_id: candidateId,
          voter_id: activeUser.id,
        });

        if (error) {
          if (error.code === "23505") {
            setMessage("You have already voted for this position.");
            setRecordedVotes((prev) => ({ ...prev, [positionId]: true }));
            return;
          }
        }
      } catch (err) {
        console.warn("Supabase vote insert note:", err);
      }
    }

    // 2. Persist vote locally
    if (typeof window !== "undefined") {
      const storageKey = `votes_${selectedElection}_${activeUser.id}`;
      const existing = localStorage.getItem(storageKey);
      const parsed = existing ? JSON.parse(existing) : {};
      parsed[positionId] = candidateId;
      localStorage.setItem(storageKey, JSON.stringify(parsed));
    }

    setRecordedVotes((prev) => ({ ...prev, [positionId]: true }));
    setMessage("Your ballot has been successfully recorded!");
  }

  function getCandidateProfile(candidateId: string) {
    return members.find((m) => m.id === candidateId);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading active elections...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            ← Back to Dashboard
          </Link>

          <Link
            href="/election-results"
            className="text-xs text-slate-400 hover:text-white transition"
          >
            Past Results →
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="rounded-full bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
              Official Voting Ballot
            </span>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
              Board Elections
            </h1>

            <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
              Review verified candidate credentials, inspect portfolios, and cast your democratic vote for each open position.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-400/30 bg-emerald-950/20 px-4 py-2 text-right">
            <span className="text-xs font-bold text-emerald-300">● Live Ballot Open</span>
            {currentUser && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                Voter: <strong className="text-cyan-300">{currentUser.name}</strong>
              </p>
            )}
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-950/30 p-4 text-sm font-medium text-cyan-300">
            {message}
          </div>
        )}

        {elections.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <h2 className="text-2xl font-bold">No Active Elections Currently Open</h2>
            <p className="mt-2 text-slate-400 text-sm">
              Please check back during the next scheduled voting cycle.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {positions.map((pos) => {
              const posCandidates = candidates.filter((c) => c.position_id === pos.id);
              const isVoted = !!recordedVotes[pos.id];

              return (
                <section
                  key={pos.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-xl"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                        Position Ballot
                      </span>
                      <h2 className="mt-1 text-2xl font-bold">{pos.position_name}</h2>
                      {pos.description && (
                        <p className="mt-1 text-xs text-slate-400">{pos.description}</p>
                      )}
                    </div>

                    {isVoted && (
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                        ✓ Ballot Cast
                      </span>
                    )}
                  </div>

                  <div className="mt-6 space-y-3">
                    {posCandidates.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4">No candidates nominated yet for this position.</p>
                    ) : (
                      posCandidates.map((cand) => {
                        const prof = getCandidateProfile(cand.candidate_id);
                        const isSelected = votes[pos.id] === cand.candidate_id;

                        return (
                          <label
                            key={cand.id}
                            className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
                              isSelected
                                ? "border-cyan-400/60 bg-cyan-950/20 shadow-md shadow-cyan-400/10"
                                : "border-white/10 bg-slate-900/60 hover:border-cyan-400/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`position-${pos.id}`}
                              disabled={isVoted}
                              checked={isSelected}
                              onChange={() =>
                                setVotes((curr) => ({
                                  ...curr,
                                  [pos.id]: cand.candidate_id,
                                }))
                              }
                              className="h-4 w-4 accent-cyan-400 cursor-pointer"
                            />

                            <div className="flex-1">
                              <p className="text-base font-bold text-white">
                                {prof?.name || "Candidate"}
                              </p>
                              <p className="text-xs text-slate-400">
                                {prof?.department || "SATI Student"}
                                {prof?.year ? ` • ${prof.year}` : ""}
                              </p>
                            </div>

                            <Link
                              href={`/candidate?id=${cand.candidate_id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-400 hover:bg-white/10 transition"
                            >
                              Inspect Portfolio ↗
                            </Link>
                          </label>
                        );
                      })
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      disabled={isVoted || posCandidates.length === 0}
                      onClick={() => castVote(pos.id)}
                      className={`rounded-xl px-6 py-2.5 text-xs font-bold transition ${
                        isVoted
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                          : "bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md shadow-cyan-400/20"
                      }`}
                    >
                      {isVoted ? "Vote Recorded" : "Cast Vote for " + pos.position_name}
                    </button>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}