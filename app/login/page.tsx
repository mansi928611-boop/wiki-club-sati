"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage("Sending login link...");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the login link.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-md pt-20">
        <a
          href="/"
          className="text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Home
        </a>

        <h1 className="mt-10 text-4xl font-bold">
          Member Login
        </h1>

        <p className="mt-4 text-slate-400">
          Sign in with your college email.
        </p>

        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-8 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400"
        />

        <button
          onClick={handleLogin}
          className="mt-4 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          Send Login Link
        </button>

        {message && (
          <p className="mt-5 text-center text-sm text-slate-300">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}