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

      console.log('Processing file:', id, 'audioFile:', metadata.audioFile);

      return {
        id,
        audioFile: metadata.audioFile,
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
  console.log('Raw fetched posts:', posts.length);

  const sortedPosts = posts
    .filter(post => {
      const hasPersonalWebsiteTag = post.tags && post.tags.includes('personalWebsite');
      console.log(`Post "${post.title}" has personalWebsite tag: ${hasPersonalWebsiteTag}`);
      return hasPersonalWebsiteTag;
    })
    .map(post => {
      let category = 'home';
      if (post.tags.includes('#blog')) category = 'blog';
      else if (post.tags.includes('#articles')) category = 'articles';
      else if (post.tags.includes('#music')) category = 'music';
      else if (post.tags.includes('#aiTools')) category = 'aiTools';
      else if (post.tags.includes('#experience')) category = 'experience';
      else if (post.tags.includes('#education')) category = 'education';
      else if (post.tags.includes('#notes')) category = 'notes';
      else if (post.tags.includes('#projects')) category = 'projects';

      const mappedPost = {
        id: post.id,
        title: post.title,
        subheading: post.subheading || '',
        date: post.date instanceof Date ? post.date.toISOString() : post.date,
        category: category,
        description: post.description || 'No description available.',
        content: post.content,
        pinned: post.pinned || false,
        isHomePost: post.tags.includes('home'),
        tags: post.tags,
        company: post.company || '',
        duration: post.duration || '',
        audioFile: post.audioFile || null, // Use null if audioFile is not present
      };

      console.log('Mapped post:', { title: mappedPost.title, category: mappedPost.category, audioFile: mappedPost.audioFile });
      return mappedPost;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });

  console.log('Sorted posts:', sortedPosts.length);
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