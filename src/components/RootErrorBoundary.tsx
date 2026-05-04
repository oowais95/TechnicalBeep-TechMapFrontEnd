import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string | null
}

export class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Unknown error' }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[RootErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="tem-app mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-4 p-6">
          <h1 className="text-xl font-semibold text-slate-900">Something broke while rendering</h1>
          <p className="text-sm text-slate-600">
            Open the browser devtools <strong>Console</strong> for the full stack trace. Common causes: API
            fields that do not match what the UI expects (dates, coordinates), or a map/tiles error.
          </p>
          {import.meta.env.DEV && this.state.message ? (
            <pre className="overflow-x-auto rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-900">
              {this.state.message}
            </pre>
          ) : null}
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => {
              this.setState({ hasError: false, message: null })
              window.location.reload()
            }}
          >
            Reload page
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
