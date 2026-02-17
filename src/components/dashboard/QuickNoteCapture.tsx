import React, { useState } from 'react';
import { useNotes } from '../../hooks/useNotes';
import { Loader2, Zap } from 'lucide-react';

export const QuickNoteCapture: React.FC = () => {
  const [note, setNote] = useState('');
  const { createNote } = useNotes();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    createNote.mutate({ 
      title: 'Quick Idea: ' + (note.length > 20 ? note.substring(0, 20) + '...' : note), 
      content: note, 
      tags: ['Quick Capture'] 
    });
    setNote('');
  };

  return (
    <div className="flex flex-col h-full py-2">
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Capture fleeting tactical thought..."
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-vault-amber outline-none focus:border-vault-amber/50 transition-all resize-none font-mono placeholder:text-white/10"
        />
        <button 
          type="submit"
          disabled={createNote.isPending}
          className="w-full py-3 bg-vault-amber/10 text-vault-amber text-[10px] font-black uppercase tracking-widest rounded-xl border border-vault-amber/20 hover:bg-vault-amber hover:text-black transition-all flex items-center justify-center gap-2"
        >
          {createNote.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Zap className="w-3 h-3" /> Authorize Briefing</>}
        </button>
      </form>
    </div>
  );
};
