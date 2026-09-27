import React, { useEffect, useRef, useState } from 'react';
import { Search, X, Play, ListPlus, Youtube, Sparkles } from 'lucide-react';

export default function QuickSearchModal({
  isOpen,
  initialQuery,
  onClose,
  songs,
  onPlayNow,
  onQueueNext,
  onQueueEnd,
  onOpenYouTubeSearch,
}) {
  const [query, setQuery] = useState(initialQuery || '');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(initialQuery || '');
    setSelectedIndex(0);
  }, [initialQuery, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredSongs = songs.filter(s =>
    s.code.toLowerCase().includes(query.toLowerCase()) ||
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase()) ||
    s.type.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const totalItems = filteredSongs.length + (query.trim() ? 1 : 0);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, totalItems));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + totalItems) % Math.max(1, totalItems));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < filteredSongs.length) {
        const song = filteredSongs[selectedIndex];
        if (e.shiftKey) {
          onQueueNext(song);
        } else {
          onPlayNow(song);
        }
        onClose();
      } else if (query.trim()) {
        // Trigger YouTube Search
        onOpenYouTubeSearch(query);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const getFormatBadgeColor = (type) => {
    switch (type) {
      case 'NCN': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'KAR': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'KMID': return 'bg-teal-500/20 text-teal-400 border-teal-500/40';
      case 'EMK': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'RMS': return 'bg-pink-500/20 text-pink-400 border-pink-500/40';
      case 'MP4': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'YOUTUBE': return 'bg-red-500/20 text-red-400 border-red-500/40';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header Search Input (eXtreme Karaoke Overlay Input) */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-6 h-6 text-cyan-400 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-xl md:text-2xl font-bold text-white placeholder-slate-500 focus:outline-none font-mono tracking-wide"
            placeholder="พิมพ์รหัส 5 หลัก หรือชื่อเพลง (เช่น แพ้ใจ)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredSongs.map((song, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={song.id}
                onClick={() => {
                  onPlayNow(song);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/50 scale-[1.01]'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-extrabold text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-md border border-cyan-800/50">
                    {song.code}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-base md:text-lg">{song.title}</h4>
                    <p className="text-xs text-slate-400">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${getFormatBadgeColor(song.type)}`}>
                    {song.type}
                  </span>

                  <button
                    title="เล่นทันที (Enter)"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayNow(song);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black transition"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    title="แทรกคิวถัดไป (Shift+Enter)"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQueueNext(song);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black transition"
                  >
                    <ListPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* YouTube Search Direct Action Button */}
          {query.trim() && (
            <div
              onClick={() => {
                onOpenYouTubeSearch(query);
                onClose();
              }}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                selectedIndex === filteredSongs.length
                  ? 'bg-red-950/80 border-red-500 shadow-lg shadow-red-950/50 scale-[1.01]'
                  : 'bg-red-950/30 border-red-900/50 hover:bg-red-900/40 text-red-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-600/20 text-red-400">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">ค้นหาเพลง "{query}" บน YouTube</h4>
                  <p className="text-xs text-red-300">ค้นหาวิดีโอคาราโอเกะสดออนไลน์บน YouTube</p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center gap-1">
                <Youtube className="w-4 h-4" /> ค้นหาทันที
              </span>
            </div>
          )}
        </div>

        {/* Footer Keyboard Guide */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">↑↓</kbd> เลือก</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">Enter</kbd> เล่น/ค้นหา YouTube</span>
          </div>
          <div>Poapoa eXtreme QuickSearch</div>
        </div>

      </div>
    </div>
  );
}
