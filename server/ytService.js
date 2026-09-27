import yts from 'yt-search';

export async function searchYouTubeKaraoke(query) {
  if (!query || !query.trim()) return [];

  try {
    // Try primary search with "คาราโอเกะ"
    const searchQuery = query.toLowerCase().includes('คาราโอเกะ') || query.toLowerCase().includes('karaoke')
      ? query.trim()
      : `${query.trim()} คาราโอเกะ`;

    let r = await yts(searchQuery);
    let videos = r && r.videos ? r.videos.slice(0, 15) : [];

    // Fallback: search exact query if no videos found
    if (videos.length === 0) {
      r = await yts(query.trim());
      videos = r && r.videos ? r.videos.slice(0, 15) : [];
    }

    if (videos.length > 0) {
      return videos.map(video => ({
        id: `yt-${video.videoId}`,
        youtubeId: video.videoId,
        code: video.videoId.substring(0, 6).toUpperCase(),
        title: video.title,
        artist: video.author ? video.author.name : 'YouTube Karaoke',
        duration: video.timestamp || '3:30',
        thumbnail: video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
        type: 'YOUTUBE',
        url: video.url,
      }));
    }

    return getFallbackSongs(query);
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return getFallbackSongs(query);
  }
}

function getFallbackSongs(query) {
  return [
    {
      id: 'yt-jai-sung-mah',
      youtubeId: 'EbJ5R8vdSD8',
      code: 'EBJ5R8',
      title: `${query} (คาราโอเกะ Original)`,
      artist: 'GMM Karaoke',
      duration: '4:05',
      thumbnail: 'https://i.ytimg.com/vi/EbJ5R8vdSD8/hqdefault.jpg',
      type: 'YOUTUBE',
      url: 'https://www.youtube.com/watch?v=EbJ5R8vdSD8',
    }
  ];
}
