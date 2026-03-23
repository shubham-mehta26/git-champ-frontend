import type { ReactNode } from 'react'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
} from 'react-router-dom'

import { HydrationGate } from '@/app/HydrationGate'
import { useAuthStore } from '@/features/auth/store/authStore'
import { AuthLayoutPage } from '@/pages/auth/AuthLayoutPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { GoogleOAuthCallbackPage } from '@/pages/auth/GoogleOAuthCallbackPage'
import { SignUpPage } from '@/pages/auth/SignUpPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { LandingPage } from '@/pages/landing/LandingPage'

/** Logged-in users hitting login/register are sent to the app (session already exists). */
function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const hasHydrated = useAuthStore((s) => s.hasHydrated)

  if (hasHydrated && user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!user) {
    return (
      <Navigate to="/auth/login" replace state={{ from: location }} />
    )
  }

  return children
}

function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  )
}

const router = createBrowserRouter([
  {
    element: <HydrationGate />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/auth',
        element: <AuthLayoutPage />,
        children: [
          { index: true, element: <Navigate to="login" replace /> },
          {
            path: 'login',
            element: (
              <GuestOnlyRoute>
                <LoginPage />
              </GuestOnlyRoute>
            ),
          },
          {
            path: 'register',
            element: (
              <GuestOnlyRoute>
                <SignUpPage />
              </GuestOnlyRoute>
            ),
          },
          { path: 'callback', element: <GoogleOAuthCallbackPage /> },
        ],
      },
      {
        path: '/dashboard',
        element: <ProtectedDashboard />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
