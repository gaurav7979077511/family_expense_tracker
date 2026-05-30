-- ============================================
-- FIX ROW-LEVEL SECURITY POLICIES
-- ============================================
-- This script fixes the data access issue
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Check RLS status on each table
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('expenses', 'contributions', 'required_fund');

-- 2. OPTION A: Disable RLS (simplest for development/internal use)
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE contributions DISABLE ROW LEVEL SECURITY;
ALTER TABLE required_fund DISABLE ROW LEVEL SECURITY;

-- 3. OPTION B: Create permissive policies (if you want RLS enabled)
-- Run these INSTEAD of the disable commands above if you want RLS

-- For expenses table
CREATE POLICY "Allow public select on expenses" 
ON expenses FOR SELECT 
USING (true);

CREATE POLICY "Allow insert on expenses" 
ON expenses FOR INSERT 
WITH CHECK (true);

-- For contributions table
CREATE POLICY "Allow public select on contributions" 
ON contributions FOR SELECT 
USING (true);

CREATE POLICY "Allow insert on contributions" 
ON contributions FOR INSERT 
WITH CHECK (true);

-- For required_fund table
CREATE POLICY "Allow public select on required_fund" 
ON required_fund FOR SELECT 
USING (true);

CREATE POLICY "Allow insert on required_fund" 
ON required_fund FOR INSERT 
WITH CHECK (true);

-- 4. Verify the fix
SELECT COUNT(*) FROM expenses;
SELECT COUNT(*) FROM contributions;
SELECT COUNT(*) FROM required_fund;
