import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { openDb } from './db';

const localContentDir = path.join(process.cwd(), 'content');

export async function getPosts() {
  const db = await openDb();
  const posts = await db.all('SELECT * FROM posts ORDER BY datePublished DESC');
  
  return posts.map(post => ({
    ...post,
    tags: JSON.parse(post.tags),
  }));
}

export async function getPostBySlug(slug) {
  const db = await openDb();
  const post = await db.get('SELECT * FROM posts WHERE filePath = ?', [slug]);
  
  if (!post) return null;
  
  const fullPath = path.join(localContentDir, post.filePath);
  const fileContents = await fs.readFile(fullPath, 'utf8');
  const { content } = matter(fileContents);
  
  return {
    ...post,
    tags: JSON.parse(post.tags),
    content,
  };
}

export async function getSortedPostsData(page = 1, limit = 10) {
  const db = await openDb();
  const offset = (page - 1) * limit;
  
  const posts = await db.all(
    'SELECT * FROM posts ORDER BY datePublished DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  
  const totalPosts = await db.get('SELECT COUNT(*) as count FROM posts');
  
  return {
    posts: posts.map(post => ({
      ...post,
      tags: JSON.parse(post.tags),
    })),
    hasMore: offset + posts.length < totalPosts.count,
  };
}

// Add more functions as needed for filtering