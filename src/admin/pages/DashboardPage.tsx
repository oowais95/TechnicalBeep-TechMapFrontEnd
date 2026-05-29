import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TechEvent } from '../../types/event'
import { deleteEvent, getEvents } from '../../services/eventsService.js'
import { EventsTable } from '../components/EventsTable'
import { Button } from '../../components/ui/Button'
import { Panel } from '../../components/ui/Panel'
import { StateNotice } from '../../components/ui/StateNotice'

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
      <StateNotice
        tone="error"
        title="Events failed to load"
        message={error}
        action={
          <Button onClick={() => void loadEvents()} type="button">
            Retry
          </Button>
        }
      />
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Events</h2>
          <p className="text-sm text-ink-muted">Create, update, and remove tech events.</p>
        </div>
        <Button onClick={() => navigate('/admin/events/new')} type="button">
          Add Event
        </Button>
      </div>

      <Panel className="p-3 sm:p-4">
        <label
          className="block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-subtle"
          htmlFor="admin-events-search"
        >
          Search events
        </label>
        <input
          id="admin-events-search"
          type="search"
          value={listSearch}
          onChange={(e) => setListSearch(e.target.value)}
          placeholder="Title, city, venue, category, or id..."
          className="input !rounded-xl mt-1.5"
          autoComplete="off"
          aria-label="Search events in admin list"
        />
        {!isLoading && events.length > 0 ? (
          <p className="mt-1.5 text-xs text-ink-subtle">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        ) : null}
      </Panel>

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
