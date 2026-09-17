"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      try {
        await supabase.auth.initialize();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/login");
      }
    }

    handleAuth();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        <h1 className="mt-4 text-2xl font-bold">Signing you in...</h1>
        <p className="mt-2 text-sm text-slate-400">
          Please wait while we verify your credentials and initialize your session.
        </p>
      </div>
    </main>
  );
}