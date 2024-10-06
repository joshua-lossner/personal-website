import { getSortedPostsData } from '../../lib/posts';
import { rateLimiter } from '../../utils/rateLimiter';

export default async function handler(req, res) {
  // Apply rate limiting
  const rateLimitResult = await rateLimiter(req, res);
  if (!rateLimitResult) {
    return; // The response has already been sent by the rateLimiter function
  }

  const { category, page = 1, limit = 10 } = req.query;
  const { posts } = await getSortedPostsData(category === 'home' ? null : category, parseInt(page), parseInt(limit));
  res.status(200).json(posts);
}