import { memo, useEffect, useMemo, useRef } from 'react'
import type { Marker as LeafletMarker } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { format } from 'date-fns'
import { MAP_CONFIG } from '../../config/map'
import type { TechEvent } from '../../types/event'

interface EventsMapProps {
  events: TechEvent[]
  activeEventId: string | null
  center: [number, number]
}

const EventsMapComponent = ({ events, activeEventId, center }: EventsMapProps) => {
  const markerRefs = useRef<Record<string, LeafletMarker | null>>({})
  const activeEvent = useMemo(
    () => events.find((event) => event.id === activeEventId) ?? null,
    [events, activeEventId],
  )

  useEffect(() => {
    if (!activeEventId) {
      return
    }
    markerRefs.current[activeEventId]?.openPopup()
  }, [activeEventId])

  return (
    <div className="h-[420px] overflow-hidden rounded-xl shadow-card transition duration-300 lg:h-full">
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
          {events.map((event) => (
            <Marker
              key={event.id}
              position={event.coordinates}
              ref={(ref) => {
                markerRefs.current[event.id] = ref
              }}
            >
              <Popup>
                <div className="max-w-60">
                  <h3 className="text-sm font-semibold">{event.title}</h3>
                  <p className="mt-1 text-xs text-slate-600">
                    {format(new Date(event.dateTime), 'PPP p')}
                  </p>
                  <p className="text-xs text-slate-600">
                    {event.venue}, {event.city}
                  </p>
                  <p className="mt-2 text-xs text-slate-700">{event.description}</p>
                  <a
                    className="mt-2 inline-block text-xs font-semibold text-blue-600 underline"
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
