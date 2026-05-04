import { ENV } from '../config/env'
import { mockEvents } from '../data/mockEvents'
import { isUpcomingPublishedMapEvent } from '../utils/eventFilters'

const RETRY_ATTEMPTS = 3
const RETRY_DELAY_MS = 500
const MOCK_STORAGE_KEY = 'tem_mock_events_v1'

const loadLocalEventsFromStorage = () => {
  if (typeof sessionStorage === 'undefined') {
    return null
  }
  try {
    const raw = sessionStorage.getItem(MOCK_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null
  } catch {
    return null
  }
}

let localEvents = loadLocalEventsFromStorage() ?? [...mockEvents]

const persistMockEvents = () => {
  if (typeof sessionStorage === 'undefined') {
    return
  }
  try {
    sessionStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(localEvents))
  } catch {
    /* ignore quota / private mode */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tem:events-changed'))
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const trimSlash = (value) => value.replace(/\/+$/, '')

const parsePositiveInt = (raw, fallback) => {
  const n = Number.parseInt(String(raw ?? ''), 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

/** Spring Data REST style page object, or a plain array. */
const normalizeEventsPayload = (data) => {
  if (Array.isArray(data)) {
    return data
  }
  if (data && Array.isArray(data.content)) {
    return data.content
  }
  if (data && Array.isArray(data.data)) {
    return data.data
  }
  return []
}

/** API expects latitude/longitude; UI uses coordinates [lat, lng]. */
const eventPayloadToApiBody = (payload) => {
  const [lat, lng] = payload.coordinates ?? []
  return {
    title: payload.title,
    description: payload.description,
    dateTime: payload.dateTime,
    venue: payload.venue,
    city: payload.city,
    latitude: lat,
    longitude: lng,
    category: payload.category,
    featured: payload.featured,
    published: payload.published,
    showOnMap: payload.showOnMap,
    externalUrl: payload.externalUrl,
  }
}

const mapEventFromApi = (row) => {
  if (!row || typeof row !== 'object') {
    return row
  }
  const lat = row.latitude
  const lng = row.longitude
  if (Array.isArray(row.coordinates) && row.coordinates.length >= 2) {
    return {
      ...row,
      coordinates: [Number(row.coordinates[0]), Number(row.coordinates[1])],
    }
  }
  if (lat != null && lng != null && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
    return { ...row, coordinates: [Number(lat), Number(lng)] }
  }
  return row
}

const buildUrl = (path, query = {}) => {
  if (!ENV.apiBaseUrl && !ENV.useMockApi) {
    throw new Error('VITE_API_BASE_URL is not set. Please configure your API base URL.')
  }

  const joined = `${trimSlash(ENV.apiBaseUrl)}${path}`
  const originFallback =
    typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'http://localhost:5173'
  const url = /^https?:\/\//i.test(joined) ? new URL(joined) : new URL(joined, originFallback)

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }
    url.searchParams.set(key, String(value))
  })

  return url.toString()
}

const messageFromErrorBody = (body) => {
  if (!body || typeof body !== 'object') {
    return null
  }
  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message.trim()
  }
  if (typeof body.detail === 'string' && body.detail.trim()) {
    return body.detail.trim()
  }
  if (typeof body.error === 'string' && body.error.trim()) {
    return body.error.trim()
  }
  if (Array.isArray(body.errors) && body.errors.length > 0) {
    const parts = body.errors
      .map((e) => (e && (e.defaultMessage || e.message)) || '')
      .filter(Boolean)
    if (parts.length) return parts.join('; ')
  }
  if (body.errors && typeof body.errors === 'object' && !Array.isArray(body.errors)) {
    const parts = Object.entries(body.errors).map(([k, v]) => {
      const val = Array.isArray(v) ? v.join(', ') : String(v)
      return `${k}: ${val}`
    })
    if (parts.length) return parts.join('; ')
  }
  return null
}

const fetchWithRetry = async (url, options = {}) => {
  let lastError = null

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        const retryable = response.status >= 500
        let message = `Request failed with status ${response.status}${response.statusText ? ` (${response.statusText})` : ''}`
        try {
          const ct = response.headers.get('content-type') ?? ''
          const rawText = await response.text()
          if (ct.includes('application/json') && rawText) {
            const body = JSON.parse(rawText)
            const parsed = messageFromErrorBody(body)
            if (parsed) message = `${message}. ${parsed}`
            else message = `${message}. ${rawText}`
          } else if (rawText) {
            message = `${message}. ${rawText}`
          }
        } catch {
          /* ignore non-JSON error bodies */
        }
        if (!retryable || attempt === RETRY_ATTEMPTS) {
          throw new Error(message)
        }
        await wait(RETRY_DELAY_MS * attempt)
        continue
      }

      if (response.status === 204) {
        return { success: true }
      }

      const contentType = response.headers.get('content-type') ?? ''
      if (!contentType.includes('application/json')) {
        return { success: true }
      }

      return response.json()
    } catch (error) {
      lastError = error
      if (attempt === RETRY_ATTEMPTS) {
        break
      }
      await wait(RETRY_DELAY_MS * attempt)
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Request failed after retries.')
}

export const getEvents = ({ search, category, listAll = false } = {}) => {
  if (ENV.useMockApi) {
    const base = listAll
      ? [...localEvents]
      : localEvents.filter((event) => isUpcomingPublishedMapEvent(event))
    const normalizedSearch = (search ?? '').trim().toLowerCase()
    return Promise.resolve(
      base.filter((event) => {
        const searchMatch =
          !normalizedSearch ||
          event.title.toLowerCase().includes(normalizedSearch) ||
          event.city.toLowerCase().includes(normalizedSearch) ||
          (event.venue && event.venue.toLowerCase().includes(normalizedSearch))
        const categoryMatch = !category || category === 'All' || event.category === category
        return searchMatch && categoryMatch
      }),
    )
  }

  const mapPageSize = parsePositiveInt(import.meta.env.VITE_EVENTS_PAGE_SIZE, 20)
  const adminPageSize = parsePositiveInt(import.meta.env.VITE_ADMIN_EVENTS_PAGE_SIZE, 500)

  const url = buildUrl('/events', {
    page: 0,
    size: listAll ? adminPageSize : mapPageSize,
    sort: 'dateTime,asc',
  })
  return fetchWithRetry(url).then((data) => normalizeEventsPayload(data).map(mapEventFromApi))
}

export const getFeaturedEvents = () => {
  if (ENV.useMockApi) {
    return Promise.resolve(
      localEvents.filter((event) => event.featured && isUpcomingPublishedMapEvent(event)),
    )
  }

  return getEvents({}).then((rows) =>
    rows.filter((event) => event.featured && isUpcomingPublishedMapEvent(event)),
  )
}

export const createEvent = (payload) => {
  if (ENV.useMockApi) {
    const created = { ...payload, id: `evt-${Date.now()}` }
    localEvents = [created, ...localEvents]
    persistMockEvents()
    return Promise.resolve(created)
  }

  const url = buildUrl('/events')
  return fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventPayloadToApiBody(payload)),
  }).then(mapEventFromApi)
}

export const updateEvent = (id, payload) => {
  if (ENV.useMockApi) {
    localEvents = localEvents.map((event) => (event.id === id ? { ...event, ...payload, id } : event))
    const updated = localEvents.find((event) => event.id === id)
    if (!updated) {
      return Promise.reject(new Error('Event not found.'))
    }
    persistMockEvents()
    return Promise.resolve(updated)
  }

  const url = buildUrl(`/events/${id}`)
  return fetchWithRetry(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventPayloadToApiBody(payload)),
  }).then(mapEventFromApi)
}

export const deleteEvent = (id) => {
  if (ENV.useMockApi) {
    localEvents = localEvents.filter((event) => event.id !== id)
    persistMockEvents()
    return Promise.resolve({ success: true })
  }

  const url = buildUrl(`/events/${id}`)
  return fetchWithRetry(url, { method: 'DELETE' })
}
