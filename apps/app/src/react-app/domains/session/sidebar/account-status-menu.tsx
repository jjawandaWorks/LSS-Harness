import { Settings } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import type { OpenworkServerStatus } from "@/app/lib/openwork-server";
import type { SessionCloudMcpMaintenanceState } from "@/react-app/domains/connections/use-session-mcp-maintenance";
export type AccountStatusMenuProps = {
  clientConnected: boolean;
  openworkServerStatus: OpenworkServerStatus;
  developerMode: boolean;
  /** Hidden until a workspace is selected, matching the old status bar. */
  showConnectionStatus: boolean;
  providerConnectedIds: string[];
  mcpConnectedCount: number;
  reloadBusy?: boolean;
  reloadError?: string | null;
  openWorkConnectState?: SessionCloudMcpMaintenanceState;
  showSettingsButton?: boolean;
  onOpenAccountSettings?: () => void;
  onSendFeedback?: () => void;
};
export function AccountStatusMenu(props: AccountStatusMenuProps) {
  const navigate = useNavigate();
  return <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
    <span>{props.clientConnected ? "Local workspace" : "Workspace offline"}</span>
    <Button variant="ghost" size="icon-sm" aria-label="Open settings" onClick={() => navigate("/settings/ollama")}><Settings /></Button>
  </div>;
}
