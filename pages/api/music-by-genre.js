import { openDb } from '../../lib/db';

export default async function handler(req, res) {
  const { genre } = req.query;

  if (!genre) {
    return res.status(400).json({ error: 'Genre parameter is required' });
  }

  try {
    const db = await openDb();
    const posts = await db.all(
      `SELECT title, audioFile FROM posts 
       WHERE category = 'music' AND tags LIKE ? AND audioFile IS NOT NULL`,
      [`%${genre}%`]
    );

    const playlist = posts.map(post => ({
      title: post.title,
      url: constructAudioUrl(post.audioFile)
    }));

    res.status(200).json({ playlist });
  } catch (error) {
    console.error('Error fetching music by genre:', error);
    res.status(500).json({ error: 'Failed to fetch music by genre' });
  }
}

function constructAudioUrl(path) {
  const baseUrl = 'https://personal-website-audio.s3.amazonaws.com/audio';
  return `${baseUrl}/${path.replace(/^\//, '')}`;
}