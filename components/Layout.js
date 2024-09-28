import { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from './Sidebar';
import ErrorBoundary from './ErrorBoundary';

const DynamicMusicPlayer = dynamic(() => import('./MusicPlayer'), {
  ssr: false,
  loading: () => <p>Loading music player...</p>
});

const Layout = ({ children, categories }) => {
  const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(false);

  const toggleMusicPlayer = () => {
    setIsMusicPlayerVisible(!isMusicPlayerVisible);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar categories={categories} />
      <div className="flex-grow overflow-auto pt-16 md:pt-0">
        {children}
      </div>
      <div className={`fixed md:static right-0 top-0 h-full transition-transform duration-300 ease-in-out ${isMusicPlayerVisible ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} bg-white dark:bg-gray-800`}>
        <ErrorBoundary>
          <DynamicMusicPlayer />
        </ErrorBoundary>
      </div>
      <button 
        onClick={toggleMusicPlayer}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg md:hidden z-50"
        aria-label="Toggle Music Player"
      >
        {isMusicPlayerVisible ? '🎵' : '🎵'}
      </button>
    </div>
  );
};

export default Layout;