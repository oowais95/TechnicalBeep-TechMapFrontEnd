import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { EventPayload } from '../../services/eventsService.js'
import { createEvent, getEvents, updateEvent } from '../../services/eventsService.js'
import type { TechEvent } from '../../types/event'
import { EventForm } from '../components/EventForm'

export const EventFormPage = () => {
  const navigate = useNavigate()
  const { eventId } = useParams()
  const isEditMode = useMemo(() => Boolean(eventId), [eventId])
  const [initialEvent, setInitialEvent] = useState<TechEvent | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadEvent = useCallback(async () => {
    if (!eventId) {
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const events = (await getEvents()) as TechEvent[]
      const found = events.find((event) => event.id === eventId)
      if (!found) {
        throw new Error('Event not found.')
      }
      setInitialEvent(found)
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : 'Failed to load event.')
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    void loadEvent()
  }, [loadEvent])

  const handleSubmit = async (payload: EventPayload) => {
    setIsSaving(true)
    setError(null)
    try {
      if (eventId) {
        await updateEvent(eventId, payload)
      } else {
        await createEvent(payload)
      }
      navigate('/admin')
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : 'Failed to save event.')
    } finally {
      setIsSaving(false)
    }
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-white p-6 text-center shadow-card">
        <p className="text-sm text-rose-600">{error}</p>
        <button
          className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => void loadEvent()}
          type="button"
        >
          Retry
        </button>
      </div>
    )
  }

  if (isLoading) {
    return <div className="rounded-xl bg-white p-6 shadow-card">Loading event...</div>
  }

  return (
    <section className="space-y-4">
      <button
        className="text-sm font-medium text-slate-600 hover:text-slate-900"
        onClick={() => navigate('/admin')}
        type="button"
      >
        ← Back to dashboard
      </button>
      <EventForm initialEvent={initialEvent} isSaving={isSaving} onSubmit={handleSubmit} />
    </section>
  )
}
