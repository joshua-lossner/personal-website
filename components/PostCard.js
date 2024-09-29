import React, { useState, useContext } from 'react';
import { FaTag, FaPlay, FaList, FaForward, FaChevronDown, FaChevronUp, FaEllipsisH } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { AudioContext } from '../contexts/AudioContext';
import remarkBreaks from 'remark-breaks';
import { Menu, Transition } from '@headlessui/react';

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

  const AudioMenu = () => {
    if (!audioFile) return null;
    return (
      <div className="absolute top-2 right-2">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="music-button">
            <FaEllipsisH size={16} />
          </Menu.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={(e) => { e.stopPropagation(); playSong(audioFile); }}
                      className={`${
                        active ? 'bg-blue-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <FaPlay className="mr-2" size={14} />
                      Play
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={(e) => { e.stopPropagation(); addToUpNext(audioFile); }}
                      className={`${
                        active ? 'bg-blue-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <FaForward className="mr-2" size={14} />
                      Play Next
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={(e) => { e.stopPropagation(); addToQueue(audioFile); }}
                      className={`${
                        active ? 'bg-blue-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <FaList className="mr-2" size={14} />
                      Add to Queue
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    );
  };

  // Check if there's additional content beyond the front matter
  const hasAdditionalContent = content.trim() !== '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 transition-all duration-300 ease-in-out hover:shadow-lg relative">
      <AudioMenu />
      
      <div className={hasAdditionalContent ? "cursor-pointer" : ""} onClick={hasAdditionalContent ? toggleExpand : undefined}>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">{title}</h2>
        {subtitle && (
          <h3 className="text-xs sm:text-sm italic text-gray-600 dark:text-gray-400 mb-2">{subtitle}</h3>
        )}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
        
        {hasAdditionalContent && (
          <button 
            onClick={toggleExpand} 
            className="text-blue-500 hover:text-blue-600 transition-colors duration-200 flex items-center"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
            {isExpanded ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
          </button>
        )}
      </div>

      {isExpanded && hasAdditionalContent && (
        <div className="mt-4 transition-all duration-300 ease-in-out">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <ReactMarkdown 
              className="prose dark:prose-invert max-w-none"
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({...props}) => <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2" {...props} />,
                h2: ({...props}) => <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2" {...props} />,
                h3: ({...props}) => <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-2" {...props} />,
                p: ({...props}) => <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3" {...props} />,
                ul: ({...props}) => <ul className="list-disc list-inside mb-3" {...props} />,
                ol: ({...props}) => <ol className="list-decimal list-inside mb-3" {...props} />,
                li: ({...props}) => <li className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1" {...props} />,
                a: ({...props}) => <a className="text-blue-500 hover:text-blue-600 transition-colors duration-200" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
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