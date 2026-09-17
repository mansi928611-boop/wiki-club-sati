"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { setDemoSession } from "@/lib/auth-helpers";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    setMessage("Sending login link to your inbox...");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Check your SATI email for the magic login link.");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to send login link.";
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDemoLogin(role: "member" | "admin") {
    setDemoSession(role);
    setMessage(`Signed in as Demo ${role === "admin" ? "Coordinator" : "Member"}! Redirecting...`);
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-md pt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition"
        >
          ← Back to Home
        </Link>

        <div className="mt-8">
          <span className="rounded-full bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
            Official Club Portal
          </span>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
            Member Login
          </h1>

          <p className="mt-3 text-slate-400 text-sm leading-relaxed">
            Sign in using your official SATI college email or select a Demo Role to test all portal features.
          </p>
        </div>

        {/* 1-Click Demo Login Panel */}
        <div className="mt-8 rounded-2xl border border-cyan-400/30 bg-cyan-950/20 p-5 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <span>⚡</span>
            <span>Quick Demo Login (For Review & Testing)</span>
          </div>

          <p className="mt-1.5 text-xs text-slate-400">
            Instant access to test voting, contribution logging, board nominations, and admin controls without waiting for email OTP:
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDemoLogin("member")}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left transition hover:bg-white/10 hover:border-cyan-400/40"
            >
              <p className="text-xs font-bold text-white">👤 Member</p>
              <p className="text-[10px] text-slate-400">Rohit Sharma (3rd Year)</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="rounded-xl border border-purple-400/30 bg-purple-500/10 px-3 py-2.5 text-left transition hover:bg-purple-500/20 hover:border-purple-400/50"
            >
              <p className="text-xs font-bold text-purple-300">🛡️ Coordinator</p>
              <p className="text-[10px] text-slate-400">Mansi Gupta (Admin)</p>
            </button>
          </div>
        </div>

        {/* Official Email OTP Login */}
        <div className="mt-8">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Official SATI Email Address
          </label>

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
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-white outline-none focus:border-cyan-400 transition placeholder:text-slate-600"
          />

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 font-bold text-slate-950 transition hover:opacity-95 disabled:opacity-50 shadow-md shadow-cyan-400/20"
          >
            {isLoading ? "Sending Link..." : "Send Magic Login Link"}
          </button>
        </div>

        {message && (
          <p className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3.5 text-center text-sm text-cyan-300">
            {message}
          </p>
        )}

        <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">College Email Policy</p>
          <p>
            Only active students with verified emails ending in{" "}
            <span className="font-semibold text-cyan-400">@satiengg.in</span> can receive official Supabase OTP tokens.
          </p>
        </div>
      </div>
    </main>
  );
}