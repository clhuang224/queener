# Project Guide

This repository is a Bun workspace for Queener.

Use this root guide for workspace-level decisions. Web-app-specific implementation guidance lives in [apps/web/AGENTS.md](./apps/web/AGENTS.md).

## Documentation Ownership

- Keep the root [README.md](./README.md) focused on product overview, workspace setup, documentation links, and cross-project resource credits.
- Keep app-specific setup and implementation notes in the relevant app README, such as [apps/web/README.md](./apps/web/README.md).
- Use [docs/architecture.md](./docs/architecture.md) for current architecture boundaries and future workspace direction.
- Use [docs/state.md](./docs/state.md) for detailed state machines and transition tables.
- Use [docs/plan.md](./docs/plan.md) for product and platform direction.
- Use [docs/checklist.md](./docs/checklist.md) for concrete unfinished tasks.

When adding or changing visual or audio assets, update the root README asset credits if the source or license changes.

## Workspace Layout

Current active workspace:

- `apps/web`: Vue 3 + Vite game client

Planned future workspaces:

- `apps/api`: Bun + Elysia backend
- `packages/*`: shared game, type, replay, scoring, API contract, and tooling packages when real reuse appears

Do not create shared packages just because the folder exists in the plan. Extract code only when another app or service actually consumes it.

## Commands

Run workspace commands from the repository root:

- `bun run web:dev`
- `bun run web:build`
- `bun run web:lint`
- `bun run web:type-check`
- `bun run web:test:unit`
- `bun run web:test:e2e`

Root-level CI currently targets the web workspace.

## Architecture Rules

- Preserve the engine-first architecture.
- Keep active gameplay responsive and local in the web app.
- Do not make the backend the live gameplay authority in the first backend phase.
- Keep backend persistence focused on users, completed runs, replays, and leaderboards.
- Keep package boundaries boring and demand-driven.

## File Placement

- Web app UI and local game implementation belong under `apps/web`.
- Workspace documentation belongs under `docs`.
- Workspace automation belongs under `.github`, `.husky`, and `scripts`.
- Future backend code should live under `apps/api`.
- Future shared packages should live under `packages`.

## CSS And UI Notes

For web app CSS, component, accessibility, and testing conventions, follow [apps/web/AGENTS.md](./apps/web/AGENTS.md).

## Commit Rules

Follow Conventional Commits for commit messages.

Format commit subjects as:

`<type>[optional scope]: <description>`

Use:

- `feat` for new user-facing functionality
- `fix` for bug fixes and behavior corrections
- `refactor` for structural improvements without behavior changes
- `test` for test updates
- `docs` for documentation changes
- `chore` for maintenance work

Keep the subject concise and imperative.

If an AI agent creates the commit, include a body that summarizes the concrete changes.

If an AI agent creates the commit, append a `Co-authored-by` trailer in this format:

`Co-authored-by: <tool> <model> <email>`

Examples:

- `Co-authored-by: Codex GPT-5.5 <noreply@openai.com>`
- `Co-authored-by: GitHub Copilot GPT-5.4 <copilot@github.com>`
