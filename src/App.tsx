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
      <header className="relative overflow-hidden rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white via-indigo-50/50 to-violet-50/80 p-5 shadow-card sm:p-6">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-400/15 blur-2xl"
          aria-hidden
        />
        <p className="relative text-xs font-semibold uppercase tracking-widest text-indigo-600/90">
          Live discovery
        </p>
        <h1 className="relative mt-1 bg-gradient-to-r from-indigo-700 via-violet-600 to-fuchsia-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          Tech Events Map
        </h1>
        <p className="relative mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Discover upcoming tech events and instantly navigate their locations on an interactive map.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="h-36 animate-pulse rounded-2xl bg-gradient-to-r from-indigo-100 via-violet-100 to-fuchsia-100/80" />
        }
      >
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
        <Suspense
          fallback={
            <div className="h-[420px] animate-pulse rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 lg:h-full" />
          }
        >
          <EventsMap events={events} activeEventId={selectedEventId} center={center} />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-[420px] animate-pulse rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100/90 lg:h-full" />
          }
        >
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
