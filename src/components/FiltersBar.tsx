import { memo } from 'react'
import type { EventCategory } from '../types/event'

interface FiltersBarProps {
  searchQuery: string
  selectedCategory: EventCategory | 'All'
  categories: Array<EventCategory | 'All'>
  onSearchChange: (value: string) => void
  onCategoryChange: (value: EventCategory | 'All') => void
}

const FiltersBarComponent = ({
  searchQuery,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange,
}: FiltersBarProps) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100/90 bg-white/90 p-4 shadow-card backdrop-blur-sm transition duration-300">
    <input
      type="text"
      value={searchQuery}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Search events by title or city..."
      className="input"
      aria-label="Search events"
    />
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const active = selectedCategory === category
        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                : 'bg-indigo-50/80 text-indigo-900 ring-1 ring-indigo-100 hover:-translate-y-0.5 hover:bg-indigo-100/90 hover:ring-indigo-200'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  </div>
)

export const FiltersBar = memo(FiltersBarComponent)
