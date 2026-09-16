export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <a
          href="/"
          className="mb-10 inline-block text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Home
        </a>

        <h1 className="text-5xl font-bold mb-6">
          About Wiki Club SATI
        </h1>

        <p className="text-lg text-slate-300 leading-8 mb-8">
          Wiki Club SATI is a student-driven community focused on
          knowledge sharing, technology, creativity, collaboration,
          and meaningful contribution.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 p-6">
            <h2 className="text-xl font-semibold mb-3">Learn</h2>
            <p className="text-slate-400">
              Explore knowledge, attend events, and learn from fellow members.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 p-6">
            <h2 className="text-xl font-semibold mb-3">Contribute</h2>
            <p className="text-slate-400">
              Share projects, organize events, create content, and help the community.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 p-6">
            <h2 className="text-xl font-semibold mb-3">Lead</h2>
            <p className="text-slate-400">
              Take responsibility and help shape the future of the club.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}