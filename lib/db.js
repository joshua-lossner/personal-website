let db = null;

// Add this function to update the database schema
async function updateDatabaseSchema(db) {
  const columns = await db.all("PRAGMA table_info(posts)");
  if (!columns.some(col => col.name === 'hidden')) {
    await db.exec("ALTER TABLE posts ADD COLUMN hidden BOOLEAN DEFAULT 0");
  }
}

// Combine the two openDb functions into one
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
      await updateDatabaseSchema(db);
    }
    return db;
  }
  return null;
}