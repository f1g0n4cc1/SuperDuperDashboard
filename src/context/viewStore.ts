import { create } from 'zustand';

export type ViewType = 
  | 'Dashboard' 
  | 'Calendar' 
  | 'Notes' 
  | 'Goal' 
  | 'Projects' 
  | 'Journal' 
  | 'Habits'
  | 'Settings'; // Keeping Settings as a utility view

interface ViewState {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  activeView: 'Dashboard',
  setActiveView: (view) => set({ activeView: view }),
}));
