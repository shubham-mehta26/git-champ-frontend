import type { LoginInput, SignUpInput } from '@/features/auth/model/schemas'
import type { User } from '@/features/auth/model/types'
import {
  apiFetch,
  parseApiErrorMessage,
} from '@/shared/api/http'

import {
  decodeJwtPayload,
  displayNameFromJwtClaims,
  emailFromJwtClaims,
  userIdFromJwtClaims,
} from '@/features/auth/lib/jwt'

/**
 * Returns authenticated user id, or null if no valid session cookie.
 */
export async function fetchAuthUserId(): Promise<string | null> {
  const res = await apiFetch('/check-auth', { method: 'GET' })
  if (res.status === 401) return null
  if (!res.ok) {
    throw new Error(await parseApiErrorMessage(res))
  }
  const text = (await res.text()).trim()
  return text || null
}

function buildUser(
  token: string,
  id: string,
  fallbackEmail: string,
  localDisplayName?: string
): User {
  const claims = decodeJwtPayload(token)
  const email = emailFromJwtClaims(claims, fallbackEmail)
  const displayName = displayNameFromJwtClaims(claims, email, localDisplayName)
  return { id, email, displayName }
}

export async function login(input: LoginInput): Promise<User> {
  const res = await apiFetch('/login', {
    method: 'POST',
    json: {
      email: input.email.trim().toLowerCase(),
      password: input.password,
    },
  })
  if (!res.ok) {
    throw new Error(await parseApiErrorMessage(res))
  }
  const data = (await res.json()) as { token: string }
  const id = await fetchAuthUserId()
  if (!id) {
    throw new Error('Session could not be established.')
  }
  return buildUser(data.token, id, input.email.trim().toLowerCase())
}

export async function signUp(input: SignUpInput): Promise<User> {
  const res = await apiFetch('/register', {
    method: 'POST',
    json: {
      email: input.email.trim().toLowerCase(),
      password: input.password,
    },
  })
  if (!res.ok) {
    throw new Error(await parseApiErrorMessage(res))
  }
  const data = (await res.json()) as { token: string }
  const id = await fetchAuthUserId()
  if (!id) {
    throw new Error('Session could not be established.')
  }
  const localName =
    `${input.firstName.trim()} ${input.lastName.trim()}`.replace(/\s+/g, ' ') ||
    undefined
  return buildUser(
    data.token,
    id,
    input.email.trim().toLowerCase(),
    localName
  )
}

export async function logout(): Promise<void> {
  const res = await apiFetch('/logout', { method: 'POST' })
  if (!res.ok) {
    throw new Error(await parseApiErrorMessage(res))
  }
}

/** One POST per auth code — avoids duplicate exchanges (React Strict Mode, remounts). */
const googleCallbackByCode = new Map<string, Promise<User>>()

export async function googleCallback(code: string): Promise<User> {
  const existing = googleCallbackByCode.get(code)
  if (existing) return existing

  const promise = (async () => {
    try {
      const res = await apiFetch('/auth/google/callback', {
        method: 'POST',
        json: { code },
      })
      if (!res.ok) {
        throw new Error(await parseApiErrorMessage(res))
      }
      const data = (await res.json()) as { token: string }
      const claims = decodeJwtPayload(data.token)
      let id = userIdFromJwtClaims(claims)
      if (!id) {
        id = await fetchAuthUserId()
      }
      if (!id) {
        throw new Error('Session could not be established.')
      }
      return buildUser(data.token, id, '')
    } finally {
      googleCallbackByCode.delete(code)
    }
  })()

  googleCallbackByCode.set(code, promise)
  return promise
}

/**
 * Restore user from cookie session after refresh. Email/displayName may be minimal if JWT lacks claims.
 */
export async function hydrateUserFromSession(): Promise<User | null> {
  const id = await fetchAuthUserId()
  if (!id) return null
  return {
    id,
    email: '',
    displayName: '',
  }
}
