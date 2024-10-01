import { FaHome, FaNewspaper, FaBlog, FaMusic, FaUsers, FaToolbox, FaGraduationCap, FaStickyNote } from 'react-icons/fa';

export const categories = [
  { id: 'home', name: 'Home', iconName: 'FaHome' },
  { id: 'blog', name: 'Blog', iconName: 'FaBlog' },
  { id: 'articles', name: 'Articles', iconName: 'FaNewspaper' },
  { id: 'music', name: 'Music', iconName: 'FaMusic' },
  { id: 'people', name: 'People', iconName: 'FaUsers' },
  { id: 'toolkit', name: 'Toolkit', iconName: 'FaToolbox' },
  { id: 'education', name: 'Education', iconName: 'FaGraduationCap' },
  { id: 'notes', name: 'Notes', iconName: 'FaStickyNote' },
];

export function getCategories() {
  return categories;
}

export function getCategoryIcon(iconName, size = '1em') {
  const iconProps = { size };
  switch (iconName) {
    case 'FaHome':
      return <FaHome {...iconProps} />;
    case 'FaNewspaper':
      return <FaNewspaper {...iconProps} />;
    case 'FaBlog':
      return <FaBlog {...iconProps} />;
    case 'FaMusic':
      return <FaMusic {...iconProps} />;
    case 'FaUsers':
      return <FaUsers {...iconProps} />;
    case 'FaToolbox':
      return <FaToolbox {...iconProps} />;
    case 'FaGraduationCap':
      return <FaGraduationCap {...iconProps} />;
    case 'FaStickyNote':
      return <FaStickyNote {...iconProps} />;
    default:
      return null;
  }
}