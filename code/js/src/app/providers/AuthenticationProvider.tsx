import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService } from '@/shared/services/auth'
import {
  AuthenticationContext,
  type AuthenticationState,
  type AuthUser,
} from '@/shared/hooks/useAuthentication'
import type { RegisterResponseDTO } from '@/shared/services/auth/auth.types'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthenticationProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser>(undefined)
  const [loading, setLoading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshUser = useCallback(async (): Promise<AuthUser> => {
    setLoading(true)
    setError(null)

    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      return currentUser
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch current user'
      setError(message)
      setUser(undefined)
      return undefined
    } finally {
      setLoading(false)
      setHydrated(true)
    }
  }, [])

  const login = useCallback(
    async (username: string, password: string): Promise<AuthUser> => {
      setLoading(true)
      setError(null)

      try {
        const authenticatedUser = await authService.authenticate(username, password)
        if (!authenticatedUser) {
          setError('Invalid username or password')
          setUser(undefined)
          return undefined
        }

        return await refreshUser()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed'
        setError(message)
        setUser(undefined)
        return undefined
      } finally {
        setLoading(false)
      }
    },
    [refreshUser]
  )

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      await authService.logout()
    } catch {
      // ignore logout network errors
    } finally {
      setUser(undefined)
      setLoading(false)
    }
  }, [])

  const register = useCallback(
    async (username: string, email: string, password: string, firstName: string, lastName: string, inviteCode: string): Promise<RegisterResponseDTO | undefined> => {
      setLoading(true)
      setError(null)

      try {
        const registeredUser = await authService.register(username, email, password, firstName, lastName, inviteCode)
        if (!registeredUser) {
          setError('Registration failed')
          setUser(undefined)
          return undefined
        }
        return registeredUser

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed'
        setError(message)
        setUser(undefined)
        return undefined
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const updateProfile = useCallback(
    async (username?: string, email?: string, password?: string, firstName?: string, lastName?: string, bio?: string | null, profilePictureUrl?: string | null): Promise<AuthUser> => {
      setLoading(true)
      setError(null)

      try {
        const updatedUser = await authService.updateProfile(username, email, password, firstName, lastName, bio, profilePictureUrl)
        if (!updatedUser) {
          setError('Failed to update profile')
          return undefined
        }
        setUser(updatedUser)
        return updatedUser
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update profile'
        setError(message)
        return undefined
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const value = useMemo<AuthenticationState>(
    () => ({
      user,
      loading,
      hydrated,
      error,
      login,
      logout,
      register,
      refreshUser,
      updateProfile,
    }),
    [user, loading, hydrated, error, login, logout, register, refreshUser, updateProfile]
  )

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>
}