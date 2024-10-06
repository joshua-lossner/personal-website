import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { openDb } from '../lib/db.js';

dotenv.config({ path: '.env.local' });

const githubUsername = process.env.GITHUB_USERNAME;
const githubRepo = process.env.GITHUB_REPO;
const githubToken = process.env.GITHUB_TOKEN;

if (!githubUsername || !githubRepo || !githubToken) {
  console.error('Missing required environment variables. Please check your .env.local file.');
  process.exit(1);
}

const localContentDir = path.join(process.cwd(), 'content');

async function updateDatabase(post) {
  const db = await openDb();
  const { title, subtitle, category, description, tags, datePublished, narration, audioFile, pinned, hidden, filePath, published, artwork } = post;
  
  if (published === true) {
    await db.run(`
      INSERT OR REPLACE INTO posts (title, subtitle, category, description, tags, datePublished, narration, audioFile, pinned, hidden, filePath, artwork)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, subtitle, category, description, JSON.stringify(tags), datePublished, narration, audioFile, pinned ? 1 : 0, hidden ? 1 : 0, filePath, artwork]);
  } else {
    await db.run(`DELETE FROM posts WHERE filePath = ?`, [filePath]);
  }
}

async function processFile(filePath, content) {
  const { data: metadata, content: markdownContent } = matter(content);
  
  let audioFilePath = null;
  if (metadata.audioFile) {
    if (metadata.audioFile.startsWith('public/')) {
      audioFilePath = '/' + metadata.audioFile.replace(/^public\//, '');
    } else if (metadata.audioFile.startsWith('/')) {
      audioFilePath = metadata.audioFile;
    } else {
      audioFilePath = '/' + metadata.audioFile;
    }
  }

  const post = {
    ...metadata,
    filePath: filePath.replace(localContentDir, ''),
    content: markdownContent,
    audioFile: audioFilePath,
    hidden: metadata.hidden || false,
    published: metadata.published === true, // Explicitly check for true
  };
  
  await fs.writeFile(path.join(localContentDir, filePath), content);
  await updateDatabase(post);
}

async function fetchFilesRecursively(path = '') {
  const url = `https://api.github.com/repos/${githubUsername}/${githubRepo}/contents/${path}`;
  const headers = githubToken ? { Authorization: `token ${githubToken}` } : {};
  const response = await axios.get(url, { headers });

  let files = [];
  for (const item of response.data) {
    if (item.type === 'file' && item.name.endsWith('.md')) {
      files.push(item);
    } else if (item.type === 'dir') {
      const subFiles = await fetchFilesRecursively(item.path);
      files = files.concat(subFiles);
    }
  }
  return files;
}

async function fetchFileContent(path) {
  const url = `https://api.github.com/repos/${githubUsername}/${githubRepo}/contents/${path}`;
  const headers = githubToken ? { Authorization: `token ${githubToken}` } : {};
  const response = await axios.get(url, { headers });
  return Buffer.from(response.data.content, 'base64').toString('utf8');
}

async function clearLocalContentDir() {
  try {
    await fs.rm(localContentDir, { recursive: true, force: true });
  } catch (error) {
    console.error('Error clearing local content directory:', error);
  }
}

async function fetchAndStoreDocuments() {
  try {
    await clearLocalContentDir();

    const files = await fetchFilesRecursively();
    for (const file of files) {
      const content = await fetchFileContent(file.path);
      const { data, content: markdownContent } = matter(content);

      if (data.published === true) {
        const requiredFields = ['title', 'category', 'description', 'datePublished'];
        for (const field of requiredFields) {
          if (!data[field]) {
            console.warn(`Warning: Missing ${field} for ${file.path}`);
            if (field === 'category') {
              data[field] = 'Uncategorized';  // Set a default category
            } else {
              data[field] = 'No ' + field + ' available.';
            }
          }
        }

        data.subtitle = data.subtitle || '';
        data.narration = data.narration || '';
        data.audioFile = data.audioFile || '';
        data.pinned = data.pinned || false;
        data.tags = data.tags || [];

        if (data.datePublished) {
          const date = new Date(data.datePublished);
          if (!isNaN(date.getTime())) {
            data.datePublished = date.toISOString();
          } else {
            console.warn(`Warning: Invalid datePublished for ${file.path}. Using current date.`);
            data.datePublished = new Date().toISOString();
          }
        } else {
          console.warn(`Warning: Missing datePublished for ${file.path}. Using current date.`);
          data.datePublished = new Date().toISOString();
        }

        const localPath = path.join(localContentDir, file.path);
        await fs.mkdir(path.dirname(localPath), { recursive: true });
        
        const updatedContent = matter.stringify(markdownContent, data);
        await fs.writeFile(localPath, updatedContent);
        await processFile(file.path, updatedContent);
      } else {
        const db = await openDb();
        await db.run(`DELETE FROM posts WHERE filePath = ?`, [file.path]);
      }
    }
  } catch (error) {
    console.error('Error fetching and storing documents:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

fetchAndStoreDocuments().then(() => {
}).catch(error => {
  console.error('Error:', error);
});