import Link from 'next/link'
import { useRouter } from 'next/router'
import { getCategoryIcon, categories } from '../utils/categories'
import ThemeToggle from './ThemeToggle'

export default function Sidebar() {
  const router = useRouter()

  const prefetchCategory = (id) => {
    router.prefetch(`/category/${id}`)
  }

  return (
    <nav className="bg-gray-200 dark:bg-gray-800 md:w-20 md:h-full md:flex-shrink-0 fixed md:static top-0 left-0 right-0 z-40">
      <ul className="flex md:flex-col items-center justify-around md:justify-start md:space-y-8 p-4 md:pt-8">
        {categories.map((category) => (
          <li key={category.id} onMouseEnter={() => prefetchCategory(category.id)}>
            <Link href={category.id === 'home' ? '/' : `/category/${category.id}`}>
              <span className="flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                {getCategoryIcon(category.id, '1.5em')}
                <span className="sr-only">{category.name}</span>
              </span>
            </Link>
          </li>
        ))}
        <li className="md:mt-auto">
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  )
}