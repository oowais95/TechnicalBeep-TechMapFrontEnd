import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './authContext'
import type { AuthContextValue } from './authContext'

const AUTH_STORAGE_KEY = 'tem_admin_token'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => window.localStorage.getItem(AUTH_STORAGE_KEY) !== null,
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      login: async (email: string, password: string) => {
        if (!email.trim() || !password.trim()) {
          throw new Error('Email and password are required.')
        }
        window.localStorage.setItem(AUTH_STORAGE_KEY, 'admin-session')
        setIsAuthenticated(true)
      },
      logout: () => {
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
        setIsAuthenticated(false)
      },
    }),
    [isAuthenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
