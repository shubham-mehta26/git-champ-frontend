import type { Location } from 'react-router-dom'

/** Build a single path string (pathname + search + hash) for `navigate()` after auth. */
export function postAuthPathFromLocation(
  from: Location | undefined,
  fallback = '/dashboard'
): string {
  if (!from?.pathname) return fallback
  return `${from.pathname}${from.search}${from.hash}`
}
