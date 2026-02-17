import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { WidgetContainer } from '../WidgetContainer';
import { CheckCircle2, Circle, Plus, Loader2, Trash2 } from 'lucide-react';
import type { Task } from '../../types/tasks';

export const TasksWidget: React.FC = () => {
  const { tasks, isLoading, updateTask, createTask, deleteTask } = useTasks();
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

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Terminate this objective?')) {
      deleteTask.mutate(id);
    }
  };

  return (
    <WidgetContainer title="Execution Hub">
      <div className="flex flex-col h-full max-h-[500px]">
        {/* Add Task Input with Priority Selection */}
        <form onSubmit={handleAdd} className="mb-10 space-y-6">
          <div className="relative group">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Deploy new objective..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 pr-12 text-xs font-bold text-vault-amber outline-none focus:border-vault-amber/50 transition-all tracking-terminal placeholder:text-vault-amber/10"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-vault-amber/40 hover:text-vault-amber transition-colors">
              {createTask.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex items-center gap-4 px-1">
            <span className="text-[8px] uppercase tracking-terminal-wide font-black text-vault-amber-secondary opacity-40">Priority Level:</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewPriority(p)}
                  className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all border ${
                    newPriority === p 
                      ? 'bg-vault-amber border-vault-amber text-black shadow-vault-glow' 
                      : 'bg-white/5 border-white/5 text-vault-amber-secondary hover:border-vault-amber/20'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-vault-amber" />
            </div>
          ) : (tasks as Task[]).length === 0 ? (
            <div className="text-center py-10 text-vault-amber-secondary/20 text-[10px] font-black uppercase tracking-widest italic">
              No active objectives.
            </div>
          ) : (
            (tasks as Task[]).map((task) => (
              <div 
                key={task.id}
                onClick={() => handleToggle(task.id, task.status || '')}
                className={`flex items-center p-4 rounded-2xl border transition-all cursor-pointer group ${
                  task.status === 'done' 
                    ? 'bg-white/[0.01] border-transparent opacity-20' 
                    : 'bg-white/5 border-white/5 hover:border-vault-amber/20 hover:bg-vault-amber/[0.02]'
                }`}
              >
                <div className="mr-4 text-vault-amber">
                  {task.status === 'done' ? (
                    <CheckCircle2 className="w-4 h-4 opacity-50" />
                  ) : (
                    <Circle className="w-4 h-4 group-hover:scale-110 transition-transform opacity-30" />
                  )}
                </div>
                <span className={`text-[11px] font-black tracking-terminal uppercase ${task.status === 'done' ? 'line-through' : 'text-vault-amber vault-glow-text'}`}>
                  {task.title}
                </span>
                <div className="ml-auto flex items-center gap-3">
                  {task.priority && task.priority > 2 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                  )}
                  <button 
                    onClick={(e) => handleDelete(e, task.id)}
                    className="p-1 text-vault-amber/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </WidgetContainer>
  );
};
