require('dotenv').config({ path: '.env.local' });

console.log('GitHub Username:', process.env.GITHUB_USERNAME);
console.log('GitHub Repo:', process.env.GITHUB_REPO);
console.log('GitHub Token:', process.env.GITHUB_TOKEN ? 'Set' : 'Not set');

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

const githubUsername = process.env.GITHUB_USERNAME;
const githubRepo = process.env.GITHUB_REPO;
const githubToken = process.env.GITHUB_TOKEN;

const localContentDir = path.join(process.cwd(), 'content');

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
    // Clear the local content directory before fetching new files
    await clearLocalContentDir();

    const files = await fetchFilesRecursively();
    for (const file of files) {
      const content = await fetchFileContent(file.path);
      const { data, content: markdownContent } = matter(content);
      
      if (data.tags && data.tags.includes('personalWebsite')) {
        // Ensure description is included in the frontmatter
        if (!data.description) {
          console.warn(`Warning: No description found for ${file.path}`);
          data.description = 'No description available.';
        }

        const localPath = path.join(localContentDir, file.path);
        await fs.mkdir(path.dirname(localPath), { recursive: true });
        
        // Reconstruct the file content with updated frontmatter
        const updatedContent = matter.stringify(markdownContent, data);
        await fs.writeFile(localPath, updatedContent);
        console.log(`Stored: ${file.path}`);
      }
    }
    console.log('All documents fetched and stored successfully.');
  } catch (error) {
    console.error('Error fetching and storing documents:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

fetchAndStoreDocuments();