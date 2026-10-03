import type { ReactNode } from "react";
export function useEnterpriseActivationRequired() { return false; }
export function EnterpriseActivationGate({ children }: { children: ReactNode }) { return children; }
