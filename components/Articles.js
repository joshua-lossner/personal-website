import { filterVisiblePosts } from '../utils/filterPosts';
import ArticleCard from './ArticleCard';

export default function Articles({ posts }) {
  const visiblePosts = filterVisiblePosts(posts);
  return (
    <div className="articles">
      {visiblePosts.map(post => (
        <ArticleCard key={post.slug} post={post} />
      ))}
    </div>
  );
}