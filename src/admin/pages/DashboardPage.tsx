import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TechEvent } from '../../types/event'
import { deleteEvent, getEvents } from '../../services/eventsService.js'
import { EventsTable } from '../components/EventsTable'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState<TechEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEvents = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const payload = (await getEvents()) as TechEvent[]
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
      <div className="flex items-center justify-between">
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

      <EventsTable
        events={events}
        isLoading={isLoading}
        onEdit={(eventId) => navigate(`/admin/events/${eventId}/edit`)}
        onDelete={handleDelete}
      />
    </section>
  )
}
