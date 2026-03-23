import { User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store/authStore'
import { cn } from '@/lib/utils'

const itemClassName = cn(
  'flex w-full items-center rounded-sm px-3 py-2 text-left text-sm',
  'hover:bg-accent hover:text-accent-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
)

export function UserAccountMenu() {
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="group relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label="Account menu"
        aria-haspopup="true"
      >
        <User className="size-5" strokeWidth={2} />
      </Button>
      <div
        className={cn(
          'absolute right-0 top-full z-50 pt-1.5',
          'pointer-events-none opacity-0 invisible transition-opacity duration-150',
          'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100',
          'group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100'
        )}
        role="menu"
        aria-orientation="vertical"
      >
        <div className="min-w-[10rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          <button type="button" role="menuitem" className={itemClassName}>
            Profile
          </button>
          <button
            type="button"
            role="menuitem"
            className={itemClassName}
            onClick={() => void logout()}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
