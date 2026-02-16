import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { Plus, Loader2 } from 'lucide-react';

export const QuickAdd: React.FC = () => {
  const { createTask } = useTasks();
  const [quickTask, setQuickTask] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTask.trim()) return;
    createTask.mutate({ title: quickTask, priority: 1, category: 'General' });
    setQuickTask('');
  };

  return (
    <form onSubmit={handleQuickAdd} className="w-full md:w-96 relative group">
      <input
        type="text"
        value={quickTask}
        onChange={(e) => setQuickTask(e.target.value)}
        placeholder="Initialize new objective..."
        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 pr-12 text-sm focus:outline-none focus:border-batcave-blue focus:ring-4 focus:ring-batcave-blue/10 transition-all placeholder:text-gray-700"
      />
      <button 
        type="submit" 
        className="absolute right-3 top-2.5 p-1.5 bg-batcave-blue/20 text-batcave-blue rounded-xl hover:bg-batcave-blue hover:text-white transition-all"
        disabled={createTask.isPending}
      >
        {createTask.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
      </button>
    </form>
  );
};
