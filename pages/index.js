import { useState, useEffect, useCallback, useRef } from 'react';
import { getSortedPostsData } from '../lib/posts';
import PostCard from '../components/PostCard';

const POSTS_PER_PAGE = 10;

export default function Home({ initialPosts, totalPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length < totalPosts);
  const observer = useRef();

  const filterPostsForHomePage = useCallback((postsToFilter) => {
    return postsToFilter.filter(post => 
      !(post.pinned && post.category.toLowerCase() !== 'home')
    );
  }, []);

  useEffect(() => {
    setFilteredPosts(filterPostsForHomePage(posts));
  }, [posts, filterPostsForHomePage]);

  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchMorePosts = async () => {
      if (page === 1) return; // Don't fetch on initial load
      setLoading(true);
      try {
        const res = await fetch(`/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`);
        const newPosts = await res.json();
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setHasMore(newPosts.length === POSTS_PER_PAGE);
      } catch (error) {
        console.error('Error fetching more posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMorePosts();
  }, [page]);

  return (
    <div className="flex flex-col h-full">
      <div className="h-14"></div> {/* This creates space equivalent to the sticky header */}
      <div className="container mx-auto px-4 pt-4">
        <div className="space-y-4 max-w-3xl mx-auto w-full fade-content"> {/* {{ edit_1 }} Removed p-4 to align padding with category pages */}
          {filteredPosts.map((post, index) => (
            <div key={post.id} ref={index === filteredPosts.length - 1 ? lastPostElementRef : null}>
              <PostCard 
                title={post.title}
                subtitle={post.subtitle}
                datePublished={post.datePublished}
                category={post.category}
                description={post.description}
                content={post.content || ''}
                tags={post.tags}
                audioFile={post.audioFile}
                pinned={post.pinned} // Add this line
              />
            </div>
          ))}
        </div>
        {loading && <p className="text-center mt-4">Loading more posts...</p>}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const { posts, totalPosts } = await getSortedPostsData(null, 1, POSTS_PER_PAGE);
  return {
    props: {
      initialPosts: posts,
      totalPosts,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}