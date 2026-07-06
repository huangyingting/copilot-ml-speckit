<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Placeholder Principle 1 -> Type-Safe, Maintainable Code
- Placeholder Principle 2 -> Server-First Next.js Architecture
- Placeholder Principle 3 -> Testing Is Required Evidence
- Placeholder Principle 4 -> Consistent, Accessible User Experience
- Placeholder Principle 5 -> Performance Budgets by Default
Added sections:
- Next.js Architecture Constraints
- Development Workflow and Quality Gates
Removed sections:
- Placeholder section slots
Templates requiring updates:
- ✅ updated .specify/templates/plan-template.md
- ✅ updated .specify/templates/spec-template.md
- ✅ updated .specify/templates/tasks-template.md
- ✅ updated .github/agents/speckit.tasks.agent.md
- ✅ reviewed .specify/templates/commands/*.md (no files present)
- ✅ reviewed .github/agents/speckit.constitution.agent.md
Follow-up TODOs: None
-->

# Next.js Project Constitution

## Core Principles

### I. Type-Safe, Maintainable Code

All production code MUST use TypeScript with strict type checking. New code MUST keep
clear ownership boundaries between routes, components, server-only modules, client-only
modules, data access, and shared utilities. Use of `any`, unchecked casts, duplicated
business logic, or broad catch-all abstractions MUST be justified in the plan and kept
local to the smallest viable scope. Every change MUST pass formatting, linting, and
type checks before review.

Rationale: Type safety and small, explicit boundaries make Next.js applications easier
to refactor, safer to optimize, and less likely to leak server-only assumptions into
client code.

### II. Server-First Next.js Architecture

New routes MUST use the App Router unless the plan documents a compatibility reason.
Server Components, route handlers, Server Actions, and server-side data fetching MUST be
the default for server data, secrets, authentication, authorization, and mutations.
Client Components MUST be limited to interactive UI leaves that require browser APIs,
local state, or effects. Rendering mode, runtime selection, cache behavior, and revalidate
strategy MUST be explicit for every route affected by a feature.

Rationale: Server-first architecture reduces shipped JavaScript, protects sensitive
logic, and makes performance behavior deliberate instead of incidental.

### III. Testing Is Required Evidence

Every behavior change MUST include automated tests that fail before the implementation
or cite existing tests that already fail for the intended behavior. Pure logic requires
unit tests; UI branching requires component tests; API route or contract changes require
integration or contract tests; critical user journeys require end-to-end tests. Bug fixes
MUST include a regression test that reproduces the defect. A change that cannot be
tested automatically MUST document the reason, manual verification steps, and residual
risk in the plan.

Rationale: Tests are the delivery evidence that features work independently, regressions
stay fixed, and refactors can proceed without guesswork.

### IV. Consistent, Accessible User Experience

User-facing changes MUST use the project's shared components, tokens, navigation
patterns, and copy conventions. Every user journey MUST define loading, empty, error,
success, disabled, and permission-denied states where applicable. UI MUST work on the
supported mobile and desktop viewports, preserve keyboard access and visible focus, and
provide semantic labels for assistive technology. One-off visual styles MUST be approved
in the plan with a stated product rationale.

Rationale: Consistent interaction patterns reduce user confusion and keep the interface
coherent as the application grows.

### V. Performance Budgets by Default

Every feature that affects a page, route handler, asset, query, or client bundle MUST
define measurable performance budgets before implementation. Unless a stricter plan
applies, user-facing pages MUST target Core Web Vitals of LCP <= 2.5s, INP <= 200ms,
and CLS <= 0.1 for supported production-like environments. New client JavaScript, images,
fonts, third-party scripts, data fetching, and cache invalidation MUST be measured and
kept within the stated budget. Performance regressions block release until fixed or
accepted through an explicit governance exception.

Rationale: Next.js performance depends on early rendering, caching, and bundle choices;
budgets make those tradeoffs visible before they become release blockers.

## Next.js Architecture Constraints

- App Router is the default location for new routes, layouts, loading states, error
  boundaries, and metadata.
- Server-only code MUST remain outside client component import paths and MUST never expose
  secrets, privileged credentials, or unvalidated environment variables to the browser.
- Data fetching MUST document cache mode, invalidation path, and stale-data behavior.
- Images, fonts, scripts, and links MUST use Next.js optimized primitives when available.
- Accessibility, responsive behavior, and performance instrumentation MUST be considered
  part of the feature scope, not polish.

## Development Workflow and Quality Gates

- Specifications MUST identify target users, independently testable journeys, UX states,
  accessibility expectations, and measurable success criteria.
- Plans MUST pass the Constitution Check before Phase 0 research and again after Phase 1
  design. Any violation MUST be resolved or recorded in Complexity Tracking with a clear
  rationale and simpler alternative considered.
- Task lists MUST include the tests, UX verification, accessibility checks, and performance
  validation needed to prove each user story independently.
- Pull requests MUST include evidence for linting, type checking, automated tests, and any
  required performance or accessibility checks.
- Releases MUST block on unresolved MUST-level constitution violations.

## Governance

This constitution supersedes conflicting local conventions, templates, generated plans,
and ad hoc reviewer preferences. Amendments require a written proposal that states the
rationale, affected principles or sections, migration impact, and dependent template or
guidance updates. Maintainers MUST review and approve amendments before they are treated
as active governance.

Versioning follows semantic versioning. MAJOR changes remove or redefine principles or
governance in a backward-incompatible way. MINOR changes add principles, sections, or
material new requirements. PATCH changes clarify wording without changing obligations.

Every feature review MUST verify compliance with the active constitution. A documented
exception MAY be approved only when it names the violated rule, the reason, the owner,
the expiry or revisit trigger, and the planned remediation.

**Version**: 1.0.0 | **Ratified**: 2026-07-07 | **Last Amended**: 2026-07-07
