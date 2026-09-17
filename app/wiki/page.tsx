"use client";

import { useState } from "react";
import Link from "next/link";

interface WikiArticle {
  id: string;
  title: string;
  category: "Getting Started" | "Git & GitHub" | "Wikipedia" | "Elections" | "Resources";
  readTime: string;
  excerpt: string;
  content: string;
  lastUpdated: string;
}

const WIKI_ARTICLES: WikiArticle[] = [
  {
    id: "wiki-01",
    title: "Welcome to Wiki Club SATI: Student Quickstart",
    category: "Getting Started",
    readTime: "3 min read",
    excerpt: "Learn how the club operates, where to join discussion groups, and how to start your journey from beginner to lead.",
    lastUpdated: "Sept 2026",
    content: `Wiki Club SATI is a student-founded community based at Samrat Ashok Technological Institute, Vidisha.

### Core Goals
1. **Practical Learning**: We run peer-to-peer coding sessions, hackathons, and design workshops.
2. **Open Knowledge Sharing**: We write guides, enrich Wikipedia, and release campus utilities under open-source licenses.
3. **Transparent Leadership**: Board positions are elected annually by active members based on verifiable contributions.

### How to Get Started
1. Sign in to the Wiki Club SATI Portal using your college email or Demo session.
2. Complete your Member Profile under My Profile with your department, academic year, and bio.
3. Attend an upcoming club workshop (check our Events calendar).
4. Record your work under Contributions with verifiable evidence links.`,
  },
  {
    id: "wiki-02",
    title: "Git & GitHub Workflow for SATI Students",
    category: "Git & GitHub",
    readTime: "5 min read",
    excerpt: "Step-by-step instructions on setting up Git, generating SSH keys, cloning repositories, and making your first pull request.",
    lastUpdated: "Aug 2026",
    content: `Version control with Git is a fundamental skill for all engineering students.

### Essential Commands
- \`git clone <repository_url>\`: Clone a project to your local machine.
- \`git checkout -b feature/my-feature\`: Create and switch to a new branch.
- \`git add .\`: Stage your modified files.
- \`git commit -m "feat: descriptive message"\`: Commit staged changes.
- \`git push origin feature/my-feature\`: Push branch to GitHub.

### Contributing to Wiki Club Projects
Always create a pull request (PR) against the \`main\` branch. Ensure your code passes TypeScript checks and linting before requesting review.`,
  },
  {
    id: "wiki-03",
    title: "Wikipedia Contribution & Verification Standard",
    category: "Wikipedia",
    readTime: "4 min read",
    excerpt: "Best practices for writing neutral articles, formatting citations, and avoiding copyright violations on Wikipedia.",
    lastUpdated: "Sept 2026",
    content: `Wikipedia is an encyclopedia governed by three core content policies:

1. **Neutral Point of View (NPOV)**: Represent all significant views fairly, proportionately, and without editorial bias.
2. **Verifiability (V)**: Readers must be able to verify all statements through reliable published sources (books, journals, recognized news outlets).
3. **No Original Research (NOR)**: Articles must not contain unpublished facts, arguments, or theories.

### How to Cite Sources
Always use Wikipedia citation templates: \`{{cite web}}\`, \`{{cite book}}\`, or \`{{cite journal}}\` with permanent links and publication dates.`,
  },
  {
    id: "wiki-04",
    title: "Democratic Board Elections & Nominations Manual",
    category: "Elections",
    readTime: "4 min read",
    excerpt: "Everything you need to know about the candidate portfolio requirement, nomination timelines, and ballot voting rules.",
    lastUpdated: "Sept 2026",
    content: `Our club constitution mandates democratic governance to prevent nepotism and encourage real skill building.

### Election Cycle Overview
1. **Nomination Phase**: Any registered club member can nominate a fellow student for open board positions (President, Technical Head, Design Head, etc.).
2. **Verification Phase**: Coordinators review nominations and ensure the nominee has approved contributions.
3. **Voting Phase**: The election opens for all verified members. Each member can cast one vote per position.
4. **Results Publication**: Results with verified vote counts are published openly on the Election Results page.`,
  },
  {
    id: "wiki-05",
    title: "SATI Campus Tech & Open-Source Directory",
    category: "Resources",
    readTime: "2 min read",
    excerpt: "Curated collection of college computing labs, WiFi access credentials guide, and free developer tools for SATI students.",
    lastUpdated: "Sept 2026",
    content: `Useful student resources at Samrat Ashok Technological Institute:

- **GitHub Student Developer Pack**: Claim free Copilot, domain names, and cloud credits using your \`@satiengg.in\` email.
- **Campus WiFi Setup**: Connect to SATI Campus WiFi using student credentials provided during admission.
- **Central Library Digital Section**: Access IEEE, ScienceDirect, and NPTEL course materials from college library workstations.`,
  },
];

export default function WikiPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState<WikiArticle | null>(null);

  const categories = ["All", "Getting Started", "Git & GitHub", "Wikipedia", "Elections", "Resources"];

  const filteredArticles = WIKI_ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Navigation */}
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
            <Link href="/projects" className="text-slate-400 hover:text-white transition">Projects</Link>
            <Link
              href="/login"
              className="rounded-full bg-cyan-400 px-4 py-1.5 font-bold text-slate-950 text-xs hover:bg-cyan-300 transition"
            >
              Member Login
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <span className="rounded-full bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
            Knowledge Base
          </span>

          <h1 className="mt-4 text-5xl font-extrabold tracking-tight">
            Club Knowledge Wiki
          </h1>

          <p className="mt-4 text-slate-400 leading-relaxed">
            A community-maintained repository of guides, technical tutorials, and club governance
            rules for Wiki Club SATI members.
          </p>

          {/* Search bar */}
          <div className="mt-8 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search wiki articles by keyword (e.g. Git, elections, setup)..."
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-6 py-4 pl-12 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 shadow-xl"
            />
            <span className="absolute left-4 top-4 text-slate-400 text-lg">🔍</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-4 text-slate-400 hover:text-white text-sm"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-cyan-400 text-slate-950 font-bold"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="mt-12 space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
              <p className="text-slate-400">No wiki articles match your search query.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="mt-4 text-sm font-semibold text-cyan-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-200 hover:border-cyan-400/40 hover:bg-white/[0.06]"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-cyan-400/10 px-2.5 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-400/20">
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-500">{article.readTime}</span>
                  </div>

                  <h2 className="mt-3 text-xl font-bold group-hover:text-cyan-300 transition">
                    {article.title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400 max-w-2xl line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 text-sm font-semibold text-cyan-400 group-hover:translate-x-1 transition">
                  <span>Read Article</span>
                  <span>→</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Article Reader Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/20 bg-slate-900 p-8 shadow-2xl">
              <button
                onClick={() => setActiveArticle(null)}
                aria-label="Close article"
                className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <span className="rounded-md bg-cyan-400/10 px-2.5 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-400/20">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-slate-500">{activeArticle.readTime}</span>
                <span className="text-xs text-slate-500">• Updated {activeArticle.lastUpdated}</span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold">{activeArticle.title}</h2>

              <div className="mt-6 border-t border-white/10 pt-6 text-slate-300 text-sm leading-relaxed space-y-4 whitespace-pre-line">
                {activeArticle.content}
              </div>

              <div className="mt-8 border-t border-white/10 pt-5 flex justify-between items-center">
                <span className="text-xs text-slate-500">Wiki Club SATI Knowledge Base</span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="rounded-xl bg-cyan-400 px-6 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300"
                >
                  Close Reader
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}