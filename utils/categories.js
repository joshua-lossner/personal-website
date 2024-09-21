import { FaHome, FaBlog, FaNewspaper, FaMusic, FaTools, FaBriefcase, FaGraduationCap, FaStickyNote } from 'react-icons/fa';

export const categories = [
  { id: 'home', name: 'Home', iconName: 'FaHome', subheader: 'Where Tech Meets Creativity' },
  { id: 'blog', name: 'Blog', iconName: 'FaBlog', subheader: 'Musings from the Digital Frontier' },
  { id: 'articles', name: 'Articles', iconName: 'FaNewspaper', subheader: 'Deep Dives into the Tech Ocean' },
  { id: 'music', name: 'Music', iconName: 'FaMusic', subheader: 'Bytes and Beats in Perfect Harmony' },
  { id: 'aiTools', name: 'AI Tools', iconName: 'FaRobot', subheader: 'Teaching Machines to Dream' },
  { id: 'experience', name: 'Experience', iconName: 'FaBriefcase', subheader: 'Adventures in the Digital Realm' },
  { id: 'education', name: 'Education', iconName: 'FaGraduationCap', subheader: 'Lifelong Learning in the Tech Era' },
  { id: 'notes', name: 'Notes', iconName: 'FaStickyNote', subheader: 'Byte-sized Thoughts and Observations' },
];

export function getCategories() {
  return categories;
}

export function getCategoryIcon(category, size = '1em') {
  const iconProps = { size };
  switch (category.toLowerCase()) {
    case 'home':
      return <FaHome {...iconProps} />;
    case 'blog':
      return <FaBlog {...iconProps} />;
    case 'articles':
      return <FaNewspaper {...iconProps} />;
    case 'music':
      return <FaMusic {...iconProps} />;
    case 'aitools':
      return <FaTools {...iconProps} />;
    case 'experience':
      return <FaBriefcase {...iconProps} />;
    case 'education':
      return <FaGraduationCap {...iconProps} />;
    case 'notes':
      return <FaStickyNote {...iconProps} />;
    default:
      return null;
  }
}