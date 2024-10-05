import { openDb } from '../../lib/db';

export default async function handler(req, res) {
  const { tag } = req.query;

  if (!tag) {
    return res.status(400).json({ error: 'Tag parameter is required' });
  }

  try {
    const db = await openDb();
    const posts = await db.all(
      `SELECT title, audioFile FROM posts 
       WHERE tags LIKE ? AND audioFile IS NOT NULL`,
      [`%${tag}%`]
    );

    const playlist = posts.map(post => ({
      title: post.title,
      url: constructAudioUrl(post.audioFile)
    }));

    res.status(200).json({ playlist });
  } catch (error) {
    console.error('Error fetching audio by tag:', error);
    res.status(500).json({ error: 'Failed to fetch audio by tag' });
  }
}

function constructAudioUrl(path) {
  const baseUrl = process.env.S3_BASE_URL || 'https://personal-website-audio.s3.amazonaws.com/audio';
  return `${baseUrl}/${path.replace(/^\//, '')}`;
}