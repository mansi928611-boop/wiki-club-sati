"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Contribution = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  contribution_date: string | null;
  evidence_url: string | null;
  status: string;
  created_at: string;
};

export default function ContributionsPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const [contributions, setContributions] = useState<Contribution[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadContributions() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/login";
        return;
      }

      await fetchContributions(session.user.id);

      setLoading(false);
    }

    loadContributions();
  }, []);

  async function fetchContributions(userId: string) {
    const { data, error } = await supabase
      .from("contributions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setContributions(data);
    }
  }

  async function submitContribution() {
    setMessage("");

    if (!title || !category || !description) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("contributions").insert({
      user_id: session.user.id,
      title,
      category,
      description,
      contribution_date: date || null,
      evidence_url: evidenceUrl || null,
      status: "pending",
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Contribution submitted successfully! It is now pending verification."
      );

      setTitle("");
      setCategory("");
      setDescription("");
      setDate("");
      setEvidenceUrl("");

      await fetchContributions(session.user.id);
    }

    setSaving(false);
  }

  function getStatusStyle(status: string) {
    if (status === "approved") {
      return "border-green-400/30 bg-green-400/10 text-green-400";
    }

    if (status === "rejected") {
      return "border-red-400/30 bg-red-400/10 text-red-400";
    }

    return "border-yellow-400/30 bg-yellow-400/10 text-yellow-400";
  }

  function getStatusText(status: string) {
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return "Pending Verification";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading contributions...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <a
          href="/dashboard"
          className="text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Dashboard
        </a>

        <h1 className="mt-10 text-5xl font-bold">
          My Contributions
        </h1>

        <p className="mt-4 text-slate-400">
          Record and track the work you contribute to Wiki Club SATI.
        </p>

        {/* Add Contribution */}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold">
            Add New Contribution
          </h2>

          <div className="mt-6 space-y-6">
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Contribution Title *
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Organized Web Development Workshop"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Category *
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
              >
                <option value="">Select category</option>
                <option value="Event Organization">
                  Event Organization
                </option>
                <option value="Technical">Technical</option>
                <option value="Design">Design</option>
                <option value="Content">Content</option>
                <option value="Outreach">Outreach</option>
                <option value="Volunteering">Volunteering</option>
                <option value="Leadership">Leadership</option>
                <option value="Project">Project</option>
                <option value="Research">Research</option>
                <option value="Mentoring">Mentoring</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Description *
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you did and how you contributed..."
                rows={6}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Contribution Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Evidence Link
              </label>

              <input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://github.com/... or Google Drive link"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />

              <p className="mt-2 text-xs text-slate-500">
                Optional. Add a link that helps verify your contribution.
              </p>
            </div>

            <button
              onClick={submitContribution}
              disabled={saving}
              className="w-full rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
            >
              {saving ? "Submitting..." : "Submit Contribution"}
            </button>

            {message && (
              <p className="rounded-xl border border-white/10 bg-black/20 p-4 text-center text-sm text-slate-300">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Contribution History */}

        <div className="mt-12">
          <h2 className="text-2xl font-bold">
            Contribution History
          </h2>

          {contributions.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">
                You haven't submitted any contributions yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {contributions.map((contribution) => (
                <div
                  key={contribution.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {contribution.title}
                      </h3>

                      <p className="mt-2 text-sm text-cyan-400">
                        {contribution.category}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        contribution.status
                      )}`}
                    >
                      {getStatusText(contribution.status)}
                    </span>
                  </div>

                  <p className="mt-4 leading-7 text-slate-300">
                    {contribution.description}
                  </p>

                  {contribution.contribution_date && (
                    <p className="mt-4 text-sm text-slate-500">
                      Date: {contribution.contribution_date}
                    </p>
                  )}

                  {contribution.evidence_url && (
                    <a
                      href={contribution.evidence_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      View Evidence →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}