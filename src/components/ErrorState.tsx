interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <main className="tem-app mx-auto flex min-h-screen w-full max-w-[900px] items-center justify-center p-6">
    <div className="w-full rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-card">
      <p className="text-sm font-semibold uppercase tracking-wide text-rose-500">Unable to load events</p>
      <h2 className="mt-1 text-2xl font-bold text-slate-900">Something went wrong</h2>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      <button
        type="button"
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  </main>
)
