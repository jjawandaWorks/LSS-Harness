import { useCallback, useSyncExternalStore } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { OpenworkServerClient } from "@/app/lib/openwork-server";
import type { AutoPickerState, AutoAccessWall, DesktopFreeAccessStatus } from "@/app/lib/inference-access";
import { openAlternativeModelPicker } from "@/app/lib/inference-access";
import type { RejectedTurnOwner } from "../session/sync/draft-store";
import { TaskRecovery } from "@/components/chat/task-recovery";
import { Button } from "@/components/ui/button";
import { PickerNotice } from "../models/picker-notice";
import { useWorkspaceMaybe } from "@/react-app/shell/workspace-provider";
import { useDenAuth, type DenAuthStore } from "./den-auth-provider";

// Compatibility for saved sessions that used the former hosted Auto model.
// Recovery always goes to Ollama; no hosted request or account flow exists.
export function AutoRejectedTurnRecoveryBridge() { return null; }
export function openAutoUpdate() { openAutoProviderSettings(); }
export function openAutoSignIn(_recovery?: { owner: RejectedTurnOwner; id: string }) { openAutoProviderSettings(); }
export function openAutoProviderSettings() {
  const workspace = window.location.hash.match(/^#(\/workspace\/[^/]+)/)?.[1] ?? "";
  if (window.location.hash.startsWith("#/")) window.location.hash = `${workspace}/settings/ollama`;
  else window.location.assign("/settings/ollama");
}
export function autoAccessStatusQueryKey(auth: Pick<DenAuthStore, "status" | "verifiedIdentity">, baseUrl?: string, workspaceId?: string) {
  return ["auto-access", baseUrl, workspaceId, auth.status, auth.verifiedIdentity];
}
export type AutoAccessWorkspace = { openworkServerClient: OpenworkServerClient | null; workspaceId: string };
export function useObservedAutoAccessSnapshot(override?: AutoAccessWorkspace) {
  const context = useWorkspaceMaybe();
  const workspace = override ?? context;
  const auth = useDenAuth();
  const client = useQueryClient();
  const key = autoAccessStatusQueryKey(auth, workspace?.openworkServerClient?.baseUrl, workspace?.workspaceId);
  const subscribe = useCallback((onChange: () => void) => client.getQueryCache().subscribe(onChange), [client]);
  return useSyncExternalStore(subscribe, () => client.getQueryState<DesktopFreeAccessStatus>(key), () => undefined);
}
export function useObservedAutoAccessStatus(override?: AutoAccessWorkspace) {
  return useObservedAutoAccessSnapshot(override)?.data;
}
export function useAutoAccess(_available: boolean, override?: AutoAccessWorkspace) {
  const context = useWorkspaceMaybe();
  const workspace = override ?? context;
  const auth = useDenAuth();
  const query = useQuery({
    queryKey: autoAccessStatusQueryKey(auth, workspace?.openworkServerClient?.baseUrl, workspace?.workspaceId),
    enabled: false,
    queryFn: async (): Promise<DesktopFreeAccessStatus> => ({
      state: "unavailable", code: "free_not_enrolled", providerID: "", modelID: "",
      allowance: null, currentVersion: "", minimumVersion: null,
    }),
  });
  return { query, auth };
}
export function AutoPickerRecovery(props: { state: AutoPickerState; code?: string | null; resetsAt?: string | null; onRetry?: () => void | Promise<unknown>; onReload?: () => void | Promise<unknown>; hasAlternatives?: boolean }) {
  if (props.state === "ready") return null;
  return <PickerNotice action={<Button size="sm" onClick={openAutoProviderSettings}>Connect Ollama</Button>}>Choose an installed Ollama model.</PickerNotice>;
}
export function AutoAccessFooter(_props: { available: boolean; syncing?: boolean }) { return null; }
export function AutoFirstUseStatus({ onConnect }: { onConnect?: () => void }) {
  return <div className="text-center text-xs text-muted-foreground">Choose an installed Ollama model.
    {onConnect ? <Button size="sm" variant="link" onClick={onConnect}>Connect Ollama</Button> : null}
  </div>;
}
export function AutoAccessNotice({ sessionId }: { wall: AutoAccessWall; sessionId: string; workspaceId?: string; recovery?: { owner: RejectedTurnOwner; id: string } }) {
  return <TaskRecovery compact state="paused" title="Choose an Ollama model" description="This task used a model that is no longer available."
    actions={<Button size="xs" variant="ghost" onClick={() => openAlternativeModelPicker(sessionId)}>Choose a model</Button>} />;
}
