import MusicPlayer from './MusicPlayer';
import Sidebar from './Sidebar';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import ErrorBoundary from './ErrorBoundary';
import { useContext } from 'react';
import { CategoriesContext } from '../contexts/CategoriesContext';

const Layout = ({ children }) => {
  const { categories } = useContext(CategoriesContext);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar categories={categories} />
      <div className="flex-grow overflow-auto">
        {children}
      </div>
      <div className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 z-10 p-4 flex flex-col justify-between">
        <ErrorBoundary>
          <MusicPlayer />
        </ErrorBoundary>
        <div className="mt-auto">
          <div className="flex justify-center space-x-4 mb-4">
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
      </div>
    </div>
  );
};

export default Layout;