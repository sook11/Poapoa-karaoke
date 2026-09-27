import React, { useState } from 'react';
import { Disc, Upload, Check, X } from 'lucide-react';
import { midiSynthesizer } from '../services/midiSynthesizer';

export default function SoundfontManager({ isOpen, onClose, currentSF2, onSelectSF2 }) {
  const [soundfonts, setSoundfonts] = useState([
    { name: 'General MIDI (Built-in WebAudio)', size: 'Standard Synth', active: true },
    { name: 'eXtreme Karaoke Pro SoundFont v3.sf2', size: '128 MB HQ', active: false },
    { name: 'Roland Sound Canvas SC-55.sf2', size: '64 MB Classic', active: false },
    { name: 'Yamaha XG Live Karaoke.sf2', size: '96 MB Studio', active: false },
  ]);

  if (!isOpen) return null;

  const handleChooseSF = (sf) => {
    midiSynthesizer.loadSoundFont(sf.name);
    onSelectSF2(sf.name);
    setSoundfonts(prev => prev.map(item => ({
      ...item,
      active: item.name === sf.name
    })));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newSF = { name: file.name, size: `${Math.round(file.size / 1024 / 1024)} MB Custom`, active: true };
      setSoundfonts(prev => [newSF, ...prev.map(i => ({ ...i, active: false }))]);
      midiSynthesizer.loadSoundFont(file.name);
      onSelectSF2(file.name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="p-4 bg-purple-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Disc className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white"> SoundFont Manager (.SF2)</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-400">
            เลือก SoundFont สำหรับประมวลผลดนตรี NCN, KAR, KMID และ EMK เพื่อปรับปรุงคุณภาพเสียงเครื่องดนตรี MIDI ให้สมจริง
          </p>

          <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-purple-500/40 rounded-xl bg-purple-950/20 hover:bg-purple-900/30 cursor-pointer transition">
            <Upload className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-bold text-purple-300">อัปโหลดไฟล์ .SF2 จากเครื่อง</span>
            <input type="file" accept=".sf2" className="hidden" onChange={handleFileUpload} />
          </label>

          <div className="space-y-2 mt-4">
            {soundfonts.map((sf) => (
              <div
                key={sf.name}
                onClick={() => handleChooseSF(sf)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  sf.name === currentSF2 || sf.active
                    ? 'bg-purple-950/60 border-purple-500 text-white font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Disc className={`w-5 h-5 ${sf.active ? 'text-purple-400' : 'text-slate-500'}`} />
                  <div>
                    <p className="text-sm font-semibold">{sf.name}</p>
                    <p className="text-[11px] text-slate-400">{sf.size}</p>
                  </div>
                </div>

                {(sf.name === currentSF2 || sf.active) && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500 text-black text-xs font-bold">
                    <Check className="w-3.5 h-3.5" /> ใช้งานอยู่
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
