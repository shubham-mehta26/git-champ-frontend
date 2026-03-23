import type { ReactNode } from "react";
import { useEffect } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/features/auth/store/authStore";

type AppProvidersProps = {
  children: ReactNode;
};

function AuthBootstrap() {
  const hydrate = useAuthStore((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
  return null;
}

/** Root providers (theme, data clients, etc.) — extend here as the app grows. */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <AuthBootstrap />
      <Toaster position="top-right" richColors closeButton />
      {children}
    </TooltipProvider>
  );
}
