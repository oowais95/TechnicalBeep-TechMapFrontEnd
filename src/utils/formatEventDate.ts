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
