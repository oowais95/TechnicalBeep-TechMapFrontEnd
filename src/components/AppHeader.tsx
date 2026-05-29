import { memo } from 'react'

interface AppHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

const AppLogo = () => (
  <svg className="h-8 w-8 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="8" fill="#1a1410" />
    <path
      d="M16 8c-2.8 0-5 2.2-5 5 0 3.5 5 11 5 11s5-7.5 5-11c0-2.8-2.2-5-5-5zm0 6.8a1.8 1.8 0 110-3.6 1.8 1.8 0 010 3.6z"
      fill="#f7f4ed"
    />
  </svg>
)

const AppHeaderComponent = ({ searchQuery, onSearchChange }: AppHeaderProps) => (
  <header className="pointer-events-auto fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-warm-border bg-white/95 px-4 shadow-sm backdrop-blur-md sm:gap-4 sm:px-5">
    <div className="flex min-w-0 shrink-0 items-center gap-2.5">
      <AppLogo />
      <span className="font-display hidden text-base font-semibold tracking-tight text-ink sm:inline">
        Tech Events
      </span>
    </div>

    <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
      <button type="button" className="tem-subtle-button whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm">
        Submit Your Event
      </button>
      <button type="button" className="btn-primary whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm">
        Get Featured
      </button>
    </div>

    <div className="relative w-full max-w-[200px] shrink sm:max-w-xs">
      <span className="sr-only">Search events</span>
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
        />
      </svg>
      <input
        type="text"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search events…"
        className="input h-9 w-full py-2 pl-9 pr-3 text-[13px]"
        aria-label="Search events"
      />
    </div>
  </header>
)

export const AppHeader = memo(AppHeaderComponent)
