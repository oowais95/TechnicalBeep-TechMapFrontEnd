import { create } from 'zustand'
import type { EventCategory } from '../types/event'

interface EventStore {
  selectedEventId: string | null
  searchQuery: string
  categoryFilter: EventCategory | 'All'
  hasHydratedFromUrl: boolean
  setSearchQuery: (value: string) => void
  setCategoryFilter: (value: EventCategory | 'All') => void
  setFiltersFromUrl: (query: string, category: EventCategory | 'All') => void
  setSelectedEventId: (eventId: string) => void
  markUrlHydrated: () => void
}

export const useEventStore = create<EventStore>((set) => ({
  selectedEventId: null,
  searchQuery: '',
  categoryFilter: 'All',
  hasHydratedFromUrl: false,
  setSearchQuery: (value) => set({ searchQuery: value }),
  setCategoryFilter: (value) => set({ categoryFilter: value }),
  setFiltersFromUrl: (query, category) => set({ searchQuery: query, categoryFilter: category }),
  setSelectedEventId: (eventId) => set({ selectedEventId: eventId }),
  markUrlHydrated: () => set({ hasHydratedFromUrl: true }),
}))
