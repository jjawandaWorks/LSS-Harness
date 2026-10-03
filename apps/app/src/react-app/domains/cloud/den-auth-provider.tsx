import { createContext, use, type ReactNode } from "react";
import type { DenUser } from "@/app/lib/den";
export type DenAuthStatus = "checking" | "signed_out" | "signed_in" | "unavailable";
export type DenAuthStore = {
  status: DenAuthStatus;
  user: DenUser | null;
  verifiedIdentity: { principalId: string; organizationId: string } | null;
  error: string | null;
  isSignedIn: boolean;
  refresh: () => Promise<void>;
};

const DenAuthContext = createContext<DenAuthStore | undefined>(undefined);

type DenAuthProviderProps = {
  children: ReactNode;
};

const localAuth: DenAuthStore = {
  status: "signed_out", user: null, verifiedIdentity: null, error: null,
  isSignedIn: false, refresh: async () => {},
};
export function DenAuthProvider({ children }: DenAuthProviderProps) {
  return <DenAuthContext.Provider value={localAuth}>{children}</DenAuthContext.Provider>;
}
export function useDenAuth(): DenAuthStore {
  return use(DenAuthContext) ?? localAuth;
}
