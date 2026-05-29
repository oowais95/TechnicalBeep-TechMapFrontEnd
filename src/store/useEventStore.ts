import { create } from 'zustand'
import type { EventCategory } from '../types/event'

interface EventStore {
  selectedEventId: string | null
  searchQuery: string
  categoryFilter: EventCategory | 'All'
  countryFilter: string | 'All'
  hasHydratedFromUrl: boolean
  setSearchQuery: (value: string) => void
  setCategoryFilter: (value: EventCategory | 'All') => void
  setCountryFilter: (value: string | 'All') => void
  setFiltersFromUrl: (query: string, category: EventCategory | 'All', country: string | 'All') => void
  setSelectedEventId: (eventId: string) => void
  markUrlHydrated: () => void
}

export const useEventStore = create<EventStore>((set) => ({
  selectedEventId: null,
  searchQuery: '',
  categoryFilter: 'All',
  countryFilter: 'All',
  hasHydratedFromUrl: false,
  setSearchQuery: (value) => set({ searchQuery: value }),
  setCategoryFilter: (value) => set({ categoryFilter: value }),
  setCountryFilter: (value) => set({ countryFilter: value }),
  setFiltersFromUrl: (query, category, country) =>
    set({ searchQuery: query, categoryFilter: category, countryFilter: country }),
  setSelectedEventId: (eventId) => set({ selectedEventId: eventId }),
  markUrlHydrated: () => set({ hasHydratedFromUrl: true }),
}))
