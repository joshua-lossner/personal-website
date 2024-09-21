import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks'; // Add this import

export default function ArticleCard({ post }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { metadata, content } = post;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="article-card">
      <h2 className="text-lg font-bold">{metadata.title}</h2>
      <p className="text-gray-600">{metadata.description}</p>
      <p className="date">{new Date(metadata.date).toLocaleDateString()}</p>
      <button onClick={toggleExpand}>
        {isExpanded ? 'Hide' : 'Read More'}
      </button>
      {isExpanded && (
        <div className="content text-gray-600 text-sm"> {/* Adjusted styles for consistency */}
          <ReactMarkdown 
            className="prose dark:prose-invert max-w-none"
            remarkPlugins={[remarkBreaks]} // Updated here
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}