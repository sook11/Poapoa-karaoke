import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { parseNCNLyrics, scanAndPairNCNSongs } from './ncnParser.js';
import { parseKarMidiFile } from './karParser.js';
import { parseEMKFile, parseRMSFile } from './emkRmsParser.js';
import { searchYouTubeKaraoke } from './ytService.js';
import { DEMO_SONGS } from './demoSongs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend build files
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// In-memory Song Database
let songDatabase = [...DEMO_SONGS];

// API: Search & Filter Songs
app.get('/api/songs', (req, res) => {
  const { query, type } = req.query;
  let results = [...songDatabase];

  if (type && type !== 'ALL') {
    results = results.filter(s => s.type.toUpperCase() === type.toUpperCase());
  }

  if (query) {
    const q = query.toString().toLowerCase().trim();
    results = results.filter(s =>
      s.code.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      (s.category && s.category.toLowerCase().includes(q))
    );
  }

  res.json({ total: results.length, songs: results });
});

// API: Get Single Song Details
app.get('/api/song/:id', (req, res) => {
  const song = songDatabase.find(s => s.id === req.params.id || s.code === req.params.id);
  if (song) {
    res.json(song);
  } else {
    res.status(404).json({ error: 'Song not found' });
  }
});

// API: Scan Local Directory for NCN 3-Folders (Song, Lyrics, Cursor) & KAR, KMID, EMK, RMS, MP4
app.post('/api/scan', (req, res) => {
  const { folderPath } = req.body;
  if (!folderPath || !fs.existsSync(folderPath)) {
    return res.status(400).json({ error: 'Invalid or non-existent folder path' });
  }

  try {
    const scannedSongs = scanAndPairNCNSongs(folderPath);

    // Merge without duplicates by code/id
    scannedSongs.forEach(song => {
      const existsIndex = songDatabase.findIndex(s => s.code === song.code || s.id === song.id);
      if (existsIndex >= 0) {
        songDatabase[existsIndex] = song;
      } else {
        songDatabase.push(song);
      }
    });

    res.json({ message: `Scanned ${scannedSongs.length} songs`, songsScanned: scannedSongs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Search YouTube Karaoke
app.get('/api/youtube/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Search query parameter q is required' });

  const results = await searchYouTubeKaraoke(q.toString());
  res.json(results);
});

// Fallback all non-API GET requests to index.html for SPA routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && fs.existsSync(path.join(distPath, 'index.html'))) {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

const server = app.listen(PORT, () => {
  console.log(`🎤 Poapoa eXtreme Karaoke Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use by active server process.`);
  } else {
    console.error('Server error:', err);
  }
});
