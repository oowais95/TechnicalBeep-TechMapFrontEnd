import { memo } from 'react'
import { format } from 'date-fns'
import type { TechEvent } from '../types/event'

interface FeaturedEventsCarouselProps {
  events: TechEvent[]
  onEventClick: (eventId: string) => void
}

const FeaturedEventsCarouselComponent = ({ events, onEventClick }: FeaturedEventsCarouselProps) => (
  <section className="rounded-xl bg-white p-4 shadow-card">
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-900">Featured Events</h2>
      <span className="text-xs text-slate-500">{events.length} highlighted</span>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2">
      {events.map((event) => (
        <button
          key={event.id}
          type="button"
          onClick={() => onEventClick(event.id)}
          className="min-w-64 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase text-blue-600">{event.category}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">{event.title}</h3>
          <p className="mt-2 text-xs text-slate-600">{format(new Date(event.dateTime), 'PPP p')}</p>
          <p className="mt-1 text-xs text-slate-500">
            {event.venue}, {event.city}
          </p>
        </button>
      ))}
    </div>
  </section>
)

export const FeaturedEventsCarousel = memo(FeaturedEventsCarouselComponent)
