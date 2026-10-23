# Guidelines

Keep replies extremely concise. No unnecessary fluff, no long code snippets. Leverage caveman skill in full mode.

Whenever working with any third-party library, you MUST look up the official documentation to ensure up-to-date information. Use the DocsExplorer subagent for efficient documentation lookup.

## Project overview

SPA admin template built with React (React Compiler) + TypeScript + Vite.

## How to work in this repo

- Tech stack & project structure: see [`README.md`](README.md).
- Commands: see `scripts` in [`package.json`](package.json).
    - `pnpm` is the project-standard package manager. Always respect [`pnpm-workspace.yaml`](pnpm-workspace.yaml) config.
    - Prefer using defined `pnpm` scripts over raw execution of binary commands (e.g., use `pnpm tsc` instead of `npx tsc --build`).
- Code style & conventions: see [`.claude/rules/code-style.md`](.claude/rules/code-style.md).
