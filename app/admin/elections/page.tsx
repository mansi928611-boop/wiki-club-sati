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

type Member = {
  id: string;
  name: string | null;
  email: string | null;
  department: string | null;
  year: string | null;
};

type Candidate = {
  id: string;
  election_id: string;
  position_id: string;
  candidate_id: string;
};

export default function AdminElectionsPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [elections, setElections] = useState<Election[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [selectedElection, setSelectedElection] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [positionName, setPositionName] = useState("");
  const [positionDescription, setPositionDescription] = useState("");

  const [selectedCandidate, setSelectedCandidate] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
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
      .single();

    if (!profile || !["coordinator", "admin"].includes(profile.role)) {
      setLoading(false);
      return;
    }

    setAuthorized(true);

    await loadElections();
    await loadMembers();

    setLoading(false);
  }

  async function loadElections() {
    const { data, error } = await supabase
      .from("elections")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setElections(data ?? []);
    }
  }

  async function loadMembers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, department, year")
      .order("name", { ascending: true });

    if (!error) {
      setMembers(data ?? []);
    }
  }

  async function createElection() {
    if (!title.trim()) {
      setMessage("Please enter an election title.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("elections")
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        status: "draft",
        created_by: session.user.id,
      })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    setElections((current) => [data, ...current]);

    setSelectedElection(data.id);

    setTitle("");
    setDescription("");

    setPositions([]);
    setCandidates([]);

    setMessage("Election created successfully.");
  }

  async function loadElectionData(electionId: string) {
    setSelectedElection(electionId);
    setSelectedPosition("");
    setMessage("");

    const { data: positionData, error: positionError } =
      await supabase
        .from("election_positions")
        .select("*")
        .eq("election_id", electionId)
        .order("created_at", { ascending: true });

    if (positionError) {
      setMessage(positionError.message);
      return;
    }

    setPositions(positionData ?? []);

    const { data: candidateData, error: candidateError } =
      await supabase
        .from("election_candidates")
        .select("*")
        .eq("election_id", electionId);

    if (candidateError) {
      setMessage(candidateError.message);
      return;
    }

    setCandidates(candidateData ?? []);
  }

  async function addPosition() {
    if (!selectedElection) {
      setMessage("Please select an election first.");
      return;
    }

    if (!positionName.trim()) {
      setMessage("Please enter a position name.");
      return;
    }

    const { data, error } = await supabase
      .from("election_positions")
      .insert({
        election_id: selectedElection,
        position_name: positionName.trim(),
        description: positionDescription.trim() || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        setMessage("This position already exists.");
      } else {
        setMessage(error.message);
      }

      return;
    }

    setPositions((current) => [...current, data]);

    setPositionName("");
    setPositionDescription("");

    setMessage("Board position added.");
  }

  async function deletePosition(positionId: string) {
    const { error } = await supabase
      .from("election_positions")
      .delete()
      .eq("id", positionId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setPositions((current) =>
      current.filter((position) => position.id !== positionId)
    );

    setCandidates((current) =>
      current.filter((candidate) => candidate.position_id !== positionId)
    );

    if (selectedPosition === positionId) {
      setSelectedPosition("");
    }

    setMessage("Position removed.");
  }

  async function addCandidate() {
    if (!selectedElection) {
      setMessage("Please select an election.");
      return;
    }

    if (!selectedPosition) {
      setMessage("Please select a position.");
      return;
    }

    if (!selectedCandidate) {
      setMessage("Please select a member.");
      return;
    }

    const { data, error } = await supabase
      .from("election_candidates")
      .insert({
        election_id: selectedElection,
        position_id: selectedPosition,
        candidate_id: selectedCandidate,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        setMessage("This member is already a candidate for this position.");
      } else {
        setMessage(error.message);
      }

      return;
    }

    setCandidates((current) => [...current, data]);

    setSelectedCandidate("");

    setMessage("Candidate added successfully.");
  }

  async function removeCandidate(candidateId: string) {
    const { error } = await supabase
      .from("election_candidates")
      .delete()
      .eq("id", candidateId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setCandidates((current) =>
      current.filter((candidate) => candidate.id !== candidateId)
    );

    setMessage("Candidate removed.");
  }

  async function updateElectionStatus(
    electionId: string,
    status: string
  ) {
    const { error } = await supabase
      .from("elections")
      .update({ status })
      .eq("id", electionId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setElections((current) =>
      current.map((election) =>
        election.id === electionId
          ? { ...election, status }
          : election
      )
    );

    setMessage(`Election status changed to ${status}.`);
  }

  function getMember(memberId: string) {
    return members.find((member) => member.id === memberId);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Checking access...</p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Access Denied</h1>

          <p className="mt-3 text-slate-400">
            Only coordinators and admins can manage elections.
          </p>

          <a
            href="/dashboard"
            className="mt-6 inline-block rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"
          >
            Back to Dashboard
          </a>
        </div>
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

        <div className="mt-10">
          <h1 className="text-4xl font-bold">
            Election Management
          </h1>

          <p className="mt-3 text-slate-400">
            Create elections, choose Board positions, and add candidates.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-cyan-300">
            {message}
          </div>
        )}

        {/* CREATE ELECTION */}

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">
            Create New Election
          </h2>

          <div className="mt-6 grid gap-5">

            <input
              type="text"
              placeholder="Wiki Club SATI Board Election 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

            <textarea
              placeholder="Election description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

            <button
              onClick={createElection}
              className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300"
            >
              Create Election
            </button>

          </div>
        </section>

        {/* ELECTION LIST */}

        <section className="mt-10">
          <h2 className="text-2xl font-bold">
            Elections
          </h2>

          <div className="mt-5 grid gap-5">

            {elections.map((election) => (
              <div
                key={election.id}
                className={`rounded-2xl border p-6 ${
                  selectedElection === election.id
                    ? "border-cyan-400/40 bg-cyan-400/5"
                    : "border-white/10 bg-white/5"
                }`}
              >

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div>
                    <h3 className="text-xl font-bold">
                      {election.title}
                    </h3>

                    {election.description && (
                      <p className="mt-2 text-sm text-slate-400">
                        {election.description}
                      </p>
                    )}

                    <p className="mt-3 text-sm">
                      Status:{" "}
                      <span className="font-semibold text-cyan-400">
                        {election.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() =>
                        loadElectionData(election.id)
                      }
                      className="rounded-lg border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/10"
                    >
                      Manage Election
                    </button>

                    {election.status === "draft" && (
                      <button
                        onClick={() =>
                          updateElectionStatus(
                            election.id,
                            "open"
                          )
                        }
                        className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
                      >
                        Open Election
                      </button>
                    )}

                    {election.status === "open" && (
                      <button
                        onClick={() =>
                          updateElectionStatus(
                            election.id,
                            "closed"
                          )
                        }
                        className="rounded-lg border border-red-400/30 px-4 py-2 text-sm text-red-300"
                      >
                        Close Election
                      </button>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>
        </section>

        {/* MANAGE POSITIONS */}

        {selectedElection && (
          <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">

            <h2 className="text-2xl font-bold">
              Board Positions
            </h2>

            <p className="mt-2 text-slate-400">
              Add any Board positions you want.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-slate-900 p-5">

              <h3 className="font-semibold">
                Add Position
              </h3>

              <div className="mt-4 grid gap-4">

                <input
                  type="text"
                  placeholder="Position name"
                  value={positionName}
                  onChange={(e) =>
                    setPositionName(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />

                <textarea
                  placeholder="Position description (optional)"
                  value={positionDescription}
                  onChange={(e) =>
                    setPositionDescription(e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />

                <button
                  onClick={addPosition}
                  className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300"
                >
                  + Add Board Position
                </button>

              </div>
            </div>

            <div className="mt-6 grid gap-4">

              {positions.map((position) => {

                const positionCandidates = candidates.filter(
                  (candidate) =>
                    candidate.position_id === position.id
                );

                return (
                  <div
                    key={position.id}
                    className="rounded-xl border border-white/10 bg-slate-900 p-5"
                  >

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                      <div>
                        <h3 className="text-xl font-bold">
                          {position.position_name}
                        </h3>

                        {position.description && (
                          <p className="mt-1 text-sm text-slate-400">
                            {position.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          deletePosition(position.id)
                        }
                        className="rounded-lg border border-red-400/30 px-4 py-2 text-sm text-red-300"
                      >
                        Remove Position
                      </button>

                    </div>

                    {/* CANDIDATES */}

                    <div className="mt-6 border-t border-white/10 pt-5">

                      <h4 className="font-semibold">
                        Candidates
                      </h4>

                      {positionCandidates.length === 0 ? (
                        <p className="mt-3 text-sm text-slate-500">
                          No candidates added yet.
                        </p>
                      ) : (
                        <div className="mt-3 grid gap-3">

                          {positionCandidates.map((candidate) => {

                            const member = getMember(
                              candidate.candidate_id
                            );

                            return (
                              <div
                                key={candidate.id}
                                className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950 p-4"
                              >

                                <div>
                                  <p className="font-semibold">
                                    {member?.name ||
                                      "Unknown Member"}
                                  </p>

                                  <p className="text-sm text-slate-400">
                                    {member?.email}
                                  </p>

                                  <p className="text-xs text-slate-500">
                                    {member?.department || ""}
                                    {member?.year
                                      ? ` • ${member.year}`
                                      : ""}
                                  </p>
                                </div>

                                <button
                                  onClick={() =>
                                    removeCandidate(
                                      candidate.id
                                    )
                                  }
                                  className="rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300"
                                >
                                  Remove
                                </button>

                              </div>
                            );
                          })}

                        </div>
                      )}

                      {/* ADD CANDIDATE */}

                      <div className="mt-5 flex flex-col gap-3 md:flex-row">

                        <select
                          value={
                            selectedPosition === position.id
                              ? selectedCandidate
                              : ""
                          }
                          onChange={(e) => {
                            setSelectedPosition(position.id);
                            setSelectedCandidate(e.target.value);
                          }}
                          className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                        >

                          <option value="">
                            Select a member
                          </option>

                          {members.map((member) => (
                            <option
                              key={member.id}
                              value={member.id}
                            >
                              {member.name || member.email}
                            </option>
                          ))}

                        </select>

                        <button
                          onClick={() => {
                            setSelectedPosition(position.id);
                            addCandidate();
                          }}
                          className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300"
                        >
                          + Add Candidate
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </section>
        )}

      </div>
    </main>
  );
}