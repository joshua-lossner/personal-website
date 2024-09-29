import { getSortedPostsData } from '../../lib/posts';

export default async function handler(req, res) {
  const { category, page = 1, limit = 10 } = req.query;
  const { posts } = await getSortedPostsData(category === 'home' ? null : category, parseInt(page), parseInt(limit));
  res.status(200).json(posts);
}