import { memo, useMemo, useState } from 'react'
import { format } from 'date-fns'
import type { TechEvent } from '../types/event'

interface EventSidebarProps {
  events: TechEvent[]
  activeEventId: string | null
  onEventSelect: (eventId: string) => void
}

const filterEventsForList = (items: TechEvent[], query: string): TechEvent[] => {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter(
    (event) =>
      event.title.toLowerCase().includes(q) ||
      event.city.toLowerCase().includes(q) ||
      event.venue.toLowerCase().includes(q) ||
      event.category.toLowerCase().includes(q),
  )
}

const EventSidebarComponent = ({ events, activeEventId, onEventSelect }: EventSidebarProps) => {
  const [listSearch, setListSearch] = useState('')

  const filteredEvents = useMemo(
    () => filterEventsForList(events, listSearch),
    [events, listSearch],
  )

  const resultLabel =
    listSearch.trim() && filteredEvents.length !== events.length
      ? `${filteredEvents.length} of ${events.length}`
      : `${filteredEvents.length} results`

  return (
    <aside className="flex h-[55vh] flex-col rounded-xl bg-white p-4 shadow-card lg:h-full">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">Upcoming Events</h2>
        <span className="text-xs text-slate-500">{resultLabel}</span>
      </div>

      <div className="mb-3 shrink-0 rounded-lg border border-slate-200 bg-slate-50/80 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <label htmlFor="upcoming-events-list-search" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Search this list
          </label>
          {listSearch.trim() ? (
            <button
              type="button"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              onClick={() => setListSearch('')}
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="flex gap-2">
          <input
            id="upcoming-events-list-search"
            type="search"
            value={listSearch}
            onChange={(e) => setListSearch(e.target.value)}
            placeholder="Title, city, venue, category..."
            className="input min-w-0 flex-1 text-sm"
            aria-label="Search upcoming events list"
            autoComplete="off"
            enterKeyHint="search"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {filteredEvents.map((event) => {
          const active = activeEventId === event.id
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onEventSelect(event.id)}
              className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                active
                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                  : 'border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">{event.title}</h3>
                <span className="rounded-full bg-slate-200 px-2 py-1 text-[10px] font-bold uppercase text-slate-700">
                  {event.category}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">{format(new Date(event.dateTime), 'PPP p')}</p>
              <p className="mt-1 text-xs text-slate-500">
                {event.venue}, {event.city}
              </p>
            </button>
          )
        })}
        {events.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            No upcoming events match this filter.
          </p>
        )}
        {events.length > 0 && filteredEvents.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            No events match your search. Try a different term.
          </p>
        )}
      </div>
    </aside>
  )
}

export const EventSidebar = memo(EventSidebarComponent)
