import { useCallback, useEffect, useState } from 'react'
import { getEvents, getFeaturedEvents } from '../services/eventsService.js'
import type { EventCategory, TechEvent } from '../types/event'

interface EventsDataState {
  events: TechEvent[]
  featuredEvents: TechEvent[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseEventsDataParams {
  searchQuery: string
  categoryFilter: EventCategory | 'All'
}

export const useEventsData = ({ searchQuery, categoryFilter }: UseEventsDataParams): EventsDataState => {
  const [events, setEvents] = useState<TechEvent[]>([])
  const [featuredEvents, setFeaturedEvents] = useState<TechEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [eventsPayload, featuredPayload] = await Promise.all([
        getEvents({ search: searchQuery, category: categoryFilter }),
        getFeaturedEvents(),
      ])

      setEvents(eventsPayload as TechEvent[])
      setFeaturedEvents(featuredPayload as TechEvent[])
    } catch (unknownError) {
      const message =
        unknownError instanceof Error
          ? unknownError.message
          : 'Something went wrong while fetching events.'
      setError(message)
      setEvents([])
      setFeaturedEvents([])
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, categoryFilter])

  useEffect(() => {
    void refetch()
  }, [refetch])

  useEffect(() => {
    const onEventsChanged = () => {
      void refetch()
    }
    window.addEventListener('tem:events-changed', onEventsChanged)
    return () => window.removeEventListener('tem:events-changed', onEventsChanged)
  }, [refetch])

  useEffect(() => {
    const MOCK_KEY = 'tem_mock_events_v1'
    const onStorage = (event: StorageEvent) => {
      if (event.key === MOCK_KEY) {
        void refetch()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refetch])

  return { events, featuredEvents, isLoading, error, refetch }
}
