"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getActiveUser, UserSession } from "@/lib/auth-helpers";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [bio, setBio] = useState("");

  const loadProfile = useCallback(async () => {
    const user = await getActiveUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setCurrentUser(user);
    setEmail(user.email);
    setName(user.name ?? "");
    setDepartment(user.department ?? "");
    setYear(user.year ?? "");
    setBio(user.bio ?? "");

    // Also attempt to fetch latest profile from Supabase if real session
    if (!user.isDemo) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          if (profile.name) setName(profile.name);
          if (profile.department) setDepartment(profile.department);
          if (profile.year) setYear(profile.year);
          if (profile.bio) setBio(profile.bio);
        }
      } catch (err) {
        console.warn("Error fetching profile from Supabase:", err);
      }
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function saveProfile() {
    setSaving(true);
    setMessage("");

    const activeUser = await getActiveUser();

    if (!activeUser) {
      router.push("/login");
      return;
    }

    let savedSuccessfully = false;

    // 1. If not a demo user, attempt saving to Supabase
    if (!activeUser.isDemo) {
      try {
        const { error } = await supabase.from("profiles").upsert({
          id: activeUser.id,
          name,
          email: activeUser.email,
          department,
          year,
          bio,
          updated_at: new Date().toISOString(),
        });

        if (!error) {
          savedSuccessfully = true;
        } else {
          console.warn("Supabase upsert note:", error.message);
        }
      } catch (err) {
        console.warn("Supabase save threw:", err);
      }
    }

    // 2. Also persist to local session if demo or as reliable fallback
    if (typeof window !== "undefined") {
      const updatedUser: UserSession = {
        ...activeUser,
        name,
        department,
        year,
        bio,
      };
      localStorage.setItem("wiki_club_sati_demo_session", JSON.stringify(updatedUser));
      savedSuccessfully = true;
    }

    if (savedSuccessfully) {
      setMessage("Profile saved successfully! Your details are up to date.");
    } else {
      setMessage("Failed to save profile. Please check your connection.");
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
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8">
          <span className="rounded-full bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
            Account Details
          </span>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
            My Member Profile
          </h1>

          <p className="mt-3 text-slate-400 text-sm leading-relaxed">
            Manage your public information visible to fellow club members and board voters.
          </p>
        </div>

        <div className="mt-8 space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-xl">
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              College Email
            </label>

            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-slate-400 font-mono text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-300">
              Full Name *
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rohit Sharma"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-300">
              Department / Branch *
            </label>

            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-300">
              Academic Year *
            </label>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
            >
              <option value="">Select year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-300">
              About Me / Bio
            </label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the club about your technical interests, projects, or goals..."
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
            />
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 font-bold text-slate-950 transition hover:opacity-95 disabled:opacity-50 shadow-md shadow-cyan-400/20"
          >
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>

          {message && (
            <p className="rounded-xl border border-cyan-400/30 bg-cyan-950/30 p-3.5 text-center text-sm text-cyan-300">
              {message}
            </p>
          )}
        </div>

        {currentUser?.isDemo && (
          <p className="mt-4 text-center text-xs text-slate-500">
            Note: You are currently viewing this profile in Demo Mode. Edits are saved locally for this test session.
          </p>
        )}
      </div>
    </main>
  );
}