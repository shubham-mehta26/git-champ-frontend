import { Outlet, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/authStore'

import { HydrationSplash } from '@/app/HydrationSplash'

/**
 * Blocks the main UI with a splash until the first session check completes.
 * OAuth callback is excluded so `?code=` exchange can run in parallel with hydrate.
 */
export function HydrationGate() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const location = useLocation()
  const isOAuthCallbackRoute = location.pathname === '/auth/callback'

  if (!hasHydrated && !isOAuthCallbackRoute) {
    return <HydrationSplash />
  }

  return <Outlet />
}
