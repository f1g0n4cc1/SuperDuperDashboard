import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { WidgetContainer } from '../WidgetContainer';
import { CheckCircle2, Circle, Plus, Loader2 } from 'lucide-react';
import type { Task } from '../../types/tasks';

export const TasksWidget: React.FC = () => {
  const { tasks, isLoading, updateTask, createTask } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [newPriority, setNewPriority] = React.useState(1);

  const handleToggle = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    updateTask.mutate({ id, updates: { status: newStatus } });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    createTask.mutate({ title: newTaskTitle, priority: newPriority, category: 'General' });
    setNewTaskTitle('');
    setNewPriority(1);
  };

  return (
    <WidgetContainer title="Execution Hub">
      <div className="flex flex-col h-full max-h-[500px]">
        {/* Add Task Input with Priority Selection */}
        <form onSubmit={handleAdd} className="mb-6 space-y-3">
          <div className="relative group">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Deploy new objective..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 pr-10 text-sm focus:outline-none focus:border-batcave-blue transition-colors"
            />
            <button type="submit" className="absolute right-2 top-2 text-batcave-blue hover:text-white transition-colors">
              {createTask.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Priority Level:</span>
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setNewPriority(p)}
                className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all border ${
                  newPriority === p 
                    ? 'bg-batcave-blue border-batcave-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                    : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </form>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-batcave-blue" />
            </div>
          ) : (tasks as Task[]).length === 0 ? (
            <div className="text-center py-10 text-batcave-text-secondary text-sm italic">
              No active objectives.
            </div>
          ) : (
            (tasks as Task[]).map((task) => (
              <div 
                key={task.id}
                onClick={() => handleToggle(task.id, task.status || '')}
                className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer group ${
                  task.status === 'done' 
                    ? 'bg-white/2 border-transparent opacity-50' 
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="mr-3 text-batcave-blue">
                  {task.status === 'done' ? (
                    <CheckCircle2 className="w-5 h-5 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                  ) : (
                    <Circle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <span className={`text-sm font-medium ${task.status === 'done' ? 'line-through' : ''}`}>
                  {task.title}
                </span>
                {task.priority && task.priority > 2 && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-batcave-red shadow-[0_0_8px_#ef4444]" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </WidgetContainer>
  );
};
