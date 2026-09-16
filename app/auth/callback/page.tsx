"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  useEffect(() => {
    async function handleAuth() {
      try {
        await supabase.auth.initialize();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Authentication error:", error);
        window.location.href = "/login";
      }
    }

    handleAuth();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Signing you in...
        </h1>

        <p className="mt-3 text-slate-400">
          Please wait while we verify your login.
        </p>
      </div>
    </main>
  );
}