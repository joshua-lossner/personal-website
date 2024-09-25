import { filterVisiblePosts } from '../utils/filterPosts';
import ArticleCard from './ArticleCard';

export default function Home({ posts }) {
  const visiblePosts = filterVisiblePosts(posts);
  return (
    <div className="home">
      {visiblePosts.map(post => (
        <ArticleCard key={post.slug} post={post} />
      ))}
    </div>
  );
}