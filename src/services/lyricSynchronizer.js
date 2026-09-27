/**
 * Lyric Synchronizer
 * Calculates current active line, current active syllable, and highlighting progress (0% - 100%).
 */

export function getCurrentLyricState(lyrics, currentTime) {
  if (!lyrics || lyrics.length === 0) {
    return { activeLineIndex: -1, line1: null, line2: null, activeSyllableIndex: -1, progress: 0 };
  }

  let activeLineIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    const line = lyrics[i];
    const nextLineTime = lyrics[i + 1] ? lyrics[i + 1].startTime : line.startTime + (line.duration || 6);
    if (currentTime >= line.startTime && currentTime < nextLineTime) {
      activeLineIndex = i;
      break;
    }
  }

  if (activeLineIndex === -1 && currentTime < lyrics[0].startTime) {
    activeLineIndex = 0;
  } else if (activeLineIndex === -1 && currentTime >= lyrics[lyrics.length - 1].startTime) {
    activeLineIndex = lyrics.length - 1;
  }

  const line1 = lyrics[activeLineIndex] || null;
  const line2 = lyrics[activeLineIndex + 1] || lyrics[0];

  let activeSyllableIndex = -1;
  let syllableProgress = 0;

  if (line1 && line1.syllables) {
    let elapsedInLine = currentTime - line1.startTime;
    let accumulatedTime = 0;

    for (let sIdx = 0; sIdx < line1.syllables.length; sIdx++) {
      const syl = line1.syllables[sIdx];
      const sylDur = syl.duration || 0.5;

      if (elapsedInLine >= accumulatedTime && elapsedInLine < accumulatedTime + sylDur) {
        activeSyllableIndex = sIdx;
        syllableProgress = (elapsedInLine - accumulatedTime) / sylDur;
        break;
      }
      accumulatedTime += sylDur;
    }

    if (elapsedInLine >= accumulatedTime) {
      activeSyllableIndex = line1.syllables.length - 1;
      syllableProgress = 1.0;
    }
  }

  return {
    activeLineIndex,
    line1,
    line2,
    activeSyllableIndex,
    progress: Math.min(1.0, Math.max(0, syllableProgress)),
  };
}
