export interface IWidgetProps<T = any> {
  id: string;
  title: string;
  isEditable: boolean;
  onDataUpdate: (data: T) => void;
  config: Record<string, any>; // Persistent user-specific settings
}
