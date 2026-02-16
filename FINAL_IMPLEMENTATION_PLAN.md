# Final Implementation Plan: SuperDuperDashboard

This document merges the performance-optimized architecture of **Implementation Plan v2** with the visual precision of the **CSS Implementation Plan** (based on `dashboard_design.jpg`).

## 1. Unified Design System (The "Batcave" Palette)

We will standardize on a deep blue-tinted charcoal palette to match the high-fidelity design while maintaining the hardware-accelerated glassmorphism.

### A. Refined `tailwind.config.js`
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        batcave: {
          bg: '#05090e',      // Deep background
          panel: '#0d121a',   // Card background
          accent: '#1e293b',  // Hover / Sidebar active
          blue: '#3b82f6',    // Primary / Tab active
          yellow: '#eab308',  // Event highlights
          red: '#ef4444',     // High priority badge
          green: '#22c55e',   // Low priority / Success
          text: {
            primary: '#f8fafc',
            secondary: '#94a3b8'
          }
        }
      },
      borderRadius: {
        '3xl': '24px',
      }
    }
  }
}
```

## 2. Component Refactoring & New Modules

### Phase 1: Sidebar & Global Shell (The "Foundation")
- [ ] **Sidebar Sync:** Update `Sidebar.tsx` to include the specific design icons:
  - Dashboard, Calendar, Notes, Goals, Projects, Journal, Habits.
- [ ] **Active State:** Use `bg-batcave-blue/10 text-batcave-blue` with a left-edge indicator glow.
- [ ] **Background:** Add a fixed radial gradient to `index.css` to simulate the subtle star/nebula glow seen in the top-left of the design.

### Phase 2: Header & Upcoming Events (The "Focus")
- [ ] **Greeting Component:** Refactor `App.tsx` header to include the "Progress over perfection" quote in `italic text-batcave-text-secondary`.
- [ ] **EventBanner:** Create a horizontal glass-panel component for the "Upcoming Events" section.
  - Features a yellow bell icon with a `drop-shadow-yellow` glow.
  - Sub-items like "Leave by 5:30 PM" with small icons.

### Phase 3: The Todo Ecosystem (The "Core")
- [ ] **TodoGrid:** A 3-column responsive layout (`grid-cols-1 md:grid-cols-3`).
- [ ] **TodoCard:** A specialized widget container.
  - **Badge System:** Colored headers based on priority (High, Medium, Work).
  - **Interactive List:** Items with custom checkboxes (appearance-none) and subtle strike-through transitions.
  - **Priority Select:** Custom styled `<select>` element that fits the glassmorphism theme.

### Phase 4: State & Optimistic UI (The "Performance")
- [ ] **Zustand Store:** Implement a local store for the Todo cards to handle the "General vs Stocks" tab switching.
- [ ] **TanStack Query Hooks:** Create `useTasks` and `useEvents` hooks with the optimistic update logic (`onMutate`) defined in previous plans.

## 3. Performance & Polish Audit
- [ ] **Layering Check:** Ensure `glass-panel` utilities are never nested to avoid blur-stacking lag.
- [ ] **Contrast Verification:** Ensure `batcave-text-secondary` meets WCAG AA on the `batcave-panel` background.
- [ ] **GPU Acceleration:** Verify `translateZ(0)` is present on the scrollable main workspace.

## 4. Final Directory Structure
- `src/components/sidebar/` - Navigation and branding.
- `src/components/dashboard/` - Greeting, EventBanner.
- `src/components/widgets/todo/` - TodoGrid, TodoCard, PriorityBadge.
- `src/styles/` - Global CSS and Tailwind layers.
