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
  <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-card transition duration-300">
    <input
      type="text"
      value={searchQuery}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Search events by title or city..."
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
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
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              active
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-200 text-slate-700 hover:-translate-y-0.5 hover:bg-slate-300'
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
