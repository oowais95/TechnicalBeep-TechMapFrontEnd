import { memo, useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import type { Layer, Marker as LeafletMarker } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { MAP_CONFIG } from '../../config/map'
import type { TechEvent } from '../../types/event'
import { createEventClusterIcon } from '../../utils/mapClusterIcon'
import { MapEventPopup } from './MapEventPopup'

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

  const { tileLayer } = MAP_CONFIG

  return (
    <div className="tem-map h-full w-full">
      <MapContainer
        center={center}
        zoom={MAP_CONFIG.defaultZoom}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution={tileLayer.attribution}
          url={tileLayer.url}
          subdomains={tileLayer.subdomains}
          maxZoom={tileLayer.maxZoom}
        />

        <ZoomControl position="topright" />

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
          iconCreateFunction={createEventClusterIcon}
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
                <MapEventPopup event={event} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}

export const EventsMap = memo(EventsMapComponent)
