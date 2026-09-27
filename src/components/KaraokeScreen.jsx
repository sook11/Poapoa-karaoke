import React, { useEffect, useState } from 'react';
import { Play, Pause, Music, Eye, EyeOff, Sparkles, Volume2 } from 'lucide-react';
import { getCurrentLyricState } from '../services/lyricSynchronizer';

export default function KaraokeScreen({
  currentSong,
  isPlaying,
  currentTime,
  keyShift,
  tempoRate,
  vocalMode,
  soundfontName,
  audioUnlocked,
  onUnlockAudio,
  onSkipNext,
  onTogglePlay,
}) {
  const [lyricState, setLyricState] = useState({ line1: null, line2: null, activeSyllableIndex: -1, progress: 0 });
  const [showOverlay, setShowOverlay] = useState(true);

  // Reset lyrics state whenever currentSong changes
  useEffect(() => {
    setLyricState({ line1: null, line2: null, activeSyllableIndex: -1, progress: 0 });
  }, [currentSong?.id]);

  // Update synchronized lyrics
  useEffect(() => {
    if (currentSong && currentSong.lyrics && currentSong.lyrics.length > 0 && currentSong.type !== 'YOUTUBE') {
      const state = getCurrentLyricState(currentSong.lyrics, currentTime);
      setLyricState(state);
    } else {
      setLyricState({ line1: null, line2: null, activeSyllableIndex: -1, progress: 0 });
    }
  }, [currentSong, currentTime]);

  const formatBadgeColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'NCN': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'KAR': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'KMID': return 'bg-teal-500/20 text-teal-400 border-teal-500/50';
      case 'EMK': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'RMS': return 'bg-pink-500/20 text-pink-400 border-pink-500/50';
      case 'MP4': return 'bg-rose-500/20 text-rose-400 border-rose-500/50';
      case 'YOUTUBE': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isYouTube = currentSong?.type === 'YOUTUBE';
  
  const getTotalDurationSeconds = () => {
    if (!currentSong) return 180;
    if (isYouTube) {
      if (typeof currentSong.durationSeconds === 'number') return currentSong.durationSeconds;
      if (typeof currentSong.duration === 'string') {
        const parts = currentSong.duration.split(':').map(p => parseInt(p, 10));
        if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
      }
      return 300; // 5 mins default for YouTube
    }
    const lastLyric = currentSong.lyrics?.[currentSong.lyrics.length - 1];
    if (lastLyric?.startTime) {
      return Math.ceil(lastLyric.startTime + (lastLyric.duration || 4) + 8);
    }
    return 240; // 4 mins default for audio/video without lyrics
  };

  const totalDuration = getTotalDurationSeconds();
  const progressPercent = Math.min(100, (currentTime / totalDuration) * 100);

  // Title banner shows for first 4 seconds of playback or when paused at start
  const showIntroTitle = currentTime < 4 || !isPlaying;

  return (
    <div
      onClick={() => {
        if (onUnlockAudio) onUnlockAudio();
        if (!isPlaying) onTogglePlay();
      }}
      className="relative w-full h-[68vh] rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex flex-col justify-between p-6 cursor-pointer group select-none"
    >
      
      {/* Background Visualizer / Video */}
      {isYouTube && currentSong?.youtubeId ? (
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <iframe
            className="w-full h-full border-0"
            src={`https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1&mute=0&controls=1&rel=0&enablejsapi=1&origin=https://www.youtube.com`}
            title={currentSong.title || "YouTube Karaoke"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : currentSong?.type === 'MP4' && currentSong?.videoUrl ? (
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
          src={currentSong.videoUrl}
          autoPlay
          loop
          muted
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.15),transparent_70%)] animate-pulse-glow" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        </div>
      )}

      {/* Dark Overlay gradient for lyric readability */}
      {!isYouTube && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/75 z-10 pointer-events-none" />
      )}

      {/* Top Header Bar Info */}
      <div className="relative z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-xs font-bold rounded-full border backdrop-blur-md ${formatBadgeColor(currentSong?.type)}`}>
            {currentSong?.type || 'READY'}
          </span>
          {currentSong && (
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800/80 text-cyan-300 border border-slate-700">
              CODE: {currentSong.code}
            </span>
          )}
        </div>

        {/* Live Audio Parameters & Toggle Overlay Button */}
        <div className="flex items-center gap-3">
          {!audioUnlocked && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onUnlockAudio) onUnlockAudio();
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold animate-pulse hover:bg-amber-500 hover:text-black transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>แตะเปิดเสียงออกลำโพง</span>
            </button>
          )}

          <div className="flex items-center gap-4 text-xs font-mono bg-slate-900/80 backdrop-blur-md border border-slate-800 px-4 py-1.5 rounded-full text-slate-300">
            <div>KEY: <span className={keyShift !== 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{keyShift > 0 ? `+${keyShift}` : keyShift}</span></div>
            <div className="h-3 w-[1px] bg-slate-700" />
            <div>TEMPO: <span className="text-cyan-400">{Math.round(tempoRate * 100)}%</span></div>
            <div className="h-3 w-[1px] bg-slate-700" />
            <div>VOCAL: <span className="text-rose-400">{vocalMode}</span></div>
            <div className="h-3 w-[1px] bg-slate-700" />
            <div className="hidden md:block truncate max-w-[140px]">SF2: <span className="text-purple-300">{soundfontName}</span></div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOverlay(!showOverlay);
            }}
            title={showOverlay ? 'ซ่อนตัวหนังสือบนหน้าจอ' : 'แสดงตัวหนังสือบนหน้าจอ'}
            className="p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500 transition"
          >
            {showOverlay ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Middle Playing Song Details (Song Title Intro Banner) */}
      {showOverlay && (
        <div className="relative z-20 text-center my-auto px-4 pointer-events-none">
          {currentSong ? (
            <div className={`transition-all duration-700 ${showIntroTitle ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="inline-block bg-slate-950/85 backdrop-blur-md border border-slate-800/80 px-6 py-4 rounded-2xl shadow-2xl">
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-2 text-shadow-glow">
                  {currentSong.title}
                </h1>
                <p className="text-sm md:text-base font-medium text-cyan-300/90 flex items-center justify-center gap-2">
                  <Music className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                  {currentSong.artist}
                </p>
                {!isPlaying && (
                  <p className="text-xs text-amber-400 font-bold mt-2 animate-pulse">
                    ▶ คลิกบนหน้าจอ หรือกดปุ่ม เล่น ด้านล่างเพื่อเริ่มเพลง
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12">
              <Sparkles className="w-16 h-16 text-cyan-400/40 mx-auto mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-slate-400">พร้อมใช้งาน - กดพิมพ์ตัวเลขรหัสเพลงบนคีย์บอร์ดเพื่อเลือกเพลง</h2>
              <p className="text-slate-500 text-sm mt-2">พิมพ์รหัส 5 หลัก (เช่น 00001) หรือชื่อเพลงเพื่อค้นหาด่วน (eXtreme Quick Search)</p>
            </div>
          )}
        </div>
      )}

      {/* Synchronized Karaoke Lyrics Overlay (NCN / KAR / KMID / EMK / RMS) */}
      {showOverlay && !isYouTube && (
        <div className="relative z-20 w-full min-h-[120px] flex flex-col items-center justify-center space-y-3 pb-4 pointer-events-none">
          {lyricState.line1 ? (
            <div className="w-full text-center">
              {/* Line 1 */}
              <div className="text-2xl md:text-4xl font-extrabold text-shadow-lyric tracking-wider flex justify-center flex-wrap gap-x-2">
                {lyricState.line1.syllables ? lyricState.line1.syllables.map((syl, idx) => {
                  const isActive = idx === lyricState.activeSyllableIndex;
                  const isPassed = idx < lyricState.activeSyllableIndex;
                  return (
                    <span
                      key={idx}
                      className={`transition-all duration-150 relative inline-block ${
                        isPassed
                          ? 'text-cyan-400 scale-105'
                          : isActive
                          ? 'text-gold scale-110 drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]'
                          : 'text-slate-200 opacity-90'
                      }`}
                    >
                      {syl.text}
                    </span>
                  );
                }) : (
                  <span className="text-cyan-300">{lyricState.line1.text}</span>
                )}
              </div>

              {/* Line 2 Preview */}
              {lyricState.line2 && (
                <div className="text-xl md:text-2xl font-semibold text-slate-400 opacity-75 mt-2 text-shadow-lyric">
                  {lyricState.line2.text}
                </div>
              )}
            </div>
          ) : (
            currentSong && isPlaying && (
              <div className="text-slate-400 text-base font-medium animate-pulse flex items-center gap-2">
                <Music className="w-4 h-4 text-cyan-400 animate-spin" />
                ♪ ดนตรีฮิต eXtreme Karaoke ♪
              </div>
            )
          )}
        </div>
      )}

      {/* Song Playback Progress Time Bar at Bottom */}
      <div className="relative z-20 w-full flex items-center gap-3 pt-2 border-t border-slate-800/80 font-mono text-xs text-slate-400 pointer-events-none">
        <span>{formatTime(currentTime)}</span>
        <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span>{formatTime(totalDuration)}</span>
      </div>

    </div>
  );
}
