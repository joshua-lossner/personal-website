let db = null;

export async function openDb() {
  if (typeof window === 'undefined') {
    if (!db) {
      const sqlite3 = (await import('sqlite3')).default;
      const sqlite = await import('sqlite');
      
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
          hidden BOOLEAN DEFAULT 0,
          filePath TEXT NOT NULL UNIQUE
        )
      `);
    }
    return db;
  }
  return null;
}