import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getCategoryIcon, categories } from '../utils/categories'
import ThemeToggle from './ThemeToggle'
import { FaEllipsisH } from 'react-icons/fa'
import { useRouter } from 'next/router'

export default function Sidebar() {
  const [showSecondary, setShowSecondary] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Close the secondary menu when the route changes
    setShowSecondary(false)
  }, [router.asPath])

  const mainCategories = ['home', 'blog', 'articles']
  const secondaryCategories = categories.filter(cat => !mainCategories.includes(cat.id))

  const toggleSecondary = () => {
    setShowSecondary(!showSecondary)
  }

  const renderCategoryLink = (category) => (
    <li key={category.id} className="md:mb-4">
      <Link href={category.id === 'home' ? '/' : `/category/${category.id}`}>
        <span className="flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          {getCategoryIcon(category.iconName, '1.5em')}
          <span className="sr-only">{category.name}</span>
        </span>
      </Link>
    </li>
  )

  return (
    <nav className="bg-gray-200 dark:bg-gray-800 md:w-20 md:h-full md:flex-shrink-0 fixed top-0 left-0 right-0 md:top-0 z-40">
      <ul className="flex md:flex-col items-center justify-around md:justify-start md:space-y-8 p-4 md:pt-8">
        {/* All categories for desktop, main categories for mobile */}
        {categories.map(category => (
          isMobile ? 
            (mainCategories.includes(category.id) && renderCategoryLink(category)) :
            renderCategoryLink(category)
        ))}

        {/* Ellipsis button - visible only on small screens */}
        {isMobile && (
          <li>
            <button onClick={toggleSecondary} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <FaEllipsisH size="1.5em" />
            </button>
          </li>
        )}

        {/* Theme toggle - always visible at the bottom */}
        <li className="md:mt-auto">
          <ThemeToggle />
        </li>
      </ul>

      {/* Secondary menu for small screens */}
      {isMobile && showSecondary && (
        <div className="fixed top-16 left-0 right-0 bg-gray-200 dark:bg-gray-800 p-4">
          <ul className="flex justify-around">
            {secondaryCategories.map(renderCategoryLink)}
          </ul>
        </div>
      )}
    </nav>
  )
}