"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setMessage("Please enter your college email.");
      return;
    }

    if (!cleanEmail.endsWith("@satiengg.in")) {
      setMessage(
        "Please use your official SATI email address ending with @satiengg.in."
      );
      return;
    }

    setMessage("Sending login link...");

    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo:
          `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your SATI email for the login link.");
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
          Sign in using your official SATI college email.
        </p>

        <div className="mt-8">
          <input
            type="email"
            placeholder="yourname@satiengg.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <button
            type="button"
            onClick={handleLogin}
            className="mt-4 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Send Login Link
          </button>
        </div>

        {message && (
          <p className="mt-5 text-center text-sm text-slate-300">
            {message}
          </p>
        )}

        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">
            Only email addresses ending in
          </p>

          <p className="mt-1 font-semibold text-cyan-400">
            @satiengg.in
          </p>

          <p className="mt-2 text-xs text-slate-500">
            are allowed to request a login link.
          </p>
        </div>

      </div>
    </main>
  );
}