import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { AuthHeroPanel } from '@/features/auth/components/AuthHeroPanel'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { pathname } = useLocation()
  const mode = pathname.includes('/auth/register') ? 'register' : 'sign-in'

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 w-full overflow-hidden bg-black">
      <AuthHeroPanel mode={mode} />

      <div className="relative flex min-h-0 w-full flex-col justify-center overflow-hidden bg-black px-6 py-5 sm:px-10 sm:py-6 lg:w-[600px] lg:shrink-0 lg:px-14 lg:py-8 xl:px-16">
        <div
          className="h-1 w-full shrink-0 lg:hidden"
          style={{
            background:
              'linear-gradient(90deg, rgb(16, 65, 47) 0%, rgb(0, 0, 0) 100%)',
          }}
        />
        <div className="flex w-full min-h-0 flex-1 flex-col justify-center py-1">
          {children}
        </div>
      </div>
    </div>
  )
}
