"use client";

import { useState } from "react";
import Link from "next/link";

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Wiki Club SATI?",
      a: "Wiki Club SATI is an official student-led technical and knowledge community at Samrat Ashok Technological Institute (SATI), Vidisha. We empower students to develop practical technology skills, contribute to open knowledge repositories (including Wikipedia and open-source software), and build meaningful software projects.",
    },
    {
      q: "Who can join Wiki Club SATI?",
      a: "Any enrolled student at SATI from any branch (CSE, IT, ECE, Mechanical, Civil, Applied Sciences, etc.) and any year can join! No prior coding experience is required—only curiosity and eagerness to learn.",
    },
    {
      q: "How do board elections and nominations work?",
      a: "Wiki Club SATI operates on democratic, merit-based elections. Members document and submit their contributions (organizing events, technical work, design, workshops). Coordinators verify these contributions. Any member can nominate peers for Board positions, and active members vote during scheduled election cycles.",
    },
    {
      q: "How are contributions verified?",
      a: "Members submit contribution details with evidence links (e.g. GitHub PRs, Google Drive photos, workshop materials). Club coordinators review each submission and mark it approved, providing transparent candidate portfolios for election transparency.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-8 border-b border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            ← Back to Home
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <Link href="/events" className="text-slate-400 hover:text-white transition">Events</Link>
            <Link href="/projects" className="text-slate-400 hover:text-white transition">Projects</Link>
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
        <div className="mt-12">
          <span className="rounded-full bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
            About Our Community
          </span>

          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Empowering SATI Students to{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create & Lead
            </span>
          </h1>

          <p className="mt-6 text-xl text-slate-300 leading-relaxed max-w-3xl">
            Founded by enthusiastic students at Samrat Ashok Technological Institute, Vidisha,
            Wiki Club SATI bridges the gap between academic theory and real-world technology,
            open-source contribution, and leadership.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-cyan-400/40 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-2xl">
              📚
            </div>
            <h2 className="text-2xl font-bold mt-6">Learn</h2>
            <p className="mt-3 text-slate-400 leading-relaxed">
              Hands-on workshops in web technologies, Git/GitHub, cloud tools, and technical documentation.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-cyan-400/40 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-2xl bg-blue-400/10 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h2 className="text-2xl font-bold mt-6">Contribute</h2>
            <p className="mt-3 text-slate-400 leading-relaxed">
              Build campus utilities, publish Wikipedia articles, write open guides, and organize campus tech talks.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-cyan-400/40 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-2xl bg-purple-400/10 flex items-center justify-center text-2xl">
              👑
            </div>
            <h2 className="text-2xl font-bold mt-6">Lead</h2>
            <p className="mt-3 text-slate-400 leading-relaxed">
              Participate in transparent annual board elections, mentor juniors, and guide club initiatives.
            </p>
          </div>
        </div>

        {/* Governance & Meritocracy Section */}
        <div className="mt-16 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-950/30 to-slate-900/50 p-8 md:p-10">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Evidence-Based Culture
            </span>
            <h2 className="mt-2 text-3xl font-bold">Transparent Democratic Governance</h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Unlike traditional societies where positions are appointed behind closed doors,
              Wiki Club SATI maintains a verified public log of contributions. Anyone standing for
              a Board position displays their verified portfolio of real work.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-full bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Sign In to Nominate & Vote →
            </Link>

            <Link
              href="/projects"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              View Member Projects
            </Link>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="mt-2 text-slate-400">
            Everything you need to know about joining and participating in Wiki Club SATI.
          </p>

          <div className="mt-8 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold text-lg text-white hover:text-cyan-300 transition"
                  >
                    <span>{faq.q}</span>
                    <span className="ml-4 text-cyan-400 text-xl">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 text-center border-t border-white/10 pt-12">
          <h3 className="text-2xl font-bold">Ready to become a part of Wiki Club SATI?</h3>
          <p className="mt-3 text-slate-400">
            Log in with your official college email or explore the community.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/login"
              className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-3.5 font-bold text-slate-950 transition hover:scale-105"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}