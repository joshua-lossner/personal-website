import React, { useState, useContext } from 'react';
import { FaTag, FaPlay, FaList, FaForward, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { AudioContext } from '../contexts/AudioContext';

const PostCard = ({ title, subtitle, datePublished, category, description, content, tags, onTagClick, audioFile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { playSong, addToQueue, addToUpNext } = useContext(AudioContext);

  const displayTags = tags?.filter(tag => tag !== 'personalWebsite' && tag !== category) || [];

  const formatDate = (dateString) => {
    if (!dateString) return 'No date available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const MusicButtons = () => {
    if (!audioFile) return null;
    return (
      <div className="absolute top-2 right-2 flex space-x-2">
        <button onClick={(e) => { e.stopPropagation(); playSong(audioFile); }} className="music-button">
          <FaPlay size={16} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); addToUpNext(audioFile); }} className="music-button">
          <FaForward size={16} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); addToQueue(audioFile); }} className="music-button">
          <FaList size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 transition-all duration-300 ease-in-out hover:shadow-lg relative">
      {category.toLowerCase() === 'music' && <MusicButtons />}
      
      <div onClick={toggleExpand} className="cursor-pointer">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">{title}</h2>
        {subtitle && (
          <h3 className="text-xs sm:text-sm italic text-gray-600 dark:text-gray-400 mb-2">{subtitle}</h3>
        )}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
        
        <button 
          onClick={toggleExpand} 
          className="text-blue-500 hover:text-blue-600 transition-colors duration-200 flex items-center"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
          {isExpanded ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {content}
          </ReactMarkdown>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-600 dark:text-gray-400 mt-3">
        <span className="mb-2 sm:mb-0">{formatDate(datePublished)}</span>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {displayTags.map((tag, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick && onTagClick(tag);
              }}
              className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-[10px] flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out"
            >
              <FaTag className="mr-1" size={6} />
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;