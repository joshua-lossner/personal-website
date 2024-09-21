import MusicPlayer from './MusicPlayer';
import Sidebar from './Sidebar';
import ErrorBoundary from './ErrorBoundary';

const Layout = ({ children, categories }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar categories={categories} />
      <div className="flex-grow overflow-auto">
        {children}
      </div>
      <div className="w-60 flex-shrink-0 bg-white dark:bg-gray-800 z-10 p-4 flex flex-col">
        <ErrorBoundary>
          <MusicPlayer />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Layout;