import gitIconLogo from '@/assets/auth/git-icon-logo.svg'

/** Full-screen splash: Git mark zooming until session hydration finishes. */
export function HydrationSplash() {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <img
        src={gitIconLogo}
        alt=""
        width={96}
        height={96}
        className="size-24 animate-git-zoom"
        aria-hidden
      />
      <span className="sr-only">Loading application</span>
    </div>
  )
}
