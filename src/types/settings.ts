export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  w?: number; // width in grid columns
  h?: number; // height
}

export interface DashboardLayout {
  widgets: WidgetConfig[];
}

export interface UserSettings {
  user_id: string;
  dashboard_layout: DashboardLayout;
  updated_at: string;
}
