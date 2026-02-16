import React, { useEffect, useState } from 'react';
import { useJournal } from '../../hooks/useJournal';
import { Loader2, CloudCheck, CloudUpload, Smile, ShieldAlert, Lock } from 'lucide-react';

export const JournalWidget: React.FC = () => {
  const { todayEntry, isLoading, updateEntry } = useJournal();
  const [content, setContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasConsent, setHasConsent] = useState(() => localStorage.getItem('journal-consent') === 'true');

  // Sync local state when data loads
  useEffect(() => {
    if (todayEntry) {
      setContent(todayEntry.content || '');
    }
  }, [todayEntry]);

  // Debounce Auto-save
  useEffect(() => {
    if (!todayEntry || content === todayEntry.content || !hasConsent) return;

    setIsTyping(true);
    const timeoutId = setTimeout(() => {
      updateEntry.mutate({ id: todayEntry.id, updates: { content } });
      setIsTyping(false);
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timeoutId);
  }, [content, todayEntry, updateEntry, hasConsent]);

  const handleConsent = () => {
    setHasConsent(true);
    localStorage.setItem('journal-consent', 'true');
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-batcave-blue" />
    </div>
  );

  if (!hasConsent) {
    return (
      <div className="animate-fade-in max-w-xl mx-auto h-full flex items-center justify-center">
        <div className="glass-panel p-10 rounded-3xl text-center border border-batcave-blue/20">
          <div className="w-16 h-16 bg-batcave-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-batcave-blue" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Privacy & Data Security</h2>
          <p className="text-batcave-text-secondary text-sm mb-6 leading-relaxed">
            Your journal is stored in your private encrypted vault. However, please note:
          </p>
          <div className="bg-white/5 p-4 rounded-2xl text-left mb-8 space-y-3">
            <div className="flex gap-3 text-xs text-gray-400">
              <ShieldAlert className="w-4 h-4 text-orange-500 shrink-0" />
              <span>This is not a medical device. Do not store sensitive health or medical information here.</span>
            </div>
            <div className="flex gap-3 text-xs text-gray-400">
              <Lock className="w-4 h-4 text-batcave-blue shrink-0" />
              <span>Data is encrypted at rest but accessible to your authenticated session.</span>
            </div>
          </div>
          <button 
            onClick={handleConsent}
            className="w-full py-4 bg-batcave-blue text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            I Understand, Initialize Journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Daily Journal</h2>
          <p className="text-batcave-text-secondary">Document your journey and reflect on today's progress.</p>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
          {updateEntry.isPending || isTyping ? (
            <span className="text-batcave-blue flex items-center gap-2">
              <CloudUpload className="w-3 h-3" /> Encrypting & Saving...
            </span>
          ) : (
            <span className="text-green-500/50 flex items-center gap-2">
              <CloudCheck className="w-3 h-3" /> Securely Stored
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 glass-panel rounded-3xl p-8 flex flex-col relative overflow-hidden group">
        {/* Mood Slider Placeholder */}
        <div className="mb-6 flex items-center gap-4">
          <Smile className="w-5 h-5 text-batcave-blue" />
          <input 
            type="range" 
            min="1" 
            max="10" 
            defaultValue="5"
            className="w-48 accent-batcave-blue bg-white/5 rounded-full h-1"
          />
          <span className="text-[10px] text-batcave-text-secondary font-bold uppercase">Mood Index</span>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind, Bruce?"
          className="flex-1 bg-transparent border-none outline-none resize-none text-gray-200 leading-relaxed placeholder:text-gray-700 custom-scrollbar"
        />

        {/* Decorative corner element */}
        <div className="absolute bottom-4 right-4 text-[8px] text-white/5 font-mono uppercase tracking-[0.5em] select-none pointer-events-none">
          Encrypted-Session-Alpha-9
        </div>
      </div>
      <p className="mt-4 text-[9px] text-gray-600 text-center uppercase tracking-widest">
        Disclaimer: Not a medical tool. Use for personal productivity tracking only.
      </p>
    </div>
  );
};
