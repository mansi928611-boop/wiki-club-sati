import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://wosstywvgkawfrbrvsfs.supabase.co";

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_YozXT2YpzsBZUPlBhBUIkg_FmocM9Ul";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);