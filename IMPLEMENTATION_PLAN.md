# Implementation Plan: SuperDuperDashboard

This document outlines the architectural strategy and roadmap for building the **SuperDuperDashboard**, a premium "Batcave" themed productivity kit using React 18, Tailwind CSS, and Supabase.

## 1. UI Architecture & Design System

### A. Tailwind Glassmorphism Configuration
To achieve a consistent "Batcave" aesthetic, we will extend `tailwind.config.ts` with custom utilities. This avoids repetitive class strings and ensures a performant, hardware-accelerated glass effect.

```typescript
// tailwind.config.ts extension snippet
{
  theme: {
    extend: {
      colors: {
        batcave: {
          bg: '#050505',
          glass: 'rgba(15, 15, 15, 0.7)',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      backdropBlur: {
        xs: '2px',
        bat: '12px',
      }
    }
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.glass-panel': {
          '@apply backdrop-blur-bat bg-batcave-glass border border-batcave-border shadow-2xl': {},
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.glass-saturated': {
          '@apply backdrop-saturate-150 backdrop-blur-bat': {},
        }
      })
    })
  ]
}
```

### B. Layout Architecture (The "Workspace" Strategy)
We will use a **Two-Tier Layout** system:
- **Global Shell:** A fixed-height `h-screen` container using `grid-cols-[auto_1fr]` to separate the sidebar from the main workspace.
- **Main Workspace:** A scrollable area with a `max-w-7xl` centered container.
- **Responsive Handling:** Sidebar collapses into a bottom-tab bar on mobile or a hamburger-triggered overlay.

### C. Component State Styling & Micro-interactions
Using Tailwind's `group` and `peer` utilities for high-end feedback:
- **Widget Hover:** `group hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]`
- **Drag & Drop:** Use `peer-dragging` (with custom plugins) or specific transition classes to dim non-active widgets.
- **Inputs:** `peer-focus:text-blue-400` transitions for label floating and border glows.

### D. Theme Switching Strategy
We will implement a CSS Variable-based theme system that bridges Tailwind's dark mode with custom skins.
- **'Batcave' (Dark Glass):** Deep blacks, high blur, subtle white borders.
- **'Clean Dark':** Matte charcoal surfaces, no blur, solid borders for higher contrast.
- **Implementation:** Use `next-themes` or a custom React Context to toggle a `.batcave` or `.clean-dark` class on the `<html>` element.

---

## 2. Technical Roadmap (from TODO.md)

### Phase 1: The Core Foundation (Hardening)
- [ ] **Supabase Setup:** Version-controlled `schema.sql` and `seed.sql`.
- [ ] **Type Safety:** Automated type generation via Supabase CLI.
- [ ] **Auth Refinement:** Standardized Google OAuth and Protected Route HOC/Components.

### Phase 2: Modularization & API
- [ ] **CSS Decomposition:** Move away from monolithic styles into a structured `src/styles` system using Tailwind `@layer`.
- [ ] **Widget API:** Define a standard interface (`IWidgetProps`) for To-Do, Habit, and Stats components to ensure plug-and-play capability.
- [ ] **RLS Policies:** Explicit SQL documentation for multi-tenancy.

### Phase 3: Integration & Sync
- [ ] **Google Calendar:** Refresh token logic and "Sync Status" UI indicators.
- [ ] **Auto-Save Engine:** Custom `useDebounce` hook for Journal entries to optimize Supabase API usage.
- [ ] **Optimistic UI:** Integration of `TanStack Query` (React Query) for instant feedback on user actions.

### Phase 4: Developer Experience (DX)
- [ ] **Environment Validation:** `scripts/check-env.ts` to warn about missing keys.
- [ ] **Theming Engine:** Centralized `theme.config.ts` for user-level customization.

### Phase 5: Polish & Performance
- [ ] **GPU Acceleration:** Implement `will-change-transform` and `translate3d(0,0,0)` on animated backgrounds.
- [ ] **Documentation:** Comprehensive "How to add a Widget" guide.
