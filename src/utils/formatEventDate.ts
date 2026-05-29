import { format, isValid, parseISO } from 'date-fns'

/** Safe for API payloads: never throws (unlike raw `format(new Date(x), …)` on bad input). */
export const formatEventDateDisplay = (value: unknown, datePattern = 'PPP p'): string => {
  if (value == null || value === '') {
    return 'Date unavailable'
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const d = new Date(value)
    return isValid(d) ? format(d, datePattern) : 'Date unavailable'
  }

  if (typeof value === 'string') {
    const fromIso = parseISO(value)
    if (isValid(fromIso)) {
      return format(fromIso, datePattern)
    }
    const d = new Date(value)
    return isValid(d) ? format(d, datePattern) : 'Date unavailable'
  }

  return 'Date unavailable'
}

export const formatFeaturedDateParts = (
  value: unknown,
): { month: string; day: string } => {
  if (value == null || value === '') {
    return { month: '—', day: '—' }
  }

  let date: Date | null = null
  if (typeof value === 'number' && Number.isFinite(value)) {
    const d = new Date(value)
    date = isValid(d) ? d : null
  } else if (typeof value === 'string') {
    const fromIso = parseISO(value)
    date = isValid(fromIso) ? fromIso : isValid(new Date(value)) ? new Date(value) : null
  }

  if (!date) {
    return { month: '—', day: '—' }
  }

  return {
    month: format(date, 'MMM').toUpperCase(),
    day: format(date, 'd'),
  }
}

/** Popup date line, e.g. "2 Nov 2026" (no time). */
export const formatPopupEventDate = (value: unknown): string => {
  if (value == null || value === '') {
    return 'Date unavailable'
  }

  let date: Date | null = null
  if (typeof value === 'number' && Number.isFinite(value)) {
    const d = new Date(value)
    date = isValid(d) ? d : null
  } else if (typeof value === 'string') {
    const fromIso = parseISO(value)
    date = isValid(fromIso) ? fromIso : isValid(new Date(value)) ? new Date(value) : null
  }

  if (!date) {
    return 'Date unavailable'
  }

  return format(date, 'd MMM yyyy')
}
