import React, { useState, useRef, useContext } from 'react';
import { FaThumbtack, FaTag, FaPlay, FaList, FaForward } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { AudioContext } from '../contexts/AudioContext';

const PostCard = ({ title, subheading, date, category, description, content, pinned, tags, onTagClick, audioFile }) => {
  console.log('PostCard rendered:', { title, category, audioFile }); // Add this line

  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const { playSong, addToQueue, addToUpNext } = useContext(AudioContext);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    console.log('Card expanded:', !isExpanded, 'for post:', title);
  };

  const displayTags = tags.filter(tag => tag !== 'personalWebsite' && tag !== category);

  // Format the date correctly
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const MusicButtons = () => {
    console.log('Rendering MusicButtons, audioFile:', audioFile);
    const formattedAudioFile = audioFile.replace('.mp3', '');
    return (
      <div className="absolute top-2 right-2 flex space-x-2">
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Play button clicked for:', formattedAudioFile);
            playSong(audioFile);
          }}
        >
          <FaPlay size={16} />
        </button>
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Add to queue button clicked for:', audioFile);
            addToQueue(audioFile);
          }}
        >
          <FaList size={16} />
        </button>
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Add to up next button clicked for:', audioFile);
            addToUpNext(audioFile);
          }}
        >
          <FaForward size={16} />
        </button>
      </div>
    );
  };

  return (
    <div 
      onClick={(e) => {
        e.preventDefault();
        toggleExpand();
      }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 
                  transition-all duration-300 ease-in-out 
                  hover:shadow-lg hover:scale-[1.02] 
                  cursor-pointer relative
                  ${isExpanded ? 'expanded' : ''}`}
    >
      {pinned && (
        <div className="absolute top-2 left-2">
          <FaThumbtack className="text-blue-500 w-3 h-3" />
        </div>
      )}
      
      {category.toLowerCase() === 'music' && audioFile && <MusicButtons />}
      
      <div className="card-summary">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">{title}</h2>
        {subheading && (
          <h3 className="text-xs sm:text-sm italic text-gray-600 dark:text-gray-400 mb-2">{subheading}</h3>
        )}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
      </div>

      <div 
        ref={contentRef}
        className={`card-content mt-4 transition-all duration-500 ease-in-out ${isExpanded ? 'expanded' : ''}`}
      >
        {isExpanded && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400"
          >
            {content}
          </ReactMarkdown>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-600 dark:text-gray-400 mt-3">
        <span className="mb-2 sm:mb-0">{formatDate(date)}</span>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {displayTags.map((tag, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick(tag);
              }}
              className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-[10px] flex items-center 
                         hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out"
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