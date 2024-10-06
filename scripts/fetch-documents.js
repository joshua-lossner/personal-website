import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { openDb } from '../lib/db.js';

const contentDir = path.join(process.cwd(), 'content');

async function processFile(db, filePath, category) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  const relativePath = path.relative(contentDir, filePath);

  const {
    title,
    subtitle,
    description,
    tags,
    datePublished,
    narration,
    audioFile,
    pinned,
    hidden,
  } = data;

  const fullPath = path.join(category, relativePath).replace(/\\/g, '/');

  await db.run(`
    INSERT INTO posts (
      title, subtitle, category, description, tags, datePublished, narration,
      audioFile, pinned, hidden, filePath, content
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    title || '',
    subtitle || '',
    category || '',
    description || '',
    JSON.stringify(tags || []),
    datePublished || '',
    narration || '',
    audioFile || '',
    pinned ? 1 : 0,
    hidden ? 1 : 0,
    fullPath,
    content,
  ]);
}

async function processDirectory(db, dirPath, category) {
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
}

async function fetchDocuments() {
  let db;

  try {
    db = await openDb();
    await db.run('BEGIN TRANSACTION');

    // Drop the existing posts table
    await db.run('DROP TABLE IF EXISTS posts');

    // Recreate the posts table
    await db.run(`
      CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        subtitle TEXT,
        category TEXT,
        description TEXT,
        tags TEXT,
        datePublished TEXT,
        narration TEXT,
        audioFile TEXT,
        pinned INTEGER,
        hidden INTEGER,
        filePath TEXT UNIQUE,
        content TEXT
      )
    `);

    // Process all documents
    await processDirectory(db, contentDir, '');

    await db.run('COMMIT');

    const { count } = await db.get('SELECT COUNT(*) as count FROM posts');
    console.log(`Successfully processed ${count} documents.`);

    // Check for duplicates
    const duplicates = await db.all('SELECT filePath, COUNT(*) as count FROM posts GROUP BY filePath HAVING count > 1');
    if (duplicates.length > 0) {
      console.warn('Warning: Duplicate file paths found:', duplicates);
    }

  } catch (error) {
    if (db) await db.run('ROLLBACK');
    console.error('Error fetching documents:', error);
  } finally {
    if (db) await db.close();
  }
}

fetchDocuments();