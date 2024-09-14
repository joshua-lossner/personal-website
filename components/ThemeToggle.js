import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ small = false }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleSize = small ? 'w-12 h-6' : 'w-14 h-7';
  const iconSize = small ? 10 : 12;

  return (
    <div className="flex items-center">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`${toggleSize} flex items-center rounded-full p-1 bg-gray-300 dark:bg-gray-600 transition-colors duration-300 focus:outline-none`}
      >
        <div
          className={`${
            theme === 'dark' ? 'translate-x-full bg-blue-500' : 'translate-x-0 bg-yellow-500'
          } w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center`}
        >
          {theme === 'dark' ? (
            <FaMoon className="text-white" size={iconSize} />
          ) : (
            <FaSun className="text-white" size={iconSize} />
          )}
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle;