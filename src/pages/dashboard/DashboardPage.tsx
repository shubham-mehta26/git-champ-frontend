import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store/authStore'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Signed in as{' '}
            <span className="font-medium text-foreground">
              {user?.email?.trim() ||
                user?.displayName?.trim() ||
                user?.id}
            </span>
          </p>
        </div>
        <Button variant="outline" onClick={() => logout()}>
          Log out
        </Button>
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        This is a placeholder shell. Problem sets and submissions will live
        here next.
      </p>
      <Button className="mt-6 w-fit" variant="secondary" asChild>
        <Link to="/">Back to landing</Link>
      </Button>
    </div>
  )
}
