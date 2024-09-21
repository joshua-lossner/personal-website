import Head from 'next/head'
import PostCard from '../components/PostCard'
import { useState } from 'react';
import { getSortedPostsData } from '../lib/posts';

export default function Home({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [activeTag, setActiveTag] = useState(null);

  const handleTagClick = (tag) => {
    if (activeTag === tag) {
      setPosts(initialPosts);
      setActiveTag(null);
    } else {
      const filteredPosts = initialPosts.filter(post => post.tags && post.tags.includes(tag));
      setPosts(filteredPosts);
      setActiveTag(tag);
    }
  };

  return (
    <div className="flex-grow flex flex-col overflow-y-auto">
      <Head>
        <title>Joshua C. Lossner - Personal Website</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900">
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">Joshua C. Lossner</h1>
          <h2 className="text-lg mb-2 text-gray-600 dark:text-gray-400">Where Tech Meets Creativity</h2>
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
      <div className="p-4 space-y-4 max-w-3xl mx-auto w-full">
        {posts && posts.length > 0 ? (
          posts.sort((a, b) => b.pinned - a.pinned || new Date(b.datePublished) - new Date(a.datePublished)).map((post) => (
            <PostCard 
              key={post.id} 
              title={post.title}
              subtitle={post.subtitle}
              datePublished={post.datePublished}
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
          <p className="text-gray-600 dark:text-gray-400">No posts available.</p>
        )}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const { posts } = await getSortedPostsData();
  return {
    props: {
      initialPosts: posts,
    },
  };
}