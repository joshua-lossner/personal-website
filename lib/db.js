import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = null;

async function openDb() {
  if (!db) {
    db = await open({
      filename: './posts.db',
      driver: sqlite3.Database
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subtitle TEXT,
        category TEXT,
        description TEXT,
        tags TEXT,
        datePublished TEXT,
        narration TEXT,
        audioFile TEXT,
        published BOOLEAN,
        pinned BOOLEAN,
        filePath TEXT NOT NULL UNIQUE
      )
    `);

    // Check if the narration column exists, if not, add it
    const columns = await db.all("PRAGMA table_info(posts)");
    if (!columns.some(col => col.name === 'narration')) {
      await db.exec("ALTER TABLE posts ADD COLUMN narration TEXT");
    }
    
    // Check if the pinned column exists, if not, add it
    if (!columns.some(col => col.name === 'pinned')) {
      await db.exec("ALTER TABLE posts ADD COLUMN pinned BOOLEAN DEFAULT 0");
    }
  }
  return db;
}

export { openDb };