import fs from 'fs';
import path from 'path';

/**
 * Parses NCN Lyric file (.lyr or .txt) and returns timestamped lyric lines and title/artist metadata.
 */
export function parseNCNLyrics(lyricsContent) {
  if (!lyricsContent) return { title: null, artist: null, lyrics: [] };

  const lines = lyricsContent.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  let title = null;
  let artist = null;
  const parsedLines = [];

  lines.forEach((line, lineIndex) => {
    // Check metadata tags e.g. Title=... or Artist=...
    if (line.toLowerCase().startsWith('title=')) {
      title = line.substring(6).trim();
      return;
    }
    if (line.toLowerCase().startsWith('artist=')) {
      artist = line.substring(7).trim();
      return;
    }

    // Check for timestamp format [mm:ss.xx]
    const match = line.match(/^\[(\d+):(\d+\.?\d*)\](.*)/);
    let text = line;
    let timeOffset = lineIndex * 3.5 + 2.0; // fallback if no timestamp

    if (match) {
      const minutes = parseFloat(match[1]);
      const seconds = parseFloat(match[2]);
      timeOffset = minutes * 60 + seconds;
      text = match[3];
    }

    // Split text into syllables delimited by '/' or '|' or spaces
    const syllables = text.split(/[\/|]/).map(s => ({
      text: s.trim(),
      duration: 0.6,
    })).filter(s => s.text.length > 0);

    if (syllables.length === 0) {
      syllables.push({ text: text.trim(), duration: 2.0 });
    }

    parsedLines.push({
      lineIndex,
      startTime: timeOffset,
      duration: syllables.length * 0.6,
      text: syllables.map(s => s.text).join(' '),
      syllables,
    });
  });

  return {
    title,
    artist,
    lyrics: parsedLines.length > 0 ? parsedLines : [
      {
        lineIndex: 0,
        startTime: 2.0,
        text: 'NCN Karaoke Track',
        syllables: [{ text: 'NCN', duration: 1.0 }, { text: 'Karaoke', duration: 1.5 }]
      }
    ]
  };
}

/**
 * Scans an NCN directory structure (Song, Lyrics, Cursor folders) and pairs the 3 files together into single NCN songs.
 */
export function scanAndPairNCNSongs(baseFolder) {
  const songMap = new Map();

  try {
    const allFiles = fs.readdirSync(baseFolder, { recursive: true });

    allFiles.forEach(relPath => {
      const fullPath = path.join(baseFolder, relPath.toString());
      const ext = path.extname(fullPath).toLowerCase();
      const filename = path.basename(fullPath, ext);
      const songId = filename.toUpperCase();

      if (!songMap.has(songId)) {
        songMap.set(songId, {
          id: songId,
          code: songId,
          title: songId,
          artist: 'NCN Artist',
          type: 'NCN',
          midiPath: null,
          lyricsPath: null,
          cursorPath: null,
          videoPath: null,
          ext,
        });
      }

      const songEntry = songMap.get(songId);

      if (['.mid', '.midi'].includes(ext)) {
        songEntry.midiPath = fullPath;
      } else if (['.lyr', '.txt'].includes(ext)) {
        songEntry.lyricsPath = fullPath;
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const parsed = parseNCNLyrics(content);
          if (parsed.title) songEntry.title = parsed.title;
          if (parsed.artist) songEntry.artist = parsed.artist;
          songEntry.parsedLyrics = parsed.lyrics;
        } catch (e) {}
      } else if (ext === '.cur') {
        songEntry.cursorPath = fullPath;
      } else if (['.mp4', '.mkv', '.avi'].includes(ext)) {
        songEntry.type = 'MP4';
        songEntry.videoPath = fullPath;
      } else if (ext === '.kar') {
        songEntry.type = 'KAR';
      } else if (ext === '.kmid') {
        songEntry.type = 'KMID';
      } else if (ext === '.emk') {
        songEntry.type = 'EMK';
      } else if (ext === '.rms') {
        songEntry.type = 'RMS';
      }
    });
  } catch (err) {
    console.error('Error scanning NCN paired directory:', err);
  }

  // Convert map to array of complete songs
  const songsList = [];
  songMap.forEach((entry) => {
    // Only include if it has at least one valid music or lyric file
    if (entry.midiPath || entry.lyricsPath || entry.videoPath) {
      songsList.push({
        id: `ncn-${entry.id}`,
        code: entry.code,
        title: entry.title !== entry.code ? entry.title : `เพลง NCN (${entry.code})`,
        artist: entry.artist,
        type: entry.type,
        midiPath: entry.midiPath,
        lyricsPath: entry.lyricsPath,
        cursorPath: entry.cursorPath,
        videoUrl: entry.videoPath,
        lyrics: entry.parsedLyrics || [
          {
            lineIndex: 0,
            startTime: 2.0,
            text: `${entry.title} (${entry.type} Karaoke)`,
            syllables: [
              { text: entry.title, duration: 1.5 },
              { text: `[${entry.type}]`, duration: 1.0 }
            ]
          }
        ]
      });
    }
  });

  return songsList;
}
