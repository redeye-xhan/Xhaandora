# Backend Setup & Integration Guide

## 📋 Overview

This guide covers setting up the Xhaandora backend infrastructure on Supabase and integrating it with the frontend. The backend consists of:

- **PostgreSQL Database**: 20+ tables with proper relationships and indexes
- **Row Level Security (RLS)**: 60+ policies for data isolation
- **Authentication**: Email/password, Google OAuth, GitHub OAuth
- **Real-time Sync**: Live updates across devices
- **File Storage**: Avatar uploads and custom sounds
- **Edge Functions**: AI-powered features (coming next phase)

---

## 🚀 Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up or login
4. Create a new project:
   - Give it a name (e.g., "xhaandora-prod")
   - Create a strong database password
   - Select your region (closest to your users)
   - Wait for provisioning (~2 minutes)

---

## 🔑 Step 2: Get Your API Keys

1. In the Supabase dashboard, go to **Settings → API**
2. You'll see:
   - **Project URL**: Your `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key**: Your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Key**: For server-side operations (keep private!)

3. Update `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

---

## 📦 Step 3: Deploy Database Schema

### Option A: Using Supabase Dashboard (Easiest)

1. Go to the **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy the entire contents of `/supabase/migrations/001_init_schema.sql`
4. Paste into the editor
5. Click **RUN** (should see "Success" message)
6. Repeat for `/supabase/migrations/002_rls_policies.sql`

### Option B: Using Supabase CLI (Recommended for production)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-id your-project-id

# Push migrations
supabase db push
```

**Expected Output:**
```
✓ Pushed 2 migrations (001_init_schema.sql, 002_rls_policies.sql)
```

### Verify Deployment

Check the **Tables** section in Supabase dashboard. You should see:
- ✅ profiles
- ✅ pomodoro_sessions
- ✅ tasks
- ✅ subtasks
- ✅ daily_plans
- ✅ session_notes
- ✅ productivity_metrics
- ✅ streaks
- ✅ user_xp
- ✅ achievements
- ✅ user_achievements
- ✅ forest_trees
- ✅ music_preferences
- ✅ blocked_sites
- ✅ automation_rules
- ✅ notifications
- ✅ hydration_reminders
- ✅ timer_settings
- ✅ file_uploads

---

## 🔐 Step 4: Configure Authentication

### Email/Password Authentication

1. Go to **Authentication → Providers**
2. Enable **Email Provider**:
   - Check "Confirm email"
   - Set confirmation validity to 24 hours
   - Save

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Create OAuth 2.0 credentials (Web application):
   - Add redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret
5. In Supabase → **Authentication → Providers → Google**:
   - Paste Client ID and Client Secret
   - Enable provider

### GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App:
   - Authorization callback URL: `https://your-project-id.supabase.co/auth/v1/callback`
3. Copy Client ID and Client Secret
4. In Supabase → **Authentication → Providers → GitHub**:
   - Paste Client ID and Client Secret
   - Enable provider

---

## 💾 Step 5: Configure File Storage

1. Go to **Storage** in Supabase
2. Create a new bucket called `avatars`:
   - File size limit: 2 MB
   - Allowed MIME types: `image/*`
   - Public (enable "Make bucket public")
3. Create RLS policies:
   - **SELECT**: `auth.uid() IS NOT NULL` (authenticated users can view)
   - **INSERT**: `auth.uid() = owner_id` (users upload own avatars)
   - **UPDATE/DELETE**: `auth.uid() = owner_id` (users manage own files)

---

## 🔌 Step 6: Enable Real-time Database

1. Go to **Database → Replication** in Supabase
2. Enable replication for required tables:
   - ✅ pomodoro_sessions
   - ✅ tasks
   - ✅ productivity_metrics
   - ✅ notifications

---

## 📝 Step 7: Install Dependencies (if not already done)

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

---

## 🪝 Step 8: Set Up React Hooks

The project includes pre-built hooks in `/src/hooks/useSupabase.ts`:

### useAuth Hook

```typescript
import { useAuth } from '@/hooks/useSupabase';

function LoginPage() {
  const { user, signIn, signUp, signOut, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.email}</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => signIn('user@example.com', 'password')}>
        Sign In
      </button>
    </div>
  );
}
```

### useSessions Hook

```typescript
import { useSessions } from '@/hooks/useSupabase';

function SessionHistory() {
  const { todaySessions, createSession, completeSession } = useSessions(userId);

  return (
    <div>
      {todaySessions.map((session) => (
        <div key={session.id}>
          {session.session_type} - {session.duration_seconds}s
        </div>
      ))}
    </div>
  );
}
```

### useTasks Hook

```typescript
import { useTasks } from '@/hooks/useSupabase';

function TaskList() {
  const { tasks, createTask, completeTask } = useTasks(userId);

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <button onClick={() => completeTask(task.id)}>Complete</button>
        </div>
      ))}
    </div>
  );
}
```

### useMetrics Hook

```typescript
import { useMetrics } from '@/hooks/useSupabase';

function StatsWidget() {
  const { todayMetrics } = useMetrics(userId);

  return (
    <div>
      <p>Sessions: {todayMetrics?.pomodoros_completed}</p>
      <p>Focus Time: {todayMetrics?.focus_minutes} min</p>
    </div>
  );
}
```

### useProfile Hook

```typescript
import { useProfile } from '@/hooks/useSupabase';

function ProfileSettings() {
  const { profile, updateProfile, uploadAvatar } = useProfile(userId);

  return (
    <div>
      <p>Username: {profile?.username}</p>
      <button
        onClick={() => updateProfile({ username: 'newname' })}
      >
        Update Profile
      </button>
    </div>
  );
}
```

---

## 🧪 Step 9: Test the Connection

Create a test file `/src/app/api/health/route.ts`:

```typescript
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) throw error;

    return Response.json({
      status: 'ok',
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return Response.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
```

Test it:
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Supabase connection successful",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

---

## 📱 Step 10: Integrate with Components

Update your component to use the hooks:

```typescript
'use client';

import { useAuth } from '@/hooks/useSupabase';
import { useSessions } from '@/hooks/useSupabase';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { todaySessions, createSession } = useSessions(user?.id || null);

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <p>Sessions today: {todaySessions.length}</p>
      <button onClick={() => createSession({ session_type: 'work' })}>
        Start Session
      </button>
    </div>
  );
}
```

---

## 🚨 Troubleshooting

### "Invalid API Key"
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are in `.env.local`
- Restart `npm run dev` after adding env vars
- Verify keys in Supabase dashboard

### "Permission denied" errors
- Check RLS policies are deployed (step 3)
- Verify user is authenticated (`useAuth`)
- Check `user_id` matches authenticated user

### "Table not found" errors
- Run schema migrations (step 3)
- Verify tables exist in Supabase dashboard
- Check table names match exactly (case-sensitive)

### Real-time updates not working
- Enable replication for tables (step 6)
- Use `realtimeService.subscribeToSessions()` from `/src/lib/supabase.ts`
- Check browser console for errors

---

## 🔄 Database Migrations (Future Changes)

When you need to modify the schema:

1. Create a new migration file: `/supabase/migrations/003_add_new_feature.sql`
2. Write your SQL changes
3. Run migrations: `supabase db push`

---

## 📚 Useful Supabase Docs

- [Supabase Documentation](https://supabase.com/docs)
- [Authentication Guide](https://supabase.com/docs/guides/auth)
- [Real-time Database](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

---

## ✅ Deployment Checklist

- [ ] Supabase project created
- [ ] API keys added to `.env.local`
- [ ] Database schema deployed (001 & 002 migrations)
- [ ] Authentication providers configured
- [ ] File storage buckets created
- [ ] Real-time replication enabled
- [ ] Hooks tested in browser
- [ ] Production env vars configured
- [ ] CORS settings verified
- [ ] Database backups scheduled

---

**Next Steps:**

1. Deploy migrations to your Supabase project
2. Configure authentication providers
3. Update `.env.local` with your API keys
4. Test the health endpoint
5. Start building features with the provided hooks!

Questions? Check the Supabase documentation or create an issue in the repository.
