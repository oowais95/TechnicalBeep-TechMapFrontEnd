import { memo, useEffect, useMemo, useRef } from 'react'
import type { Marker as LeafletMarker } from 'leaflet'
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

const hasValidMapCoordinates = (event: TechEvent): boolean => {
  const c = event.coordinates
  return (
    Array.isArray(c) &&
    c.length === 2 &&
    Number.isFinite(c[0]) &&
    Number.isFinite(c[1])
  )
}

const EventsMapComponent = ({ events, activeEventId, center }: EventsMapProps) => {
  const mapEvents = useMemo(() => events.filter(hasValidMapCoordinates), [events])
  const markerRefs = useRef<Record<string, LeafletMarker | null>>({})
  const activeEvent = useMemo(
    () => mapEvents.find((event) => event.id === activeEventId) ?? null,
    [mapEvents, activeEventId],
  )

  useEffect(() => {
    if (!activeEventId) {
      return
    }
    markerRefs.current[activeEventId]?.openPopup()
  }, [activeEventId])

  return (
    <div className="h-[420px] overflow-hidden rounded-2xl border border-indigo-100/90 bg-white/50 shadow-card ring-1 ring-indigo-100/40 transition duration-300 lg:h-full">
      <MapContainer center={center} zoom={MAP_CONFIG.defaultZoom} scrollWheelZoom className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {activeEvent && (
          <MapFocuser
            coordinates={activeEvent.coordinates}
            key={`${activeEvent.id}-${activeEvent.coordinates[0]}-${activeEvent.coordinates[1]}`}
          />
        )}

        <MarkerClusterGroup chunkedLoading>
          {mapEvents.map((event) => (
            <Marker
              key={event.id}
              position={event.coordinates}
              ref={(ref) => {
                markerRefs.current[event.id] = ref
              }}
            >
              <Popup>
                <div className="max-w-60">
                  <h3 className="text-sm font-semibold text-slate-900">{event.title}</h3>
                  <p className="mt-1 text-xs text-indigo-700/90">
                    {formatEventDateDisplay(event.dateTime)}
                  </p>
                  <p className="text-xs text-slate-600">
                    {event.venue}, {event.city}
                  </p>
                  <p className="mt-2 text-xs text-slate-700">{event.description}</p>
                  <a
                    className="mt-2 inline-block text-xs font-semibold text-violet-600 underline decoration-violet-300 underline-offset-2 hover:text-indigo-700"
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

interface MapFocuserProps {
  coordinates: [number, number]
}

const MapFocuser = ({ coordinates }: MapFocuserProps) => {
  const map = useMap()

  useEffect(() => {
    map.flyTo(coordinates, MAP_CONFIG.focusedZoom, { duration: 0.6 })
  }, [coordinates, map])

  return null
}

export const EventsMap = memo(EventsMapComponent)
