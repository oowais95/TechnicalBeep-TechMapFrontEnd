import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

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
    <main className="tem-app flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form className="w-full max-w-md rounded-xl bg-white p-6 shadow-card" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-600">Sign in to manage events.</p>

        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
        </label>

        <label className="mt-3 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

        <button
          className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </main>
  )
}
