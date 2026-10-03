# LSS Harness

A local AI workspace powered exclusively by [Ollama](https://ollama.com).
No account, subscription, API key, hosted inference, or company telemetry.

## Run locally

1. Install Node.js, pnpm, and Bun.
2. Install and start Ollama (`ollama serve`). Pull a tool-capable model, for example `ollama pull qwen2.5-coder:7b`.
3. Run `pnpm install` and `pnpm dev`.
4. Open Settings → Ollama, select an installed model, and choose it as your default.

The default Ollama endpoint is `http://localhost:11434/v1`. Browser development may require `OLLAMA_ORIGINS=http://localhost:5173 ollama serve`.
Workspace files and chat history stay local. The agent engine is OpenCode; its model catalog and requests are restricted to Ollama.

Derived from different-ai/openwork. Original license and copyright notices are retained in LICENSE and LICENSES.
