# 🦇 SuperDuperDashboard: The Tactical Command Center

A high-performance, resilient, and secure personal dashboard built for high-stakes productivity. Developed with a "Batcave" aesthetic, this system prioritizes data integrity, extreme scalability, and operational observability.

## 🚀 Strategic Overview

SuperDuperDashboard is more than a todo list; it's a hardened tactical environment. Every feature—from the cursor-paginated **Execution Hub** to the encrypted **Knowledge Vault**—is engineered to handle massive datasets while maintaining sub-second latency.

### Key Tactical Modules:
- **Command Center:** Real-time dashboard featuring a 72-hour tactical horizon (Upcoming Engagements).
- **Project Command:** Strategic operation management with automated progress aggregation via PostgreSQL Views.
- **Execution Hub:** Mission objective tracking with infinite scroll and cursor-based pagination.
- **Knowledge Vault:** Encrypted briefing storage with real-time search.
- **Daily Journal:** Private tactical logs with mandatory privacy consent and medical disclaimers.
- **Satellite Sync:** Integrated schedule management merging local engagements with external satellite data.

---

## 🛠 Tech Stack (The "Foundations")

- **Core:** React 19 + Vite + TypeScript.
- **Database/Auth:** [Supabase](https://supabase.com) (PostgreSQL, RLS, RPC, PostgREST).
- **Data Fetching:** [TanStack Query v5](https://tanstack.com/query) (Infinite Queries, Optimistic UI updates).
- **State Management:** Zustand (View Layer).
- **Validation:** Zod (Schema-based input enforcement).
- **Security:** Row Level Security (RLS), Search Path Protection, JSONB size triggers.
- **Observability:** Sentry (Production Error Monitoring) + Sonner (Real-time Feedback).

---

## 🛡️ Security & Resilience

This project has undergone multiple high-stakes audits (Hydra, Burn Test) and features:
- **Zero-Trust RLS:** Every row is strictly isolated via `auth.uid() = user_id`.
- **Input Hardening:** Database-level `char_length` constraints and Zod-enforced client-side validation.
- **The "Ada Lovelace" Pattern:** Deterministic async state machines in Auth and Heartbeat systems to eliminate race conditions.
- **Satellite Monitoring:** Real-time connectivity tracking with a dedicated "Safe Mode" fallback layout.
- **O(1) Scalability:** Cursor-based pagination for large data volumes, avoiding expensive database offsets.

---

## 💻 Local Development

### 1. Requirements
- Node.js (Latest LTS)
- Supabase CLI
- A Supabase Project ID

### 2. Environment Setup
Create a `.env` file in the root:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SENTRY_DSN=your_sentry_dsn (optional)
```

### 3. Initialize & Sync
```bash
# Install dependencies
npm install

# Connect to your tactical database
supabase login
supabase link --project-ref your-project-id
supabase db push

# Generate type safety definitions
npm run types:generate

# Launch the uplink
npm run dev
```

---

## 🚢 Deployment

**Primary Uplink:** [Vercel](https://vercel.com) (Hobby Plan recommended for zero-cost production).

1. Push your code to a secure repository.
2. Link to Vercel and add your environment variables.
3. **Mandatory:** Enable Auth Rate Limits in the Supabase Dashboard before authorizing public access.

---

## 📜 Legal & Privacy Note
The **Daily Journal** module is designed for personal productivity. It is **not a medical device**. Users are cautioned against storing sensitive health or medical data. All logs are stored in private, encrypted-at-rest volumes.

**Operational Status:** `READY FOR DEPLOYMENT`
**Current Version:** `1.0.0-tactical`
