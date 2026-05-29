import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { EventPayload } from '../../services/eventsService.js'
import { createEvent, getEvents, updateEvent } from '../../services/eventsService.js'
import type { TechEvent } from '../../types/event'
import { EventForm } from '../components/EventForm'
import { Button } from '../../components/ui/Button'
import { StateNotice } from '../../components/ui/StateNotice'

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
      const events = (await getEvents({ listAll: true })) as TechEvent[]
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
      <StateNotice
        tone="error"
        title="Could not open event"
        message={error}
        action={
          <Button onClick={() => void loadEvent()} type="button">
            Retry
          </Button>
        }
      />
    )
  }

  if (isLoading) {
    return <div className="tem-panel p-4 text-sm text-ink-muted">Loading event...</div>
  }

  return (
    <section className="space-y-4">
      <button className="tem-subtle-button" onClick={() => navigate('/admin')} type="button">
        ← Back to dashboard
      </button>
      <EventForm initialEvent={initialEvent} isSaving={isSaving} onSubmit={handleSubmit} />
    </section>
  )
}
