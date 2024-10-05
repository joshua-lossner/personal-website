import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head'; // Add this import
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
    const allowedCategories = ['home', 'blog', 'articles']; // {{ edit_1 }} Define allowed categories
    return postsToFilter.filter(post => 
      allowedCategories.includes(post.category.toLowerCase()) && // Check if category is allowed
      (post.category.toLowerCase() === 'home' || !post.pinned) // {{ edit_2 }} Exclude pinned posts from 'blog' and 'articles'
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
    <>
      <Head>
        <title>Joshua C. Lossner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Added max-width and padding */}
        <div className="space-y-4">
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
                pinned={post.pinned} // Ensure pinned status is passed correctly
              />
            </div>
          ))}
          {loading && <p className="text-center mt-4">Loading more posts...</p>}
          {!hasMore && <p className="text-center mt-4">No more posts to load</p>}
        </div>
      </div>
    </>
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