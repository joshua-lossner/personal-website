import Link from 'next/link'
import { useRouter } from 'next/router'
import { getCategoryIcon } from '../utils/categories'
import ThemeToggle from './ThemeToggle'
import { useContext } from 'react'
import { AudioContext } from '../contexts/AudioContext'
import { FaPlay, FaPause } from 'react-icons/fa'

export default function Sidebar({ categories }) {
  const router = useRouter()
  const { isPlaying, playPause } = useContext(AudioContext)

  const prefetchCategory = (id) => {
    router.prefetch(`/category/${id}`)
  }

  return (
    <div className="w-16 bg-gray-200 dark:bg-gray-800 h-full flex flex-col justify-between items-center py-4">
      <ul className="space-y-8">
        {categories.map((category) => (
          <li key={category.id} onMouseEnter={() => prefetchCategory(category.id)}>
            <Link href={category.id === 'home' ? '/' : `/category/${category.id}`}>
              <span className="flex justify-center items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                {getCategoryIcon(category.iconName)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto space-y-4">
        <button 
          onClick={playPause} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
        </button>
        <ThemeToggle />
      </div>
    </div>
  )
}