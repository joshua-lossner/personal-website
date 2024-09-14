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
        ...metadata,
        content: markdownContent,
      };
    }));

    return allPostsData;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getSortedPostsData() {
  const posts = await getPosts();
  console.log('Fetched posts:', posts);

  const sortedPosts = posts
    .filter(post => post.tags && post.tags.includes('personalWebsite'))
    .map(post => ({
      id: post.id,
      title: post.title,
      subheading: post.subheading || '',
      date: post.date instanceof Date ? post.date.toISOString() : post.date,
      category: post.tags.includes('#blog') ? 'blog' : 
                post.tags.includes('#articles') ? 'articles' :
                post.tags.includes('#music') ? 'music' :
                post.tags.includes('#aiTools') ? 'aiTools' :
                post.tags.includes('#experience') ? 'experience' :
                post.tags.includes('#education') ? 'education' :
                post.tags.includes('#notes') ? 'notes' :
                post.tags.includes('#projects') ? 'projects' : 'home',
      description: post.description || 'No description available.',
      content: post.content,
      pinned: post.pinned || false,
      isHomePost: post.tags.includes('home'),
      tags: post.tags // Include all tags
    }))
    .sort((a, b) => {
      // Sort pinned posts first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // For pinned posts, sort #home posts first
      if (a.pinned && b.pinned) {
        if (a.isHomePost && !b.isHomePost) return -1;
        if (!a.isHomePost && b.isHomePost) return 1;
      }
      // Then sort by date
      return new Date(b.date) - new Date(a.date);
    });

  console.log('Sorted posts:', sortedPosts);
  return sortedPosts;
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