import type { EventCategory, TechEvent } from '../types/event'

export function getEvents(params?: {
  search?: string
  category?: EventCategory | 'All'
  /** Admin dashboard: include drafts / past / hidden-from-map items (mock + optional API query). */
  listAll?: boolean
}): Promise<TechEvent[]>

export function getFeaturedEvents(): Promise<TechEvent[]>

export interface EventPayload {
  title: string
  description: string
  dateTime: string
  venue: string
  city: string
  coordinates: [number, number]
  category: EventCategory
  featured: boolean
  published: boolean
  showOnMap: boolean
  externalUrl: string
}

export function createEvent(payload: EventPayload): Promise<TechEvent>
export function updateEvent(id: string, payload: EventPayload): Promise<TechEvent>
export function deleteEvent(id: string): Promise<{ success: boolean } | unknown>
