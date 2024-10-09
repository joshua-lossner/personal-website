import { getSortedPostsData } from '../lib/posts';
import { handleApiError } from '../utils/apiErrorHandler';

export default async function handler(req, res) {
  try {
    const posts = await getSortedPostsData();
    const visiblePosts = posts.filter(post => !post.hidden);
    res.status(200).json(visiblePosts);
  } catch (error) {
    handleApiError(res, error, 'Failed to fetch posts');
  }
}

export async function getArticles(req, res) {
  try {
    const posts = await getSortedPostsData();
    const visiblePosts = posts.filter(post => !post.hidden);
    res.status(200).json(visiblePosts);
  } catch (error) {
    handleApiError(res, error, 'Failed to fetch articles');
  }
}