'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useWishlistStore } from '@/lib/wishlist/wishlist-store'

export interface CustomerUser {
  id: string
  email: string
  name: string
  role: string
  phone?: string
  savedAddresses?: Array<{
    id?: string
    label?: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
    isDefault?: boolean
  }>
}

export interface AuthContextValue {
  user: CustomerUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isAuthModalOpen: boolean
  authModalMode: 'login' | 'register' | 'forgot-password'
  openAuthModal: (mode?: 'login' | 'register' | 'forgot-password', onComplete?: () => void) => void
  closeAuthModal: () => void
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name?: string, phone?: string) => Promise<{ success: boolean; error?: string }>
  forgotPasswordSendOtp: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>
  forgotPasswordVerifyOtp: (email: string, otp: string) => Promise<{ success: boolean; resetToken?: string; error?: string; message?: string }>
  forgotPasswordReset: (email: string, resetToken: string, newPassword: string) => Promise<{ success: boolean; error?: string; message?: string }>
  logout: () => Promise<void>
  updateProfile: (data: Partial<CustomerUser>) => Promise<{ success: boolean; error?: string }>
  requireAuth: (actionCallback: () => void, mode?: 'login' | 'register') => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot-password'>('login')
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user || null)
      } else {
        setUser(null)
      }
    } catch (err) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  // Automatically scope the wishlist to the logged-in customer account
  useEffect(() => {
    useWishlistStore.getState().setUser(user?.id || null)
  }, [user])

  const openAuthModal = useCallback((mode: 'login' | 'register' | 'forgot-password' = 'login', onComplete?: () => void) => {
    setAuthModalMode(mode)
    if (onComplete) {
      setPendingAction(() => onComplete)
    } else {
      setPendingAction(null)
    }
    setIsAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false)
    setPendingAction(null)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()

        if (!res.ok) {
          return { success: false, error: data.error || 'Invalid credentials' }
        }

        setUser(data.user)
        setIsAuthModalOpen(false)

        if (pendingAction) {
          const action = pendingAction
          setPendingAction(null)
          action()
        }

        return { success: true }
      } catch (err: any) {
        return { success: false, error: err.message || 'Login failed' }
      }
    },
    [pendingAction]
  )

  const register = useCallback(
    async (email: string, password: string, name?: string, phone?: string) => {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, phone }),
        })
        const data = await res.json()

        if (!res.ok) {
          return { success: false, error: data.error || 'Registration failed' }
        }

        setUser(data.user)
        setIsAuthModalOpen(false)

        if (pendingAction) {
          const action = pendingAction
          setPendingAction(null)
          action()
        }

        return { success: true }
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed' }
      }
    },
    [pendingAction]
  )

  const forgotPasswordSendOtp = useCallback(async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to send OTP.' }
      }
      return { success: true, message: data.message }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error while sending OTP.' }
    }
  }, [])

  const forgotPasswordVerifyOtp = useCallback(
    async (email: string, otp: string) => {
      try {
        const res = await fetch('/api/auth/forgot-password/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
        })
        const data = await res.json()
        if (!res.ok) {
          return { success: false, error: data.error || 'Verification failed.' }
        }

        return { success: true, resetToken: data.resetToken, message: data.message }
      } catch (err: any) {
        return { success: false, error: err.message || 'Network error during verification.' }
      }
    },
    []
  )

  const forgotPasswordReset = useCallback(
    async (email: string, resetToken: string, newPassword: string) => {
      try {
        const res = await fetch('/api/auth/forgot-password/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, resetToken, newPassword }),
        })
        const data = await res.json()
        if (!res.ok) {
          return { success: false, error: data.error || 'Failed to reset password.' }
        }

        if (data.user) {
          setUser(data.user)
        }

        return { success: true, message: data.message }
      } catch (err: any) {
        return { success: false, error: err.message || 'Network error resetting password.' }
      }
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      window.location.href = '/'
    } catch (err) {
      console.error('Logout failed:', err)
      setUser(null)
    }
  }, [])

  const updateProfile = useCallback(async (data: Partial<CustomerUser>) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) {
        return { success: false, error: result.error || 'Failed to update profile' }
      }
      setUser(result.user)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' }
    }
  }, [])

  const requireAuth = useCallback(
    (actionCallback: () => void, mode: 'login' | 'register' = 'login') => {
      if (user) {
        actionCallback()
      } else {
        openAuthModal(mode, actionCallback)
      }
    },
    [user, openAuthModal]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        forgotPasswordSendOtp,
        forgotPasswordVerifyOtp,
        forgotPasswordReset,
        logout,
        updateProfile,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
