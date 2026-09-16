 "use client";

import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black shadow-lg shadow-blue-500/20">
              W
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Wiki Club
              </h1>
              <p className="text-xs text-slate-400">SATI</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-sm text-white transition hover:text-cyan-400">
              Home
            </a>
            <a href="/about" className="text-sm text-slate-300 transition hover:text-cyan-400">
              About
            </a>
            <a href="/events" className="text-sm text-slate-300 transition hover:text-cyan-400">
              Events
            </a>
            <a href="/projects" className="text-sm text-slate-300 transition hover:text-cyan-400">
              Projects
            </a>

            <button className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-105 hover:bg-cyan-300">
              Login
            </button>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-white/10 px-3 py-2 md:hidden"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-white/10 bg-slate-950 px-6 py-5 md:hidden">
            <div className="flex flex-col gap-5">
              <a href="#" onClick={() => setMenuOpen(false)}>
                Home
              </a>
              <a href="#about" onClick={() => setMenuOpen(false)}>
                About
              </a>
              <a href="#events" onClick={() => setMenuOpen(false)}>
                Events
              </a>
              <a href="#projects" onClick={() => setMenuOpen(false)}>
                Projects
              </a>
              <button className="rounded-full bg-white px-5 py-3 font-semibold text-slate-950">
                Login
              </button>
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
              Student Community • SATI
            </div>

            <h2 className="max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Learn.
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Contribute.
              </span>
              <span className="block">Lead.</span>
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              Wiki Club SATI is a community where students learn together,
              build meaningful projects, share knowledge, and grow into
              future leaders.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <button className="group rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-3.5 font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-1">
                Join the Club
                <span className="ml-2 transition group-hover:ml-3">→</span>
              </button>

              <a
                href="#projects"
                className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-center font-semibold backdrop-blur transition hover:bg-white/10"
              >
                Explore Projects
              </a>
            </div>

            {/* Small stats */}
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl font-bold">100+</p>
                <p className="mt-1 text-xs text-slate-500">Students</p>
              </div>

              <div>
                <p className="text-2xl font-bold">25+</p>
                <p className="mt-1 text-xs text-slate-500">Projects</p>
              </div>

              <div>
                <p className="text-2xl font-bold">50+</p>
                <p className="mt-1 text-xs text-slate-500">Events</p>
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
                  <h3 className="mt-1 text-xl font-bold">Wiki Club SATI</h3>
                </div>

                <div className="rounded-xl bg-cyan-400/10 px-3 py-2 text-xs text-cyan-300">
                  Active
                </div>
              </div>

              {/* Contribution card */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Contributions
                  </span>
                  <span className="text-sm font-semibold text-cyan-300">
                    +24%
                  </span>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <div className="h-16 w-8 rounded-t-lg bg-cyan-400/40" />
                  <div className="h-24 w-8 rounded-t-lg bg-cyan-400/50" />
                  <div className="h-20 w-8 rounded-t-lg bg-blue-400/50" />
                  <div className="h-32 w-8 rounded-t-lg bg-blue-400/70" />
                  <div className="h-28 w-8 rounded-t-lg bg-purple-400/60" />
                  <div className="h-40 w-8 rounded-t-lg bg-cyan-300" />
                </div>
              </div>

              {/* Activity cards */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                    🚀
                  </div>
                  <p className="text-sm font-semibold">Projects</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Build & create
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                    🏆
                  </div>
                  <p className="text-sm font-semibold">Achievements</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Grow together
                  </p>
                </div>
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
                What's happening
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                Events & Activities
              </h2>
            </div>

            <button className="w-fit text-sm font-semibold text-cyan-300 hover:text-cyan-200">
              View all events →
            </button>
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
              contribution can become part of the club's growing community.
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
      <section className="relative overflow-hidden">
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

          <button className="mt-9 rounded-full bg-white px-8 py-4 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-300">
            Join Wiki Club SATI →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold">Wiki Club SATI</p>
            <p className="mt-1 text-sm text-slate-500">
              Learn • Contribute • Lead
            </p>
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
    <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06]">
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
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
      <p className="text-sm font-bold text-cyan-400">{number}</p>

      <h3 className="mt-12 text-2xl font-bold">{title}</h3>

      <p className="mt-4 leading-7 text-slate-400">{text}</p>

      <button className="mt-7 text-sm font-semibold text-white">
        Learn more →
      </button>
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
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8">
      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
        {tag}
      </span>

      <h3 className="mt-6 text-2xl font-bold">{title}</h3>

      <p className="mt-4 max-w-xl leading-7 text-slate-400">{text}</p>

      <button className="mt-7 text-sm font-semibold text-white">
        Explore project →
      </button>
    </div>
  );
}