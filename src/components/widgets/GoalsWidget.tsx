import React, { useState } from 'react';
import { useGoals } from '../../hooks/useGoals';
import { Target, Plus, Loader2, Calendar, ChevronRight } from 'lucide-react';

export const GoalsWidget: React.FC = () => {
  const { goals, isLoading, createGoal, updateGoal } = useGoals();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createGoal.mutate({ title, description: '', target_date: new Date().toISOString() });
    setTitle('');
    setIsAdding(false);
  };

  const incrementProgress = (id: string, current: number) => {
    const next = Math.min(current + 10, 100);
    updateGoal.mutate({ id, updates: { progress: next, status: next === 100 ? 'completed' : 'active' } });
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-vault-amber mb-2 tracking-tighter uppercase vault-glow-text">A - Ambitions (Strategic Objectives)</h2>
          <p className="text-vault-amber-secondary italic">"Track tactical trajectories and reach long-term milestones."</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-3 bg-batcave-blue/10 text-batcave-blue rounded-2xl hover:bg-batcave-blue hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleAdd} className="glass-panel p-6 rounded-3xl mb-8 animate-fade-in border-batcave-blue/30">
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Define strategic objective..."
            className="w-full bg-transparent border-none text-xl font-bold text-white placeholder:text-gray-700 outline-none mb-4"
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">CANCEL</button>
            <button type="submit" className="px-6 py-2 bg-batcave-blue text-white text-xs font-bold rounded-xl shadow-[0_0_10px_#3b82f6]">INITIALIZE</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-batcave-blue" />
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl border-dashed border-white/5">
            <Target className="w-10 h-10 text-gray-800 mx-auto mb-4" />
            <p className="text-batcave-text-secondary text-sm">No strategic objectives defined.</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div 
              key={goal.id} 
              onClick={() => incrementProgress(goal.id, goal.progress)}
              className="glass-panel p-6 rounded-3xl group hover:border-batcave-blue/30 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h3 className={`text-lg font-bold transition-all ${goal.status === 'completed' ? 'text-green-500' : 'text-white'}`}>
                    {goal.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-batcave-text-secondary font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(goal.target_date).toLocaleDateString()}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${goal.status === 'completed' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-batcave-blue shadow-[0_0_8px_#3b82f6]'}`} />
                    <span>{goal.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white/10 group-hover:text-batcave-blue/20 transition-colors">
                    {goal.progress}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                <div 
                  className={`h-full transition-all duration-700 ease-out shadow-[0_0_10px_currentColor] ${
                    goal.status === 'completed' ? 'bg-green-500 text-green-500' : 'bg-batcave-blue text-batcave-blue'
                  }`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>

              <ChevronRight className="absolute right-4 bottom-4 w-4 h-4 text-white/5 group-hover:text-white/20 transition-all group-hover:translate-x-1" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
