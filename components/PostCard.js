import React, { useState, useRef } from 'react';
import { FaThumbtack, FaChevronDown, FaTag } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const PostCard = ({ title, subheading, date, category, description, content, pinned, tags, onTagClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  const expandCard = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const displayTags = tags.filter(tag => tag !== 'personalWebsite' && tag !== category);

  // Format the date correctly
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 transition-all duration-500 ease-in-out hover:shadow-lg relative overflow-hidden ${isExpanded ? 'expanded' : ''}`}
    >
      {pinned && (
        <div className="absolute top-2 right-2">
          <FaThumbtack className="text-blue-500 w-3 h-3" />
        </div>
      )}
      
      <div className="card-summary">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">{title}</h2>
        {subheading && (
          <h3 className="text-xs sm:text-sm italic text-gray-600 dark:text-gray-400 mb-2">{subheading}</h3>
        )}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
      </div>

      <div 
        ref={contentRef}
        className={`card-content ${isExpanded ? 'expanded' : ''}`}
        style={{
          maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : '0px',
        }}
      >
        <div className="pt-2 pb-8">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              table: props => <table className="border-collapse table-auto w-full text-sm mb-4" {...props} />,
              thead: props => <thead className="bg-gray-50 dark:bg-gray-700" {...props} />,
              th: props => <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left" {...props} />,
              td: props => <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props} />
            }}
            className="prose dark:prose-invert dark:prose-dark max-w-none custom-article-typography"
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-600 dark:text-gray-400 mt-3">
        <span className="mb-2 sm:mb-0">{formatDate(date)}</span>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {displayTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => onTagClick(tag)}
              className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-[10px] flex items-center 
                         hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out"
            >
              <FaTag className="mr-1" size={6} />
              {tag}
            </button>
          ))}
        </div>
      </div>

      {!isExpanded && (
        <button 
          onClick={expandCard}
          className="mt-3 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors duration-300 text-xs"
        >
          <FaChevronDown className="mr-1" size={10} /> Expand
        </button>
      )}
    </div>
  );
};

export default PostCard;