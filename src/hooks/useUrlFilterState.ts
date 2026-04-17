import { useEffect } from 'react'
import type { EventCategory } from '../types/event'

const CATEGORY_SET = new Set<EventCategory>(['AI', 'Web', 'Cloud', 'Mobile', 'Security', 'Data'])

const isValidCategory = (value: string | null): value is EventCategory =>
  value !== null && CATEGORY_SET.has(value as EventCategory)

interface UrlFilterStateParams {
  searchQuery: string
  categoryFilter: EventCategory | 'All'
  hasHydratedFromUrl: boolean
  setFiltersFromUrl: (query: string, category: EventCategory | 'All') => void
  markUrlHydrated: () => void
}

export const useUrlFilterState = ({
  searchQuery,
  categoryFilter,
  hasHydratedFromUrl,
  setFiltersFromUrl,
  markUrlHydrated,
}: UrlFilterStateParams) => {
  useEffect(() => {
    if (hasHydratedFromUrl) {
      return
    }

    const params = new URLSearchParams(window.location.search)
    const initialSearch = params.get('q') ?? ''
    const rawCategory = params.get('category')
    const initialCategory = isValidCategory(rawCategory) ? rawCategory : 'All'

    setFiltersFromUrl(initialSearch, initialCategory)
    markUrlHydrated()
  }, [hasHydratedFromUrl, markUrlHydrated, setFiltersFromUrl])

  useEffect(() => {
    if (!hasHydratedFromUrl) {
      return
    }

    const params = new URLSearchParams(window.location.search)
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim())
    } else {
      params.delete('q')
    }

    if (categoryFilter !== 'All') {
      params.set('category', categoryFilter)
    } else {
      params.delete('category')
    }

    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`
    window.history.replaceState({}, '', nextUrl)
  }, [searchQuery, categoryFilter, hasHydratedFromUrl])
}
