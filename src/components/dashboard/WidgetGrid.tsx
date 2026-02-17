import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { TasksWidget } from '../widgets/TasksWidget';
import { JournalWidget } from '../widgets/JournalWidget';
import { GoalsWidget } from '../widgets/GoalsWidget';
import { HabitsWidget } from '../widgets/HabitsWidget';
import { ProjectsWidget } from '../widgets/ProjectsWidget';
import { NotesWidget } from '../widgets/NotesWidget';
import { CalendarWidget } from '../widgets/CalendarWidget';
import { SettingsWidget } from '../widgets/SettingsWidget';
import { StatsWidget } from '../widgets/StatsWidget';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type DashboardLayout as LayoutType } from '../../types/settings';

interface WidgetGridProps {
  layout: LayoutType;
  updateLayout: (newLayout: LayoutType) => void;
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({ layout, updateLayout }) => {
  const moveWidget = (index: number, direction: 'left' | 'right') => {
    const newWidgets = [...layout.widgets];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;
    
    [newWidgets[index], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[index]];
    updateLayout({ widgets: newWidgets });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {layout.widgets.map((widget, index) => {
        const controls = (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => moveWidget(index, 'left')}
              disabled={index === 0}
              className="p-1 hover:text-white text-gray-600 disabled:opacity-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => moveWidget(index, 'right')}
              disabled={index === layout.widgets.length - 1}
              className="p-1 hover:text-white text-gray-600 disabled:opacity-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        );

        // Registry of widget components
        const renderWidgetContent = () => {
          switch (widget.type) {
            case 'tasks': return <TasksWidget />;
            case 'logs': return <JournalWidget />;
            case 'ambitions': return <GoalsWidget />;
            case 'checklists': return <HabitsWidget />;
            case 'projects': return <ProjectsWidget />;
            case 'ideas': return <NotesWidget />;
            case 'entries': return <CalendarWidget />;
            case 'settings': return <SettingsWidget />;
            case 'intel': return <StatsWidget />;
            default:
              return (
                <div className="flex flex-col items-center justify-center h-full py-10 border border-dashed border-white/5 rounded-2xl">
                  <p className="text-xs text-batcave-text-secondary uppercase tracking-widest">{widget.type} module</p>
                  <p className="text-[10px] text-gray-600 mt-2">ID: {widget.id}</p>
                </div>
              );
          }
        };

        return (
          <WidgetContainer key={widget.id} title={widget.title} actions={controls}>
            {renderWidgetContent()}
          </WidgetContainer>
        );
      })}
    </div>
  );
};
