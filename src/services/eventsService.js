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

const buildUrl = (path, query = {}) => {
  if (!ENV.apiBaseUrl && !ENV.useMockApi) {
    throw new Error('VITE_API_BASE_URL is not set. Please configure your API base URL.')
  }

  const url = new URL(`${ENV.apiBaseUrl}${path}`)

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }
    url.searchParams.set(key, String(value))
  })

  return url.toString()
}

const fetchWithRetry = async (url, options = {}) => {
  let lastError = null

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        const retryable = response.status >= 500
        if (!retryable || attempt === RETRY_ATTEMPTS) {
          throw new Error(`Request failed with status ${response.status}`)
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

  const categoryParam = category && category !== 'All' ? category : undefined
  const url = buildUrl('/events', {
    q: search,
    category: categoryParam,
    ...(listAll ? { listAll: 'true' } : {}),
  })
  return fetchWithRetry(url)
}

export const getFeaturedEvents = () => {
  if (ENV.useMockApi) {
    return Promise.resolve(
      localEvents.filter((event) => event.featured && isUpcomingPublishedMapEvent(event)),
    )
  }

  const url = buildUrl('/events/featured')
  return fetchWithRetry(url)
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
    body: JSON.stringify(payload),
  })
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
    body: JSON.stringify(payload),
  })
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
