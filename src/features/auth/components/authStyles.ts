import { cn } from '@/lib/utils'

/** Compact auth field look (dark form on black background). */
export const authFieldClass =
  'h-9 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white shadow-none placeholder:text-white/[0.72] focus-visible:border-white/40 focus-visible:ring-1 focus-visible:ring-white/25'

export const authLabelClass = 'text-sm font-medium leading-5 text-white'

/** Merges auth field styles with shadcn-style invalid border/ring (matches Input aria-invalid behavior). */
export function authInputClassName(hasError: boolean, extraClassName?: string) {
  return cn(
    authFieldClass,
    hasError &&
      'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
    extraClassName
  )
}

export function authLabelClassName(hasError: boolean) {
  return cn(authLabelClass, hasError && 'text-destructive')
}
