import { filterVisiblePosts } from '../utils/filterPosts';
import ArticleCard from './ArticleCard';

export default function Music({ posts }) {
  const visiblePosts = filterVisiblePosts(posts);
  return (
    <div className="music">
      {visiblePosts.map(post => (
        <ArticleCard key={post.slug} post={post} />
      ))}
    </div>
  );
}