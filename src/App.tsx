import { lazy, Suspense } from 'react'
import { AppHeader } from './components/AppHeader'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { ErrorState } from './components/ErrorState'
import { MAP_CONFIG } from './config/map'
import { useEventsData } from './hooks/useEventsData'
import { useUserGeolocation } from './hooks/useUserGeolocation'
import { useUrlFilterState } from './hooks/useUrlFilterState'
import { useEventStore } from './store/useEventStore'
import type { EventCategory } from './types/event'

const categories: Array<EventCategory | 'All'> = ['All', 'AI', 'Web', 'Cloud', 'Mobile', 'Security', 'Data']
const EventsMap = lazy(() => import('./components/map/EventsMap').then((mod) => ({ default: mod.EventsMap })))
const EventSidebar = lazy(() =>
  import('./components/EventSidebar').then((mod) => ({ default: mod.EventSidebar })),
)
const FeaturedEventsCarousel = lazy(() =>
  import('./components/FeaturedEventsCarousel').then((mod) => ({ default: mod.FeaturedEventsCarousel })),
)

function App() {
  const center = useUserGeolocation(MAP_CONFIG.defaultCenter)
  const {
    searchQuery,
    categoryFilter,
    countryFilter,
    selectedEventId,
    hasHydratedFromUrl,
    setSearchQuery,
    setCategoryFilter,
    setCountryFilter,
    setFiltersFromUrl,
    markUrlHydrated,
    setSelectedEventId,
  } = useEventStore()
  const { events, featuredEvents, availableCountries, isLoading, error, refetch } = useEventsData({
    searchQuery,
    categoryFilter,
    countryFilter,
  })

  useUrlFilterState({
    searchQuery,
    categoryFilter,
    countryFilter,
    hasHydratedFromUrl,
    setFiltersFromUrl,
    markUrlHydrated,
  })

  const handleFlyTo = (eventId: string) => {
    setSelectedEventId(eventId)
  }

  const hasFeatured = featuredEvents.length > 0

  if (isLoading) {
    return <LoadingSkeleton hasFeatured={false} />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refetch()} />
  }

  return (
    <main className="tem-app">
      <AppHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div
        className="absolute right-0 z-0 left-0 sm:left-[380px]"
        style={{
          top: 'var(--app-header-height)',
          bottom: hasFeatured ? 'var(--featured-bar-height)' : 0,
        }}
      >
        <Suspense fallback={<div className="h-full w-full animate-pulse bg-[#e8e4dc]" />}>
          <EventsMap events={events} activeEventId={selectedEventId} center={center} />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div
            className="fixed left-0 z-20 w-full max-w-[380px] animate-pulse border-r border-warm-border bg-white/90"
            style={{ top: 'var(--app-header-height)', bottom: hasFeatured ? 'var(--featured-bar-height)' : 0 }}
          />
        }
      >
        <EventSidebar
          events={events}
          activeEventId={selectedEventId}
          categories={categories}
          countries={availableCountries}
          selectedCategory={categoryFilter}
          selectedCountry={countryFilter}
          onCategoryChange={setCategoryFilter}
          onCountryChange={setCountryFilter}
          onEventSelect={setSelectedEventId}
          onFlyTo={handleFlyTo}
          reserveBottomForFeatured={hasFeatured}
        />
      </Suspense>

      {hasFeatured ? (
        <Suspense fallback={null}>
          <FeaturedEventsCarousel events={featuredEvents} onFlyTo={handleFlyTo} />
        </Suspense>
      ) : null}
    </main>
  )
}

export default App
