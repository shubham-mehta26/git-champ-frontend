import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Location } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthOrDivider } from '@/features/auth/components/AuthOrDivider'
import { AuthSocialButtons } from '@/features/auth/components/AuthSocialButtons'
import {
  authInputClassName,
  authLabelClassName,
} from '@/features/auth/components/authStyles'
import { signUpSchema, type SignUpInput } from '@/features/auth/model/schemas'
import { useAuthStore } from '@/features/auth/store/authStore'

type SignUpFormProps = {
  onSuccess: () => void
  postAuthRedirectPath?: string
  /** Preserve deep link when opening sign-in from this screen. */
  loginLinkState?: { from?: Location } | null
}

export function SignUpForm({
  onSuccess,
  postAuthRedirectPath = '/dashboard',
  loginLinkState,
}: SignUpFormProps) {
  const signUp = useAuthStore((s) => s.signUp)
  const clearError = useAuthStore((s) => s.clearError)
  const isLoading = useAuthStore((s) => s.status === 'loading')
  const storeError = useAuthStore((s) => s.error)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    clearError()
  }, [clearError])

  return (
    <form
      className="flex w-full flex-col gap-3 sm:gap-3.5"
      onSubmit={form.handleSubmit(async (values) => {
        try {
          await signUp(values)
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
          <AlertTitle>Could not create account</AlertTitle>
          <AlertDescription>{storeError}</AlertDescription>
        </Alert>
      ) : null}

      <AuthSocialButtons
        disabled={isLoading}
        oauthReturnPath={postAuthRedirectPath}
      />
      <AuthOrDivider />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label
              htmlFor="firstName"
              className={authLabelClassName(!!form.formState.errors.firstName)}
            >
              First Name
            </Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              placeholder="eg. John"
              disabled={isLoading}
              aria-invalid={!!form.formState.errors.firstName}
              className={authInputClassName(!!form.formState.errors.firstName)}
              {...form.register('firstName')}
            />
            {form.formState.errors.firstName ? (
              <p className="text-xs text-red-400">
                {form.formState.errors.firstName.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <Label
              htmlFor="lastName"
              className={authLabelClassName(!!form.formState.errors.lastName)}
            >
              Last Name
            </Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              placeholder="eg. Francisco"
              disabled={isLoading}
              aria-invalid={!!form.formState.errors.lastName}
              className={authInputClassName(!!form.formState.errors.lastName)}
              {...form.register('lastName')}
            />
            {form.formState.errors.lastName ? (
              <p className="text-xs text-red-400">
                {form.formState.errors.lastName.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="login-email"
            className={authLabelClassName(!!form.formState.errors.email)}
          >
            Email
          </Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="eg. johnfrans@gmail.com"
            disabled={isLoading}
            aria-invalid={!!form.formState.errors.email}
            className={authInputClassName(!!form.formState.errors.email)}
            {...form.register('email')}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-red-400">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="new-password"
            className={authLabelClassName(!!form.formState.errors.password)}
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Enter your password"
              disabled={isLoading}
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
          <p className="text-xs leading-4 text-white/[0.72]">
            Must be at least 8 characters.
          </p>
          {form.formState.errors.password ? (
            <p className="text-xs text-red-400">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-9 w-full rounded-lg bg-white text-sm font-semibold text-black hover:bg-white/90"
      >
        {isLoading ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-center text-xs leading-4 text-white/[0.72] sm:text-sm sm:leading-5">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          state={loginLinkState ?? undefined}
          className="font-semibold text-white hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
