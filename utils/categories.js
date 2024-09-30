import { FaHome, FaNewspaper, FaBlog, FaMusic, FaUsers, FaToolbox, FaGraduationCap, FaStickyNote } from 'react-icons/fa';

export const categories = [
  { id: 'home', name: 'Home', iconName: 'FaHome', subheader: 'Where Tech Meets Creativity' },
  { id: 'articles', name: 'Articles', iconName: 'FaNewspaper', subheader: 'Deep Dives into the Tech Ocean' },
  { id: 'blog', name: 'Blog', iconName: 'FaBlog', subheader: 'Musings from the Digital Frontier' },
  { id: 'music', name: 'Music', iconName: 'FaMusic', subheader: 'Bytes and Beats in Perfect Harmony' },
  { id: 'people', name: 'People', iconName: 'FaUsers', subheader: 'Connecting in the Digital Age' },
  { id: 'toolkit', name: 'Toolkit', iconName: 'FaToolbox', subheader: 'Essential Tools for the Modern Developer' },
  { id: 'education', name: 'Education', iconName: 'FaGraduationCap', subheader: 'Lifelong Learning in the Tech Era' },
  { id: 'notes', name: 'Notes', iconName: 'FaStickyNote', subheader: 'Byte-sized Thoughts and Observations' },
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