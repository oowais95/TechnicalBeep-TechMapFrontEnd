import { useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import type { EventCategory, TechEvent } from '../../types/event'
import type { EventPayload } from '../../services/eventsService.js'

const categories: EventCategory[] = ['AI', 'Web', 'Cloud', 'Mobile', 'Security', 'Data']

interface EventFormProps {
  initialEvent?: TechEvent
  isSaving: boolean
  onSubmit: (payload: EventPayload) => Promise<void>
}

interface FormErrors {
  title?: string
  description?: string
  dateTime?: string
  venue?: string
  city?: string
  latitude?: string
  longitude?: string
  externalUrl?: string
}

export const EventForm = ({ initialEvent, isSaving, onSubmit }: EventFormProps) => {
  const [title, setTitle] = useState(initialEvent?.title ?? '')
  const [description, setDescription] = useState(initialEvent?.description ?? '')
  const [dateTime, setDateTime] = useState(initialEvent?.dateTime.slice(0, 16) ?? '')
  const [venue, setVenue] = useState(initialEvent?.venue ?? '')
  const [city, setCity] = useState(initialEvent?.city ?? '')
  const [category, setCategory] = useState<EventCategory>(initialEvent?.category ?? 'Web')
  const [latitude, setLatitude] = useState(String(initialEvent?.coordinates[0] ?? ''))
  const [longitude, setLongitude] = useState(String(initialEvent?.coordinates[1] ?? ''))
  const [featured, setFeatured] = useState(initialEvent?.featured ?? false)
  const [showOnMap, setShowOnMap] = useState(initialEvent?.showOnMap ?? true)
  const [externalUrl, setExternalUrl] = useState(initialEvent?.externalUrl ?? '')
  const [errors, setErrors] = useState<FormErrors>({})

  const submitLabel = useMemo(() => (initialEvent ? 'Update Event' : 'Create Event'), [initialEvent])

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {}
    if (!title.trim()) nextErrors.title = 'Title is required.'
    if (!description.trim()) nextErrors.description = 'Description is required.'
    if (!dateTime) nextErrors.dateTime = 'Date and time are required.'
    if (!venue.trim()) nextErrors.venue = 'Location is required.'
    if (!city.trim()) nextErrors.city = 'City is required.'
    if (!latitude || Number.isNaN(Number(latitude))) nextErrors.latitude = 'Valid latitude is required.'
    if (!longitude || Number.isNaN(Number(longitude)))
      nextErrors.longitude = 'Valid longitude is required.'
    if (!externalUrl.trim() || !/^https?:\/\//.test(externalUrl))
      nextErrors.externalUrl = 'Valid external URL required (http/https).'
    return nextErrors
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      dateTime: new Date(dateTime).toISOString(),
      venue: venue.trim(),
      city: city.trim(),
      category,
      coordinates: [Number(latitude), Number(longitude)],
      featured,
      showOnMap,
      published: true,
      externalUrl: externalUrl.trim(),
    })
  }

  return (
    <form className="space-y-4 rounded-xl bg-white p-5 shadow-card" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold text-slate-900">{submitLabel}</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" error={errors.title}>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Category">
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value as EventCategory)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description" error={errors.description}>
        <textarea
          className="input min-h-28"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Date & time" error={errors.dateTime}>
          <input
            className="input"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </Field>
        <Field label="External link" error={errors.externalUrl}>
          <input className="input" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Location" error={errors.venue}>
          <input className="input" value={venue} onChange={(e) => setVenue(e.target.value)} />
        </Field>
        <Field label="City" error={errors.city}>
          <input className="input" value={city} onChange={(e) => setCity(e.target.value)} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Latitude" error={errors.latitude}>
          <input className="input" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        </Field>
        <Field label="Longitude" error={errors.longitude}>
          <input className="input" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </Field>
      </div>

      <div className="flex flex-wrap gap-5 text-sm text-slate-700">
        <label className="inline-flex items-center gap-2">
          <input checked={featured} onChange={(e) => setFeatured(e.target.checked)} type="checkbox" />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input checked={showOnMap} onChange={(e) => setShowOnMap(e.target.checked)} type="checkbox" />
          Show on map
        </label>
      </div>

      <button
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        disabled={isSaving}
        type="submit"
      >
        {isSaving ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}

const Field = ({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
    {children}
    {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
  </label>
)
