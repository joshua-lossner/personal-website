import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

async function openDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  }).then(db => {
    db.run('PRAGMA cache_size = 0');
    db.run('PRAGMA journal_mode = DELETE');
    return db;
  });
}

async function processFile(db, filePath, category) {
  console.log(`Starting to process file: ${filePath}`);
  const content = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
  const { data, content: markdown } = matter(content);
  const slug = path.basename(filePath, '.md');

  console.log(`Processing file: ${filePath}`);
  console.log(`Slug: ${slug}`);

  // Check if the slug already exists
  const existing = await db.get('SELECT * FROM posts WHERE slug = ?', slug);
  if (existing) {
    console.warn(`Warning: Duplicate slug found for ${slug}. Skipping insertion.`);
    return;
  }

  try {
    await db.run(`
      INSERT INTO posts (title, category, content, slug, date)
      VALUES (?, ?, ?, ?, ?)
    `, [data.title, category, markdown.trim(), slug, data.date]);
    console.log(`Inserted: ${slug}`);
  } catch (error) {
    console.error(`Error inserting ${slug}:`, error);
  }
  console.log(`Finished processing file: ${filePath}`);
}

async function processDirectory(db, dirPath, category) {
  console.log(`Starting to process directory: ${dirPath}`);
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      await processDirectory(db, itemPath, path.join(category, item));
    } else if (stats.isFile() && path.extname(item) === '.md') {
      await processFile(db, itemPath, category);
    }
  }
  console.log(`Finished processing directory: ${dirPath}`);
}

async function fetchDocuments() {
  const dbPath = './database.sqlite';
  let db;

  try {
    // Delete the existing database file
    console.log('Deleting existing database...');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('Existing database deleted successfully.');
    } else {
      console.log('No existing database found.');
    }

    // Create a new database
    db = await openDb();
    await db.run('BEGIN TRANSACTION');

    console.log('Creating new posts table...');
    await db.exec(`
      CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        category TEXT,
        content TEXT,
        slug TEXT UNIQUE,
        date TEXT
      )
    `);
    console.log('New posts table created successfully.');

    console.log('Fetching and processing new documents...');
    const contentDir = path.join(process.cwd(), 'content');
    await processDirectory(db, contentDir, '');

    await db.run('COMMIT');

    const { count } = await db.get('SELECT COUNT(*) as count FROM posts');
    console.log(`Successfully imported ${count} documents.`);

    // Check for duplicates
    const duplicates = await db.all('SELECT slug, COUNT(*) as count FROM posts GROUP BY slug HAVING count > 1');
    if (duplicates.length > 0) {
      console.warn('Warning: Duplicate slugs found:', duplicates);
    }

    await db.close();
  } catch (error) {
    if (db) await db.run('ROLLBACK');
    console.error('Error fetching documents:', error);
  } finally {
    if (db) await db.close();
  }
}

fetchDocuments().catch(console.error);