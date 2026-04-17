import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TechEvent } from '../../types/event'
import { deleteEvent, getEvents } from '../../services/eventsService.js'
import { EventsTable } from '../components/EventsTable'

const filterAdminEvents = (items: TechEvent[], query: string): TechEvent[] => {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter(
    (event) =>
      event.title.toLowerCase().includes(q) ||
      event.city.toLowerCase().includes(q) ||
      event.venue.toLowerCase().includes(q) ||
      event.category.toLowerCase().includes(q) ||
      event.id.toLowerCase().includes(q),
  )
}

export const DashboardPage = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState<TechEvent[]>([])
  const [listSearch, setListSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filteredEvents = useMemo(() => filterAdminEvents(events, listSearch), [events, listSearch])

  const loadEvents = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const payload = (await getEvents({ listAll: true })) as TechEvent[]
      setEvents(payload)
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : 'Failed to fetch events.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadEvents()
  }, [loadEvents])

  const handleDelete = async (eventId: string) => {
    const shouldDelete = window.confirm('Delete this event?')
    if (!shouldDelete) {
      return
    }
    try {
      await deleteEvent(eventId)
      await loadEvents()
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : 'Failed to delete event.')
    }
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-white p-6 text-center shadow-card">
        <p className="text-sm text-rose-600">{error}</p>
        <button
          className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => void loadEvents()}
          type="button"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Events</h2>
          <p className="text-sm text-slate-600">Create, update, and remove tech events.</p>
        </div>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          onClick={() => navigate('/admin/events/new')}
          type="button"
        >
          Add Event
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="admin-events-search">
          Search events
        </label>
        <input
          id="admin-events-search"
          type="search"
          value={listSearch}
          onChange={(e) => setListSearch(e.target.value)}
          placeholder="Title, city, venue, category, or id..."
          className="input mt-1.5"
          autoComplete="off"
          aria-label="Search events in admin list"
        />
        {!isLoading && events.length > 0 ? (
          <p className="mt-1.5 text-xs text-slate-500">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        ) : null}
      </div>

      <EventsTable
        events={filteredEvents}
        totalBeforeSearch={events.length}
        isLoading={isLoading}
        onEdit={(eventId) => navigate(`/admin/events/${eventId}/edit`)}
        onDelete={handleDelete}
      />
    </section>
  )
}
