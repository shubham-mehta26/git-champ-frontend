/** sessionStorage key for post–Google OAuth navigation (see plan). */
export const OAUTH_RETURN_KEY = 'oauth_return_to'

export function setOAuthReturnPath(path: string) {
  sessionStorage.setItem(OAUTH_RETURN_KEY, path)
}
