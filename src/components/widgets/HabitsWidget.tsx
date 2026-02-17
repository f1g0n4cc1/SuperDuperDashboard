import React, { useState } from 'react';
import { useHabits } from '../../hooks/useHabits';
import { Activity, Plus, Loader2, Check } from 'lucide-react';

export const HabitsWidget: React.FC = () => {
  const { habits, isLoading, toggleHabit, createHabit } = useHabits();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createHabit.mutate({ name, color: '#3b82f6', frequency: 'daily' });
    setName('');
    setIsAdding(false);
  };

  const getDayGrid = () => {
    const days = [];
    const date = new Date();
    date.setDate(date.getDate() - 20); // Last 21 days for the grid

    for (let i = 0; i < 21; i++) {
      days.push(new Date(date).toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const dayGrid = getDayGrid();

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-vault-amber mb-2 tracking-tighter uppercase vault-glow-text">C - Checklists (Behavioral Patterns)</h2>
          <p className="text-vault-amber-secondary italic">"Consistency is mandatory. Excellence is a repeatable habit."</p>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Define behavioral pattern..."
            className="w-full bg-transparent border-none text-xl font-bold text-white placeholder:text-gray-700 outline-none mb-4"
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">CANCEL</button>
            <button type="submit" className="px-6 py-2 bg-batcave-blue text-white text-xs font-bold rounded-xl shadow-[0_0_10px_#3b82f6]">INITIALIZE</button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-batcave-blue" />
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl border-dashed border-white/5">
            <Activity className="w-10 h-10 text-gray-800 mx-auto mb-4" />
            <p className="text-batcave-text-secondary text-sm">No behavioral patterns monitored.</p>
          </div>
        ) : (
          habits.map((habit) => {
            const isCompletedToday = habit.logs.some(l => l.completed_at === today);
            
            return (
              <div key={habit.id} className="glass-panel p-6 rounded-3xl group">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleHabit.mutate({ habitId: habit.id, completedAt: today, isCompleted: isCompletedToday })}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                        isCompletedToday 
                          ? 'bg-batcave-blue border-batcave-blue text-white shadow-[0_0_15px_#3b82f6]' 
                          : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                      }`}
                    >
                      {isCompletedToday ? <Check className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                    </button>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-batcave-blue transition-colors">{habit.name}</h3>
                      <p className="text-[10px] text-batcave-text-secondary font-bold uppercase tracking-widest mt-0.5">Daily Consistency</p>
                    </div>
                  </div>
                  
                  {/* Habit Grid (GitHub Style) */}
                  <div className="flex gap-1">
                    {dayGrid.map(day => {
                      const isDone = habit.logs.some(l => l.completed_at === day);
                      return (
                        <div 
                          key={day}
                          title={day}
                          className={`w-3 h-3 rounded-sm transition-all duration-500 ${
                            isDone 
                              ? 'bg-batcave-blue shadow-[0_0_5px_rgba(59,130,246,0.5)]' 
                              : 'bg-white/5'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
