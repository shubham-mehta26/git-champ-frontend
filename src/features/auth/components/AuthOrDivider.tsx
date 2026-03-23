export function AuthOrDivider() {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/25 to-white/25" />
      <span className="shrink-0 text-xs leading-4 text-white/[0.72]">Or</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/25 to-white/25" />
    </div>
  )
}
