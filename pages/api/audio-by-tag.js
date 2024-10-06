import { openDb } from '../../lib/db';

export default async function handler(req, res) {
  const { tag } = req.query;

  if (!tag || typeof tag !== 'string') {
    return res.status(400).json({ error: 'Valid tag parameter is required' });
  }

  try {
    const db = await openDb();
    
    // Sanitize the tag input by escaping special characters
    const sanitizedTag = tag.replace(/[%_\\]/g, '\\$&');

    const posts = await db.all(
      `SELECT title, audioFile FROM posts 
       WHERE tags LIKE ? ESCAPE '\\' AND audioFile IS NOT NULL`,
      [`%${sanitizedTag}%`]
    );

    const playlist = posts.map(post => ({
      title: post.title,
      url: constructAudioUrl(post.audioFile)
    }));

    res.status(200).json({ playlist });
  } catch (error) {
    // Log the detailed error on the server
    console.error('Error fetching audio by tag:', error);

    // Send a generic error message to the client
    res.status(500).json({ error: 'An unexpected error occurred while fetching audio' });
  }
}

function constructAudioUrl(path) {
  const baseUrl = process.env.S3_BASE_URL || 'https://personal-website-audio.s3.amazonaws.com/audio';
  return `${baseUrl}/${path.replace(/^\//, '')}`;
}