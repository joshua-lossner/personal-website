import path from 'path';
import fs from 'fs/promises';
import matter from 'gray-matter';
import { openDb } from './db';

const localContentDir = path.join(process.cwd(), 'content');

export async function getPosts(category = null) {
  const db = await openDb();
  let query = 'SELECT id, title, subtitle, category, description, tags, datePublished, narration, audioFile, pinned, filePath FROM posts';
  let params = [];
  
  if (category && category !== 'home') {
    query += ' WHERE category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY datePublished DESC';
  
  const posts = await db.all(query, params);
  
  return posts.map(post => ({
    ...post,
    tags: JSON.parse(post.tags),
  }));
}

export async function getPostBySlug(slug) {
  const db = await openDb();
  const post = await db.get('SELECT id, title, subtitle, category, description, tags, datePublished, narration, audioFile, pinned, filePath FROM posts WHERE filePath = ?', [slug]);
  
  if (!post) return null;
  
  if (typeof window === 'undefined') {
    const fs = await import('fs/promises');
    const matter = await import('gray-matter');
    const fullPath = path.join(localContentDir, post.filePath);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { content } = matter.default(fileContents);
    return {
      ...post,
      tags: JSON.parse(post.tags),
      content,
    };
  }
  
  return {
    ...post,
    tags: JSON.parse(post.tags),
    content: '',
  };
}

export async function getSortedPostsData(category = null, page = 1, limit = 10) {
  const db = await openDb();
  const offset = (page - 1) * limit;
  
  let query = 'SELECT id, title, subtitle, category, description, tags, datePublished, narration, audioFile, pinned, filePath FROM posts WHERE hidden = 0'; // Add this condition
  let countQuery = 'SELECT COUNT(*) as count FROM posts WHERE hidden = 0'; // Add this condition
  let params = [];
  
  if (category && category !== 'home') {
    query += ' AND category = ?';
    countQuery += ' AND category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY datePublished DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  console.log('Executing query:', query, 'with params:', params);
  
  const posts = await db.all(query, params);
  const totalPosts = await db.get(countQuery, category && category !== 'home' ? [category] : []);
  
  console.log('Found posts:', posts.length);
  
  // Fetch content for each post
  const postsWithContent = await Promise.all(posts.map(async (post) => {
    const fullPath = path.join(localContentDir, post.filePath);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { content } = matter(fileContents);
    return {
      ...post,
      tags: JSON.parse(post.tags),
      content,
    };
  }));
  
  return {
    posts: postsWithContent,
    hasMore: offset + posts.length < totalPosts.count,
  };
}

export async function getCategories() {
  const db = await openDb();
  const categories = await db.all('SELECT DISTINCT category FROM posts WHERE category IS NOT NULL AND category != ""');
  console.log('All categories:', categories.map(c => c.category));
  return categories.map(c => c.category);
}