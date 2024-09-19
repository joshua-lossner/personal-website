import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const localContentDir = path.join(process.cwd(), 'content');

async function getLocalFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map((entry) => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? getLocalFiles(res) : res;
    }));
    return files.flat();
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn('Content directory does not exist yet. Please run the fetch-documents script.');
      return [];
    }
    throw error;
  }
}

export async function getPosts() {
  try {
    const files = await getLocalFiles(localContentDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const allPostsData = await Promise.all(markdownFiles.map(async (file) => {
      const content = await fs.readFile(file, 'utf8');
      const { data: metadata, content: markdownContent } = matter(content);
      const id = path.relative(localContentDir, file);

      return {
        id,
        audioFile: metadata.audioFile || null,
        ...metadata,
        date: metadata.date ? metadata.date.toISOString() : null, // Convert Date to string
        content: markdownContent,
      };
    }));

    return allPostsData;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getSortedPostsData(category) {
  try {
    const allPosts = await getPosts();
    const filteredPosts = category
      ? allPosts.filter(post => post.category && post.category.toLowerCase() === category.toLowerCase())
      : allPosts;

    return filteredPosts.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error getting sorted posts:', error);
    return [];
  }
}

export async function getHomeContent() {
  const posts = await getPosts();
  const homePost = posts.find(post => 
    post.tags && (post.tags.includes('#home') || post.tags.includes('home'))
  );
  
  if (!homePost) {
    console.warn('No home post found');
    return null;
  }

  return {
    title: homePost.title,
    content: homePost.content,
  };
}