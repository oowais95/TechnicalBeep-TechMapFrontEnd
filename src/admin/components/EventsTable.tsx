import type { TechEvent } from '../../types/event'
import { formatEventDateDisplay } from '../../utils/formatEventDate'
import { Button } from '../../components/ui/Button'
import { StateNotice } from '../../components/ui/StateNotice'

interface EventsTableProps {
  events: TechEvent[]
  /** Total events before client-side search filter (for empty-state copy). */
  totalBeforeSearch?: number
  isLoading: boolean
  onEdit: (eventId: string) => void
  onDelete: (eventId: string) => void
}

export const EventsTable = ({ events, totalBeforeSearch, isLoading, onEdit, onDelete }: EventsTableProps) => {
  if (isLoading) {
    return <div className="tem-panel p-4 text-sm text-ink-muted">Loading events...</div>
  }

  if (events.length === 0) {
    const hasRowsButFilteredOut =
      typeof totalBeforeSearch === 'number' && totalBeforeSearch > 0
    return (
      <StateNotice
        title="No events"
        message={hasRowsButFilteredOut ? 'No events match your search. Try another term.' : 'No events found.'}
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-warm-border bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-warm-line bg-cream/60">
            <tr>
              <th className="px-4 py-3 font-semibold text-ink-muted">Title</th>
              <th className="px-4 py-3 font-semibold text-ink-muted">Date</th>
              <th className="px-4 py-3 font-semibold text-ink-muted">Location</th>
              <th className="px-4 py-3 font-semibold text-ink-muted">Flags</th>
              <th className="px-4 py-3 font-semibold text-ink-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-t border-warm-line transition-colors hover:bg-cream/50"
              >
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{event.title}</p>
                  <p className="text-xs text-ink-subtle">{event.category}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted">{formatEventDateDisplay(event.dateTime)}</td>
                <td className="px-4 py-3 text-ink-muted">
                  {event.venue}, {event.city}
                </td>
                <td className="px-4 py-3 text-xs text-ink-muted">
                  <p>Featured: {event.featured ? 'Yes' : 'No'}</p>
                  <p>Show on map: {event.showOnMap ? 'Yes' : 'No'}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="secondary" className="px-3 py-1 text-xs" onClick={() => onEdit(event.id)} type="button">
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      className="border-rose-200 px-3 py-1 text-xs text-rose-700 hover:bg-rose-50"
                      onClick={() => onDelete(event.id)}
                      type="button"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
