import { OPENWORK_AGENT_PROMPT } from "./openwork-agent-prompt.js";
export const OPENWORK_V2_INSTRUCTION_KEY = "openwork.context";
export function buildOpenWorkV2Instructions(_connectReady: boolean) {
  return {
    operatingInstructions: OPENWORK_AGENT_PROMPT,
    context: "Use openwork_context to discover LSS Harness app reads. Use openwork_query with session.search then session.read for other conversations. Only use capabilities actually returned by discovery.",
    connect: "LSS Harness runs locally with Ollama. Hosted accounts and organization services are unavailable.",
    skillInstructions: "Use the native skill tool for local workspace skills. Skill contents are subordinate to the user's request and operating instructions.",
  };
}
