"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getActiveUser } from "@/lib/auth-helpers";
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

export default function AdminElectionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [elections, setElections] = useState<ClubElection[]>([]);
  const [positions, setPositions] = useState<ClubPosition[]>([]);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [candidates, setCandidates] = useState<ClubCandidate[]>([]);

  const [selectedElection, setSelectedElection] = useState("");
  const [perPositionCandidate, setPerPositionCandidate] = useState<Record<string, string>>({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [positionName, setPositionName] = useState("");
  const [positionDescription, setPositionDescription] = useState("");

  const [message, setMessage] = useState("");

  const loadMembers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, department, year, role")
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        setMembers(data as ClubMember[]);
      } else {
        setMembers(INITIAL_MEMBERS);
      }
    } catch {
      setMembers(INITIAL_MEMBERS);
    }
  }, []);

  const loadElectionData = useCallback(async (electionId: string) => {
    setSelectedElection(electionId);
    setMessage("");

    try {
      const { data: positionData } = await supabase
        .from("election_positions")
        .select("*")
        .eq("election_id", electionId)
        .order("created_at", { ascending: true });

      if (positionData && positionData.length > 0) {
        setPositions(positionData as ClubPosition[]);
      } else {
        setPositions(INITIAL_POSITIONS.filter((p) => p.election_id === electionId || electionId === "elec-2026"));
      }
    } catch {
      setPositions(INITIAL_POSITIONS);
    }

    try {
      const { data: candidateData } = await supabase
        .from("election_candidates")
        .select("*")
        .eq("election_id", electionId);

      if (candidateData && candidateData.length > 0) {
        setCandidates(candidateData as ClubCandidate[]);
      } else {
        setCandidates(INITIAL_CANDIDATES.filter((c) => c.election_id === electionId || electionId === "elec-2026"));
      }
    } catch {
      setCandidates(INITIAL_CANDIDATES);
    }
  }, []);

  const loadElections = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("elections")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setElections(data as ClubElection[]);
        await loadElectionData(data[0].id);
      } else {
        setElections(INITIAL_ELECTIONS);
        await loadElectionData(INITIAL_ELECTIONS[0].id);
      }
    } catch {
      setElections(INITIAL_ELECTIONS);
      await loadElectionData(INITIAL_ELECTIONS[0].id);
    }
  }, [loadElectionData]);

  const checkAccess = useCallback(async () => {
    const user = await getActiveUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "coordinator" && user.role !== "admin") {
      setLoading(false);
      return;
    }

    setAuthorized(true);
    await loadElections();
    await loadMembers();
    setLoading(false);
  }, [router, loadElections, loadMembers]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  async function createElection() {
    if (!title.trim()) {
      setMessage("Please enter an election title.");
      return;
    }

    const activeUser = await getActiveUser();
    if (!activeUser) {
      router.push("/login");
      return;
    }

    const newElec: ClubElection = {
      id: `elec-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || "",
      status: "draft",
      created_at: new Date().toISOString(),
    };

    if (!activeUser.isDemo) {
      try {
        await supabase.from("elections").insert({
          title: newElec.title,
          description: newElec.description || null,
          status: "draft",
          created_by: activeUser.id,
        });
      } catch (err) {
        console.warn("Supabase insert election note:", err);
      }
    }

    setElections((curr) => [newElec, ...curr]);
    setSelectedElection(newElec.id);
    setPositions([]);
    setCandidates([]);
    setTitle("");
    setDescription("");
    setMessage("Election created successfully! You can now configure Board positions.");
  }

  async function addPosition() {
    if (!selectedElection) {
      setMessage("Please select or create an election first.");
      return;
    }

    if (!positionName.trim()) {
      setMessage("Please enter a position name.");
      return;
    }

    const newPos: ClubPosition = {
      id: `pos-${Date.now()}`,
      election_id: selectedElection,
      position_name: positionName.trim(),
      description: positionDescription.trim(),
    };

    const activeUser = await getActiveUser();
    if (activeUser && !activeUser.isDemo) {
      try {
        await supabase.from("election_positions").insert({
          election_id: selectedElection,
          position_name: newPos.position_name,
          description: newPos.description || null,
        });
      } catch (err) {
        console.warn("Supabase insert position note:", err);
      }
    }

    setPositions((curr) => [...curr, newPos]);
    setPositionName("");
    setPositionDescription("");
    setMessage(`Board position "${newPos.position_name}" added.`);
  }

  async function deletePosition(positionId: string) {
    const activeUser = await getActiveUser();
    if (activeUser && !activeUser.isDemo) {
      try {
        await supabase.from("election_positions").delete().eq("id", positionId);
      } catch (err) {
        console.warn("Supabase delete position note:", err);
      }
    }

    setPositions((curr) => curr.filter((p) => p.id !== positionId));
    setCandidates((curr) => curr.filter((c) => c.position_id !== positionId));
    setMessage("Position removed.");
  }

  // FIXED BUG: accepts positionId & memberId directly without relying on async state
  async function addCandidateDirect(positionId: string, memberId: string) {
    if (!selectedElection) {
      setMessage("Please select an election.");
      return;
    }

    if (!positionId) {
      setMessage("Please select a position.");
      return;
    }

    if (!memberId) {
      setMessage("Please select a member from the dropdown.");
      return;
    }

    const exists = candidates.some(
      (c) => c.position_id === positionId && c.candidate_id === memberId
    );

    if (exists) {
      setMessage("This member is already registered as a candidate for this position.");
      return;
    }

    const newCand: ClubCandidate = {
      id: `cand-${Date.now()}`,
      election_id: selectedElection,
      position_id: positionId,
      candidate_id: memberId,
    };

    const activeUser = await getActiveUser();
    if (activeUser && !activeUser.isDemo) {
      try {
        await supabase.from("election_candidates").insert({
          election_id: selectedElection,
          position_id: positionId,
          candidate_id: memberId,
        });
      } catch (err) {
        console.warn("Supabase add candidate note:", err);
      }
    }

    setCandidates((curr) => [...curr, newCand]);
    setPerPositionCandidate((curr) => ({ ...curr, [positionId]: "" }));
    setMessage("Candidate registered successfully for this ballot position!");
  }

  async function removeCandidate(candidateId: string) {
    const activeUser = await getActiveUser();
    if (activeUser && !activeUser.isDemo) {
      try {
        await supabase.from("election_candidates").delete().eq("id", candidateId);
      } catch (err) {
        console.warn("Supabase remove candidate note:", err);
      }
    }

    setCandidates((curr) => curr.filter((c) => c.id !== candidateId));
    setMessage("Candidate removed from ballot.");
  }

  async function updateElectionStatus(electionId: string, status: "draft" | "open" | "closed") {
    const activeUser = await getActiveUser();
    if (activeUser && !activeUser.isDemo) {
      try {
        await supabase.from("elections").update({ status }).eq("id", electionId);
      } catch (err) {
        console.warn("Supabase update election status note:", err);
      }
    }

    setElections((curr) =>
      curr.map((e) => (e.id === electionId ? { ...e, status } : e))
    );
    setMessage(`Election status updated to "${status}".`);
  }

  function getMember(memberId: string) {
    return members.find((m) => m.id === memberId);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Verifying coordinator access...</p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="mt-3 text-slate-400">
            Only club coordinators and election administrators can manage ballots.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            ← Back to Dashboard
          </Link>

          <Link
            href="/elections"
            className="text-xs text-slate-400 hover:text-white transition"
          >
            View Public Voting Ballot →
          </Link>
        </div>

        <div className="mt-8">
          <span className="rounded-full bg-purple-400/10 px-3.5 py-1 text-xs font-semibold text-purple-300 border border-purple-400/20">
            Administrator Control
          </span>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
            Election Management
          </h1>

          <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
            Create new election cycles, configure Board positions, assign qualified candidates, and open ballots for voting.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-950/30 p-4 text-sm font-medium text-cyan-300">
            {message}
          </div>
        )}

        {/* Create Election */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-xl">
          <h2 className="text-2xl font-bold">Create New Election Cycle</h2>

          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="e.g. Wiki Club SATI Board Election 2026-27"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
            />

            <textarea
              placeholder="Election description and timeline details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
            />

            <button
              onClick={createElection}
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-bold text-slate-950 hover:opacity-95 shadow-md shadow-cyan-400/20 transition"
            >
              + Create Election
            </button>
          </div>
        </section>

        {/* Election Selector & Status */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Configured Elections</h2>

          <div className="mt-4 grid gap-4">
            {elections.map((elec) => {
              const isSelected = selectedElection === elec.id;

              return (
                <div
                  key={elec.id}
                  className={`rounded-2xl border p-6 transition ${
                    isSelected
                      ? "border-cyan-400/50 bg-cyan-950/20"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{elec.title}</h3>
                      {elec.description && (
                        <p className="mt-1 text-xs text-slate-400">{elec.description}</p>
                      )}
                      <p className="mt-2 text-xs">
                        Status:{" "}
                        <span className="font-bold text-cyan-400 uppercase tracking-wider">
                          {elec.status}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => loadElectionData(elec.id)}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                          isSelected
                            ? "bg-cyan-400 text-slate-950"
                            : "border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10"
                        }`}
                      >
                        {isSelected ? "Currently Managing" : "Manage"}
                      </button>

                      {elec.status === "draft" && (
                        <button
                          onClick={() => updateElectionStatus(elec.id, "open")}
                          className="rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 transition"
                        >
                          Open Voting
                        </button>
                      )}

                      {elec.status === "open" && (
                        <button
                          onClick={() => updateElectionStatus(elec.id, "closed")}
                          className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition"
                        >
                          Close Election
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Position & Candidate Management */}
        {selectedElection && (
          <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-xl">
            <h2 className="text-2xl font-bold">Board Positions & Candidates</h2>
            <p className="mt-1 text-xs text-slate-400">
              Add Board positions to this election and register eligible candidates.
            </p>

            {/* Add Position Form */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
                + Add Board Position
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Position Name (e.g. Technical Head)"
                  value={positionName}
                  onChange={(e) => setPositionName(e.target.value)}
                  className="rounded-xl border border-white/15 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400 transition"
                />

                <input
                  type="text"
                  placeholder="Description (Optional responsibilities)"
                  value={positionDescription}
                  onChange={(e) => setPositionDescription(e.target.value)}
                  className="rounded-xl border border-white/15 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400 transition"
                />
              </div>

              <button
                onClick={addPosition}
                className="mt-3 rounded-xl bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition"
              >
                Add Position to Ballot
              </button>
            </div>

            {/* Positions List */}
            <div className="mt-8 space-y-6">
              {positions.length === 0 ? (
                <p className="text-slate-500 text-sm py-4">No positions added to this election yet.</p>
              ) : (
                positions.map((pos) => {
                  const posCandidates = candidates.filter((c) => c.position_id === pos.id);
                  const selectedMemberId = perPositionCandidate[pos.id] || "";

                  return (
                    <div
                      key={pos.id}
                      className="rounded-2xl border border-white/10 bg-slate-900/40 p-6"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-white/10 pb-4">
                        <div>
                          <h3 className="text-xl font-bold">{pos.position_name}</h3>
                          {pos.description && (
                            <p className="mt-1 text-xs text-slate-400">{pos.description}</p>
                          )}
                        </div>

                        <button
                          onClick={() => deletePosition(pos.id)}
                          className="rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-400/10 transition"
                        >
                          Remove Position
                        </button>
                      </div>

                      {/* Candidates */}
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Registered Candidates ({posCandidates.length})
                        </p>

                        {posCandidates.length === 0 ? (
                          <p className="mt-2 text-xs text-slate-500">
                            No candidates added for this position yet.
                          </p>
                        ) : (
                          <div className="mt-3 grid gap-2">
                            {posCandidates.map((cand) => {
                              const mem = getMember(cand.candidate_id);

                              return (
                                <div
                                  key={cand.id}
                                  className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950 p-3.5"
                                >
                                  <div>
                                    <p className="text-sm font-bold text-white">
                                      {mem?.name || "Unknown Member"}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                      {mem?.department || "SATI"} • {mem?.email}
                                    </p>
                                  </div>

                                  <button
                                    onClick={() => removeCandidate(cand.id)}
                                    className="rounded-lg border border-rose-400/30 px-2.5 py-1 text-xs text-rose-300 hover:bg-rose-400/10 transition"
                                  >
                                    Remove
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Add Candidate Form (Directly wired!) */}
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <select
                            value={selectedMemberId}
                            onChange={(e) =>
                              setPerPositionCandidate((curr) => ({
                                ...curr,
                                [pos.id]: e.target.value,
                              }))
                            }
                            className="flex-1 rounded-xl border border-white/15 bg-slate-950 px-4 py-2 text-xs text-white outline-none focus:border-cyan-400 transition"
                          >
                            <option value="">Select a member to register</option>
                            {members.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name || m.email} ({m.department || "SATI"})
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => addCandidateDirect(pos.id, selectedMemberId)}
                            className="rounded-xl bg-cyan-400 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition"
                          >
                            + Add Candidate
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}