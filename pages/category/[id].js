import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import PostCard from '../../components/PostCard'
import { getSortedPostsData, getCategories } from '../../lib/posts'
import { categories } from '../../utils/categories'

const POSTS_PER_PAGE = 10;

export default function Category({ initialCategory, initialPosts, totalPosts }) {
  const router = useRouter();
  const [category, setCategory] = useState(initialCategory);
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length < totalPosts);
  const [activeTag, setActiveTag] = useState(null);
  const observer = useRef();

  useEffect(() => {
    if (router.query.id) {
      setCategory(router.query.id);
      setPosts(initialPosts);
      setPage(1);
      setHasMore(initialPosts.length < totalPosts);
    }
  }, [router.query.id, initialPosts, totalPosts]);

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
        const res = await fetch(`/api/posts?category=${category}&page=${page}&limit=${POSTS_PER_PAGE}`);
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
  }, [page, category]);

  const categoryData = categories.find(c => c.id === category) || categories[0];

  const handleTagClick = (tag) => {
    if (activeTag === tag) {
      setPosts(initialPosts);
      setActiveTag(null);
    } else {
      const filteredPosts = posts.filter(post => post.tags && post.tags.includes(tag));
      setPosts(filteredPosts);
      setActiveTag(tag);
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col h-full">
      <Head>
        <title>{`${categoryData.name} - Joshua C. Lossner`}</title>
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
          {posts && posts.length > 0 ? (
            posts
              .sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return new Date(b.datePublished) - new Date(a.datePublished);
              })
              .map((post, index) => (
                <div key={post.id} ref={index === posts.length - 1 ? lastPostElementRef : null}>
                  <PostCard 
                    title={post.title || 'Untitled'}
                    subtitle={post.subtitle || ''}
                    datePublished={post.datePublished || ''}
                    category={post.category || ''} 
                    description={post.description || ''} 
                    content={post.content || ''}
                    tags={post.tags || []}
                    onTagClick={handleTagClick}
                    audioFile={post.audioFile || ''}
                  />
                </div>
              ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No posts available in this category.</p>
          )}
          {loading && <p className="text-center">Loading more posts...</p>}
          {!hasMore && <p className="text-center">No more posts to load</p>}
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const categories = await getCategories();
  const paths = categories.map((category) => ({
    params: { id: category },
  }));

  paths.push({ params: { id: 'home' } });

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const category = params.id === 'home' ? null : params.id;
  const { posts, totalPosts } = await getSortedPostsData(category, 1, POSTS_PER_PAGE);

  return {
    props: {
      initialPosts: posts,
      initialCategory: params.id,
      totalPosts,
    },
  };
}