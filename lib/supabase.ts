import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to debug RLS issues
export async function testDatabaseAccess() {
  try {
    console.log("[v0] Testing Supabase access...");
    
    const testQueries = [
      { table: "expenses", name: "Expenses" },
      { table: "contributions", name: "Contributions" },
      { table: "required_fund", name: "Required Fund" },
    ];

    for (const { table, name } of testQueries) {
      const { data, error } = await supabase.from(table).select("count");
      if (error) {
        console.error(`[v0] ${name} table error:`, error.message, error.details, error.code);
      } else {
        console.log(`[v0] ${name} table accessible - Count:`, data);
      }
    }
  } catch (err) {
    console.error("[v0] Database access test failed:", err);
  }
}
