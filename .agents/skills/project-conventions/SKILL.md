---
name: project-conventions
description: Project-specific conventions for every task in the @teqfw/web repository.
---

# Project Conventions

`AGENTS.md` overrides this file.

## Repositories

- The package root and `ctx/` are separate repositories; do not mix their
  status, commits, or pushes.
- `ctx/` is the authoritative cognitive context for
  `@teqfw/web`.

## Workflow

- Work in each repository's `main` branch. This project rule overrides any
  GitHub-skill instruction to use a separate branch.
- At the start of work, check upstream state in the package root and `ctx/`;
  safely fast-forward each local `main` when needed to keep it synchronized.
- Before changes, inspect every affected working tree.
- Do not commit or push unless the user requests it.

## Communication

- Communicate with the user in Russian; write source code, comments,
  documentation, commit messages, and identifiers in English.
- Report changes, verification, and remaining risks.

## Project boundaries

- Maintain the `@teqfw/web` Node.js library package; runtime implementation
  belongs in `src/`, tests in `test/`, and package-consumer skills in `skills/`.
- Keep `ctx/` for project cognitive context. Use `adsm-ctx` when changing or
  validating its ADSM structure.
- Use ES modules with `.mjs`; preserve the `TeqFw_Web_ -> src` DI namespace mapping.

## Validation

- For source or test changes, run the relevant `npm run test:unit`,
  `npm run test:integration`, and `npm run typecheck` checks.
- For Markdown changes under `skills/` or at the package root, run `npm run lint:md`.

## GitHub

- In all multiline text sent to GitHub, including issues and comments, use
  actual line breaks; never send literal `\n`.

## Shared memory

- `flancer32/ai-memo` is the shared cross-project issue tracker and memory.
- Use source `teqfw/web`; every issue must name the project or projects
  expected to resolve it.
- When referring to a commit in another repository, use its full GitHub URL:
  `https://github.com/vendor/name/commit/<sha>`.
- Store notes at `project/teqfw/web/`.
