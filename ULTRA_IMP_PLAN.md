# Ultra Implementation Plan: SuperDuperDashboard

This is the definitive roadmap for a premium, performant, and secure SaaS boilerplate. It combines high-end "Batcave" aesthetics with industrial-grade Supabase architecture.

## 1. Database & Security (The "Magic" Layer)
We move beyond basic tables to a trigger-based, self-healing schema.

- [x] **Pro-Level Schema:** Execute the refined SQL (see `supabase/migrations/`) including:
  - **Profiles table** for public metadata.
  - **User Settings table** with a single `dashboard_layout` JSONB column for infinite widget flexibility.
  - **Auth Trigger:** A PL/pgSQL function to auto-create profiles and settings on signup.
- [x] **Bulletproof RLS:** 
  - Strict `FOR ALL` policies using `(auth.uid() = user_id)`.
  - Specific `INSERT` check: `WITH CHECK (auth.uid() = user_id)`.

## 2. Authentication & Gatekeeping
- [x] **The gatekeeper:** Implement `src/context/AuthContext.tsx` using the `onAuthStateChange` listener.
- [x] **Secure Login:** Create `src/pages/Login.tsx` with the high-end animated Google OAuth button.
- [x] **Env Lockdown:** Ensure `.env` is properly mapped in Vite and handled safely in the Supabase service.

## 3. The "Data Bridge" (The Suspension)
Standardizing how the UI talks to the motor.

- [x] **Query Key Factory:** Create `src/lib/queryKeys.ts` to prevent "magic string" bugs.
- [ ] **Optimistic Hooks:**
  - `useTasks`: Instant UI updates on check/uncheck.
  - `useJournal`: Debounced *Mutations* (Zustand updates instantly, Supabase fires after 1s of silence).

## 4. The "Batcave" Visual Depth (The Polish)
- [x] **Corner Glows:** Implement the dual-radial gradient in `index.css` to make glass panels pop.
- [x] **Standardized Tokens:** Refactor any remaining hardcoded hexes to use the `batcave-panel` and `batcave-accent` tokens in `tailwind.config.js`.

## 5. Optional Integrations (Feature Flags)
- [ ] **Google Calendar:** Implement as an *Optional Integration*.
- [ ] **Strategy:** Create a `useSyncStatus` hook that only attempts connection if the user has granted the specific `calendar.readonly` scope, preventing "verification blockages" for new users.

## 6. Execution Roadmap
1. **SQL Migrations:** Deploy the trigger-based schema.
2. **Auth Layer:** Wire up the `AuthProvider` and `Login` view.
3. **Task Loop:** Build the first full CRUD loop with TanStack Query.
4. **Visual Polish:** Finalize the "Starry Depth" CSS.
