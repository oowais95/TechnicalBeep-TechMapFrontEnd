import { isAfter, isValid, parseISO } from 'date-fns'
import type { EventCategory, TechEvent } from '../types/event'

export const isUpcomingPublishedMapEvent = (event: TechEvent): boolean => {
  if (event.dateTime == null || event.dateTime === '') {
    return false
  }
  const eventDate = parseISO(String(event.dateTime))
  if (!isValid(eventDate)) {
    return false
  }
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
    const title = (event.title ?? '').toLowerCase()
    const city = (event.city ?? '').toLowerCase()
    const searchMatch =
      normalizedQuery.length === 0 || title.includes(normalizedQuery) || city.includes(normalizedQuery)

    const categoryMatch = category === 'All' || event.category === category

    return searchMatch && categoryMatch
  })
}
