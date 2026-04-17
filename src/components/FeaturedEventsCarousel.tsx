import { memo, useMemo } from 'react'
import { format } from 'date-fns'
import type { TechEvent } from '../types/event'

interface FeaturedEventsCarouselProps {
  events: TechEvent[]
  onEventClick: (eventId: string) => void
}

const FeaturedEventsCarouselComponent = ({ events, onEventClick }: FeaturedEventsCarouselProps) => {
  const loopItems = useMemo(() => {
    if (events.length === 0) return []
    return [...events, ...events]
  }, [events])

  const durationSeconds = useMemo(() => {
    if (events.length === 0) return 45
    return Math.min(120, Math.max(36, events.length * 5))
  }, [events.length])

  if (events.length === 0) {
    return (
      <section className="rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white to-indigo-50/40 p-4 shadow-card">
        <h2 className="text-lg font-semibold text-slate-900">Featured Events</h2>
        <p className="mt-2 text-sm text-slate-500">No featured events right now.</p>
      </section>
    )
  }

  return (
    <section className="group rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white via-indigo-50/30 to-violet-50/50 p-4 shadow-card shadow-glow">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="bg-gradient-to-r from-indigo-800 to-violet-700 bg-clip-text text-lg font-semibold text-transparent">
          Featured Events
        </h2>
        <span className="rounded-full bg-indigo-100/90 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
          {events.length} highlighted · auto-scroll
        </span>
      </div>

      <div
        className="featured-marquee-outer relative py-1 [mask-image:linear-gradient(90deg,transparent,black_5%,black_95%,transparent)]"
        role="region"
        aria-label="Featured events, auto-scrolling"
      >
        <div
          className="featured-marquee-track flex w-max animate-featured-marquee gap-3 will-change-transform hover:[animation-play-state:paused]"
          style={{ animationDuration: `${durationSeconds}s` }}
        >
          {loopItems.map((event, index) => (
            <button
              key={`${event.id}-${index}`}
              type="button"
              onClick={() => onEventClick(event.id)}
              className="min-w-64 shrink-0 rounded-xl border border-indigo-100/90 bg-gradient-to-br from-white to-indigo-50/40 p-4 text-left shadow-sm ring-1 ring-indigo-100/50 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">{event.category}</p>
              <h3 className="mt-1 text-base font-semibold text-slate-900">{event.title}</h3>
              <p className="mt-2 text-xs text-slate-600">{format(new Date(event.dateTime), 'PPP p')}</p>
              <p className="mt-1 text-xs text-slate-500">
                {event.venue}, {event.city}
              </p>
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-[11px] text-indigo-400/90">Hover to pause scrolling.</p>
    </section>
  )
}

export const FeaturedEventsCarousel = memo(FeaturedEventsCarouselComponent)
