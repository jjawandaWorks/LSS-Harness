/** @jsxImportSource react */
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { openDesktopUrl } from "@/app/lib/desktop";
import { isDesktopRuntime } from "@/app/utils";
import { compareProviders } from "@/app/utils/providers";
import { Button } from "@/components/ui/button";
import { ProviderIcon } from "../../../design-system/provider-icon";
import { TextInput } from "../../../design-system/text-input";
import type {
  ProviderAuthMethod,
  ProviderAuthProvider,
  ProviderOAuthStartResult,
} from "./store";

type ProviderAuthEntry = {
  id: string;
  name: string;
  methods: ProviderAuthMethod[];
  connected: boolean;
  env: string[];
};

type ProviderOAuthSession = ProviderOAuthStartResult & {
  providerId: string;
  methodLabel: string;
};


import { useNavigate } from "react-router";
export const PROVIDER_LABELS: Record<string, string> = { ollama: "Ollama" };
export type ProviderAuthModalProps = {
  open: boolean;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  preferredProviderId?: string | null;
  workerType?: "local" | "remote";
  providers: ProviderAuthProvider[];
  connectedProviderIds: string[];
  gatewayProviderIds?: ReadonlySet<string>;
  authMethods: Record<string, ProviderAuthMethod[]>;
  onSelect: (providerId: string, methodIndex?: number) => Promise<ProviderOAuthStartResult>;
  onSubmitApiKey: (providerId: string, apiKey: string) => Promise<string | void>;
  onSubmitOAuth: (
    providerId: string,
    methodIndex: number,
    code?: string,
  ) => Promise<{ connected: boolean; pending?: boolean; message?: string }>;
  onRefreshProviders?: () => Promise<unknown>;
  openWorkModelsState?: "included" | "off" | "unavailable";
  organizationName?: string;
  organizationProviderIds?: ReadonlySet<string>;
  organizationProviderCount?: number;
  onOpenDen?: () => void;
  onClose: () => void;
};

export default function ProviderAuthModal(props: ProviderAuthModalProps) {
  const navigate = useNavigate();
  return <Dialog open={props.open} onOpenChange={(open) => { if (!open) props.onClose(); }}>
    <DialogContent><DialogHeader><DialogTitle>Connect Ollama</DialogTitle><DialogDescription>Start Ollama and choose a local model.</DialogDescription></DialogHeader>
      <Button onClick={() => { props.onClose(); navigate("/settings/ollama"); }}>Open Ollama settings</Button>
    </DialogContent>
  </Dialog>;
}
