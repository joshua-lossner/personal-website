import path from 'path';
import { openDb } from './db';
import fs from 'fs/promises';
import matter from 'gray-matter';

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
    tags: post.tags ? JSON.parse(post.tags) : [],
    pinned: Boolean(post.pinned),
  }));
}

export async function getPostBySlug(slug) {
  const db = await openDb();
  const post = await db.get('SELECT id, title, subtitle, category, description, tags, datePublished, narration, audioFile, pinned, filePath FROM posts WHERE filePath = ?', [slug]);
  
  if (!post) return null;
  
  if (typeof window === 'undefined') {
    const fullPath = path.join(localContentDir, post.filePath);
    
    try {
      const fileContents = await fs.readFile(fullPath, 'utf8');
      const { content } = matter(fileContents);
      return {
        ...post,
        tags: JSON.parse(post.tags),
        content,
      };
    } catch (error) {
      console.error(`Error reading file: ${fullPath}`, error);
      return {
        ...post,
        tags: JSON.parse(post.tags),
        content: 'Content not available',
      };
    }
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

  let query = `
    SELECT * FROM posts 
    WHERE hidden = 0
  `;
  let params = [];

  if (category && category !== 'home') {
    query += ' AND category = ?';
    params.push(category);
  }

  query += `
    ORDER BY 
      pinned DESC,
      datePublished DESC 
    LIMIT ? OFFSET ?
  `;
  params.push(limit, offset);

  const posts = await db.all(query, params);

  const totalPosts = await db.get('SELECT COUNT(*) as count FROM posts WHERE hidden = 0');

  const postsWithContent = await Promise.all(posts.map(async (post) => {
    const fullPath = path.join(localContentDir, post.filePath);
    try {
      const fileContents = await fs.readFile(fullPath, 'utf8');
      const { content } = matter(fileContents);
      return {
        ...post,
        content,
        tags: post.tags ? JSON.parse(post.tags) : [],
      };
    } catch (error) {
      console.error(`Error reading file: ${fullPath}`, error);
      return {
        ...post,
        content: 'Content not available',
        tags: post.tags ? JSON.parse(post.tags) : [],
      };
    }
  }));

  return {
    posts: postsWithContent.map(post => ({
      id: post.id,
      title: post.title || '',
      subtitle: post.subtitle || '',
      category: post.category || '',
      description: post.description || '',
      tags: post.tags,
      datePublished: post.datePublished || '',
      narration: post.narration || '',
      audioFile: post.audioFile || '',
      pinned: Boolean(post.pinned),
      hidden: Boolean(post.hidden),
      filePath: post.filePath || '',
      content: post.content || '',
    })),
    totalPosts: totalPosts.count,
  };
}

export async function getCategories() {
  const db = await openDb();
  const categories = await db.all('SELECT DISTINCT category FROM posts WHERE category IS NOT NULL AND category != ""');
  return categories.map(c => c.category).filter(Boolean);
}