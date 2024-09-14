export default function Tags({ tags, onSelectTag }) {
    return (
      <div className="tags-pane">
        {tags.map(tag => (
          <button key={tag} className="tag-button" onClick={() => onSelectTag(tag)}>
            {tag}
          </button>
        ))}
      </div>
    );
  }