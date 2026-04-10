# WiseForgeStudio Headquarters Constitution

## Core Principles

### I. Spec Before Code
Every meaningful feature starts with a numbered spec package under `specs/` before implementation begins. The minimum path is: specification, clarification when needed, technical plan, task breakdown, then implementation. Work that skips the spec layer is considered exploratory only and must not be treated as production-ready.

### II. Human-Governed Delivery
This project models a real headquarters with human approval in the loop. Changes that affect architecture, public UX, deployment, security posture, or operational policies require explicit review in the plan and a rollback path before release. "Fast" never outranks "traceable."

### III. Buildable Increments
Each task batch must leave the repository in a buildable state. For frontend and application work, the default quality gate is a successful `npm run build`. If that gate cannot be executed, the blocker must be documented in the spec package and in the final implementation notes.

### IV. UI Is Product, Not Decoration
User-facing work must be intentional, distinctive, and grounded in the problem narrative. Reusing the same safe SaaS layout by default is not acceptable. New interfaces should reflect the product story, preserve responsiveness, and justify major visual choices in the plan when they affect the information architecture.

### V. Auditability Over Ambiguity
Plans, tasks, approvals, incidents, and improvement proposals are first-class artifacts. Decisions that change scope, risk, architecture, or rollout behavior must be captured in the active spec package so another engineer or agent can reconstruct why the change happened.

## Development Constraints

- Primary application stack: Next.js 14, TypeScript, Tailwind CSS, Vercel deployment.
- Primary runtime guardrail: local-first operation with zero mandatory paid services.
- Default validation path for shipped UI changes:
  1. `npm run build`
  2. verify critical route rendering
  3. deploy only after the build passes
- Keep changes aligned with the existing repo structure unless the active plan explicitly authorizes structural refactors.
- Never overwrite user-authored changes outside the current scope without approval.

## Workflow Standard

1. Create or switch to a feature branch tied to a numbered spec package.
2. Run `/speckit.specify` to define the feature in terms of user and business intent.
3. Run `/speckit.clarify` when requirements, UX, or rollout risk remain ambiguous.
4. Run `/speckit.plan` to lock stack choices, architecture, validation, and rollout.
5. Run `/speckit.tasks` to produce implementation slices small enough to complete safely.
6. Implement only after the above artifacts exist and are internally consistent.
7. Before merge or deploy, confirm the implementation still matches the active spec package.

## Governance

This constitution overrides ad-hoc development habits inside this repository. Any amendment must update this file, explain why the previous rule is insufficient, and define how existing specs or workflows should adapt. All implementation plans and reviews are expected to check compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2026-04-07 | **Last Amended**: 2026-04-07
