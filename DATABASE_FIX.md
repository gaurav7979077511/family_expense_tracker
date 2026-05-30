# Database Data Not Being Picked Up - Root Cause & Fix

## 🔍 Root Cause

The issue is **Row-Level Security (RLS) Policies** in your Supabase database. Here's what's happening:

1. **INSERT works** - Your AddEntryForm successfully adds data to the database
2. **SELECT fails** - The Dashboard, Expenses, and Contributors pages cannot read the data due to RLS blocking SELECT queries with the anon key

### Why RLS is blocking access:
- Your Supabase tables have RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- No policies exist (or existing policies are too restrictive) to allow the `NEXT_PUBLIC_SUPABASE_ANON_KEY` to SELECT data
- The anon key can INSERT (likely because there's a permissive INSERT policy), but cannot SELECT

## ✅ How to Fix

### Step 1: Go to Your Supabase Dashboard
1. Navigate to https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** (left sidebar)

### Step 2: Run One of These Solutions

#### **Option A: Disable RLS (Recommended for Internal/Private Apps)**
```sql
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE contributions DISABLE ROW LEVEL SECURITY;
ALTER TABLE required_fund DISABLE ROW LEVEL SECURITY;
```

This is the fastest fix if your app is internal/private (not public-facing).

#### **Option B: Create Permissive Policies (If RLS must stay enabled)**
```sql
-- For expenses table
CREATE POLICY "Allow public select on expenses" ON expenses FOR SELECT USING (true);
CREATE POLICY "Allow insert on expenses" ON expenses FOR INSERT WITH CHECK (true);

-- For contributions table
CREATE POLICY "Allow public select on contributions" ON contributions FOR SELECT USING (true);
CREATE POLICY "Allow insert on contributions" ON contributions FOR INSERT WITH CHECK (true);

-- For required_fund table
CREATE POLICY "Allow public select on required_fund" ON required_fund FOR SELECT USING (true);
CREATE POLICY "Allow insert on required_fund" ON required_fund FOR INSERT WITH CHECK (true);
```

### Step 3: Verify It Works
Run this query to test:
```sql
SELECT COUNT(*) as total_expenses FROM expenses;
SELECT COUNT(*) as total_contributions FROM contributions;
SELECT COUNT(*) as total_funds FROM required_fund;
```

You should see your data counts, not zero.

### Step 4: Refresh Your App
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Navigate to the Dashboard or Expenses page
- Data should now appear!

## 🛠️ For Production Apps

If this is a production app that needs authentication:

1. Implement proper Supabase authentication (email/password, OAuth, etc.)
2. Create RLS policies that check `auth.uid()` or custom claims
3. Store user_id in your tables to properly scope access

Example for authenticated users:
```sql
CREATE POLICY "Users can select own expenses" ON expenses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses" ON expenses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

## 📋 SQL Script

A complete SQL script is available in `scripts/fix-rls-policies.sql` for reference.

## 🐛 How to Identify This Issue in the Future

If data doesn't show up but you can add entries:
1. Check browser console for Supabase errors
2. Run the debug function: The added `testDatabaseAccess()` in your dashboard logs detailed error messages
3. Look for "permission denied" or "violates row-level security policy" errors
4. These are RLS issues - fix using the steps above

## ❓ Questions?

- **"Why does INSERT work but SELECT doesn't?"** - There might be an INSERT policy without a SELECT policy
- **"Will disabling RLS make my app insecure?"** - Only if it's public-facing. For internal family apps, it's fine. For production with sensitive data, use proper authentication + RLS policies
- **"Which option should I choose?"** - Option A (disable RLS) is quickest. Use Option B if your app needs authentication later
