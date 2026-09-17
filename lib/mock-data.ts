export interface ClubMember {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  bio: string;
  role: "member" | "coordinator" | "admin";
}

export interface ClubContribution {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  contribution_date: string;
  evidence_url?: string;
  status: "approved" | "pending" | "rejected";
  created_at: string;
}

export interface ClubNomination {
  id: string;
  nominator_id: string;
  nominee_id: string;
  position: string;
  reason: string;
  status: "approved" | "pending" | "rejected";
  created_at: string;
}

export interface ClubElection {
  id: string;
  title: string;
  description: string;
  status: "draft" | "open" | "closed";
  created_at: string;
}

export interface ClubPosition {
  id: string;
  election_id: string;
  position_name: string;
  description: string;
}

export interface ClubCandidate {
  id: string;
  election_id: string;
  position_id: string;
  candidate_id: string;
}

export const INITIAL_MEMBERS: ClubMember[] = [
  {
    id: "demo-admin-002",
    name: "Mansi Gupta",
    email: "mansi.coordinator@satiengg.in",
    department: "Information Technology",
    year: "4th Year",
    bio: "Wiki Club SATI Student Coordinator. Passionate about community building, open access, and tech leadership.",
    role: "coordinator",
  },
  {
    id: "demo-member-001",
    name: "Rohit Sharma",
    email: "rohit.sharma@satiengg.in",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    bio: "Frontend engineer and open-source enthusiast. Loves building Next.js web applications and organizing workshops.",
    role: "member",
  },
  {
    id: "member-003",
    name: "Ananya Verma",
    email: "ananya.verma@satiengg.in",
    department: "Electronics & Communication",
    year: "3rd Year",
    bio: "Design lead and content creator. Leads UI/UX workshops and club graphic identity.",
    role: "member",
  },
  {
    id: "member-004",
    name: "Aman Patel",
    email: "aman.patel@satiengg.in",
    department: "Mechanical Engineering",
    year: "2nd Year",
    bio: "Student researcher, active Wikipedia contributor, and documentation specialist for SATI Wiki Club.",
    role: "member",
  },
];

export const INITIAL_CONTRIBUTIONS: ClubContribution[] = [
  {
    id: "contrib-001",
    user_id: "demo-admin-002",
    title: "Organized Wikipedia Edit-a-thon 2026",
    category: "Event Organization",
    description: "Led a 2-day hands-on workshop teaching 60+ SATI students how to contribute articles and citations to Wikipedia.",
    contribution_date: "2026-03-10",
    evidence_url: "https://github.com/mansi928611-boop/wiki-club-sati",
    status: "approved",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "contrib-002",
    user_id: "demo-member-001",
    title: "Developed SATI Knowledge Wiki Platform",
    category: "Technical",
    description: "Built the responsive Next.js frontend portal for club documentation, project directories, and member voting.",
    contribution_date: "2026-03-05",
    evidence_url: "https://github.com/mansi928611-boop/wiki-club-sati",
    status: "approved",
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: "contrib-003",
    user_id: "member-003",
    title: "Brand Identity & Design System",
    category: "Design",
    description: "Created official color palettes, logos, and presentation templates for Wiki Club SATI outreach.",
    contribution_date: "2026-02-20",
    status: "approved",
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
];

export const INITIAL_NOMINATIONS: ClubNomination[] = [
  {
    id: "nom-001",
    nominator_id: "demo-member-001",
    nominee_id: "demo-admin-002",
    position: "President",
    reason: "Mansi has shown exceptional leadership in coordinating club events, onboarding junior students, and liaising with college faculty.",
    status: "approved",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "nom-002",
    nominator_id: "member-004",
    nominee_id: "demo-member-001",
    position: "Technical Head",
    reason: "Rohit has spearheaded the development of the club portal, automated repo workflows, and mentored 15+ students in Git.",
    status: "approved",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

export const INITIAL_ELECTIONS: ClubElection[] = [
  {
    id: "elec-2026",
    title: "Wiki Club SATI Board Election 2026-27",
    description: "Annual elections to elect the student executive board members for Wiki Club SATI.",
    status: "open",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const INITIAL_POSITIONS: ClubPosition[] = [
  {
    id: "pos-001",
    election_id: "elec-2026",
    position_name: "President",
    description: "Leads club vision, oversees activities, represents Wiki Club SATI in college administration.",
  },
  {
    id: "pos-002",
    election_id: "elec-2026",
    position_name: "Technical Head",
    description: "Supervises coding projects, leads technical workshops, manages GitHub repos.",
  },
  {
    id: "pos-003",
    election_id: "elec-2026",
    position_name: "Design Head",
    description: "Oversees club UI/UX design, visual branding, banners, and digital graphics.",
  },
];

export const INITIAL_CANDIDATES: ClubCandidate[] = [
  {
    id: "cand-001",
    election_id: "elec-2026",
    position_id: "pos-001",
    candidate_id: "demo-admin-002",
  },
  {
    id: "cand-002",
    election_id: "elec-2026",
    position_id: "pos-002",
    candidate_id: "demo-member-001",
  },
  {
    id: "cand-003",
    election_id: "elec-2026",
    position_id: "pos-003",
    candidate_id: "member-003",
  },
];
