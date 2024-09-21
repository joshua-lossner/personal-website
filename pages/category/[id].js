import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import PostCard from '../../components/PostCard'
import { getSortedPostsData } from '../../lib/posts'
import { getCategories } from '../../utils/categories'

const categorySubheadings = {
  blog: "Thoughts and insights on technology and life",
  articles: "In-depth explorations of various topics",
  music: "Melodies, rhythms, and AI-generated tunes",
  aiTools: "Exploring the frontiers of artificial intelligence",
  experience: "My journey through the tech industry",
  education: "Learning never stops in the world of tech",
  notes: "Quick thoughts and observations",
  home: "Welcome to my personal website",
};

export default function Category({ initialCategory, initialPosts = [], categories = [] }) {
  const router = useRouter();
  const [category, setCategory] = useState(initialCategory);
  const [posts, setPosts] = useState(initialPosts);
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    if (router.query.id && categories && categories.length > 0) {
      const newCategory = categories.find(c => c.id === router.query.id);
      if (newCategory) {
        setCategory(newCategory.name);
        setPosts(initialPosts.filter(post => post.tags && post.tags.includes(`#${router.query.id}`)));
        setActiveTag(null);
      }
    }
  }, [router.query.id, categories, initialPosts]);

  const handleTagClick = (tag) => {
    if (activeTag === tag) {
      setPosts(initialPosts.filter(post => post.tags && post.tags.includes(`#${router.query.id}`)));
      setActiveTag(null);
    } else {
      const filteredPosts = initialPosts.filter(post => 
        post.tags && post.tags.includes(`#${router.query.id}`) && post.tags.includes(tag)
      );
      setPosts(filteredPosts);
      setActiveTag(tag);
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <main className="flex-grow flex flex-col overflow-hidden relative">
      <Head>
        <title>{`${category || 'Category'} - Joshua Lossner`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900">
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">{category || 'Category'}</h1>
          <h2 className="text-lg mb-2 text-gray-600 dark:text-gray-400">{category && categorySubheadings[category.toLowerCase()] || ''}</h2>
        </div>
        {activeTag && (
          <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            Showing posts tagged with: {activeTag}
            <button 
              onClick={() => handleTagClick(activeTag)} 
              className="ml-2 text-blue-600 dark:text-blue-300 hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>
      <div className="flex-grow overflow-y-auto scrollbar-hide">
        <div className="p-4 space-y-4 max-w-3xl mx-auto w-full">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                title={post.title}
                subheading={post.subheading}
                date={post.datePublished} // Change this line
                category={post.category} 
                description={post.description} 
                content={post.content}
                pinned={post.pinned}
                tags={post.tags}
                onTagClick={handleTagClick}
                audioFile={post.audioFile}
              />
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No posts available in this category.</p>
          )}
        </div>
      </div>
    </main>
  )
}

export async function getStaticPaths() {
  const categories = getCategories();
  const paths = categories.map((category) => ({
    params: { id: category.id },
  }));

  console.log('Generated paths:', paths);

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  try {
    const categories = getCategories();
    const initialCategory = categories.find((cat) => cat.id === params.id);
    const allPosts = await getSortedPostsData();
    const initialPosts = allPosts.filter(post => post.tags && post.tags.includes(`#${params.id}`));

    return {
      props: {
        initialCategory: initialCategory ? initialCategory.name : null,
        initialPosts: initialPosts || [],
        categories: categories || [],
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error(`Error fetching data for category ${params.id}:`, error);
    return {
      props: {
        initialCategory: null,
        initialPosts: [],
        categories: [],
      },
      revalidate: 60,
    };
  }
}