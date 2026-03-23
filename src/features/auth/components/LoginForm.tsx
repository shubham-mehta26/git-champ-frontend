import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Location } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as authApi from '@/features/auth/api/authApi'
import { AuthOrDivider } from '@/features/auth/components/AuthOrDivider'
import { AuthSocialButtons } from '@/features/auth/components/AuthSocialButtons'
import {
  authInputClassName,
  authLabelClassName,
} from '@/features/auth/components/authStyles'
import { OAUTH_RETURN_KEY } from '@/features/auth/lib/oauthRedirect'
import { loginSchema, type LoginInput } from '@/features/auth/model/schemas'
import { useAuthStore } from '@/features/auth/store/authStore'

type LoginFormProps = {
  onSuccess: () => void
  /** Present on `/auth/callback?code=` — completes Google sign-in inline. */
  googleOAuthCode?: string | null
  /** Path after successful sign-in (from `location.state.from` or default). */
  postAuthRedirectPath?: string
  /** Preserve deep link when opening sign-up from this screen. */
  registerLinkState?: { from?: Location } | null
}

export function LoginForm({
  onSuccess,
  googleOAuthCode = null,
  postAuthRedirectPath = '/dashboard',
  registerLinkState,
}: LoginFormProps) {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const setUser = useAuthStore((s) => s.setUser)
  const clearError = useAuthStore((s) => s.clearError)
  const isLoading = useAuthStore((s) => s.status === 'loading')
  const storeError = useAuthStore((s) => s.error)
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleOAuthCompleting, setIsGoogleOAuthCompleting] = useState(
    () => Boolean(googleOAuthCode)
  )

  const formBusy = isLoading || isGoogleOAuthCompleting

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    clearError()
  }, [clearError])

  useEffect(() => {
    if (!googleOAuthCode) return

    let cancelled = false
    void (async () => {
      setIsGoogleOAuthCompleting(true)
      try {
        const user = await authApi.googleCallback(googleOAuthCode)
        if (cancelled) return
        setUser(user)
        const to =
          sessionStorage.getItem(OAUTH_RETURN_KEY) ?? postAuthRedirectPath
        sessionStorage.removeItem(OAUTH_RETURN_KEY)
        navigate(to, { replace: true })
      } catch (e) {
        if (!cancelled) {
          const message =
            e instanceof Error ? e.message : 'Google sign-in failed. Try again.'
          toast.error(message)
          navigate('/auth/login', { replace: true })
        }
      } finally {
        if (!cancelled) {
          setIsGoogleOAuthCompleting(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [googleOAuthCode, navigate, postAuthRedirectPath, setUser])

  return (
    <form
      className="flex w-full flex-col gap-3 sm:gap-3.5"
      onSubmit={form.handleSubmit(async (values) => {
        try {
          await login(values)
          onSuccess()
        } catch {
          /* surfaced via store */
        }
      })}
      noValidate
    >
      {storeError ? (
        <Alert
          variant="destructive"
          className="border-red-500/40 bg-red-950/40 text-red-50 [&_svg]:text-red-200"
        >
          <AlertTitle>Could not sign in</AlertTitle>
          <AlertDescription>{storeError}</AlertDescription>
        </Alert>
      ) : null}

      <AuthSocialButtons
        disabled={isLoading}
        oauthCompleting={isGoogleOAuthCompleting}
        oauthReturnPath={postAuthRedirectPath}
      />
      <AuthOrDivider />

      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="email"
            className={authLabelClassName(!!form.formState.errors.email)}
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="eg. johnfrans@gmail.com"
            disabled={formBusy}
            aria-invalid={!!form.formState.errors.email}
            className={authInputClassName(!!form.formState.errors.email)}
            {...form.register('email')}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="password"
            className={authLabelClassName(!!form.formState.errors.password)}
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={formBusy}
              aria-invalid={!!form.formState.errors.password}
              className={authInputClassName(
                !!form.formState.errors.password,
                'pr-10'
              )}
              {...form.register('password')}
            />
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {form.formState.errors.password ? (
            <p className="text-xs text-red-400">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
      </div>

      <Button
        type="submit"
        disabled={formBusy}
        className="h-9 w-full rounded-lg bg-white text-sm font-semibold text-black hover:bg-white/90"
      >
        {isLoading ? 'Signing in…' : 'Sign In'}
      </Button>

      <p className="text-center text-xs leading-4 text-white/[0.72] sm:text-sm sm:leading-5">
        Don&apos;t have an account?{' '}
        <Link
          to="/auth/register"
          state={registerLinkState ?? undefined}
          className="font-semibold text-white hover:underline"
        >
          Create account
        </Link>
      </p>
    </form>
  )
}
