import { memo, useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import type { Layer, Marker as LeafletMarker } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { MAP_CONFIG } from '../../config/map'
import type { TechEvent } from '../../types/event'
import { formatEventDateDisplay } from '../../utils/formatEventDate'

interface EventsMapProps {
  events: TechEvent[]
  activeEventId: string | null
  center: [number, number]
}

interface MarkerClusterGroupLayer extends Layer {
  hasLayer: (layer: Layer) => boolean
  zoomToShowLayer: (layer: Layer, callback?: () => void) => void
}

const hasValidMapCoordinates = (event: TechEvent): boolean => {
  const c = event.coordinates
  return (
    Array.isArray(c) &&
    c.length === 2 &&
    Number.isFinite(c[0]) &&
    Number.isFinite(c[1])
  )
}

const openMarkerPopup = (
  marker: LeafletMarker | null | undefined,
  clusterGroup: MarkerClusterGroupLayer | null,
) => {
  if (!marker) {
    return
  }

  if (clusterGroup && clusterGroup.hasLayer(marker)) {
    clusterGroup.zoomToShowLayer(marker, () => {
      marker.openPopup()
    })
    return
  }

  marker.openPopup()
}

interface ActiveEventControllerProps {
  activeEvent: TechEvent | null
  activeEventId: string | null
  markerRefs: MutableRefObject<Record<string, LeafletMarker | null>>
  clusterGroupRef: MutableRefObject<MarkerClusterGroupLayer | null>
}

const ActiveEventController = ({
  activeEvent,
  activeEventId,
  markerRefs,
  clusterGroupRef,
}: ActiveEventControllerProps) => {
  const map = useMap()

  useEffect(() => {
    if (!activeEventId || !activeEvent) {
      return
    }

    const marker = markerRefs.current[activeEventId]
    const clusterGroup = clusterGroupRef.current

    let cancelled = false

    const revealPopup = () => {
      if (cancelled) {
        return
      }
      openMarkerPopup(marker, clusterGroup)
    }

    const onMoveEnd = () => {
      map.off('moveend', onMoveEnd)
      revealPopup()
    }

    map.on('moveend', onMoveEnd)
    map.flyTo(activeEvent.coordinates, MAP_CONFIG.focusedZoom, { duration: 0.6 })

    // If the map does not move (already centered), moveend may not fire.
    const fallbackTimer = window.setTimeout(() => {
      map.off('moveend', onMoveEnd)
      revealPopup()
    }, 700)

    return () => {
      cancelled = true
      map.off('moveend', onMoveEnd)
      window.clearTimeout(fallbackTimer)
    }
  }, [activeEvent, activeEventId, clusterGroupRef, map, markerRefs])

  return null
}

const EventsMapComponent = ({ events, activeEventId, center }: EventsMapProps) => {
  const mapEvents = useMemo(() => events.filter(hasValidMapCoordinates), [events])
  const markerRefs = useRef<Record<string, LeafletMarker | null>>({})
  const clusterGroupRef = useRef<MarkerClusterGroupLayer | null>(null)
  const activeEvent = useMemo(
    () => mapEvents.find((event) => event.id === activeEventId) ?? null,
    [mapEvents, activeEventId],
  )

  return (
    <div className="h-full w-full">
      <MapContainer center={center} zoom={MAP_CONFIG.defaultZoom} scrollWheelZoom className="z-0 h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {activeEvent && activeEventId ? (
          <ActiveEventController
            activeEvent={activeEvent}
            activeEventId={activeEventId}
            markerRefs={markerRefs}
            clusterGroupRef={clusterGroupRef}
          />
        ) : null}

        <MarkerClusterGroup
          chunkedLoading
          ref={(group: MarkerClusterGroupLayer | null) => {
            clusterGroupRef.current = group
          }}
        >
          {mapEvents.map((event) => (
            <Marker
              key={event.id}
              position={event.coordinates}
              ref={(ref) => {
                markerRefs.current[event.id] = ref
              }}
            >
              <Popup>
                <div className="max-w-60 font-sans">
                  <h3 className="font-display text-sm font-semibold text-ink">{event.title}</h3>
                  <p className="mt-1 text-xs text-ink-muted">
                    {formatEventDateDisplay(event.dateTime)}
                  </p>
                  <p className="text-xs text-ink-subtle">
                    {event.venue}, {event.city}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">{event.description}</p>
                  <a
                    className="mt-2 inline-block text-xs font-semibold text-ink underline decoration-warm-border underline-offset-2 hover:opacity-80"
                    href={event.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open event details
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}

export const EventsMap = memo(EventsMapComponent)
