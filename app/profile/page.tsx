"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        window.location.href = "/login";
        return;
      }

      const user = data.session.user;

      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setName(profile.name ?? "");
        setDepartment(profile.department ?? "");
        setYear(profile.year ?? "");
        setBio(profile.bio ?? "");
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  async function saveProfile() {
    setSaving(true);
    setMessage("");

    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      window.location.href = "/login";
      return;
    }

    const user = data.session.user;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      name,
      email: user.email,
      department,
      year,
      bio,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Profile saved successfully!");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <a href="/dashboard" className="text-cyan-400 hover:text-cyan-300">
          ← Back to Dashboard
        </a>

        <h1 className="mt-10 text-5xl font-bold">
          My Profile
        </h1>

        <p className="mt-4 text-slate-400">
          Create and manage your Wiki Club SATI member profile.
        </p>

        <div className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div>
            <label className="mb-2 block text-sm text-slate-400">
              College Email
            </label>

            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Department
            </label>

            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Year
            </label>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="">Select year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              About Me
            </label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the club a little about yourself..."
              rows={5}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          {message && (
            <p className="text-center text-sm text-slate-300">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}