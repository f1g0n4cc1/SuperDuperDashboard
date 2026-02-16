# CSS Implementation Plan: Batcave Design

This plan translates the visual aesthetic of `dashboard_design.jpg` into a technical implementation using Tailwind CSS v3.

## 1. Visual Identity & Color Palette
The design uses a deep, multi-layered dark theme with high-contrast accents for status and priority.

### A. Extended Tailwind Theme
```javascript
// tailwind.config.js updates
theme: {
  extend: {
    colors: {
      batcave: {
        dark: '#05090e',      // Main background
        panel: '#0d121a',     // Widget background
        accent: '#1e293b',    // Sidebar active / Hover
        blue: '#3b82f6',      // Primary actions / Active tab
        yellow: '#eab308',    // Event icons
        red: '#ef4444',       // High priority
        green: '#22c55e',     // Success / Low priority
        text: {
          primary: '#f8fafc', // Headlines
          secondary: '#94a3b8' // Subtext
        }
      }
    },
    borderRadius: {
      '3xl': '24px',
    }
  }
}
```

## 2. Layout Strategy
The layout is a rigid sidebar with a fluid, grid-based workspace.

- **Sidebar:** Fixed width (`w-64`), full height (`h-screen`). Active items use `bg-batcave-blue/10 text-batcave-blue` with a subtle left border or background glow.
- **Main Workspace:** `flex-1 overflow-y-auto`. Large padding (`p-10`).
- **Header Section:** Large typography for the greeting, small subtext for the quote (`italic text-batcave-text-secondary`).

## 3. Component Styling (Glassmorphism 2.0)

### A. The "Upcoming Events" Banner
- **Structure:** A wide, low-profile glass container.
- **CSS:** `glass-panel bg-batcave-panel/40 p-6 rounded-3xl flex items-start gap-4`.
- **Icon:** The yellow bell uses a glow: `text-batcave-yellow drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]`.

### B. Todo List Grid
- **Grid:** `grid grid-cols-1 lg:grid-cols-3 gap-6`.
- **Card Style:** 
  - `bg-batcave-panel/60 border border-white/5 rounded-3xl p-6`.
  - Header with colored badges: `px-3 py-1 rounded-full text-xs font-bold`.
- **Input/Checkbox:**
  - Custom checkbox using `appearance-none border-2 border-white/10 rounded-md checked:bg-batcave-blue`.
  - Priority dropdown: `bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm`.

## 4. Micro-interactions & Polish
- **Hover States:** Widgets should elevate slightly: `hover:-translate-y-1 hover:border-white/20`.
- **Glow Effects:** Use `shadow-[0_0_30px_rgba(0,0,0,0.5)]` combined with subtle colored glows for active elements.
- **Typography:**
  - Headlines: `font-bold tracking-tight`.
  - Labels: `font-semibold uppercase text-[10px] tracking-widest text-batcave-text-secondary`.

## 5. Implementation Steps
1. [ ] Update `tailwind.config.js` with the specific hex codes from the design.
2. [ ] Refactor `Sidebar.tsx` to match the navigation spacing and icons (Calendar, Notes, Goals, Projects, Journal, Habits).
3. [ ] Create `EventBanner.tsx` for the "Upcoming Events" section.
4. [ ] Create `TodoGrid.tsx` and `TodoCard.tsx` implementing the triple-column list view.
5. [ ] Add the "Starry" background effect using a CSS radial gradient overlay in `src/index.css`.
