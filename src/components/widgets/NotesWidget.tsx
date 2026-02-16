import React, { useState, useEffect } from 'react';
import { useNotes } from '../../hooks/useNotes';
import { FileText, Plus, Loader2, Search, Trash2, CloudCheck, CloudUpload } from 'lucide-react';
import type { Note } from '../../types/notes';

export const NotesWidget: React.FC = () => {
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [search, setSearch] = useState('');

  const currentNote = (notes as Note[]).find(n => n.id === selectedNoteId);

  // Sync local state when note selection changes
  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content || '');
      setTitle(currentNote.title || '');
    } else {
      setContent('');
      setTitle('');
    }
  }, [selectedNoteId, currentNote]);

  // Debounce Auto-save
  useEffect(() => {
    if (!currentNote || (content === currentNote.content && title === currentNote.title)) return;

    setIsTyping(true);
    const timeoutId = setTimeout(() => {
      updateNote.mutate({ id: currentNote.id, updates: { content, title } });
      setIsTyping(false);
    }, 2000); // 2s debounce

    return () => clearTimeout(timeoutId);
  }, [content, title, currentNote, updateNote]);

  const handleCreateNote = () => {
    createNote.mutate({ title: 'New Mission Briefing', content: '', tags: [] }, {
      onSuccess: (data) => setSelectedNoteId(data.id)
    });
  };

  const filteredNotes = (notes as Note[]).filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in max-w-6xl mx-auto h-[75vh] flex flex-col">
      <header className="mb-10 flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Knowledge Vault</h2>
          <p className="text-batcave-text-secondary italic">"Information is power. Secure your mission intelligence."</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
          {updateNote.isPending || isTyping ? (
            <span className="text-batcave-blue flex items-center gap-2">
              <CloudUpload className="w-3 h-3" /> Encrypting...
            </span>
          ) : (
            <span className="text-green-500/50 flex items-center gap-2">
              <CloudCheck className="w-3 h-3" /> Vault Secured
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Note List */}
        <div className="w-80 glass-panel rounded-3xl p-4 flex flex-col">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-600" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vault..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-batcave-blue transition-colors"
            />
          </div>

          <button 
            onClick={handleCreateNote}
            className="w-full flex items-center justify-center p-3 mb-4 rounded-xl border border-batcave-blue/20 bg-batcave-blue/5 text-batcave-blue hover:bg-batcave-blue hover:text-white transition-all text-xs font-bold gap-2"
          >
            <Plus className="w-4 h-4" /> INITIALIZE BRIEFING
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
            {isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-batcave-blue" /></div>
            ) : filteredNotes.map(note => (
              <button 
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`w-full flex flex-col p-4 rounded-2xl transition-all text-left group ${
                  selectedNoteId === note.id ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-bold text-sm truncate ${selectedNoteId === note.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                    {note.title}
                  </span>
                  <Trash2 
                    onClick={(e) => { e.stopPropagation(); deleteNote.mutate(note.id); }}
                    className="w-3 h-3 text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
                <p className="text-[10px] text-gray-600 truncate">{note.content || 'No content...'}</p>
                <span className="text-[8px] text-gray-800 mt-2 font-mono">{new Date(note.updated_at).toLocaleDateString()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note Editor */}
        <div className="flex-1 glass-panel rounded-3xl p-8 flex flex-col overflow-hidden relative">
          {selectedNoteId && currentNote ? (
            <>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border-none text-2xl font-bold text-white outline-none mb-6 w-full placeholder:text-gray-800"
                placeholder="Briefing Title..."
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin tactical documentation..."
                className="flex-1 bg-transparent border-none outline-none resize-none text-gray-200 leading-relaxed placeholder:text-gray-800 custom-scrollbar font-mono text-sm"
              />
              <div className="absolute bottom-4 right-8 text-[8px] text-white/5 font-mono uppercase tracking-[0.5em] select-none pointer-events-none">
                Data-Stream-Secure
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
              <FileText className="w-20 h-20 mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">Select a briefing from the vault</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
