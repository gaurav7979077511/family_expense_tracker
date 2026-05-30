# 🚀 Quick Fix - Data Not Loading From Database

## The Problem
Your app can **add data** but **cannot read it back** from the database.

## The Root Cause
**Row-Level Security (RLS) policies** on your Supabase tables are blocking SELECT queries.

## The 30-Second Fix

### 1. Open Supabase Dashboard
Go to https://app.supabase.com and select your project

### 2. Click SQL Editor
Click "SQL Editor" in the left sidebar

### 3. Copy & Paste This Code
```sql
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE contributions DISABLE ROW LEVEL SECURITY;
ALTER TABLE required_fund DISABLE ROW LEVEL SECURITY;
```

### 4. Click "Run"
Paste the code and hit the Run button

### 5. Done! ✅
Refresh your app and data will appear.

---

## Want More Details?
See `DATABASE_FIX.md` for:
- Detailed explanation of the issue
- Alternative solutions
- How to prevent this in the future
- Production-ready authentication setup
