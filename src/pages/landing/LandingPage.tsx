import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { UserAccountMenu } from "@/features/auth/components/UserAccountMenu";
import { useAuthStore } from "@/features/auth/store/authStore";
import gitIconLogo from "@/assets/auth/git-icon-logo.svg";

export function LandingPage() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const authLinkState = { from: location };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img
              src={gitIconLogo}
              alt=""
              width={28}
              height={28}
              className="size-7 shrink-0"
              aria-hidden
            />
            <span className="font-semibold tracking-tight">Git Champ</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <UserAccountMenu />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth/login" state={authLinkState}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/auth/register" state={authLinkState}>
                    Create account
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-3xl flex-1 flex-col justify-center px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Level up your Git skills
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A practice platform for commits, branches, rebases, and merges—without
          the pressure of production.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {user ? (
            <Button asChild size="lg">
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link to="/auth/register" state={authLinkState}>
                  Get started
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">Open dashboard</Link>
              </Button>
            </>
          )}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          {user
            ? "You're signed in. Use the dashboard to pick up where you left off."
            : "The dashboard route is a stub: you will be redirected to sign in until you authenticate."}
        </p>
      </main>
    </div>
  );
}
