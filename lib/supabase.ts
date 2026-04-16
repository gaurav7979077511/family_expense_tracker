import { createClient } from "@supabase/supabase-js";

// Create client lazily to ensure environment variables are available
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Singleton instance for browser usage
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = getSupabaseClient();
  }
  return browserClient;
}

// For backwards compatibility - use getSupabaseBrowserClient() instead
export const supabase = typeof window !== "undefined" 
  ? getSupabaseBrowserClient() 
  : null!;
