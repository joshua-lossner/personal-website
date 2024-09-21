import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import PostCard from '../../components/PostCard'
import { getSortedPostsData, getCategories } from '../../lib/posts'
import { categories } from '../../utils/categories'

export default function Category({ initialCategory, initialPosts = [] }) {
  const router = useRouter();
  const [category, setCategory] = useState(initialCategory);
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    if (router.query.id) {
      setCategory(router.query.id);
      setPosts(initialPosts);
    }
  }, [router.query.id, initialPosts]);

  const categoryData = categories.find(c => c.id === category) || categories[0];

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <main className="flex-grow flex flex-col overflow-hidden relative">
      <Head>
        <title>{`${categoryData.name} - Joshua C. Lossner`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900">
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">Joshua C. Lossner</h1>
          <h2 className="text-lg mb-2 text-gray-600 dark:text-gray-400">{categoryData.subheader}</h2>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto scrollbar-hide">
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
  const categories = await getCategories();
  const paths = categories.map((category) => ({
    params: { id: category },
  }));

  paths.push({ params: { id: 'home' } });

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const category = params.id === 'home' ? null : params.id;
  const { posts } = await getSortedPostsData(category);

  return {
    props: {
      initialPosts: posts,
      initialCategory: params.id,
    },
  };
}