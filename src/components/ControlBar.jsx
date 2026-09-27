import React from 'react';
import {
  Play, Pause, SkipForward, RotateCcw, Volume2, Mic, MicOff,
  Sliders, Music2, Youtube, FolderPlus, Disc
} from 'lucide-react';

export default function ControlBar({
  isPlaying,
  onTogglePlay,
  onSkipNext,
  onRestartSong,
  keyShift,
  onChangeKey,
  tempoRate,
  onChangeTempo,
  vocalMode,
  onChangeVocalMode,
  volume,
  onChangeVolume,
  onOpenYouTubeModal,
  onOpenSoundFontModal,
  onOpenLibraryModal,
}) {
  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
      
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRestartSong}
          title="เริ่มเพลงใหม่"
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={onTogglePlay}
          className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold shadow-lg shadow-cyan-500/25 transition scale-105 active:scale-95"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
        </button>

        <button
          onClick={onSkipNext}
          title="ข้ามเพลงถัดไป"
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Realtime Key / Pitch Control */}
      <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
        <span className="text-xs font-bold text-slate-400 font-mono">KEY:</span>
        <button
          onClick={() => onChangeKey(keyShift - 1)}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold rounded text-xs font-mono"
        >
          b
        </button>
        <span className="w-8 text-center font-mono font-bold text-cyan-300 text-sm">
          {keyShift > 0 ? `+${keyShift}` : keyShift}
        </span>
        <button
          onClick={() => onChangeKey(keyShift + 1)}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold rounded text-xs font-mono"
        >
          #
        </button>
      </div>

      {/* Tempo Speed Control */}
      <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
        <span className="text-xs font-bold text-slate-400 font-mono">TEMPO:</span>
        <button
          onClick={() => onChangeTempo(Math.max(0.5, tempoRate - 0.05))}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded text-xs"
        >
          -
        </button>
        <span className="w-12 text-center font-mono font-bold text-amber-300 text-xs">
          {Math.round(tempoRate * 100)}%
        </span>
        <button
          onClick={() => onChangeTempo(Math.min(1.5, tempoRate + 0.05))}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded text-xs"
        >
          +
        </button>
      </div>

      {/* Vocal Switch L/R */}
      <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => onChangeVocalMode('STEREO')}
          className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
            vocalMode === 'STEREO'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          เสียงร้อง
        </button>
        <button
          onClick={() => onChangeVocalMode('MUSIC_ONLY')}
          className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
            vocalMode === 'MUSIC_ONLY'
              ? 'bg-cyan-500 text-black font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ตัดเสียง
        </button>
      </div>

      {/* Feature Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenYouTubeModal) onOpenYouTubeModal();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 text-xs font-bold transition cursor-pointer active:scale-95"
        >
          <Youtube className="w-4 h-4" />
          <span className="hidden sm:inline">YouTube</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenSoundFontModal) onOpenSoundFontModal();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 text-xs font-bold transition cursor-pointer active:scale-95"
        >
          <Disc className="w-4 h-4" />
          <span className="hidden sm:inline">SoundFont</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenLibraryModal) onOpenLibraryModal();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 text-xs font-bold transition cursor-pointer active:scale-95"
        >
          <FolderPlus className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">คลังเพลง</span>
        </button>
      </div>

      {/* Volume Slider */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <Volume2 className="w-4 h-4 text-slate-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

    </div>
  );
}
