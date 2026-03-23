import { Outlet } from 'react-router-dom'

import { AuthLayout } from '@/features/auth/components/AuthLayout'

export function AuthLayoutPage() {
  return (
    <AuthLayout>
      <div className="mx-auto flex w-full max-w-[440px] flex-col">
        <Outlet />
      </div>
    </AuthLayout>
  )
}
