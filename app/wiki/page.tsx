export default function WikiPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-cyan-400">
          ← Back to Home
        </a>

        <h1 className="mt-10 text-5xl font-bold">Wiki</h1>

        <p className="mt-6 text-lg text-slate-300">
          A shared knowledge space for the Wiki Club SATI community.
        </p>
      </div>
    </main>
  );
}