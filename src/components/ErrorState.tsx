interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <main className="tem-app mx-auto flex min-h-screen w-full max-w-[900px] items-center justify-center p-6">
    <div className="w-full rounded-2xl border border-rose-100 bg-gradient-to-br from-white via-rose-50/40 to-orange-50/30 p-6 text-center shadow-card ring-1 ring-rose-100/60">
      <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">Unable to load events</p>
      <h2 className="mt-1 bg-gradient-to-r from-rose-700 to-orange-600 bg-clip-text text-2xl font-bold text-transparent">
        Something went wrong
      </h2>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      <button
        type="button"
        className="mt-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-105"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  </main>
)
