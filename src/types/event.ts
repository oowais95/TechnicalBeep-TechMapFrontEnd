export type EventCategory = 'AI' | 'Web' | 'Cloud' | 'Mobile' | 'Security' | 'Data'

export interface TechEvent {
  id: string
  title: string
  category: EventCategory
  dateTime: string
  venue: string
  city: string
  coordinates: [number, number]
  description: string
  externalUrl: string
  featured: boolean
  published: boolean
  showOnMap: boolean
}
