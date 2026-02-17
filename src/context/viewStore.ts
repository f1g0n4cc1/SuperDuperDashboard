import { create } from 'zustand';

export type ViewType = 
  | 'Schedules' 
  | 'Projects' 
  | 'Entries' 
  | 'Checklists' 
  | 'Ideas' 
  | 'Ambitions' 
  | 'Logs'
  | 'Settings'; 

interface ViewState {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  activeView: 'Schedules',
  setActiveView: (view) => set({ activeView: view }),
}));
