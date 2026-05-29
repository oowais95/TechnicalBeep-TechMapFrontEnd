import { memo } from 'react'
import type { TechEvent } from '../types/event'
import { getEventCountry } from '../utils/eventCountry'
import { formatFeaturedDateParts } from '../utils/formatEventDate'

interface FeaturedEventsCarouselProps {
  events: TechEvent[]
  onFlyTo: (eventId: string) => void
}

const PinIcon = () => (
  <svg className="h-3.5 w-3.5 shrink-0 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" />
  </svg>
)

const FlyToIcon = () => (
  <svg className="h-3.5 w-3.5 shrink-0 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
    />
  </svg>
)

const ExternalIcon = () => (
  <svg className="h-3.5 w-3.5 shrink-0 text-[#4338ca]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

interface FeaturedEventCardProps {
  event: TechEvent
  onFlyTo: (eventId: string) => void
}

const FeaturedEventCard = ({ event, onFlyTo }: FeaturedEventCardProps) => {
  const { month, day } = formatFeaturedDateParts(event.dateTime)
  const country = getEventCountry(event)
  const metaLine = event.venue
    ? `${event.category.toUpperCase()} · ${event.venue}`
    : event.category.toUpperCase()

  return (
    <article className="featured-event-card flex w-[min(100%,320px)] shrink-0 gap-3 rounded-xl border border-[#e5e7eb] bg-white p-3.5 sm:w-[320px]">
      <div className="flex w-10 shrink-0 flex-col items-center pt-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#7c3aed]">{month}</span>
        <span className="text-[26px] font-bold leading-none text-[#7c3aed]">{day}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2 pr-0.5">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-[#111827]">{event.title}</h3>
          <span className="shrink-0 rounded-md bg-[#fce7f3] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#db2777]">
            {event.category}
          </span>
        </div>

        <p className="mt-1.5 flex items-center gap-1 text-[13px] text-[#6b7280]">
          <PinIcon />
          <span className="truncate">
            {event.city}, {country}
          </span>
        </p>

        <p className="mt-0.5 text-[11px] font-medium tracking-wide text-[#9ca3af]">{metaLine}</p>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onFlyTo(event.id)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-xs font-medium text-[#374151] shadow-sm transition hover:border-[#d1d5db] hover:bg-[#f9fafb]"
          >
            <FlyToIcon />
            Fly to
          </button>
          <a
            href={event.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#eef2ff] px-3 py-2 text-xs font-medium text-[#4338ca] transition hover:bg-[#e0e7ff]"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalIcon />
            Website
          </a>
        </div>
      </div>
    </article>
  )
}

const FeaturedEventsCarouselComponent = ({ events, onFlyTo }: FeaturedEventsCarouselProps) => {
  if (events.length === 0) {
    return null
  }

  return (
    <section
      className="pointer-events-auto fixed bottom-0 left-0 right-0 z-30 flex w-full flex-col border-t border-[#e5e7eb] bg-white"
      style={{ height: 'var(--featured-bar-height)' }}
      aria-label="Featured events"
    >
      <div className="flex shrink-0 items-center gap-2 px-4 pb-2 pt-3 sm:px-5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af]">
          Featured events
        </span>
      </div>

      <div
        className="featured-events-scroll min-h-0 flex-1 overflow-x-auto overflow-y-hidden px-4 pb-3.5 sm:px-5"
        role="list"
        aria-label="Featured event cards"
      >
        <div className="flex w-max gap-3">
          {events.map((event) => (
            <FeaturedEventCard key={event.id} event={event} onFlyTo={onFlyTo} />
          ))}
        </div>
      </div>
    </section>
  )
}

export const FeaturedEventsCarousel = memo(FeaturedEventsCarouselComponent)
