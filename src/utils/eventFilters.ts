import { isAfter, parseISO } from 'date-fns'
import type { EventCategory, TechEvent } from '../types/event'

export const isUpcomingPublishedMapEvent = (event: TechEvent): boolean => {
  const eventDate = parseISO(event.dateTime)
  return (
    event.published &&
    event.showOnMap &&
    (isAfter(eventDate, new Date()) || eventDate.toDateString() === new Date().toDateString())
  )
}

export const filterEvents = (
  events: TechEvent[],
  searchQuery: string,
  category: EventCategory | 'All',
): TechEvent[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  return events.filter((event) => {
    const searchMatch =
      normalizedQuery.length === 0 ||
      event.title.toLowerCase().includes(normalizedQuery) ||
      event.city.toLowerCase().includes(normalizedQuery)

    const categoryMatch = category === 'All' || event.category === category

    return searchMatch && categoryMatch
  })
}
