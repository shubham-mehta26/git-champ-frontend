import { Link } from 'react-router-dom'

import gitIconLogoUrl from '@/assets/auth/git-icon-logo.svg'
import heroPanelBgUrl from '@/assets/auth/hero-panel-bg.svg'

/** `sign-in` = returning user (login route); `register` = new account (register route). */
type AuthMode = 'sign-in' | 'register'

type Step = { n: number; title: string; active: boolean }

type AuthHeroPanelProps = {
  mode: AuthMode
}

function StepCard({ step }: { step: Step }) {
  const active = step.active
  return (
    <div
      className={
        active
          ? 'flex w-[140px] shrink-0 flex-col gap-4 rounded-2xl border border-white/24 bg-white/95 p-4 shadow-sm backdrop-blur-md sm:w-[150px] lg:w-[163px] lg:gap-5 lg:p-5'
          : 'flex w-[140px] shrink-0 flex-col gap-4 rounded-2xl border border-white bg-white/12 p-4 backdrop-blur-md sm:w-[150px] lg:w-[163px] lg:gap-5 lg:p-5'
      }
    >
      <div
        className={
          active
            ? 'flex size-6 items-center justify-center rounded-full bg-black text-sm font-medium text-white'
            : 'flex size-6 items-center justify-center rounded-full bg-white/16 text-sm font-medium text-white'
        }
      >
        {step.n}
      </div>
      <p
        className={
          active
            ? 'text-base font-medium leading-6 text-black'
            : 'text-base font-normal leading-6 text-white/[0.8]'
        }
      >
        {step.title}
      </p>
    </div>
  )
}

export function AuthHeroPanel({ mode }: AuthHeroPanelProps) {
  const steps: Step[] =
    mode === 'register'
      ? [
          { n: 1, title: 'Create your account', active: true },
          { n: 2, title: 'Set up your workspace', active: false },
          { n: 3, title: 'Set up your profile', active: false },
        ]
      : [
          { n: 1, title: 'Sign in to your account', active: true },
          { n: 2, title: 'Practice challenges', active: false },
          { n: 3, title: 'Track your progress', active: false },
        ]

  const headline =
    mode === 'register' ? 'Get Started with Us' : 'Welcome back'

  return (
    <div className="relative hidden h-full min-h-0 min-w-0 flex-1 overflow-hidden rounded-[32px] p-3 lg:flex">
      <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[28px]">
        <img
          src={heroPanelBgUrl}
          alt=""
          className="pointer-events-none absolute inset-0 z-0 h-full w-full rounded-[28px] object-cover"
          draggable={false}
        />

        <div className="relative z-10 flex shrink-0 items-center gap-2 px-6 pb-4 pt-6 lg:px-8 lg:pb-5 lg:pt-8">
          <img
            src={gitIconLogoUrl}
            alt=""
            width={22}
            height={22}
            className="size-[22px] shrink-0"
            draggable={false}
          />
          <Link
            to="/"
            className="text-xl font-medium leading-7 text-white hover:text-white/90"
          >
            Git Champ
          </Link>
        </div>

        <div className="relative z-10 mt-auto flex min-h-0 flex-col gap-5 px-6 pb-6 lg:gap-6 lg:px-8 lg:pb-8">
          <h2 className="max-w-[min(100%,420px)] text-3xl font-medium leading-tight tracking-tight text-white lg:text-4xl lg:leading-[48px]">
            {headline}
          </h2>

          <div className="flex min-h-0 flex-wrap gap-2">
            {steps.map((s) => (
              <StepCard key={s.n} step={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
