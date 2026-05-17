import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuthService } from '@/shared/services/auth'
import { useUsersService } from '@/shared/services/users'
import {
  AuthenticationContext,
  type AuthenticationState,
  type AuthUser,
} from '@/shared/hooks/useAuthentication'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthenticationProvider({ children }: AuthProviderProps) {
  const authService = useAuthService()
  const usersService = useUsersService()
  const [user, setUser] = useState<AuthUser>(undefined)
  const [loading, setLoading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshUser = useCallback(async (): Promise<AuthUser> => {
    setLoading(true)
    setError(null)

    try {
      const currentUser = await usersService.getCurrentUser()
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
  }, [usersService])

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
    [authService, refreshUser]
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
  }, [authService])

  const register = useCallback(
    async (username: string, email: string, password: string, firstName: string, lastName: string, inviteCode: string): Promise<boolean> => {
      setLoading(true)
      setError(null)

      try {
        const registeredUser = await authService.register(username, email, password, firstName, lastName, inviteCode)
        if (!registeredUser) {
          setError('Registration failed')
          setUser(undefined)
          return false
        }
        return registeredUser

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed'
        setError(message)
        setUser(undefined)
        return false
      } finally {
        setLoading(false)
      }
    },
    [authService]
  )

  const updateProfile = useCallback(
    async (username?: string, email?: string, password?: string, firstName?: string, lastName?: string, bio?: string | null, profilePictureURL?: string | null): Promise<AuthUser> => {
      setLoading(true)
      setError(null)

      try {
        const updatedUser = await usersService.updateProfile(username, email, password, firstName, lastName, bio, profilePictureURL)
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
    [usersService]
  )

  useEffect(() => {
    let cancelled = false

    async function hydrateUser() {
      setLoading(true)
      setError(null)
      try {
        const currentUser = await usersService.getCurrentUser()
        if (!cancelled) {
          setUser(currentUser)
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to fetch current user'
          setError(message)
          setUser(undefined)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
          setHydrated(true)
        }
      }
    }
    void hydrateUser()

    return () => {
      cancelled = true
    }
  }, [usersService])

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