import type { Location } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'

import { SignUpForm } from '@/features/auth/components/SignUpForm'
import { postAuthPathFromLocation } from '@/features/auth/lib/postAuthRedirect'

export function SignUpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from
  const postAuthPath = postAuthPathFromLocation(from, '/dashboard')

  return (
    <div className="flex w-full flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-medium leading-7 text-white sm:text-2xl sm:leading-8">
          Create account
        </h1>
        <p className="text-sm leading-5 text-white/[0.8] sm:text-[15px] sm:leading-6">
          Enter your personal data to create your account.
        </p>
      </div>
      <SignUpForm
        postAuthRedirectPath={postAuthPath}
        loginLinkState={from ? { from } : null}
        onSuccess={() => navigate(postAuthPath, { replace: true })}
      />
    </div>
  )
}
