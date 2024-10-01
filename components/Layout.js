import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from './Sidebar';
import ErrorBoundary from './ErrorBoundary';

const DynamicMusicPlayer = dynamic(() => import('./MusicPlayer'), {
  ssr: false,
  loading: () => <p>Loading music player...</p>
});

export default function Layout({ children, categories }) {
  const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMusicPlayer = () => {
    setIsMusicPlayerVisible(!isMusicPlayerVisible);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Sidebar categories={categories} />
      <main className="flex-grow md:pl-20 overflow-y-auto h-full main-content">
        <div className="h-full overflow-y-auto pt-4 md:pt-6"> {/* Added padding top */}
          {children}
        </div>
      </main>
      <div 
        className={`fixed md:static right-0 top-0 bottom-0 w-full md:w-64 min-w-[256px] z-50 transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 overflow-y-auto ${
          isMobile ? (isMusicPlayerVisible ? 'translate-x-0' : 'translate-x-full') : ''
        }`}
      >
        <ErrorBoundary>
          <DynamicMusicPlayer />
        </ErrorBoundary>
      </div>
      {isMobile && (
        <button 
          onClick={toggleMusicPlayer}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg z-50"
          aria-label="Toggle Music Player"
        >
          {isMusicPlayerVisible ? '🎵' : '🎵'}
        </button>
      )}
    </div>
  );
};