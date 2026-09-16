"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Member = {
  id: string;
  name: string | null;
  email: string | null;
  department: string | null;
  year: string | null;
  bio: string | null;
};

export default function MembersPage() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, department, year, bio")
      .order("name", { ascending: true });

    if (error) {
      setMessage(error.message);
    } else {
      setMembers(data ?? []);
    }

    setLoading(false);
  }

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
        <p className="text-slate-400">
          Loading members...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <a
          href="/dashboard"
          className="text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Dashboard
        </a>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
            Wiki Club SATI
          </p>

          <h1 className="mt-2 text-5xl font-bold">
            Members
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            Explore Wiki Club SATI members and view their profiles
            and verified contributions.
          </p>
        </div>

        <div className="mt-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, department, year, or email..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
          />
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
            {message}
          </div>
        )}

        <div className="mt-8">
          {filteredMembers.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">
                No members found.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/40 hover:bg-white/10"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/10 text-xl font-bold text-cyan-400">
                    {(member.name || member.email || "M")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <h2 className="mt-5 text-xl font-semibold">
                    {member.name || "Unnamed Member"}
                  </h2>

                  {member.department && (
                    <p className="mt-2 text-sm text-cyan-400">
                      {member.department}
                    </p>
                  )}

                  {member.year && (
                    <p className="mt-1 text-sm text-slate-500">
                      {member.year}
                    </p>
                  )}

                  {member.bio && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                      {member.bio}
                    </p>
                  )}

                  <a
                    href={`/candidate?id=${member.id}`}
                    className="mt-6 block rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-center text-sm font-semibold text-cyan-400 transition hover:bg-cyan-400/20"
                  >
                    View Portfolio →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}