let db = null;

async function openDb() {
  if (typeof window === 'undefined') {
    const sqlite3 = (await import('sqlite3')).default;
    const sqlite = await import('sqlite');
    
    if (!db) {
      db = await sqlite.open({
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

      const columns = await db.all("PRAGMA table_info(posts)");
      if (!columns.some(col => col.name === 'narration')) {
        await db.exec("ALTER TABLE posts ADD COLUMN narration TEXT");
      }
      
      if (!columns.some(col => col.name === 'pinned')) {
        await db.exec("ALTER TABLE posts ADD COLUMN pinned BOOLEAN DEFAULT 0");
      }
    }
  }
  return db;
}

export { openDb };