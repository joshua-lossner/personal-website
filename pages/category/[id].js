import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import Sidebar from '../../components/Sidebar'
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

export default function Category({ initialCategory, initialPosts, categories }) {
  const router = useRouter();
  const [category, setCategory] = useState(initialCategory);
  const [posts, setPosts] = useState(initialPosts);
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    if (router.query.id) {
      const newCategory = categories.find(c => c.id === router.query.id);
      if (newCategory) {
        setCategory(newCategory.name);
        setPosts(initialPosts.filter(post => post.category.toLowerCase() === router.query.id.toLowerCase()));
        setActiveTag(null);
      }
    }
  }, [router.query.id, categories, initialPosts]);

  const handleTagClick = (tag) => {
    if (activeTag === tag) {
      setPosts(initialPosts.filter(post => post.category.toLowerCase() === router.query.id.toLowerCase()));
      setActiveTag(null);
    } else {
      const filteredPosts = initialPosts.filter(post => 
        post.category.toLowerCase() === router.query.id.toLowerCase() && post.tags.includes(tag)
      );
      setPosts(filteredPosts);
      setActiveTag(tag);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <Head>
        <title>{`${category} - Joshua Lossner`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Left panel - Categories */}
      <div className="w-16 flex-shrink-0 z-10">
        <Sidebar categories={categories} />
      </div>

      {/* Main content area */}
      <main className="flex-grow flex flex-col overflow-hidden relative">
        <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900">
          <div className="p-4">
            <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">{category}</h1>
            <h2 className="text-lg mb-2 text-gray-600 dark:text-gray-400">{categorySubheadings[category.toLowerCase()] || ''}</h2>
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
          <div className="p-4 space-y-4 max-w-2xl mx-auto">
            {posts.map(({ id, date, title, subheading, category, description, content, pinned, tags }) => (
              <PostCard 
                key={id} 
                title={title}
                subheading={subheading}
                date={date} 
                category={category} 
                description={description} 
                content={content}
                pinned={pinned}
                tags={tags}
                onTagClick={handleTagClick}
              />
            ))}
            {posts.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400">No posts available in this category.</p>
            )}
          </div>
        </div>
      </main>

      {/* Right panel - Empty */}
      <div className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 z-10">
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const categories = getCategories();
  const paths = categories.map((category) => ({
    params: { id: category.id },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const categories = getCategories();
  const category = categories.find((c) => c.id === params.id);
  const allPosts = await getSortedPostsData();
  
  if (!category) {
    return {
      notFound: true,
    };
  }

  const initialPosts = allPosts.filter((post) => {
    if (category.id === 'home') {
      return post.isHomePost;
    }
    return post.category.toLowerCase() === category.id.toLowerCase();
  });

  return {
    props: {
      initialCategory: category.name,
      initialPosts,
      categories,
    },
    revalidate: 60 * 5, // Regenerate the page every 5 minutes
  };
}