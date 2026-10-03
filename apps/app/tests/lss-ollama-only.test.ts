import { expect, test } from "bun:test";
import { providerListFromConnected, ollamaProviderList } from "../src/react-app/infra/provider-list-query";
import { buildModelCatalog } from "../src/react-app/domains/models/catalog";
import { readDenBootstrapConfig, readDenSettings } from "../src/app/lib/den";
import { DEFAULT_MODEL } from "../src/app/constants";
import { DEFAULT_SHELL_CONFIG } from "../src/react-app/shell/shell-config";

test("restored credentials never activate cloud accounts and bootstrap identity is stable", () => {
  expect(readDenSettings().authToken).toBeNull();
  expect(readDenSettings().activeOrgId).toBeNull();
  expect(readDenBootstrapConfig()).toBe(readDenBootstrapConfig());
  expect(readDenBootstrapConfig().requireSignin).toBe(false);
  expect(DEFAULT_SHELL_CONFIG.cloudSignin).toBe(false);
  expect(DEFAULT_MODEL.providerID).toBe("ollama");
});
test("stale cloud fallback models cannot reappear in the picker", () => {
  const options = ["ollama", "openai", "anthropic", "opencode", "openwork"].map((providerID) => ({ providerID, modelID: "model", title: "Model", description: providerID }));
  const catalog = buildModelCatalog({ runtime: options, fallback: options, pending: options, signedIn: false, restrictToCloud: false, checkRestriction: () => false });
  expect(catalog.options.map((model) => model.providerID)).toEqual(["ollama"]);
  expect(catalog.known.map((model) => model.providerID)).toEqual(["ollama"]);
});
test("cached catalogs cannot retain non-Ollama defaults", () => {
  expect(ollamaProviderList({ all: [], connected: ["ollama", "openai"], default: { ollama: "qwen", openai: "gpt" } })).toEqual({ all: [], connected: ["ollama"], default: { ollama: "qwen" } });
  expect(providerListFromConnected({ providers: [], default: { openai: "gpt" } }).default).toEqual({});
});
