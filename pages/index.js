import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import PostCard from '../components/PostCard'
import { getSortedPostsData } from '../lib/posts'
import { getCategories } from '../utils/categories'
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { useState } from 'react';

export default function Home({ allPostsData = [], categories = [] }) {
  const [filteredPosts, setFilteredPosts] = useState(allPostsData);
  const [activeTag, setActiveTag] = useState(null);

  const handleTagClick = (tag) => {
    if (activeTag === tag) {
      setFilteredPosts(allPostsData);
      setActiveTag(null);
    } else {
      const newFilteredPosts = allPostsData.filter(post => post.tags.includes(tag));
      setFilteredPosts(newFilteredPosts);
      setActiveTag(tag);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <Head>
        <title>Joshua Lossner - Personal Website</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Left panel - Categories */}
      <div className="flex-shrink-0 z-10">
        <Sidebar categories={categories} />
      </div>

      {/* Main content area */}
      <main className="flex-grow flex flex-col overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900">
          <div className="p-4 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">Joshua Lossner</h1>
              <h2 className="text-lg mb-2 text-gray-600 dark:text-gray-400">Information Technology Professional</h2>
            </div>
            <div className="flex space-x-4">
              <a href="https://x.com/Joshua_Lossner" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.facebook.com/joshua.lossner/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <FaFacebook size={20} />
              </a>
              <a href="https://www.linkedin.com/in/joshualossner/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <FaLinkedin size={20} />
              </a>
            </div>
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
        <div className="p-4 space-y-4 max-w-3xl mx-auto w-full"> {/* Added max-w-3xl and mx-auto */}
          {filteredPosts.map((post) => {
            console.log('Post content:', post.title, post.content.substring(0, 100)); // Log the first 100 characters
            return (
              <PostCard 
                key={post.id} 
                title={post.title}
                subheading={post.subheading}
                date={post.date} 
                category={post.category} 
                description={post.description} 
                content={post.content}
                pinned={post.pinned} 
                tags={post.tags}
                onTagClick={handleTagClick}
              />
            );
          })}
          {filteredPosts.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400">No posts available.</p>
          )}
        </div>
      </main>

      {/* Right panel */}
      <div className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 z-10 p-4">
        {/* Add other right panel content here */}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  let allPostsData = []
  let categories = []
  
  try {
    allPostsData = await getSortedPostsData()
    categories = getCategories()
  } catch (error) {
    console.error("Error fetching data:", error)
  }

  return {
    props: {
      allPostsData,
      categories
    },
    revalidate: 60 * 5, // Regenerate the page every 5 minutes
  }
}