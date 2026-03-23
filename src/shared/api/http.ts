import { getApiBaseUrl } from '@/shared/config/env'

function joinUrl(path: string): string {
  const base = getApiBaseUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

export async function parseApiErrorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get('Content-Type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      const data: unknown = await res.json()
      if (
        data &&
        typeof data === 'object' &&
        'error' in data &&
        typeof (data as { error: unknown }).error === 'string'
      ) {
        return (data as { error: string }).error
      }
    } catch {
      /* fall through */
    }
  }
  return res.statusText || 'Request failed'
}

type ApiFetchOptions = RequestInit & {
  json?: unknown
}

/**
 * Same-origin style API calls with session cookies. Always sends credentials.
 */
export async function apiFetch(
  path: string,
  init?: ApiFetchOptions
): Promise<Response> {
  const { json, headers: initHeaders, body: initBody, ...rest } = init ?? {}
  const headers = new Headers(initHeaders)
  let body: BodyInit | null | undefined = initBody

  if (json !== undefined) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(json)
  }

  return fetch(joinUrl(path), {
    ...rest,
    credentials: 'include',
    headers,
    body: body ?? null,
  })
}
