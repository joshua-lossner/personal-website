import { getSortedPostsData } from '../../lib/posts';

export default async function handler(req, res) {
  const posts = await getSortedPostsData();
  res.status(200).json(posts);
}