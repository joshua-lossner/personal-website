import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { openDb } from '../lib/db.js';

dotenv.config({ path: '.env.local' });

console.log('GitHub Username:', process.env.GITHUB_USERNAME);
console.log('GitHub Repo:', process.env.GITHUB_REPO);
console.log('GitHub Token:', process.env.GITHUB_TOKEN ? 'Set' : 'Not set');

const githubUsername = process.env.GITHUB_USERNAME;
const githubRepo = process.env.GITHUB_REPO;
const githubToken = process.env.GITHUB_TOKEN;

const localContentDir = path.join(process.cwd(), 'content');

async function updateDatabase(post) {
  const db = await openDb();
  const { title, subtitle, category, description, tags, datePublished, narration, audioFile, pinned, hidden, filePath, published } = post;
  
  if (published === true) {
    console.log(`Inserting/updating published document: ${filePath}`);
    await db.run(`
      INSERT OR REPLACE INTO posts (title, subtitle, category, description, tags, datePublished, narration, audioFile, pinned, hidden, filePath)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, subtitle, category, description, JSON.stringify(tags), datePublished, narration, audioFile, pinned ? 1 : 0, hidden ? 1 : 0, filePath]);
  } else {
    console.log(`Removing unpublished document from database: ${filePath}`);
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
  
  console.log('Processing file:', filePath);
  console.log('Metadata:', metadata);
  console.log('Published status:', post.published);
  
  await fs.writeFile(path.join(localContentDir, filePath), content);
  await updateDatabase(post);
}

async function fetchFilesRecursively(path = '') {
  const url = `https://api.github.com/repos/${githubUsername}/${githubRepo}/contents/${path}`;
  console.log('Fetching from URL:', url);
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
    console.log('Cleared local content directory');
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
      
      console.log(`Processing ${file.path}. Published status: ${data.published}`);

      // Only process if explicitly published
      if (data.published === true) {
        // Ensure all required fields are present
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

        // Set default values for optional fields
        data.subtitle = data.subtitle || '';
        data.narration = data.narration || '';
        data.audioFile = data.audioFile || '';
        data.pinned = data.pinned || false;
        data.tags = data.tags || [];

        // Ensure datePublished is in the correct format
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
        
        // Reconstruct the file content with updated frontmatter
        const updatedContent = matter.stringify(markdownContent, data);
        await fs.writeFile(localPath, updatedContent);
        await processFile(file.path, updatedContent);
        console.log(`Stored and processed: ${file.path} (Category: ${data.category})`);
      } else {
        console.log(`Skipped unpublished document: ${file.path}`);
        // Remove from database if it exists
        const db = await openDb();
        await db.run(`DELETE FROM posts WHERE filePath = ?`, [file.path]);
      }
    }
    console.log('All documents processed successfully.');
  } catch (error) {
    console.error('Error fetching and storing documents:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

fetchAndStoreDocuments().then(() => {
  console.log('Finished fetching and processing documents');
}).catch(error => {
  console.error('Error:', error);
});