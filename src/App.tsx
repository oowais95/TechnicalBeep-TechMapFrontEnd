import { lazy, Suspense } from 'react'
import { FiltersBar } from './components/FiltersBar'
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
    selectedEventId,
    hasHydratedFromUrl,
    setSearchQuery,
    setCategoryFilter,
    setFiltersFromUrl,
    markUrlHydrated,
    setSelectedEventId,
  } = useEventStore()
  const { events, featuredEvents, isLoading, error, refetch } = useEventsData({
    searchQuery,
    categoryFilter,
  })

  useUrlFilterState({
    searchQuery,
    categoryFilter,
    hasHydratedFromUrl,
    setFiltersFromUrl,
    markUrlHydrated,
  })

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void refetch()} />
  }

  return (
    <main className="tem-app mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-4 p-4 lg:gap-5 lg:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Tech Events Map
        </h1>
        <p className="text-sm text-slate-600">
          Discover upcoming tech events and instantly navigate their locations on an interactive map.
        </p>
      </header>

      <Suspense fallback={<div className="h-36 animate-pulse rounded-xl bg-slate-200" />}>
        <FeaturedEventsCarousel events={featuredEvents} onEventClick={setSelectedEventId} />
      </Suspense>

      <FiltersBar
        searchQuery={searchQuery}
        selectedCategory={categoryFilter}
        categories={categories}
        onSearchChange={setSearchQuery}
        onCategoryChange={setCategoryFilter}
      />

      <section className="grid flex-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
        <Suspense fallback={<div className="h-[420px] animate-pulse rounded-xl bg-slate-200 lg:h-full" />}>
          <EventsMap events={events} activeEventId={selectedEventId} center={center} />
        </Suspense>
        <Suspense fallback={<div className="h-[420px] animate-pulse rounded-xl bg-slate-200 lg:h-full" />}>
          <EventSidebar
            events={events}
            activeEventId={selectedEventId}
            onEventSelect={setSelectedEventId}
          />
        </Suspense>
      </section>
    </main>
  )
}

export default App
