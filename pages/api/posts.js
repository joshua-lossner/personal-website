import { getSortedPostsData } from '../../lib/posts'

export default async function handler(req, res) {
  const { page = 1, limit = 10 } = req.query
  const { posts, hasMore } = await getSortedPostsData(parseInt(page), parseInt(limit))
  res.status(200).json({ posts, hasMore })
}