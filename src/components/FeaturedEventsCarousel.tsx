import { memo, useMemo } from 'react'
import type { TechEvent } from '../types/event'
import { formatEventDateDisplay } from '../utils/formatEventDate'

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
    return null
  }

  return (
    <section
      className="pointer-events-auto fixed bottom-0 left-0 right-0 z-30 flex w-full flex-col overflow-hidden border-t border-white/10 bg-cream-dark shadow-panel"
      style={{ height: 'var(--featured-bar-height)' }}
      aria-label="Featured events"
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2 sm:px-6">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#a8a099]">
          Featured · {events.length}
        </span>
        <span className="text-[10px] text-[#a8a099]/80">Hover to pause</span>
      </div>

      <div
        className="featured-marquee-outer relative min-h-0 flex-1 py-2 [mask-image:linear-gradient(90deg,transparent,black_2%,black_98%,transparent)]"
        role="region"
        aria-label="Featured events, auto-scrolling"
      >
        <div
          className="featured-marquee-track flex w-max animate-featured-marquee gap-2 px-3 will-change-transform hover:[animation-play-state:paused] sm:px-4"
          style={{ animationDuration: `${durationSeconds}s` }}
        >
          {loopItems.map((event, index) => (
            <button
              key={`${event.id}-${index}`}
              type="button"
              onClick={() => onEventClick(event.id)}
              className="min-w-56 shrink-0 rounded-xl border border-white/10 bg-cream-darker px-3 py-2.5 text-left transition hover:bg-[#3d3530] sm:min-w-64"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#a8a099]">
                {event.category}
              </p>
              <h3 className="mt-0.5 line-clamp-1 text-sm font-semibold text-white">{event.title}</h3>
              <p className="mt-1 text-[11px] text-[#c4bdb4]">{formatEventDateDisplay(event.dateTime)}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export const FeaturedEventsCarousel = memo(FeaturedEventsCarouselComponent)
