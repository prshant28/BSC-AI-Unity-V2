
# Database Setup Instructions

To fix the current issues with your admin dashboard, you need to run the SQL commands in your Supabase database.

## Steps:

1. **Go to your Supabase project dashboard**
2. **Navigate to the SQL Editor**
3. **Copy and paste the contents of `supabase-setup.sql` file**
4. **Run the SQL commands**

## What this will fix:

- ✅ Missing `is_hidden` column in concerns table
- ✅ Missing `helpful_votes` and `not_helpful_votes` columns
- ✅ Missing `concern_replies` table
- ✅ Missing `concern_votes` table
- ✅ Missing `analytics_events` table
- ✅ Performance indexes
- ✅ Row Level Security policies

## After running the SQL:

Your admin dashboard pages will work properly:
- ✅ Questions Management
- ✅ Leaderboard
- ✅ Overview Dashboard
- ✅ Concerns with voting and replies

## Alternative: Use the shell command

You can also copy the SQL content by running:
```bash
cat supabase-setup.sql
```

Then paste it in your Supabase SQL Editor.
