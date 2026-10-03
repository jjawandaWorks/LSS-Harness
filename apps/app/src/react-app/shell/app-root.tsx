import { Navigate, Route, Routes } from "react-router";
import { ComputerUseControls } from "../domains/session/surface/computer-use-controls";
import { ChatDeepLinkListener } from "./chat-deep-link-listener";
import { NewProvidersListener } from "./new-providers-listener";
import { useDesktopFontZoomBehavior } from "./font-zoom";
import { useVisualViewportInset } from "../../hooks/use-visual-viewport-inset";
import { LoadingOverlay } from "./loading-overlay";
import { EngineMigrationOverlay } from "./engine-migration";
import { CloudWorkspaceStatusProvider } from "./cloud-workspace-overlay";
import { AppMenuProvider } from "./app-menu";
import { OpenworkControlProvider, OpenworkRouteControlActions } from "./control/control-provider";
import { OpenworkContextPublisher } from "./openwork-context-publisher";
import { SessionRoute } from "./session-route";
import { SettingsRoute } from "./settings-route";
import { ShellConfigProvider } from "./shell-config";
import { DesktopUpdaterProvider } from "../domains/settings/state/desktop-updater-provider";

export function AppRoot() {
  useDesktopFontZoomBehavior();
  useVisualViewportInset();
  return <DesktopUpdaterProvider><ShellConfigProvider><AppMenuProvider><OpenworkControlProvider>
    <OpenworkRouteControlActions />
    <ChatDeepLinkListener /><OpenworkContextPublisher /><NewProvidersListener />
    <CloudWorkspaceStatusProvider>
      <ComputerUseControls />
      <Routes>
        <Route path="/session" element={<SessionRoute />} />
        <Route path="/session/:sessionId" element={<SessionRoute />} />
        <Route path="/workspace/:workspaceId/session" element={<SessionRoute />} />
        <Route path="/workspace/:workspaceId/session/:sessionId" element={<SessionRoute />} />
        <Route path="/settings/*" element={<SettingsRoute />} />
        <Route path="/workspace/:workspaceId/settings/*" element={<SettingsRoute />} />
        <Route path="/extensions/*" element={<SessionRoute />} />
        <Route path="/workspace/:workspaceId/extensions/*" element={<SessionRoute />} />
        <Route path="*" element={<Navigate to="/session" replace />} />
      </Routes>
      <LoadingOverlay /><EngineMigrationOverlay />
    </CloudWorkspaceStatusProvider>
  </OpenworkControlProvider></AppMenuProvider></ShellConfigProvider></DesktopUpdaterProvider>;
}
