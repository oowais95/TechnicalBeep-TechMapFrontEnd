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
    <aside className="flex h-[55vh] flex-col rounded-2xl border border-indigo-100/80 bg-white/90 p-4 shadow-card backdrop-blur-sm lg:h-full">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-2">
        <h2 className="bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-lg font-semibold text-transparent">
          Upcoming Events
        </h2>
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-900">{resultLabel}</span>
      </div>

      <div className="mb-3 shrink-0 rounded-xl border border-indigo-100/90 bg-gradient-to-br from-indigo-50/50 to-violet-50/40 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <label htmlFor="upcoming-events-list-search" className="text-xs font-semibold uppercase tracking-wide text-indigo-700/90">
            Search this list
          </label>
          {listSearch.trim() ? (
            <button
              type="button"
              className="text-xs font-semibold text-indigo-600 hover:text-violet-700"
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
              className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                active
                  ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-violet-50 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-200/80'
                  : 'border-indigo-100/90 bg-white/70 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/40 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">{event.title}</h3>
                <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-bold uppercase text-indigo-800">
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
          <p className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 p-4 text-sm text-indigo-800/80">
            No upcoming events match this filter.
          </p>
        )}
        {events.length > 0 && filteredEvents.length === 0 && (
          <p className="rounded-xl border border-dashed border-violet-200 bg-violet-50/50 p-4 text-sm text-violet-900/80">
            No events match your search. Try a different term.
          </p>
        )}
      </div>
    </aside>
  )
}

export const EventSidebar = memo(EventSidebarComponent)
