# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., TypeScript 5.x, Next.js 15.x, Python 3.11 or NEEDS CLARIFICATION]

**Primary Dependencies**: [e.g., Next.js, React, database/client SDK, FastAPI or NEEDS CLARIFICATION]

**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

**Testing**: [e.g., Vitest, React Testing Library, Playwright, pytest or NEEDS CLARIFICATION]

**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]

**Project Type**: [e.g., Next.js web app/library/cli/web-service/mobile-app or NEEDS CLARIFICATION]

**Performance Goals**: [domain-specific, e.g., Core Web Vitals targets, p95 API latency, 60 fps or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., <=200ms p95 API, client bundle budget, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Document pass/fail evidence for each active constitution gate:

- **Code Quality**: TypeScript strictness, module ownership, server/client boundaries,
  linting, formatting, and typecheck commands are identified.
- **Testing**: Unit, component, integration, end-to-end, or contract tests are mapped to
  changed behavior; any automation gap has a documented rationale and manual check.
- **UX Consistency**: Shared components/tokens, accessibility requirements, responsive
  behavior, and loading/error/empty/success states are accounted for.
- **Performance**: Core Web Vitals, API latency, client bundle impact, image/font/script
  handling, rendering mode, caching, and measurement commands are defined.
- **Next.js Architecture**: App Router usage, Server Component and Client Component
  boundaries, route handlers, runtime selection, and data-fetching strategy are explicit.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Next.js web application
app/
├── (routes)/
├── api/
└── layout.tsx
components/
lib/
styles/
public/
tests/
├── unit/
├── integration/
└── e2e/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
