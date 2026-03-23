/** Default matches local git-champ API; override per environment in `.env`. */
const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
).replace(/\/$/, '')

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''
const googleRedirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI ?? ''

export const env = {
  apiBaseUrl,
  googleClientId,
  googleRedirectUri,
} as const

export function getApiBaseUrl(): string {
  return apiBaseUrl
}
