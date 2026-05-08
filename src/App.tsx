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
      <header className="tem-surface relative overflow-hidden rounded-3xl p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-fuchsia-400/15 blur-3xl"
          aria-hidden
        />
        <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700/90">
          Live discovery
        </p>
        <h1 className="relative mt-1 bg-gradient-to-r from-slate-900 via-indigo-700 to-violet-700 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          Tech Events Map
        </h1>
        <p className="relative mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Discover upcoming tech events and instantly navigate their locations on an interactive map.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="tem-surface h-36 animate-pulse rounded-3xl bg-gradient-to-r from-white/80 via-indigo-50/80 to-fuchsia-50/70" />
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
            <div className="tem-surface h-[420px] animate-pulse rounded-3xl bg-gradient-to-br from-white/80 to-indigo-50/70 lg:h-full" />
          }
        >
          <EventsMap events={events} activeEventId={selectedEventId} center={center} />
        </Suspense>
        <Suspense
          fallback={
            <div className="tem-surface h-[420px] animate-pulse rounded-3xl bg-gradient-to-br from-white/75 to-violet-50/80 lg:h-full" />
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
