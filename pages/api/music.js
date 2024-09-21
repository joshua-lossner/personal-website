import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { directory } = req.query;

  console.log('API route called with directory:', directory);

  const playlistDirectory = path.join(process.cwd(), 'public', 'audio', 'site-playlist', directory);

  console.log('Playlist directory:', playlistDirectory);

  try {
    const files = fs.readdirSync(playlistDirectory);
    console.log('Files found:', files);

    const playlist = files
      .filter(file => file.endsWith('.mp3'))
      .map(file => ({
        title: file,
        url: `/audio/site-playlist/${directory}/${file}`,
      }));

    console.log('Playlist generated:', playlist);

    res.status(200).json({ playlist });
  } catch (error) {
    console.error('Error reading playlist directory:', error);
    res.status(500).json({ error: 'Failed to load playlist', details: error.message });
  }
}