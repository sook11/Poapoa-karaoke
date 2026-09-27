import React from 'react';
import { ListMusic, SkipForward, Trash2, ArrowUp, ArrowDown, Play, Sparkles } from 'lucide-react';

export default function PlaylistQueue({
  queue,
  currentSong,
  onSkipNext,
  onRemoveFromQueue,
  onMoveQueue,
  onPlaySongFromQueue,
  onClearQueue,
}) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-xl">
      
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-base">คิวเพลง (Song Queue)</h3>
          <span className="bg-cyan-950 text-cyan-400 text-xs font-mono px-2 py-0.5 rounded-full border border-cyan-800">
            {queue.length} เพลง
          </span>
        </div>
        {queue.length > 0 && (
          <button
            onClick={onClearQueue}
            className="text-xs text-rose-400 hover:text-rose-300 transition hover:underline"
          >
            ล้างคิวทั้งหมด
          </button>
        )}
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[160px] max-h-[320px]">
        {queue.length > 0 ? (
          queue.map((song, index) => {
            const isPlaying = currentSong?.id === song.id;
            return (
              <div
                key={`${song.id}-${index}`}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                  isPlaying
                    ? 'bg-cyan-950/40 border-cyan-500/80 text-white'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span className="font-mono text-slate-500 w-4 font-bold text-center">
                    {index + 1}
                  </span>
                  <span className="font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px]">
                    {song.code}
                  </span>
                  <div className="truncate">
                    <p className="font-bold truncate text-slate-200">{song.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    title="เลื่อนขึ้น"
                    disabled={index === 0}
                    onClick={() => onMoveQueue(index, index - 1)}
                    className="p-1 rounded hover:bg-slate-700 text-slate-400 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="เลื่อนลง"
                    disabled={index === queue.length - 1}
                    onClick={() => onMoveQueue(index, index + 1)}
                    className="p-1 rounded hover:bg-slate-700 text-slate-400 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="เล่นทันที"
                    onClick={() => onPlaySongFromQueue(index)}
                    className="p-1 rounded hover:bg-cyan-500/20 text-cyan-400"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    title="ลบออกจากคิว"
                    onClick={() => onRemoveFromQueue(index)}
                    className="p-1 rounded hover:bg-rose-500/20 text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Sparkles className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-xs font-semibold">ยังไม่มีเพลงในคิว</p>
            <p className="text-[11px] text-slate-600 mt-1">กดพิมพ์ชื่อเพลง หรือเปิดคลังเพลงเพื่อเพิ่มเพลงลงคิว</p>
          </div>
        )}
      </div>

    </div>
  );
}
