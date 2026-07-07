'use client'

import { useState, useEffect } from 'react'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import DashboardLayout from '@/components/layouts/DashboardLayout'

// Mock authentication state — replace with real auth (Supabase, NextAuth, etc.)
interface AuthState {
  isAuthenticated: boolean
  userRole: 'free_athlete' | 'coach' | 'premium_athlete' | null
  user: {
    id: string
    username: string
    fullName: string
  } | null
}

export default function Page() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userRole: null,
    user: null,
  })

  const [isLoading, setIsLoading] = useState(true)

  // Simulate auth check on mount (replace with real auth logic)
  useEffect(() => {
    // In production: check Supabase session, JWT token, etc.
    const checkAuth = async () => {
      // Mock: check localStorage or API for existing session
      const savedAuth = localStorage.getItem('vigorhub_auth')
      if (savedAuth) {
        setAuthState(JSON.parse(savedAuth))
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
          <p className="mt-4 text-slate-400">Loading VigorHub...</p>
        </div>
      </div>
    )
  }

  // ─── Step 1: Not authenticated → Show Auth/Onboarding
  if (!authState.isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0B0F19]">
        <OnboardingWizard
          onOnboardingComplete={(payload: any) => {
            // Mock: Save user data, create session
            const newAuthState: AuthState = {
              isAuthenticated: true,
              userRole: 'free_athlete', // Default role for new users
              user: {
                id: 'user_' + Math.random().toString(36).substr(2, 9),
                username: payload.username,
                fullName: payload.fullName,
              },
            }
            setAuthState(newAuthState)
            localStorage.setItem('vigorhub_auth', JSON.stringify(newAuthState))
          }}
        />
      </main>
    )
  }

  // ─── Step 2: Role Gate — Check if userRole is allowed
  if (authState.userRole !== 'free_athlete' && authState.userRole !== 'premium_athlete' && authState.userRole !== 'coach') {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-center text-slate-400">
          <p className="text-lg">Access Denied</p>
          <p className="text-sm mt-2">Your role ({authState.userRole}) does not have dashboard access.</p>
        </div>
      </div>
    )
  }

  // ─── Step 3: Authenticated + Role approved → Show Dashboard
  return (
    <DashboardLayout
      user={authState.user!}
      userRole={authState.userRole}
      onLogout={() => {
        setAuthState({
          isAuthenticated: false,
          userRole: null,
          user: null,
        })
        localStorage.removeItem('vigorhub_auth')
      }}
    />
  )
}
