import { filterVisiblePosts } from '../utils/filterPosts';
import ArticleCard from './ArticleCard';

export default function Feed({ posts }) {
  console.log('Received posts:', posts); // Log the received posts
  const visiblePosts = filterVisiblePosts(posts);
  console.log('Visible posts:', visiblePosts); // Log the visible posts after filtering
  return (
    <div className="feed">
      {visiblePosts.map(post => (
        <ArticleCard key={post.slug} post={post} />
      ))}
    </div>
  );
}