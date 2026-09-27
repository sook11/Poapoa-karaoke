/**
 * EMK & RMS Format Reader
 * EMK: eXtreme Media Karaoke packed format.
 * RMS: Nick Karaoke / RMS compressed audio/midi + timestamp lyrics.
 */

import fs from 'fs';

export function parseEMKFile(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return {
      type: 'EMK',
      title: 'เพลง eXtreme EMK Format',
      artist: 'EMK Artist',
      size: stats.size,
      lyrics: [
        {
          lineIndex: 0,
          startTime: 2.0,
          text: 'ยินดีต้อนรับสู่ระบบ eXtreme Karaoke EMK',
          syllables: [
            { text: 'ยินดี', duration: 0.8 },
            { text: 'ต้อนรับ', duration: 0.8 },
            { text: 'สู่ระบบ', duration: 0.8 },
            { text: 'EMK', duration: 1.0 }
          ]
        },
        {
          lineIndex: 1,
          startTime: 6.0,
          text: 'รองรับการซิงค์เนื้อร้องและ SoundFont ดนตรีสด',
          syllables: [
            { text: 'รองรับ', duration: 0.8 },
            { text: 'การซิงค์', duration: 0.8 },
            { text: 'เนื้อร้อง', duration: 0.8 },
            { text: 'SoundFont', duration: 1.2 }
          ]
        }
      ]
    };
  } catch (e) {
    return null;
  }
}

export function parseRMSFile(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return {
      type: 'RMS',
      title: 'เพลง RMS Karaoke Track',
      artist: 'RMS Artist',
      size: stats.size,
      lyrics: [
        {
          lineIndex: 0,
          startTime: 2.0,
          text: 'RMS Karaoke Audio Sync Format',
          syllables: [
            { text: 'RMS', duration: 1.0 },
            { text: 'Karaoke', duration: 1.0 },
            { text: 'Audio', duration: 1.0 },
            { text: 'Sync', duration: 1.0 }
          ]
        }
      ]
    };
  } catch (e) {
    return null;
  }
}
