/**
 * KAR / KMID (MIDI Karaoke Format Parser)
 * Extracts Karaoke lyric track events and timestamps from MIDI Type 0/1 files.
 */

import midiParser from 'midi-parser-js';
import fs from 'fs';

export function parseKarMidiFile(filePath) {
  try {
    const fileData = fs.readFileSync(filePath);
    const parsedMidi = midiParser.parse(fileData);
    
    const lyrics = [];
    let currentLine = { startTime: 0, text: '', syllables: [] };
    let totalTicks = 0;
    
    // Process track events looking for Text/Lyric Meta Events (0x01, 0x05)
    if (parsedMidi && parsedMidi.track) {
      parsedMidi.track.forEach(track => {
        let absoluteTime = 0;
        track.event.forEach(event => {
          absoluteTime += event.deltaTime || 0;
          const timeSec = (absoluteTime / 480) * 0.5; // estimated tempo conversion

          if (event.type === 255) { // Meta Event
            if (event.metaType === 1 || event.metaType === 5) { // Text or Lyric
              const lyricText = event.data;
              if (typeof lyricText === 'string') {
                if (lyricText.startsWith('\\') || lyricText.startsWith('/')) {
                  // Line break tag
                  if (currentLine.syllables.length > 0) {
                    lyrics.push({ ...currentLine });
                  }
                  const cleanText = lyricText.replace(/^[\\\/]/, '');
                  currentLine = {
                    startTime: timeSec,
                    text: cleanText,
                    syllables: [{ text: cleanText, duration: 0.5, time: timeSec }]
                  };
                } else if (!lyricText.startsWith('@')) {
                  currentLine.text += lyricText;
                  currentLine.syllables.push({
                    text: lyricText,
                    duration: 0.5,
                    time: timeSec
                  });
                }
              }
            }
          }
        });
      });
    }

    if (currentLine.syllables.length > 0) {
      lyrics.push(currentLine);
    }

    return {
      title: parsedMidi?.meta?.title || 'KAR Karaoke Track',
      lyrics: lyrics.length > 0 ? lyrics : generateFallbackLyrics('KAR Track'),
      midiData: fileData.toString('base64'),
    };
  } catch (err) {
    console.error('Error parsing KAR file:', err);
    return {
      title: 'KAR Track',
      lyrics: generateFallbackLyrics('KAR Track'),
    };
  }
}

function generateFallbackLyrics(title) {
  return [
    {
      lineIndex: 0,
      startTime: 2.0,
      text: `${title} - MIDI Karaoke Track`,
      syllables: [
        { text: `${title}`, duration: 1.5 },
        { text: 'MIDI', duration: 1.0 },
        { text: 'Karaoke', duration: 1.5 }
      ]
    }
  ];
}
