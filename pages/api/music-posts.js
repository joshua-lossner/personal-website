import { openDb } from '../../lib/db';
import { rateLimiter } from '../../utils/rateLimiter';

export default async function handler(req, res) {
  // Apply rate limiting
  if (!await rateLimiter(req, res)) {
    return;
  }

  try {
    const db = await openDb();
    const posts = await db.all(
      `SELECT title, audioFile FROM posts 
       WHERE category = 'music' AND audioFile IS NOT NULL`
    );

    const playlist = posts.map(post => ({
      title: post.title,
      url: constructAudioUrl(post.audioFile),
    }));

    res.status(200).json({ playlist });
  } catch (error) {
    console.error('Error fetching music posts:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

function constructAudioUrl(path) {
  const baseUrl = process.env.S3_BASE_URL || 'https://personal-website-audio.s3.amazonaws.com/audio';
  return `${baseUrl}/${path.replace(/^\//, '')}`;
}