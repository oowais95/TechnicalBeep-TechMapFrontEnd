import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { Button } from '../../components/ui/Button'
import { Panel } from '../../components/ui/Panel'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : 'Login failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Panel as="section" className="w-full max-w-md p-6 sm:p-7">
        <form onSubmit={handleSubmit}>
          <h1 className="font-display text-2xl font-semibold text-ink">Admin Login</h1>
          <p className="mt-1 text-sm text-ink-muted">Sign in to manage events.</p>

          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-medium text-ink-muted">Email</span>
            <input
              className="input !rounded-xl"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </label>

          <label className="mt-3 block">
            <span className="mb-1 block text-sm font-medium text-ink-muted">Password</span>
            <input
              className="input !rounded-xl"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

          <Button className="mt-5 w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing in...' : 'Login'}
          </Button>
        </form>
      </Panel>
    </main>
  )
}
