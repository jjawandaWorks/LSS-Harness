import { expect, test } from "bun:test";
import { buildOpenworkRuntimeConfigObjectFromSnapshot } from "./openwork-runtime-config.js";
import { renderOpencodeV2Config } from "./managed-opencode-v2.js";
import filterPlugin from "./opencode-plugins/openwork-provider-filters-v2.js";
import { managedDesktopPolicy } from "./managed-desktop-policy.js";
import type { ServerConfig } from "./types.js";

const config: ServerConfig = {
  host: "127.0.0.1", port: 0, token: "test", hostToken: "test",
  approval: { mode: "auto", timeoutMs: 1000 }, corsOrigins: [], workspaces: [], authorizedRoots: [],
  readOnly: false, startedAt: 0, tokenSource: "generated", hostTokenSource: "generated", logFormat: "pretty", logRequests: false,
};
test("v1 keeps configured Ollama models and excludes restored cloud providers", () => {
  const ollama = { npm: "@ai-sdk/openai-compatible", options: { baseURL: "http://localhost:11434/v1" }, models: { "qwen:7b": { name: "Qwen" } } };
  const runtime = buildOpenworkRuntimeConfigObjectFromSnapshot({ provider: { ollama, openai: { models: {} }, openwork: { models: {} } }, disabled_providers: ["openai"], managedPolicy: { allowCustomProviders: false } });
  expect(runtime.enabled_providers).toEqual(["ollama"]);
  expect(runtime.provider).toEqual({ ollama });
  expect(buildOpenworkRuntimeConfigObjectFromSnapshot({}).provider).toHaveProperty("ollama");
});
test("v2 always installs its allowlist even when no providers are configured", () => {
  const runtime = renderOpencodeV2Config({ providers: [], skills: [], providerFiltersPluginDirectory: "/tmp/lss-provider-filter" });
  expect(runtime.plugins).toEqual([{ package: "file:///tmp/lss-provider-filter", options: { providers: {}, allowedProviders: ["ollama"] } }]);
});
test("v2 removes built-in and later-discovered foreign models", async () => {
  const removed: string[] = [];
  await filterPlugin.setup({ options: { allowedProviders: ["ollama"] }, catalog: { transform: async (apply) => {
    apply({ provider: { list: () => ["ollama", "openai", "opencode", "anthropic"].map((id) => ({ provider: { id }, models: new Map([["model", {}]]) })) }, model: { remove: (provider, model) => { removed.push(`${provider}/${model}`); } } });
    return { dispose: async () => {} };
  } } });
  expect(removed).toEqual(["openai/model", "opencode/model", "anthropic/model"]);
});
test("requests cannot authenticate or run non-Ollama models", async () => {
  const policy = managedDesktopPolicy(config);
  for (const providerID of ["openai", "anthropic", "opencode", "openwork"]) {
    await expect(policy.assert("provider", { providerIDs: [providerID] })).rejects.toThrow("only supports Ollama");
    const path = "/opencode/session/task/prompt_async";
    await expect(policy.assertRequest(new Request(`http://localhost${path}`, { method: "POST", body: JSON.stringify({ model: { providerID, modelID: "model" } }) }), path, true)).rejects.toThrow("only supports Ollama");
    await expect(policy.assertRequest(new Request(`http://localhost/opencode/auth/${providerID}`, { method: "PUT" }), `/opencode/auth/${providerID}`, true)).rejects.toThrow("only supports Ollama");
  }
  await expect(policy.assert("model", { providerID: "ollama", modelID: "qwen:7b" })).resolves.toBeUndefined();
});

test("live server rejects cloud accounts and foreign provider configuration", async () => {
  const { mkdtemp, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { startServer } = await import("./server.js");
  const root = await mkdtemp(join(tmpdir(), "lss-ollama-api-"));
  const previousDb = process.env.OPENWORK_RUNTIME_DB;
  process.env.OPENWORK_RUNTIME_DB = join(root, "runtime.sqlite");
  const server = await startServer({ ...config, workspaces: [{ id: "ws_lss", name: "Local", path: root, preset: "starter", workspaceType: "local" }], authorizedRoots: [root] });
  try {
    const base = `http://127.0.0.1:${server.port}`;
    const headers = { Authorization: "Bearer test", "x-openwork-host-token": "test", "Content-Type": "application/json" };
    for (const path of ["/den-session", "/cloud-provider-sync/status", "/anonymous-inference/status"]) {
      expect((await fetch(`${base}${path}`, { headers })).status).toBe(410);
    }
    const patch = await fetch(`${base}/workspace/ws_lss/config`, { method: "PATCH", headers, body: JSON.stringify({ opencode: { provider: { openai: { models: {} } } } }) });
    expect(patch.status).toBe(403);
    const defaultModel = await fetch(`${base}/workspace/ws_lss/default-model`, { method: "PUT", headers, body: JSON.stringify({ model: { providerID: "openai", modelID: "gpt" } }) });
    expect(defaultModel.status).toBe(403);
    const ollama = await fetch(`${base}/workspace/ws_lss/default-model`, { method: "PUT", headers, body: JSON.stringify({ model: { providerID: "ollama", modelID: "qwen:7b" } }) });
    expect(ollama.status).toBe(200);
  } finally {
    server.stop();
    if (previousDb === undefined) delete process.env.OPENWORK_RUNTIME_DB;
    else process.env.OPENWORK_RUNTIME_DB = previousDb;
    await rm(root, { recursive: true, force: true });
  }
});
