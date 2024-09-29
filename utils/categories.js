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

export function getCategoryIcon(category, size = '1em') {
  const iconProps = { size };
  switch (category.toLowerCase()) {
    case 'home':
      return <FaHome {...iconProps} />;
    case 'articles':
      return <FaNewspaper {...iconProps} />;
    case 'blog':
      return <FaBlog {...iconProps} />;
    case 'music':
      return <FaMusic {...iconProps} />;
    case 'people':
      return <FaUsers {...iconProps} />;
    case 'toolkit':
      return <FaToolbox {...iconProps} />;
    case 'education':
      return <FaGraduationCap {...iconProps} />;
    case 'notes':
      return <FaStickyNote {...iconProps} />;
    default:
      return null;
  }
}