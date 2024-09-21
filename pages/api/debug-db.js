import { openDb } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const db = await openDb();
    const posts = await db.all('SELECT * FROM posts');
    
    const html = `
      <html>
        <head>
          <title>Database Contents</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            pre { background-color: #f0f0f0; padding: 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>Database Contents</h1>
          <pre>${JSON.stringify(posts, null, 2)}</pre>
        </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error fetching database contents:', error);
    res.status(500).json({ error: 'Failed to fetch database contents' });
  }
}