import type { TechEvent } from '../types/event'

/** Fallback when API does not provide `country` — keyed by city name. */
const CITY_TO_COUNTRY: Record<string, string> = {
  London: 'United Kingdom',
  Berlin: 'Germany',
  Toronto: 'Canada',
  Dubai: 'United Arab Emirates',
  Singapore: 'Singapore',
  'New York': 'United States',
  Lisbon: 'Portugal',
  Amsterdam: 'Netherlands',
  Paris: 'France',
  Chicago: 'United States',
  Warsaw: 'Poland',
  Sydney: 'Australia',
  Seattle: 'United States',
  Copenhagen: 'Denmark',
  'San Francisco': 'United States',
}

export const getEventCountry = (event: TechEvent): string => {
  const fromApi = event.country?.trim()
  if (fromApi) return fromApi
  const fromCity = CITY_TO_COUNTRY[event.city?.trim() ?? '']
  if (fromCity) return fromCity
  return 'Other'
}

export const getUniqueCountries = (events: TechEvent[]): string[] => {
  const set = new Set(events.map(getEventCountry))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}
