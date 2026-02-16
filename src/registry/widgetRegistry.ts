import type { LazyExoticComponent, ComponentType } from 'react';
import type { IWidgetProps } from '../types/widget';

export type WidgetComponent = LazyExoticComponent<ComponentType<IWidgetProps>>;

export interface WidgetDefinition {
  type: string;
  name: string;
  component: WidgetComponent;
  defaultConfig: Record<string, any>;
}

const registry: Map<string, WidgetDefinition> = new Map();

export const registerWidget = (definition: WidgetDefinition) => {
  registry.set(definition.type, definition);
};

export const getWidgetDefinition = (type: string) => {
  return registry.get(type);
};

export const getAllWidgets = () => {
  return Array.from(registry.values());
};
