import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ArticleCard({ post }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { metadata, content } = post;

  return (
    <div className="article-card">
      <h2>{metadata.title}</h2>
      <p>{metadata.description}</p>
      <p className="date">{new Date(metadata.date).toLocaleDateString()}</p>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Hide' : 'Read More'}
      </button>
      {isExpanded && (
        <div className="content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}