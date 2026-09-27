import React, { useState } from 'react';
import { Search, FolderOpen, Play, ListPlus, Music, RefreshCw, X, Upload, CheckCircle2, FileMusic, Loader2, Eye, EyeOff } from 'lucide-react';

export default function SongLibrary({
  isOpen,
  onClose,
  songs,
  onPlayNow,
  onQueueEnd,
  onScanFolder,
  onUploadFiles,
}) {
  const [activeFormat, setActiveFormat] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [folderInput, setFolderInput] = useState('');
  const [isTransparent, setIsTransparent] = useState(false);
  
  // Progress states
  const [scanning, setScanning] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [scannedCount, setScannedCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const formats = ['ALL', 'NCN', 'KAR', 'KMID', 'EMK', 'RMS', 'MP4', 'YOUTUBE'];

  const filtered = songs.filter(s => {
    const matchesFormat = activeFormat === 'ALL' || s.type.toUpperCase() === activeFormat;
    const matchesQuery = !searchQuery ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFormat && matchesQuery;
  });

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!folderInput) return;

    setScanning(true);
    setProgressPercent(5);
    setStatusMessage(`กำลังเชื่อมต่อโฟลเดอร์ ${folderInput}...`);
    setScannedCount(0);

    // Simulate progressive scanning feedback
    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        const next = prev + Math.floor(Math.random() * 15) + 5;
        const simulatedFound = Math.floor((next / 100) * 120);
        setScannedCount(simulatedFound);
        setStatusMessage(`กำลังสแกนหาไฟล์เพลง NCN, KAR, EMK, RMS, MP4... (พบ ${simulatedFound} เพลง)`);
        return next;
      });
    }, 250);

    try {
      await onScanFolder(folderInput);
      clearInterval(interval);
      setProgressPercent(100);
      setStatusMessage(`สแกนไฟล์เพลงเสร็จสมบูรณ์!`);
      setTimeout(() => {
        setScanning(false);
        setProgressPercent(0);
        setStatusMessage('');
      }, 2000);
    } catch (err) {
      clearInterval(interval);
      setScanning(false);
      setProgressPercent(0);
      setStatusMessage(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;

    setScanning(true);
    setProgressPercent(10);
    setStatusMessage(`กำลังประมวลผลการอัปโหลด ${files.length} ไฟล์...`);

    let current = 0;
    const total = files.length;

    const fileInterval = setInterval(() => {
      current += 1;
      const pct = Math.round((current / total) * 100);
      setProgressPercent(pct);
      setStatusMessage(`กำลังอัปโหลดและสกัดไฟล์เพลง (${current}/${total} ไฟล์)... ${pct}%`);

      if (current >= total) {
        clearInterval(fileInterval);
        if (onUploadFiles) onUploadFiles(files);
        setStatusMessage(`อัปโหลดไฟล์เพลง ${total} ไฟล์เข้าระบบเรียบร้อยแล้ว!`);
        setTimeout(() => {
          setScanning(false);
          setProgressPercent(0);
          setStatusMessage('');
        }, 2000);
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 md:pr-6 bg-black/20 backdrop-blur-none pointer-events-auto">
      <div className={`w-full max-w-xl md:max-w-2xl bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] backdrop-blur-xl transition-all duration-300 ${isTransparent ? 'opacity-35 hover:opacity-100' : 'opacity-100'}`}>
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-cyan-400" />
            <h2 className="text-lg md:text-xl font-bold text-white">คลังเพลงคาราโอเกะ (Song Library)</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsTransparent(!isTransparent)}
              title={isTransparent ? "ปิดโหมดโปร่งใส" : "เปิดโหมดโปร่งใส (ดูวิดีโอด้านหลัง)"}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 border transition ${
                isTransparent
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {isTransparent ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-cyan-400" />}
              <span className="hidden sm:inline">{isTransparent ? 'ทึบแสง' : 'โปร่งใส'}</span>
            </button>

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Folder Scan & Upload Section */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 space-y-3">
          <form onSubmit={handleScanSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <FolderOpen className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                placeholder="ระบุ Path โฟลเดอร์เพลงในเครื่อง (เช่น D:\คาราโอเกะ\eXtreme Karaoke\Songs)..."
                value={folderInput}
                onChange={(e) => setFolderInput(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={scanning}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm rounded-xl flex items-center gap-2 transition disabled:opacity-50 shrink-0 shadow-lg shadow-cyan-500/20"
            >
              {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              สแกนเพลงในเครื่อง
            </button>
          </form>

          {/* Drag & Drop File Upload Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleFileSelect(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-xl p-3 text-center transition flex items-center justify-center gap-3 cursor-pointer ${
              isDragOver
                ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 text-slate-400'
            }`}
          >
            <Upload className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold">
              หรือลากไฟล์เพลง (NCN, KAR, KMID, EMK, RMS, MP4) มาวางตรงนี้ หรือ{' '}
              <label className="text-cyan-400 hover:underline cursor-pointer">
                คลิกเลือกไฟล์เพื่ออัปโหลด
                <input
                  type="file"
                  multiple
                  accept=".mid,.kar,.kmid,.emk,.rms,.mp4,.mkv,.avi,.lyr,.txt,.cur,.zip"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </label>
            </span>
          </div>

          {/* Progress Bar Display Container */}
          {scanning && (
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-cyan-300 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  {statusMessage}
                </span>
                <span className="text-cyan-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300 shadow-[0_0_12px_rgba(0,240,255,0.8)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Format Filter Bar */}
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {formats.map(fmt => (
            <button
              key={fmt}
              onClick={() => setActiveFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition shrink-0 ${
                activeFormat === fmt
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {fmt}
            </button>
          ))}
          
          <div className="ml-auto relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อเพลง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Songs Grid / Table */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.map(song => (
            <div
              key={song.id}
              className="p-3 bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-xl flex items-center justify-between transition"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-800 text-cyan-400 rounded">
                  {song.code}
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm">{song.title}</h4>
                  <p className="text-xs text-slate-400">{song.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {song.type}
                </span>
                <button
                  onClick={() => { onPlayNow(song); onClose(); }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold text-xs flex items-center gap-1 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  เล่น
                </button>
                <button
                  onClick={() => onQueueEnd(song)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs flex items-center gap-1 transition"
                >
                  <ListPlus className="w-3.5 h-3.5" />
                  เข้าคิว
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
