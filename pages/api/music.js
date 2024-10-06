import path from 'path';
import fs from 'fs/promises';

export default async function handler(req, res) {
  const { directory } = req.query;
  
  if (!directory) {
    return res.status(400).json({ error: 'Missing directory parameter' });
  }

  // Sanitize the directory parameter to prevent path traversal
  const sanitizedDirectory = path.normalize(directory).replace(/^(\.\.(\/|\\|$))+/, '');
  const musicBaseDir = path.join(process.cwd(), 'content', 'Artifacts', 'Music');
  const playlistDirectory = path.join(musicBaseDir, sanitizedDirectory);

  // Ensure the resulting path is still within the Music directory
  if (!playlistDirectory.startsWith(musicBaseDir)) {
    console.warn(`Invalid directory access attempt: ${directory}`);
    return res.status(400).json({ error: 'Invalid directory parameter' });
  }
  
  try {
    const files = await fs.readdir(playlistDirectory);
    const audioFiles = files.filter(file => /\.(mp3|wav|ogg)$/i.test(file));
    
    res.status(200).json({ files: audioFiles });
  } catch (error) {
    console.error('Error reading playlist directory:', error);
    res.status(500).json({ error: 'Failed to read playlist directory' });
  }
}