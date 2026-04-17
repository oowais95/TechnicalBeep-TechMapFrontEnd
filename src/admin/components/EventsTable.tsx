import { format } from 'date-fns'
import type { TechEvent } from '../../types/event'

interface EventsTableProps {
  events: TechEvent[]
  isLoading: boolean
  onEdit: (eventId: string) => void
  onDelete: (eventId: string) => void
}

export const EventsTable = ({ events, isLoading, onEdit, onDelete }: EventsTableProps) => {
  if (isLoading) {
    return <div className="rounded-xl bg-white p-6 shadow-card">Loading events...</div>
  }

  if (events.length === 0) {
    return <div className="rounded-xl bg-white p-6 shadow-card">No events found.</div>
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-700">Title</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Date</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Location</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Flags</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{event.title}</p>
                  <p className="text-xs text-slate-500">{event.category}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{format(new Date(event.dateTime), 'PPP p')}</td>
                <td className="px-4 py-3 text-slate-600">
                  {event.venue}, {event.city}
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  <p>Featured: {event.featured ? 'Yes' : 'No'}</p>
                  <p>Show on map: {event.showOnMap ? 'Yes' : 'No'}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      onClick={() => onEdit(event.id)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-md border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      onClick={() => onDelete(event.id)}
                      type="button"
                    >
                      Delete
                    </button>
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
