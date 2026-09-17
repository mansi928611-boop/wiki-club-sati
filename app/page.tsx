"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black shadow-lg shadow-blue-500/20 transition group-hover:scale-105">
              W
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition">
                Wiki Club
              </h1>
              <p className="text-xs text-slate-400">SATI Vidisha</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 md:flex">
            <Link href="/" className="text-sm font-medium text-cyan-400">
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
            >
              About
            </Link>
            <Link
              href="/events"
              className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
            >
              Events
            </Link>
            <Link
              href="/projects"
              className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
            >
              Projects
            </Link>
            <Link
              href="/wiki"
              className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
            >
              Wiki
            </Link>

            <Link
              href="/login"
              className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition hover:scale-105 hover:opacity-95"
            >
              Portal Login →
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            className="rounded-lg border border-white/10 px-3 py-2 text-slate-300 transition hover:bg-white/5 md:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-white/10 bg-slate-950 px-6 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-cyan-400 font-semibold py-1"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="text-slate-300 transition hover:text-cyan-400 py-1"
              >
                About
              </Link>
              <Link
                href="/events"
                onClick={() => setMenuOpen(false)}
                className="text-slate-300 transition hover:text-cyan-400 py-1"
              >
                Events
              </Link>
              <Link
                href="/projects"
                onClick={() => setMenuOpen(false)}
                className="text-slate-300 transition hover:text-cyan-400 py-1"
              >
                Projects
              </Link>
              <Link
                href="/wiki"
                onClick={() => setMenuOpen(false)}
                className="text-slate-300 transition hover:text-cyan-400 py-1"
              >
                Knowledge Wiki
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full bg-cyan-400 px-5 py-3 text-center font-bold text-slate-950"
              >
                Member / Coordinator Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
        {/* Background glow */}
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              Student Community • SATI Vidisha
            </div>

            <h2 className="max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Learn.
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Contribute.
              </span>
              <span className="block">Lead.</span>
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              Wiki Club SATI is a premier student community where engineers learn together,
              build open-source software, share verified knowledge, and elect their board democratically.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-3.5 font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30"
              >
                Join the Club
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>

              <Link
                href="/projects"
                className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-center font-semibold backdrop-blur transition hover:bg-white/10 hover:border-cyan-400/40"
              >
                Explore Projects
              </Link>
            </div>

            {/* Small stats */}
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl font-bold text-cyan-400">100+</p>
                <p className="mt-1 text-xs text-slate-400">Students</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-blue-400">25+</p>
                <p className="mt-1 text-xs text-slate-400">Projects</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-purple-400">50+</p>
                <p className="mt-1 text-xs text-slate-400">Events & Talks</p>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl">
              {/* Top bar */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Club Dashboard</p>
                  <h3 className="mt-1 text-xl font-bold text-white">Wiki Club SATI</h3>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-300 border border-cyan-400/30">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  Active Portal
                </div>
              </div>

              {/* Contribution card */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Contributions Growth
                  </span>
                  <span className="text-sm font-semibold text-cyan-300">
                    +24% this semester
                  </span>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <div className="h-16 w-8 rounded-t-lg bg-cyan-400/40" />
                  <div className="h-24 w-8 rounded-t-lg bg-cyan-400/50" />
                  <div className="h-20 w-8 rounded-t-lg bg-blue-400/50" />
                  <div className="h-32 w-8 rounded-t-lg bg-blue-400/70" />
                  <div className="h-28 w-8 rounded-t-lg bg-purple-400/60" />
                  <div className="h-40 w-8 rounded-t-lg bg-cyan-300 shadow-lg shadow-cyan-400/50" />
                </div>
              </div>

              {/* Activity cards */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Link
                  href="/projects"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.08] hover:border-cyan-400/40"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                    🚀
                  </div>
                  <p className="text-sm font-semibold">Projects</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Build & create
                  </p>
                </Link>

                <Link
                  href="/wiki"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.08] hover:border-cyan-400/40"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                    📚
                  </div>
                  <p className="text-sm font-semibold">Knowledge Wiki</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Open articles
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              About the Club
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              A place to learn, build and make an impact.
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Wiki Club SATI brings students together to exchange knowledge,
              organize events, create projects, and contribute to the college
              community.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <InfoCard
              icon="📚"
              title="Learn"
              text="Explore new technologies, ideas and skills with fellow students."
            />

            <InfoCard
              icon="⚡"
              title="Contribute"
              text="Turn your skills into real contributions through events and projects."
            />

            <InfoCard
              icon="👑"
              title="Lead"
              text="Take responsibility, work with teams and develop leadership skills."
            />
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                What&apos;s happening
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                Events & Activities
              </h2>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-400 transition hover:text-cyan-300 hover:translate-x-1"
            >
              View all events →
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <EventCard
              number="01"
              title="Tech Workshops"
              text="Hands-on sessions where students learn practical technology skills."
            />

            <EventCard
              number="02"
              title="Community Meetups"
              text="Meet, discuss ideas, collaborate and discover opportunities."
            />

            <EventCard
              number="03"
              title="Hackathons"
              text="Build innovative solutions with a team under real-world challenges."
            />
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="border-t border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Student Work
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Build something meaningful.
            </h2>

            <p className="mt-5 text-slate-400">
              From technical projects to knowledge resources, every
              contribution can become part of the club&apos;s growing community.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <ProjectCard
              title="Club Knowledge Wiki"
              tag="Knowledge"
              text="A shared knowledge base created and maintained by club members."
            />

            <ProjectCard
              title="Student Projects"
              tag="Technology"
              text="A collection of projects built by students through collaboration."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />

        <div className="relative mx-auto max-w-5xl px-6 py-28 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Your journey starts here
          </p>

          <h2 className="mt-5 text-4xl font-black sm:text-6xl">
            Ready to make your contribution?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-slate-400">
            Join Wiki Club SATI, connect with students, work on meaningful
            projects and grow together.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              Join Wiki Club SATI →
            </Link>

            <Link
              href="/about"
              className="rounded-full border border-white/15 bg-white/5 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-white">Wiki Club SATI</p>
            <p className="mt-1 text-sm text-slate-400">
              Learn • Contribute • Lead • Samrat Ashok Technological Institute
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/about" className="hover:text-cyan-400 transition">About</Link>
            <Link href="/events" className="hover:text-cyan-400 transition">Events</Link>
            <Link href="/projects" className="hover:text-cyan-400 transition">Projects</Link>
            <Link href="/wiki" className="hover:text-cyan-400 transition">Wiki</Link>
            <Link href="/login" className="hover:text-cyan-400 transition">Login</Link>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 Wiki Club SATI. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.06]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold">{title}</h3>

      <p className="mt-3 leading-7 text-slate-400">{text}</p>
    </div>
  );
}

function EventCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 flex flex-col justify-between">
      <div>
        <p className="text-sm font-bold text-cyan-400">{number}</p>

        <h3 className="mt-8 text-2xl font-bold">{title}</h3>

        <p className="mt-4 leading-7 text-slate-400">{text}</p>
      </div>

      <Link
        href="/events"
        className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
      >
        Learn more →
      </Link>
    </div>
  );
}

function ProjectCard({
  title,
  tag,
  text,
}: {
  title: string;
  tag: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 flex flex-col justify-between transition hover:border-cyan-400/30">
      <div>
        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
          {tag}
        </span>

        <h3 className="mt-6 text-2xl font-bold">{title}</h3>

        <p className="mt-4 max-w-xl leading-7 text-slate-400">{text}</p>
      </div>

      <Link
        href="/projects"
        className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
      >
        Explore project →
      </Link>
    </div>
  );
}