"use client";

import { useState } from "react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  category: "Web" | "Knowledge" | "Tools" | "Campus";
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  stars: number;
  maintainer: string;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-01",
    title: "Wiki Club SATI Portal",
    category: "Web",
    description: "The official Next.js & Supabase portal for Wiki Club SATI featuring member profiles, verified contribution logging, and democratic elections.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    githubUrl: "https://github.com/mansi928611-boop/wiki-club-sati",
    liveUrl: "https://wiki-club-sati.vercel.app",
    stars: 28,
    maintainer: "Mansi Gupta & Rohit Sharma",
  },
  {
    id: "proj-02",
    title: "SATI Campus Map & Lab Navigator",
    category: "Campus",
    description: "Interactive 3D and 2D campus directory assisting new freshmen and visitors navigate college academic blocks, workshop sheds, and canteen.",
    tags: ["React", "Leaflet", "OpenStreetMap", "GeoJSON"],
    githubUrl: "https://github.com/mansi928611-boop/wiki-club-sati",
    liveUrl: "https://sati-map.demo.app",
    stars: 19,
    maintainer: "SATI Dev Guild",
  },
  {
    id: "proj-03",
    title: "SATI Open Notes & Papers Archive",
    category: "Knowledge",
    description: "Centralized open knowledge repository storing semester question papers, professor handouts, and laboratory manuals verified by toppers.",
    tags: ["Markdown", "Nextra", "Cloudflare R2", "Algolia"],
    githubUrl: "https://github.com/mansi928611-boop/wiki-club-sati",
    liveUrl: "https://notes.satiengg.in",
    stars: 45,
    maintainer: "Wiki Club Documentation Team",
  },
  {
    id: "proj-04",
    title: "SATI Event & Notice Telegram Bot",
    category: "Tools",
    description: "Automated notification bot scraping official college circulars and exam schedules, alerting subscribed students immediately.",
    tags: ["Python", "Telegram API", "BeautifulSoup", "Docker"],
    githubUrl: "https://github.com/mansi928611-boop/wiki-club-sati",
    stars: 33,
    maintainer: "Aman Patel",
  },
];

export default function ProjectsPage() {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [starred, setStarred] = useState<Record<string, boolean>>({});

  // Submit Modal
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<"Web" | "Knowledge" | "Tools" | "Campus">("Web");
  const [newGithub, setNewGithub] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const categories = ["All", "Web", "Knowledge", "Campus", "Tools"];

  const filteredProjects = projects.filter((project) => {
    if (selectedTag === "All") return true;
    return project.category === selectedTag;
  });

  function toggleStar(id: string) {
    setStarred((prev) => {
      const isStarred = !prev[id];
      setProjects((curr) =>
        curr.map((p) => (p.id === id ? { ...p, stars: p.stars + (isStarred ? 1 : -1) } : p))
      );
      return { ...prev, [id]: isStarred };
    });
  }

  function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      setSubmitMessage("Please provide a title and description.");
      return;
    }

    const created: Project = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      tags: [newCategory, "Community Project"],
      githubUrl: newGithub.trim() || "https://github.com/mansi928611-boop/wiki-club-sati",
      stars: 1,
      maintainer: "Current Member",
    };

    setProjects([created, ...projects]);
    setSubmitMessage("Project submitted successfully! It is now listed in the showcase.");
    setTimeout(() => {
      setIsSubmitOpen(false);
      setNewTitle("");
      setNewDesc("");
      setNewGithub("");
      setSubmitMessage("");
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-8 border-b border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            ← Back to Home
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <Link href="/about" className="text-slate-400 hover:text-white transition">About</Link>
            <Link href="/events" className="text-slate-400 hover:text-white transition">Events</Link>
            <Link href="/wiki" className="text-slate-400 hover:text-white transition">Wiki</Link>
            <Link
              href="/login"
              className="rounded-full bg-cyan-400 px-4 py-1.5 font-bold text-slate-950 text-xs hover:bg-cyan-300 transition"
            >
              Member Login
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="rounded-full bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
              Open Source & Student Tech
            </span>

            <h1 className="mt-4 text-5xl font-extrabold tracking-tight">
              Community Projects
            </h1>

            <p className="mt-4 text-lg text-slate-400 max-w-2xl leading-relaxed">
              Explore open-source tools, knowledge wikis, and applications built by
              students and members of Wiki Club SATI.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitOpen(true)}
            className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
          >
            + Submit a Project
          </button>
        </div>

        {/* Filter Categories */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedTag(cat)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                selectedTag === cat
                  ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat === "All" ? "All Projects" : cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => {
            const hasStarred = !!starred[project.id];

            return (
              <div
                key={project.id}
                className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition duration-300 hover:border-cyan-400/40 hover:bg-white/[0.06]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-400/20">
                      {project.category}
                    </span>

                    <button
                      onClick={() => toggleStar(project.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                        hasStarred
                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                          : "bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>{hasStarred ? "★" : "☆"}</span>
                      <span>{project.stars}</span>
                    </button>
                  </div>

                  <h3 className="mt-6 text-2xl font-bold group-hover:text-cyan-300 transition">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-slate-400 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Maintainer: <span className="text-slate-300 font-medium">{project.maintainer}</span>
                  </span>

                  <div className="flex items-center gap-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
                    >
                      GitHub Repo ↗
                    </a>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Modal */}
        {isSubmitOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-slate-900 p-8 shadow-2xl">
              <button
                onClick={() => setIsSubmitOpen(false)}
                aria-label="Close modal"
                className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold">Submit a Student Project</h2>
              <p className="mt-2 text-sm text-slate-400">
                Share your open-source software, campus bot, or knowledge repo with the club.
              </p>

              <form onSubmit={handleCreateProject} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. SATI Class Schedule Bot"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as "Web" | "Knowledge" | "Tools" | "Campus")}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Web">Web Application</option>
                    <option value="Knowledge">Knowledge / Wiki</option>
                    <option value="Campus">Campus Utility</option>
                    <option value="Tools">Developer Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Briefly describe what your project does and who it helps..."
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    GitHub / Source Code Link
                  </label>
                  <input
                    type="url"
                    value={newGithub}
                    onChange={(e) => setNewGithub(e.target.value)}
                    placeholder="https://github.com/your-username/repo"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                {submitMessage && (
                  <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-center text-xs font-semibold text-emerald-300">
                    {submitMessage}
                  </p>
                )}

                <div className="mt-6 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitOpen(false)}
                    className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-cyan-400 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-300"
                  >
                    Submit Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}