import MusicPlayer from './MusicPlayer';
import Sidebar from './Sidebar';
import ErrorBoundary from './ErrorBoundary';

const Layout = ({ children, categories }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar categories={categories} />
      <div className="flex-grow overflow-auto pt-16 md:pt-0"> {/* Keep padding-top for mobile */}
        {children}
      </div>
      <div className="w-full md:w-60 bg-white dark:bg-gray-800 z-10 p-4">
        <ErrorBoundary>
          <MusicPlayer />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Layout;