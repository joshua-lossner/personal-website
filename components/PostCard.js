import React, { useState, useRef } from 'react';
import { FaThumbtack, FaChevronDown, FaTag } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const PostCard = ({ title, subheading, date, category, description, content, pinned, tags, onTagClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  const expandCard = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const displayTags = tags.filter(tag => tag !== 'personalWebsite' && tag !== category);

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4 transition-all duration-500 ease-in-out hover:shadow-lg relative overflow-hidden ${isExpanded ? 'expanded' : ''}`}
    >
      {pinned && (
        <div className="absolute top-2 right-2">
          <FaThumbtack className="text-blue-500 w-4 h-4" />
        </div>
      )}
      
      <div className="card-summary">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">{title}</h2>
        {subheading && (
          <h3 className="text-sm italic text-gray-600 dark:text-gray-400 mb-2">{subheading}</h3>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      </div>

      <div 
        ref={contentRef}
        className={`card-content ${isExpanded ? 'expanded' : ''}`}
        style={{
          maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : '0px',
        }}
      >
        <div className="pt-2 pb-5">
          <ReactMarkdown className="prose dark:prose-invert dark:prose-dark max-w-none custom-article-typography">
            {content}
          </ReactMarkdown>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        <span>{new Date(date).toLocaleDateString()}</span>
        <div className="flex flex-wrap gap-2">
          {displayTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => onTagClick(tag)}
              className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 
                         text-blue-600 dark:text-blue-200 px-3 py-1 rounded-full text-xs flex items-center 
                         hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800 dark:hover:to-blue-700 
                         transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
            >
              <FaTag className="mr-1" size={8} />
              {tag}
            </button>
          ))}
        </div>
      </div>

      {!isExpanded && (
        <button 
          onClick={expandCard}
          className="mt-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors duration-300"
        >
          <FaChevronDown className="mr-2" /> Expand
        </button>
      )}
    </div>
  );
};

export default PostCard;