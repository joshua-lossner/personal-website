import { FaHome, FaBlog, FaNewspaper, FaMusic, FaRobot, FaBriefcase, FaGraduationCap, FaStickyNote } from 'react-icons/fa';

export const categories = [
  { id: 'home', name: 'Home', iconName: 'FaHome' },
  { id: 'blog', name: 'Blog', iconName: 'FaBlog' },
  { id: 'articles', name: 'Articles', iconName: 'FaNewspaper' },
  { id: 'music', name: 'Music', iconName: 'FaMusic' },
  { id: 'aiTools', name: 'AI Tools', iconName: 'FaRobot' },
  { id: 'experience', name: 'Experience', iconName: 'FaBriefcase' },
  { id: 'education', name: 'Education', iconName: 'FaGraduationCap' },
  { id: 'notes', name: 'Notes', iconName: 'FaStickyNote' },
];

export function getCategories() {
  return categories;
}

export function getCategoryIcon(iconName) {
  const iconSize = 24; // Increase this value to make icons larger
  switch (iconName) {
    case 'FaHome':
      return <FaHome size={iconSize} />;
    case 'FaBlog':
      return <FaBlog size={iconSize} />;
    case 'FaNewspaper':
      return <FaNewspaper size={iconSize} />;
    case 'FaMusic':
      return <FaMusic size={iconSize} />;
    case 'FaRobot':
      return <FaRobot size={iconSize} />;
    case 'FaBriefcase':
      return <FaBriefcase size={iconSize} />;
    case 'FaGraduationCap':
      return <FaGraduationCap size={iconSize} />;
    case 'FaStickyNote':
      return <FaStickyNote size={iconSize} />;
    default:
      return null;
  }
}