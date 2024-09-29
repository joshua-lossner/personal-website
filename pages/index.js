import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import PostCard from '../components/PostCard';
import { getSortedPostsData } from '../lib/posts';

const POSTS_PER_PAGE = 10;

export default function Home({ initialPosts, totalPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length < totalPosts);
  const [activeTag, setActiveTag] = useState(null);
  const observer = useRef();

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

  useEffect(() => {
    if (activeTag) {
      setFilteredPosts(posts.filter(post => post.tags && post.tags.includes(activeTag)));
    } else {
      setFilteredPosts(posts);
    }
  }, [posts, activeTag]);

  const handleTagClick = (tag) => {
    if (activeTag === tag) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Head>
        <title>Joshua C. Lossner - Personal Website</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900">
        {activeTag && (
          <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            <span className="text-sm md:text-base">Showing posts tagged with: {activeTag}</span>
            <button 
              onClick={() => handleTagClick(activeTag)} 
              className="ml-2 text-sm md:text-base text-blue-600 dark:text-blue-300 hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-4 max-w-3xl mx-auto w-full fade-content">
          {filteredPosts.map((post, index) => (
            <div key={post.id} ref={index === filteredPosts.length - 1 ? lastPostElementRef : null}>
              <PostCard 
                title={post.title}
                subtitle={post.subtitle}
                datePublished={post.datePublished}
                category={post.category} 
                description={post.description} 
                content={post.content}
                tags={post.tags}
                audioFile={post.audioFile}
                onTagClick={handleTagClick}
              />
            </div>
          ))}
          {loading && <p className="text-center">Loading more posts...</p>}
          {!hasMore && !activeTag && <p className="text-center">No more posts to load</p>}
          {filteredPosts.length === 0 && <p className="text-center">No posts found for this tag</p>}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const { posts, totalPosts } = await getSortedPostsData(null, 1, POSTS_PER_PAGE);
  return {
    props: {
      initialPosts: posts,
      totalPosts,
    },
  };
}