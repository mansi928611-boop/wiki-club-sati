import { supabase } from "./supabase";

export type UserSession = {
  id: string;
  email: string;
  role: "member" | "coordinator" | "admin";
  name: string;
  department?: string;
  year?: string;
  bio?: string;
  isDemo?: boolean;
};

const DEMO_USER_KEY = "wiki_club_sati_demo_session";

export const DEMO_USERS: Record<string, UserSession> = {
  member: {
    id: "demo-member-001",
    email: "rohit.sharma@satiengg.in",
    name: "Rohit Sharma",
    role: "member",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    bio: "Passionate about open-source tools, Next.js, and web development. Active Wiki Club SATI contributor.",
    isDemo: true,
  },
  admin: {
    id: "demo-admin-002",
    email: "mansi.coordinator@satiengg.in",
    name: "Mansi Gupta",
    role: "coordinator",
    department: "Information Technology",
    year: "4th Year",
    bio: "Wiki Club SATI Student Coordinator & Lead. Leading technical workshops and open-source events.",
    isDemo: true,
  },
};

export async function getActiveUser(): Promise<UserSession | null> {
  try {
    // 1. Check Supabase session first
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session && session.user) {
      // Fetch role and details from Supabase profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      return {
        id: session.user.id,
        email: session.user.email ?? "",
        role: (profile?.role as "member" | "coordinator" | "admin") ?? "member",
        name: profile?.name ?? session.user.email?.split("@")[0] ?? "Member",
        department: profile?.department ?? undefined,
        year: profile?.year ?? undefined,
        bio: profile?.bio ?? undefined,
        isDemo: false,
      };
    }
  } catch (err) {
    console.warn("Supabase session check error:", err);
  }

  // 2. Check Demo session from localStorage if in browser
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(DEMO_USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as UserSession;
      } catch {
        localStorage.removeItem(DEMO_USER_KEY);
      }
    }
  }

  return null;
}

export function setDemoSession(userType: "member" | "admin"): UserSession {
  const user = DEMO_USERS[userType];
  if (typeof window !== "undefined") {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
  }
  return user;
}

export async function logOutUser(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Supabase sign out error:", err);
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(DEMO_USER_KEY);
  }
}
