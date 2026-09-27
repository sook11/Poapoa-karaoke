/**
 * Demo Songs Database
 * Provides out-of-the-box demo tracks for all formats: NCN, KAR, KMID, EMK, RMS, MP4, YOUTUBE
 */

export const DEMO_SONGS = [
  {
    id: '00001',
    code: '00001',
    title: 'ผู้สาวขาเลาะ (NCN Sync)',
    artist: 'ลำไย ไหทองคำ',
    type: 'NCN',
    category: 'ลูกทุ่ง/หมอลำ',
    bpm: 135,
    key: 'Am',
    lyrics: [
      {
        lineIndex: 0,
        startTime: 2.0,
        text: 'เฮาแค่ผู้สาวขาเลาะ บ่แม่นผู้สาวเรียนดี',
        syllables: [
          { text: 'เฮา', duration: 0.5 },
          { text: 'แค่', duration: 0.4 },
          { text: 'ผู้', duration: 0.4 },
          { text: 'สาว', duration: 0.5 },
          { text: 'ขา', duration: 0.5 },
          { text: 'เลาะ', duration: 0.6 },
          { text: 'บ่', duration: 0.4 },
          { text: 'แม่น', duration: 0.4 },
          { text: 'ผู้', duration: 0.4 },
          { text: 'สาว', duration: 0.5 },
          { text: 'เรียน', duration: 0.5 },
          { text: 'ดี', duration: 0.8 }
        ]
      },
      {
        lineIndex: 1,
        startTime: 8.5,
        text: 'พิสูจน์ฮักด้วยการเรียน บ่ได้หรอกพี่',
        syllables: [
          { text: 'พิ', duration: 0.4 },
          { text: 'สูจน์', duration: 0.5 },
          { text: 'ฮัก', duration: 0.4 },
          { text: 'ด้วย', duration: 0.5 },
          { text: 'การ', duration: 0.4 },
          { text: 'เรียน', duration: 0.6 },
          { text: 'บ่', duration: 0.4 },
          { text: 'ได้', duration: 0.4 },
          { text: 'หรอก', duration: 0.5 },
          { text: 'พี่', duration: 0.9 }
        ]
      },
      {
        lineIndex: 2,
        startTime: 14.5,
        text: 'แต่ถ้าให้ฮักหมดใจ อันนี้สบายมากๆ',
        syllables: [
          { text: 'แต่', duration: 0.4 },
          { text: 'ถ้า', duration: 0.4 },
          { text: 'ให้', duration: 0.4 },
          { text: 'ฮัก', duration: 0.5 },
          { text: 'หมด', duration: 0.5 },
          { text: 'ใจ', duration: 0.6 },
          { text: 'อัน', duration: 0.4 },
          { text: 'นี้', duration: 0.4 },
          { text: 'ส', duration: 0.3 },
          { text: 'บาย', duration: 0.5 },
          { text: 'มาก', duration: 0.4 },
          { text: 'มาก', duration: 0.8 }
        ]
      }
    ]
  },
  {
    id: '00002',
    code: '00002',
    title: 'คุกกี้เสี่ยงทาย (KAR Karaoke MIDI)',
    artist: 'BNK48',
    type: 'KAR',
    category: 'สตริง',
    bpm: 120,
    key: 'C',
    lyrics: [
      {
        lineIndex: 0,
        startTime: 2.5,
        text: 'แอบมองเธออยู่นะจ๊ะ แต่เธอไม่รู้บ้างเลย',
        syllables: [
          { text: 'แอบ', duration: 0.4 },
          { text: 'มอง', duration: 0.4 },
          { text: 'เธอ', duration: 0.5 },
          { text: 'อยู่', duration: 0.4 },
          { text: 'นะ', duration: 0.3 },
          { text: 'จ๊ะ', duration: 0.6 },
          { text: 'แต่', duration: 0.4 },
          { text: 'เธอ', duration: 0.4 },
          { text: 'ไม่', duration: 0.4 },
          { text: 'รู้', duration: 0.5 },
          { text: 'บ้าง', duration: 0.5 },
          { text: 'เลย', duration: 0.8 }
        ]
      },
      {
        lineIndex: 1,
        startTime: 8.5,
        text: 'แอบส่งใจให้เธอตั้งนาน รู้ไหมคะเออ',
        syllables: [
          { text: 'แอบ', duration: 0.4 },
          { text: 'ส่ง', duration: 0.4 },
          { text: 'ใจ', duration: 0.5 },
          { text: 'ให้', duration: 0.4 },
          { text: 'เธอ', duration: 0.5 },
          { text: 'ตั้ง', duration: 0.4 },
          { text: 'นาน', duration: 0.6 },
          { text: 'รู้', duration: 0.4 },
          { text: 'ไหม', duration: 0.4 },
          { text: 'คะ', duration: 0.4 },
          { text: 'เออ', duration: 0.8 }
        ]
      }
    ]
  },
  {
    id: '00003',
    code: '00003',
    title: 'คู่ชีวิต (KMID SoundFont MIDI)',
    artist: 'Cocktail',
    type: 'KMID',
    category: 'สตริง/ร็อค',
    bpm: 90,
    key: 'G',
    lyrics: [
      {
        lineIndex: 0,
        startTime: 2.0,
        text: 'เธอคือทุกสิ่ง ในความจริงหรือในความฝัน',
        syllables: [
          { text: 'เธอ', duration: 0.6 },
          { text: 'คือ', duration: 0.5 },
          { text: 'ทุก', duration: 0.5 },
          { text: 'สิ่ง', duration: 0.8 },
          { text: 'ใน', duration: 0.5 },
          { text: 'ความ', duration: 0.5 },
          { text: 'จริง', duration: 0.6 },
          { text: 'หรือ', duration: 0.4 },
          { text: 'ใน', duration: 0.4 },
          { text: 'ความ', duration: 0.5 },
          { text: 'ฝัน', duration: 0.9 }
        ]
      }
    ]
  },
  {
    id: '00004',
    code: '00004',
    title: 'ไสว่าสิบ่ถิ่มกัน (EMK Media Format)',
    artist: 'ก้อง ห้วยไร่',
    type: 'EMK',
    category: 'ลูกทุ่ง',
    bpm: 78,
    key: 'Dm',
    lyrics: [
      {
        lineIndex: 0,
        startTime: 2.0,
        text: 'ไสว่าสิบ่ถิ่มกัน ไสว่าสิมีกันและกัน',
        syllables: [
          { text: 'ไส', duration: 0.6 },
          { text: 'ว่า', duration: 0.5 },
          { text: 'สิ', duration: 0.4 },
          { text: 'บ่', duration: 0.5 },
          { text: 'ถิ่ม', duration: 0.6 },
          { text: 'กัน', duration: 0.8 },
          { text: 'ไส', duration: 0.5 },
          { text: 'ว่า', duration: 0.5 },
          { text: 'สิ', duration: 0.4 },
          { text: 'มี', duration: 0.5 },
          { text: 'กัน', duration: 0.4 },
          { text: 'และ', duration: 0.3 },
          { text: 'กัน', duration: 0.9 }
        ]
      }
    ]
  },
  {
    id: '00005',
    code: '00005',
    title: 'โบว์รักสีดำ (RMS Audio Format)',
    artist: 'ศิริพร อำไพพงษ์',
    type: 'RMS',
    category: 'หมอลำ',
    bpm: 140,
    key: 'Fm',
    lyrics: [
      {
        lineIndex: 0,
        startTime: 2.0,
        text: 'โบว์รักสีดำ ผูกตรงใจน้องจำบ่ลืม',
        syllables: [
          { text: 'โบว์', duration: 0.5 },
          { text: 'รัก', duration: 0.5 },
          { text: 'สี', duration: 0.5 },
          { text: 'ดำ', duration: 0.8 },
          { text: 'ผูก', duration: 0.4 },
          { text: 'ตรง', duration: 0.4 },
          { text: 'ใจ', duration: 0.5 },
          { text: 'น้อง', duration: 0.5 },
          { text: 'จำ', duration: 0.4 },
          { text: 'บ่', duration: 0.3 },
          { text: 'ลืม', duration: 0.9 }
        ]
      }
    ]
  },
  {
    id: '00006',
    code: '00006',
    title: 'คำว่าฮักกัน มันสะกดบ่ยาก (MP4 Video Dual-Audio)',
    artist: 'ต่าย อรทัย',
    type: 'MP4',
    category: 'MP4 Video',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    hasStereoVocal: true,
    lyrics: [
      {
        lineIndex: 0,
        startTime: 2.0,
        text: 'คำว่าฮักกัน มันสะกดบ่ยากดอกพี่',
        syllables: [
          { text: 'คำ', duration: 0.5 },
          { text: 'ว่า', duration: 0.5 },
          { text: 'ฮัก', duration: 0.5 },
          { text: 'กัน', duration: 0.6 },
          { text: 'มัน', duration: 0.4 },
          { text: 'สะ', duration: 0.3 },
          { text: 'กด', duration: 0.4 },
          { text: 'บ่', duration: 0.4 },
          { text: 'ยาก', duration: 0.6 },
          { text: 'ดอก', duration: 0.4 },
          { text: 'พี่', duration: 0.9 }
        ]
      }
    ]
  },
  {
    id: '00007',
    code: '00007',
    title: 'ทรงอย่างแบด (YouTube Karaoke Live)',
    artist: 'Paper Planes',
    type: 'YOUTUBE',
    youtubeId: 'b_xH8cR5Z4k',
    category: 'YouTube',
    lyrics: []
  }
];
