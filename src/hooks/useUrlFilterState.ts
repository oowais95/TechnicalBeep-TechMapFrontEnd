import { useEffect } from 'react'
import type { EventCategory } from '../types/event'

const CATEGORY_SET = new Set<EventCategory>(['AI', 'Web', 'Cloud', 'Mobile', 'Security', 'Data'])

const isValidCategory = (value: string | null): value is EventCategory =>
  value !== null && CATEGORY_SET.has(value as EventCategory)

interface UrlFilterStateParams {
  searchQuery: string
  categoryFilter: EventCategory | 'All'
  countryFilter: string | 'All'
  hasHydratedFromUrl: boolean
  setFiltersFromUrl: (query: string, category: EventCategory | 'All', country: string | 'All') => void
  markUrlHydrated: () => void
}

export const useUrlFilterState = ({
  searchQuery,
  categoryFilter,
  countryFilter,
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
    const rawCountry = params.get('country')
    const initialCountry = rawCountry?.trim() ? rawCountry.trim() : 'All'

    setFiltersFromUrl(initialSearch, initialCategory, initialCountry)
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

    if (countryFilter !== 'All') {
      params.set('country', countryFilter)
    } else {
      params.delete('country')
    }

    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`
    window.history.replaceState({}, '', nextUrl)
  }, [searchQuery, categoryFilter, countryFilter, hasHydratedFromUrl])
}
