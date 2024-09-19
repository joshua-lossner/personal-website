import React from 'react';
import Head from 'next/head';

const MusicPage = () => {
  return (
    <>
      <Head>
        <title>Music - Joshua Lossner</title>
        <meta name="description" content="Explore Joshua Lossner's music collection and playlists." />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Music</h1>
        <p className="text-lg mb-4">Welcome to my music page. Use the player in the sidebar to listen to various playlists and tracks.</p>
        {/* You can add more content specific to the music page here */}
      </div>
    </>
  );
};

export default MusicPage;