import { memo, useMemo, useState } from 'react'
import type { EventCategory } from '../types/event'
import type { TechEvent } from '../types/event'
import { getEventCountry } from '../utils/eventCountry'
import { formatEventDateDisplay } from '../utils/formatEventDate'

interface EventSidebarProps {
  events: TechEvent[]
  activeEventId: string | null
  categories: Array<EventCategory | 'All'>
  countries: string[]
  selectedCategory: EventCategory | 'All'
  selectedCountry: string | 'All'
  onCategoryChange: (value: EventCategory | 'All') => void
  onCountryChange: (value: string | 'All') => void
  onEventSelect: (eventId: string) => void
  onFlyTo: (eventId: string) => void
  reserveBottomForFeatured?: boolean
}

const filterEventsForList = (items: TechEvent[], query: string): TechEvent[] => {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter((event) => {
    const title = (event.title ?? '').toLowerCase()
    const city = (event.city ?? '').toLowerCase()
    const venue = (event.venue ?? '').toLowerCase()
    const cat = (event.category ?? '').toLowerCase()
    const country = getEventCountry(event).toLowerCase()
    return (
      title.includes(q) ||
      city.includes(q) ||
      venue.includes(q) ||
      cat.includes(q) ||
      country.includes(q)
    )
  })
}

const FilterChipGroup = ({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: string[]
  selected: string
  onSelect: (value: string) => void
}) => (
  <div>
    <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">{label}</p>
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = selected === option
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={active ? 'filter-chip filter-chip-active !px-2.5 !py-1.5 !text-[11px]' : 'filter-chip !px-2.5 !py-1.5 !text-[11px]'}
          >
            {option}
          </button>
        )
      })}
    </div>
  </div>
)

const EventSidebarComponent = ({
  events,
  activeEventId,
  categories,
  countries,
  selectedCategory,
  selectedCountry,
  onCategoryChange,
  onCountryChange,
  onEventSelect,
  onFlyTo,
  reserveBottomForFeatured = false,
}: EventSidebarProps) => {
  const [listSearch, setListSearch] = useState('')

  const countryOptions = useMemo(() => ['All', ...countries], [countries])

  const filteredEvents = useMemo(
    () => filterEventsForList(events, listSearch),
    [events, listSearch],
  )

  const resultLabel =
    listSearch.trim() && filteredEvents.length !== events.length
      ? `${filteredEvents.length} of ${events.length}`
      : `${filteredEvents.length} results`

  return (
    <aside
      className="pointer-events-auto fixed left-0 z-20 flex w-full max-w-[380px] flex-col border-r border-warm-border bg-white shadow-panel sm:w-[380px]"
      style={{
        top: 'var(--app-header-height)',
        bottom: reserveBottomForFeatured ? 'var(--featured-bar-height)' : 0,
      }}
    >
      <div className="shrink-0 border-b border-warm-line px-5 pb-3 pt-4">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">Exploring</p>
        <h2 className="font-display mt-0.5 text-xl font-semibold tracking-tight text-ink">Events</h2>
      </div>

      <div className="shrink-0 space-y-4 border-b border-warm-line px-5 py-4">
        <FilterChipGroup
          label="Countries"
          options={countryOptions}
          selected={selectedCountry}
          onSelect={onCountryChange}
        />
        <FilterChipGroup
          label="Event categories"
          options={categories}
          selected={selectedCategory}
          onSelect={(value) => onCategoryChange(value as EventCategory | 'All')}
        />
      </div>

      <div className="shrink-0 px-5 py-3">
        <label htmlFor="upcoming-events-list-search" className="sr-only">
          Search this list
        </label>
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
          <input
            id="upcoming-events-list-search"
            type="search"
            value={listSearch}
            onChange={(e) => setListSearch(e.target.value)}
            placeholder="Search this list…"
            className="input h-9 py-2 pl-9 pr-3 text-[13px]"
            aria-label="Search upcoming events list"
            autoComplete="off"
            enterKeyHint="search"
          />
        </div>
        {listSearch.trim() ? (
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-ink-muted transition hover:text-ink"
            onClick={() => setListSearch('')}
          >
            Clear search
          </button>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center justify-between border-b border-warm-line px-6 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
        <span>Events</span>
        <span>{resultLabel}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-2">
        {events.length === 0 && (
          <p className="px-2 py-12 text-center text-[13px] font-medium text-ink-subtle">
            Pan the map to find events
          </p>
        )}
        {events.length > 0 && filteredEvents.length === 0 && (
          <p className="px-2 py-8 text-center text-[12.5px] text-ink-subtle">
            No events match your search. Try a different term.
          </p>
        )}
        {filteredEvents.map((event) => {
          const active = activeEventId === event.id
          return (
            <div
              key={event.id}
              className={`mb-1 rounded-xl px-3 py-3 transition ${
                active ? 'bg-cream ring-1 ring-warm-border' : 'hover:bg-cream/70'
              }`}
            >
              <button
                type="button"
                onClick={() => onEventSelect(event.id)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-ink">{event.title}</h3>
                  <span className="shrink-0 rounded-full border border-warm-border bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                    {event.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-muted">{formatEventDateDisplay(event.dateTime)}</p>
                <p className="mt-0.5 text-xs text-ink-subtle">
                  {event.venue}, {event.city}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-subtle">{getEventCountry(event)}</p>
              </button>
              <button
                type="button"
                onClick={() => onFlyTo(event.id)}
                className="mt-2 inline-flex items-center gap-1 rounded-lg border border-warm-border bg-white px-2.5 py-1 text-[11px] font-semibold text-ink transition hover:border-ink/25 hover:bg-cream"
                aria-label={`Fly to ${event.title} on map`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />
                </svg>
                Fly to
              </button>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export const EventSidebar = memo(EventSidebarComponent)
