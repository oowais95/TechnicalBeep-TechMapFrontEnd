import type { TechEvent } from '../../types/event'
import { getEventCountry } from '../../utils/eventCountry'
import { formatPopupEventDate } from '../../utils/formatEventDate'

const CATEGORY_LABELS: Record<string, string> = {
  AI: 'AI',
  Web: 'Web',
  Cloud: 'Cloud',
  Mobile: 'Mobile',
  Security: 'Security',
  Data: 'Data Analytics',
}

interface MapEventPopupProps {
  event: TechEvent
}

export const MapEventPopup = ({ event }: MapEventPopupProps) => {
  const country = getEventCountry(event)
  const categoryLabel = CATEGORY_LABELS[event.category] ?? String(event.category ?? '').trim()

  return (
    <div className="max-w-[260px] font-sans">
      <h3 className="font-display text-sm font-semibold leading-snug text-ink">{event.title}</h3>

      {categoryLabel ? (
        <p className="mt-2">
          <span className="inline-block rounded-md bg-[#f3f0ff] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#5b3df5]">
            {categoryLabel}
          </span>
        </p>
      ) : null}

      <p className="mt-2.5 flex items-start gap-1.5 text-xs leading-relaxed text-[#6b7280]">
        <span className="shrink-0" aria-hidden>
          📍
        </span>
        <span>
          {event.city}, {country}
        </span>
      </p>

      <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-[#6b7280]">
        <span className="shrink-0" aria-hidden>
          📅
        </span>
        <span>{formatPopupEventDate(event.dateTime)}</span>
      </p>

      {event.description ? (
        <p className="mt-2.5 text-xs leading-relaxed text-ink-muted">{event.description}</p>
      ) : null}

      <a
        className="mt-3 inline-block text-xs font-semibold text-[#5b3df5] underline decoration-[#c4b5fd] underline-offset-2 hover:text-[#4c2de0]"
        href={event.externalUrl}
        target="_blank"
        rel="noreferrer"
      >
        Visit Website
      </a>
    </div>
  )
}
