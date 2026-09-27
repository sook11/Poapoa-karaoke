import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import KaraokeScreen from './components/KaraokeScreen';
import QuickSearchModal from './components/QuickSearchModal';
import PlaylistQueue from './components/PlaylistQueue';
import ControlBar from './components/ControlBar';
import SongLibrary from './components/SongLibrary';
import YouTubeModal from './components/YouTubeModal';
import SoundfontManager from './components/SoundfontManager';
import { audioEngine } from './services/audioEngine';
import { midiSynthesizer } from './services/midiSynthesizer';
import { Mic, Search, Volume2 } from 'lucide-react';

// Ensure API requests connect to local Express server
axios.defaults.baseURL = 'http://localhost:5000';

export default function App() {
  const [songs, setSongs] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Sound parameters
  const [keyShift, setKeyShift] = useState(0);
  const [tempoRate, setTempoRate] = useState(1.0);
  const [vocalMode, setVocalMode] = useState('STEREO');
  const [volume, setVolume] = useState(0.8);
  const [soundfontName, setSoundfontName] = useState('General MIDI (Built-in)');

  // Modals state
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [ytModalOpen, setYtModalOpen] = useState(false);
  const [ytQuery, setYtQuery] = useState('');
  const [sfModalOpen, setSfModalOpen] = useState(false);

  const timerRef = useRef(null);

  // Global Audio Context Unlock on User Interaction
  const unlockAudioContext = () => {
    audioEngine.init();
    midiSynthesizer.init();
    setAudioUnlocked(true);
  };

  useEffect(() => {
    window.addEventListener('click', unlockAudioContext);
    window.addEventListener('keydown', unlockAudioContext);
    return () => {
      window.removeEventListener('click', unlockAudioContext);
      window.removeEventListener('keydown', unlockAudioContext);
    };
  }, []);

  // Fetch song database on startup
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await axios.get('/api/songs');
      setSongs(res.data.songs || []);
      if (res.data.songs && res.data.songs.length > 0 && !currentSong) {
        setCurrentSong(res.data.songs[0]);
      }
    } catch (err) {
      console.error('Failed to load songs:', err);
    }
  };

  // eXtreme Karaoke Global Keyboard Typing Capture
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setQuickQuery(e.key);
        setQuickSearchOpen(true);
      } else if (e.key === 'F8') {
        e.preventDefault();
        handleSkipNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleTogglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [queue, isPlaying]);

  // Audio Playback Timer & Lyric Synchronizer Loop
  useEffect(() => {
    if (isPlaying) {
      unlockAudioContext();

      timerRef.current = setInterval(() => {
        // 1. Trigger Multi-Instrument MIDI Backing Music safely
        try {
          if (currentSong && currentSong.type !== 'YOUTUBE') {
            midiSynthesizer.playKaraokeBeat(keyShift, tempoRate);
          }
        } catch (err) {
          console.warn('Synthesizer beat tick error:', err);
        }

        // 2. Advance time safely
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + 0.1 * tempoRate;
          
          let targetDuration = 300; // Default 5 minutes
          if (currentSong?.type === 'YOUTUBE') {
            if (typeof currentSong.durationSeconds === 'number') {
              targetDuration = currentSong.durationSeconds + 5;
            } else if (typeof currentSong.duration === 'string') {
              const parts = currentSong.duration.split(':').map(p => parseInt(p, 10));
              if (parts.length === 2) targetDuration = (parts[0] || 0) * 60 + (parts[1] || 0) + 5;
              else targetDuration = 360;
            } else {
              targetDuration = 360; // 6 mins default for YouTube
            }
          } else {
            const lastLyric = currentSong?.lyrics?.[currentSong.lyrics.length - 1];
            if (lastLyric?.startTime) {
              targetDuration = lastLyric.startTime + (lastLyric.duration || 4) + 10;
            } else {
              targetDuration = 240; // 4 mins default for audio without lyrics
            }
          }

          if (nextTime >= targetDuration) {
            setTimeout(() => handleSkipNext(), 0);
            return 0;
          }
          return nextTime;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      midiSynthesizer.stopAll();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, tempoRate, currentSong, keyShift]);

  // Handlers
  const handlePlayNow = (song) => {
    setCurrentSong(song);
    setCurrentTime(0);
    setIsPlaying(true);
    unlockAudioContext();
  };

  const handleQueueNext = (song) => {
    setQueue((prev) => [song, ...prev]);
  };

  const handleQueueEnd = (song) => {
    setQueue((prev) => [...prev, song]);
  };

  const handleSkipNext = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setQueue((prev) => prev.slice(1));
      handlePlayNow(nextSong);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      midiSynthesizer.stopAll();
    }
  };

  const handleTogglePlay = () => {
    unlockAudioContext();
    setIsPlaying(!isPlaying);
  };

  const handleRestartSong = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    unlockAudioContext();
  };

  const handleScanFolder = async (folderPath) => {
    try {
      const res = await axios.post('/api/scan', { folderPath });
      fetchSongs();
    } catch (err) {
      console.error('Scan error:', err);
    }
  };

  const handleUploadFiles = (files) => {
    if (!files) return;
    const uploadedSongs = Array.from(files).map((file, index) => {
      const ext = file.name.split('.').pop().toUpperCase();
      let type = 'NCN';
      if (ext === 'KAR') type = 'KAR';
      else if (ext === 'KMID') type = 'KMID';
      else if (ext === 'EMK') type = 'EMK';
      else if (ext === 'RMS') type = 'RMS';
      else if (['MP4', 'MKV', 'AVI'].includes(ext)) type = 'MP4';

      const code = String(songs.length + index + 1).padStart(5, '0');
      return {
        id: `upload-${Date.now()}-${index}`,
        code,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: 'ไฟล์อัปโหลดสด',
        type,
        category: 'ไฟล์อัปโหลด',
        lyrics: [
          {
            lineIndex: 0,
            startTime: 2.0,
            text: `${file.name} (${type} Karaoke)`,
            syllables: [
              { text: file.name, duration: 2.0 },
              { text: `[${type}]`, duration: 1.0 }
            ]
          },
          {
            lineIndex: 1,
            startTime: 6.0,
            text: 'ยินดีต้อนรับสู่ระบบ eXtreme Karaoke',
            syllables: [
              { text: 'ยินดี', duration: 0.8 },
              { text: 'ต้อนรับ', duration: 0.8 },
              { text: 'สู่ระบบ', duration: 0.8 },
              { text: 'eXtreme', duration: 1.0 }
            ]
          }
        ]
      };
    });

    setSongs(prev => [...uploadedSongs, ...prev]);
  };

  const handleOpenYouTubeSearch = (searchQuery) => {
    setYtQuery(searchQuery);
    setYtModalOpen(true);
  };

  return (
    <div
      onClick={unlockAudioContext}
      className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 md:p-6 select-none font-karaoke"
    >
      
      {/* Top Main Navigation Bar */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20">
            <Mic className="w-6 h-6 text-black fill-black" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Poapoa <span className="text-cyan-400">eXtreme Karaoke</span>
            </h1>
            <p className="text-xs text-slate-400">รองรับ NCN, KAR, KMID, EMK, RMS, MP4 & YouTube Karaoke</p>
          </div>
        </div>

        {/* Search Trigger Button */}
        <button
          onClick={() => { setQuickQuery(''); setQuickSearchOpen(true); }}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-sm font-semibold flex items-center gap-2 text-cyan-300 transition shadow-md"
        >
          <Search className="w-4 h-4" />
          <span>ค้นหาเพลงด่วน (พิมพ์บนหน้าจอ)</span>
        </button>
      </header>

      {/* Main Karaoke View Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 my-4 flex-1">
        
        {/* Karaoke Lyrics & Screen (3 columns) */}
        <div className="lg:col-span-3 flex flex-col">
          <KaraokeScreen
            currentSong={currentSong}
            isPlaying={isPlaying}
            currentTime={currentTime}
            keyShift={keyShift}
            tempoRate={tempoRate}
            vocalMode={vocalMode}
            soundfontName={soundfontName}
            audioUnlocked={audioUnlocked}
            onUnlockAudio={unlockAudioContext}
            onSkipNext={handleSkipNext}
            onTogglePlay={handleTogglePlay}
          />
        </div>

        {/* Song Queue & Playlist Drawer (1 column) */}
        <div className="lg:col-span-1 flex flex-col h-[68vh]">
          <PlaylistQueue
            queue={queue}
            currentSong={currentSong}
            onSkipNext={handleSkipNext}
            onRemoveFromQueue={(idx) => setQueue(q => q.filter((_, i) => i !== idx))}
            onMoveQueue={(from, to) => {
              const updated = [...queue];
              const [moved] = updated.splice(from, 1);
              updated.splice(to, 0, moved);
              setQueue(updated);
            }}
            onPlaySongFromQueue={(idx) => {
              const song = queue[idx];
              setQueue(q => q.filter((_, i) => i !== idx));
              handlePlayNow(song);
            }}
            onClearQueue={() => setQueue([])}
          />
        </div>

      </main>

      {/* Bottom Control Bar */}
      <footer>
        <ControlBar
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onSkipNext={handleSkipNext}
          onRestartSong={handleRestartSong}
          keyShift={keyShift}
          onChangeKey={(k) => setKeyShift(audioEngine.setKeyPitch(k))}
          tempoRate={tempoRate}
          onChangeTempo={(t) => setTempoRate(audioEngine.setTempoRate(t))}
          vocalMode={vocalMode}
          onChangeVocalMode={(m) => setVocalMode(audioEngine.setVocalChannel(m))}
          volume={volume}
          onChangeVolume={(v) => {
            setVolume(v);
            audioEngine.setVolume(v);
            midiSynthesizer.setVolume(v);
          }}
          onOpenYouTubeModal={() => handleOpenYouTubeSearch('แพ้ใจ คาราโอเกะ')}
          onOpenSoundFontModal={() => setSfModalOpen(true)}
          onOpenLibraryModal={() => setLibraryOpen(true)}
        />
      </footer>

      {/* Popups & Modals */}
      <QuickSearchModal
        isOpen={quickSearchOpen}
        initialQuery={quickQuery}
        onClose={() => setQuickSearchOpen(false)}
        songs={songs}
        onPlayNow={handlePlayNow}
        onQueueNext={handleQueueNext}
        onQueueEnd={handleQueueEnd}
        onOpenYouTubeSearch={handleOpenYouTubeSearch}
      />

      <SongLibrary
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        songs={songs}
        onPlayNow={handlePlayNow}
        onQueueEnd={handleQueueEnd}
        onScanFolder={handleScanFolder}
        onUploadFiles={handleUploadFiles}
      />

      <YouTubeModal
        isOpen={ytModalOpen}
        initialQuery={ytQuery}
        onClose={() => setYtModalOpen(false)}
        onPlayNow={handlePlayNow}
        onQueueEnd={handleQueueEnd}
      />

      <SoundfontManager
        isOpen={sfModalOpen}
        onClose={() => setSfModalOpen(false)}
        currentSF2={soundfontName}
        onSelectSF2={(sf) => setSoundfontName(sf)}
      />

    </div>
  );
}
