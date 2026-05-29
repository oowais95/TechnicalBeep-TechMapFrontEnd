import { Button } from './ui/Button'
import { StateNotice } from './ui/StateNotice'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <main className="tem-app flex items-center justify-center bg-background p-6">
    <StateNotice
      className="w-full max-w-md"
      title="Unable to load events"
      tone="error"
      message={
        <>
          <strong className="font-display block text-xl font-semibold text-ink">Something went wrong</strong>
          <span className="mt-2 block text-sm text-ink-muted">{message}</span>
        </>
      }
      action={
        <Button type="button" onClick={onRetry}>
          Retry
        </Button>
      }
    />
  </main>
)
