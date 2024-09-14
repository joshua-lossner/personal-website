import ArticleCard from './ArticleCard';

export default function Feed({ posts }) {
  return (
    <div className="feed">
      {posts.map(post => (
        <ArticleCard key={post.slug} post={post} />
      ))}
    </div>
  );
}