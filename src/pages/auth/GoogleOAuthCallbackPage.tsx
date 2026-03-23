import type { Location } from 'react-router-dom'
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { LoginForm } from '@/features/auth/components/LoginForm'
import { postAuthPathFromLocation } from '@/features/auth/lib/postAuthRedirect'

/**
 * Same sign-in form as `/auth/login`, with `?code=` handled in LoginForm
 * (Google button shows loading during token exchange).
 */
export function GoogleOAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from
  const postAuthPath = postAuthPathFromLocation(from, '/dashboard')

  if (!code) {
    return <Navigate to="/auth/login" replace />
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-medium leading-7 text-white sm:text-2xl sm:leading-8">
          Sign in
        </h1>
        <p className="text-sm leading-5 text-white/[0.8] sm:text-[15px] sm:leading-6">
          Enter your credentials to access your account.
        </p>
      </div>
      <LoginForm
        googleOAuthCode={code}
        postAuthRedirectPath={postAuthPath}
        registerLinkState={from ? { from } : null}
        onSuccess={() => navigate(postAuthPath, { replace: true })}
      />
    </div>
  )
}
