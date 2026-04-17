import { ENV } from '../config/env'
import { mockEvents } from '../data/mockEvents'

const RETRY_ATTEMPTS = 3
const RETRY_DELAY_MS = 500
let localEvents = [...mockEvents]

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

export const getEvents = ({ search, category } = {}) => {
  if (ENV.useMockApi) {
    const normalizedSearch = (search ?? '').trim().toLowerCase()
    return Promise.resolve(
      localEvents.filter((event) => {
        const searchMatch =
          !normalizedSearch ||
          event.title.toLowerCase().includes(normalizedSearch) ||
          event.city.toLowerCase().includes(normalizedSearch)
        const categoryMatch = !category || category === 'All' || event.category === category
        return searchMatch && categoryMatch
      }),
    )
  }

  const categoryParam = category && category !== 'All' ? category : undefined
  const url = buildUrl('/events', { q: search, category: categoryParam })
  return fetchWithRetry(url)
}

export const getFeaturedEvents = () => {
  if (ENV.useMockApi) {
    return Promise.resolve(localEvents.filter((event) => event.featured))
  }

  const url = buildUrl('/events/featured')
  return fetchWithRetry(url)
}

export const createEvent = (payload) => {
  if (ENV.useMockApi) {
    const created = { ...payload, id: `evt-${Date.now()}` }
    localEvents = [created, ...localEvents]
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
    return Promise.resolve({ success: true })
  }

  const url = buildUrl(`/events/${id}`)
  return fetchWithRetry(url, { method: 'DELETE' })
}
