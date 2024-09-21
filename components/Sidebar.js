import Link from 'next/link'
import { useRouter } from 'next/router'
import { getCategoryIcon } from '../utils/categories'
import ThemeToggle from './ThemeToggle'

export default function Sidebar({ categories = [] }) {
  const router = useRouter()

  const prefetchCategory = (id) => {
    router.prefetch(`/category/${id}`)
  }

  return (
    <div className="w-16 bg-gray-200 dark:bg-gray-800 h-full flex flex-col justify-between items-center py-4">
      <ul className="space-y-8">
        <li onMouseEnter={() => prefetchCategory('home')}>
          <Link href="/">
            <span className="flex justify-center items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              {getCategoryIcon('home', '1.5em')} {/* Increased size here */}
            </span>
          </Link>
        </li>
        {categories.filter(category => category !== 'home').map((category) => (
          <li key={category} onMouseEnter={() => prefetchCategory(category)}>
            <Link href={`/category/${category}`}>
              <span className="flex justify-center items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                {getCategoryIcon(category, '1.5em')} {/* Increased size here */}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </div>
  )
}