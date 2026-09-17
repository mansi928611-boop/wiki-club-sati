"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getActiveUser } from "@/lib/auth-helpers";
import { INITIAL_MEMBERS, ClubMember } from "@/lib/mock-data";

export default function MembersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const loadMembers = useCallback(async () => {
    const activeUser = await getActiveUser();

    if (!activeUser) {
      router.push("/login");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, department, year, bio, role")
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        setMembers(data as ClubMember[]);
      } else {
        // Fallback to active initial members if table is empty or offline
        setMembers(INITIAL_MEMBERS);
      }
    } catch (err: unknown) {
      console.warn("Supabase fetch members error:", err);
      setMessage("Note: Displaying active club members directory.");
      setMembers(INITIAL_MEMBERS);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const filteredMembers = members.filter((member) => {
    const searchText = search.toLowerCase();

    return (
      (member.name ?? "").toLowerCase().includes(searchText) ||
      (member.email ?? "").toLowerCase().includes(searchText) ||
      (member.department ?? "").toLowerCase().includes(searchText) ||
      (member.year ?? "").toLowerCase().includes(searchText)
    );
  });

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading club members directory...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            ← Back to Dashboard
          </Link>

          <Link
            href="/contributions"
            className="text-xs text-slate-400 hover:text-white transition"
          >
            View Contributions →
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="rounded-full bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
              Wiki Club SATI
            </span>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
              Members Directory
            </h1>

            <p className="mt-2 max-w-2xl text-slate-400 text-sm leading-relaxed">
              Explore Wiki Club SATI members, their departments, and their verified contribution records.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-right">
            <span className="text-xl font-bold text-cyan-400">{filteredMembers.length}</span>
            <span className="text-xs text-slate-400 ml-1.5">Members Listed</span>
          </div>
        </div>

        <div className="mt-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, department, year, or email..."
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 transition shadow-lg"
          />
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
            {message}
          </div>
        )}

        <div className="mt-8">
          {filteredMembers.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
              <p className="text-slate-400">No club members matched your search.</p>
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-sm font-semibold text-cyan-400 hover:underline"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-200 hover:border-cyan-400/40 hover:bg-white/[0.06]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-lg font-bold text-cyan-400 border border-cyan-400/20">
                        {(member.name || member.email || "M")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      {member.role === "coordinator" && (
                        <span className="rounded-full bg-purple-400/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-400/30">
                          Coordinator
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-lg font-bold">
                      {member.name || "Unnamed Member"}
                    </h2>

                    {member.department && (
                      <p className="mt-1 text-xs font-medium text-cyan-400">
                        {member.department}
                      </p>
                    )}

                    {member.year && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {member.year}
                      </p>
                    )}

                    {member.bio && (
                      <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-400">
                        {member.bio}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/candidate?id=${member.id}`}
                    className="mt-6 block rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-center text-xs font-bold text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950"
                  >
                    View Verified Portfolio →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}