import { create } from 'zustand';

export type ViewType = 'Dashboard' | 'Tasks' | 'Journal' | 'Stats' | 'Settings';

interface ViewState {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  activeView: 'Dashboard',
  setActiveView: (view) => set({ activeView: view }),
}));
