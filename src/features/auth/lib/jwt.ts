/**
 * Decode JWT payload (middle segment) without verification — for display claims only.
 * Do not use for trust decisions; the server validates the cookie.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const pad = base64.length % 4
    const padded = base64 + (pad ? '='.repeat(4 - pad) : '')
    const json = atob(padded)
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

/** Prefer `sub` as stable user id when present (OIDC-style access tokens). */
export function userIdFromJwtClaims(
  claims: Record<string, unknown> | null
): string | null {
  if (!claims) return null
  const sub = claims.sub
  if (typeof sub === 'string' && sub.trim()) return sub.trim()
  return null
}

export function emailFromJwtClaims(
  claims: Record<string, unknown> | null,
  fallback: string
): string {
  if (!claims) return fallback
  const email = claims.email
  if (typeof email === 'string' && email) return email
  const sub = claims.sub
  if (typeof sub === 'string' && sub.includes('@')) return sub
  return fallback
}

export function displayNameFromJwtClaims(
  claims: Record<string, unknown> | null,
  email: string,
  fallback?: string
): string {
  if (fallback?.trim()) return fallback.trim()
  if (!claims) return email.includes('@') ? email.split('@')[0]! : 'User'
  const name = claims.name
  if (typeof name === 'string' && name.trim()) return name.trim()
  return email.includes('@') ? email.split('@')[0]! : 'User'
}
