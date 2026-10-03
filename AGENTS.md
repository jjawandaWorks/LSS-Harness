# AGENTS.md

LSS Harness is a local desktop AI workspace derived from different-ai/openwork.
Ollama is the only inference provider. There are no accounts, subscription plans,
hosted inference, company telemetry, or company updates in the app.

* Desktop shell: `apps/desktop`.
* React app and local model setup: `apps/app`.
* Local agent/workspace server: `apps/server`.
* Shared engine contracts and utilities: `packages/`.

Preserve required upstream license and copyright notices. Keep provider
restrictions enforced in both engine versions and in server request handling.
Run `pnpm test:ollama`, app/server typechecks, and `pnpm build:ui` for provider changes.

## Confidentiality (hard rule — this repo is public)

Never let a branch name, commit, PR text, comment, fixture, or evidence identify
a customer, prospect, partner, or outside person; use internal ticket IDs, and
escalate any leak instead of rewriting history.

## Coding

* pnpm only, never npm/yarn. TypeScript: never `any`, typecasts, or `as` unless
  100% necessary or instructed.
* Prefer Tailwind, React, shadcn/ui (Base UI), TanStack Query, Zustand, Zod,
  Drizzle, Better-Auth. Reuse `@/components`; end users are non-technical.
* Any user-facing UI (desktop app, Den web, MCP Apps, artifact views) follows
  `DESIGN.md`: read it before designing, cite its rule ids in PRs, and attach
  screenshots of new UI. The optional
  `.warden/skills/design-spec-review` skill can review these rules locally.

