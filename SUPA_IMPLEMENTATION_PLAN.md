# Supabase Implementation Plan: The Engine

This document outlines the strategy for integrating the "Engine" into the **SuperDuperDashboard**. We are pausing UI polish to ensure data integrity, multi-tenancy, and a seamless auth flow.

## 1. Environment & Client Setup
- [x] **Supabase Client:** Initialize the client in `src/services/supabase.ts` using environment variables.
- [ ] **Environment Validation:** Implement a script to ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present before the app boots.

## 2. Database Schema (The Blueprint)
We will use a migration-first approach to ensure the schema is version-controlled.

### A. Tables & Relationships
- **`profiles`**: User metadata, preferences (Theme: Batcave vs Clean Dark), and Google refresh tokens.
- **`tasks`**: `id, user_id, title, status, priority, due_date, created_at`.
- **`journal_entries`**: `id, user_id, content, mood, created_at`.
- **`user_settings`**: Stores the "Widget Layout" (Registry keys and positions).

### B. Row Level Security (RLS)
- [x] **Multi-tenancy:** Enable RLS on all tables.
- [x] **Policies:** `CREATE POLICY "Users can only access their own data" ON tasks FOR ALL USING (auth.uid() = user_id);`

## 3. Authentication Flow (Google OAuth)
- [x] **Auth Service:** Create `src/services/auth.ts` to handle `signInWithOAuth` and `signOut`.
- [x] **Protected Routes:** Refactor `App.tsx` to use a `SessionProvider`. If no session is found, redirect to a "Batcave-styled" login landing page.
- [ ] **Syncing:** Ensure Google OAuth includes the necessary scopes for Calendar integration (Phase 3).

## 4. Data Bridge (TanStack Query + Supabase)
This is where the "suspension" meets the "motor."

- [ ] **Base Hooks:** Create `src/hooks/useTasks.ts` and `src/hooks/useJournal.ts`.
- [x] **Optimistic Strategy:** 
  - `onMutate`: Snapshot current cache, update local UI immediately.
  - `onError`: Roll back to the snapshot.
  - `onSettled`: Invalidate and refetch to ensure source-of-truth.
- [ ] **API Protection:** Wrap all Supabase calls in a `useDebounce` hook to protect API quotas during rapid typing (Journal/Tasks).

## 5. Visual "Tactical Fixes" (The Bridge)
Before we go full-backend, we will quickly implement these non-negotiable design foundations to support the data:
- [x] **Starry Background:** Radial-gradient overlay in `index.css`.
- [x] **Theme Config:** Standardize the full palette in `tailwind.config.js` so Supabase `theme_preference` can toggle classes correctly.

## 6. Execution Order
1. **Initialize Supabase Project** and set up local environment.
2. **Define SQL Schema** and run migrations.
3. **Implement Auth Wrapper** and Login View.
4. **Hook up Tasks Widget** (First functional data loop).
5. **Verify Optimistic UI** performance under simulated latency.
