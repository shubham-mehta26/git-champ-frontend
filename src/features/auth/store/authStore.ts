import { create } from "zustand";

import * as authApi from "@/features/auth/api/authApi";
import type { LoginInput, SignUpInput } from "@/features/auth/model/schemas";
import type { User } from "@/features/auth/model/types";

/** Coalesce concurrent/Strict Mode duplicate hydrate() calls. */
let hydrateInFlight: Promise<void> | null = null;

export type AuthStatus = "idle" | "loading" | "authenticated";

type AuthState = {
  user: User | null;
  /** False until initial cookie/session check finishes (for protected routes). */
  hasHydrated: boolean;
  status: AuthStatus;
  error: string | null;
  login: (input: LoginInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  hasHydrated: false,
  status: "idle",
  error: null,

  clearError: () => set({ error: null }),

  setUser: (user) =>
    set({
      user,
      status: "authenticated",
      hasHydrated: true,
      error: null,
    }),

  hydrate: async () => {
    if (get().hasHydrated) return;
    if (hydrateInFlight) return hydrateInFlight;

    hydrateInFlight = (async () => {
      try {
        const sessionUser = await authApi.hydrateUserFromSession();
        const prior = get().user;

        // OAuth/login may finish while check-auth was still in flight (401 before Set-Cookie applied).
        if (!sessionUser && prior) {
          return;
        }

        if (sessionUser && prior && sessionUser.id === prior.id) {
          set({
            user: {
              id: sessionUser.id,
              email: prior.email || sessionUser.email,
              displayName: prior.displayName || sessionUser.displayName,
            },
            status: "authenticated",
            hasHydrated: true,
            error: null,
          });
          return;
        }

        set({
          user: sessionUser,
          status: sessionUser ? "authenticated" : "idle",
          hasHydrated: true,
          error: null,
        });
      } catch {
        if (get().user) {
          return;
        }
        set({
          user: null,
          status: "idle",
          hasHydrated: true,
          error: null,
        });
      } finally {
        hydrateInFlight = null;
      }
    })();

    return hydrateInFlight;
  },

  login: async (input) => {
    set({ status: "loading", error: null });
    try {
      const user = await authApi.login(input);
      set({
        user,
        status: "authenticated",
        hasHydrated: true,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      set({ status: "idle", error: message });
      throw err;
    }
  },

  signUp: async (input) => {
    set({ status: "loading", error: null });
    try {
      const user = await authApi.signUp(input);
      set({
        user,
        status: "authenticated",
        hasHydrated: true,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      set({ status: "idle", error: message });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      /* still clear local session */
    }
    set({
      user: null,
      status: "idle",
      error: null,
    });
  },
}));

function authStateForLog(state: AuthState) {
  return {
    user: state.user,
    hasHydrated: state.hasHydrated,
    status: state.status,
    error: state.error,
  };
}

if (import.meta.env.DEV) {
  useAuthStore.subscribe((state) => {
    console.log("[auth store]", authStateForLog(state));
  });
}
