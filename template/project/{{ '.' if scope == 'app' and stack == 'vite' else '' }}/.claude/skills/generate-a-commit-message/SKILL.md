---
name: generate-a-commit-message
description: >
  Inspects staged/unstaged changes and produces a short, clean Conventional Commit
  message that satisfies this repo's commitlint.config.js. Delegates phrasing to the
  `caveman` skill (full) so the subject is terse and free of filler. Auto-detects
  ticket IDs (e.g. APP-1234) from the current branch and appends a `Refs:` footer.
  Validates the final message with `pnpm exec commitlint --edit` before presenting.
  Use when user says "generate commit message", "write commit", "commit msg",
  "what should the commit be", or invokes /generate-a-commit-message — typically just
  before `git commit`.
allowed-tools: Read, Bash
model: sonnet
---

# Generate Commit Message

## Quick start

1. Read changes: `git status` + `git diff --staged` (fall back to `git diff` if nothing staged).
2. Read current branch: `git rev-parse --abbrev-ref HEAD`. Extract any `[A-Z]+-\d+` ticket ID.
3. Pick **one** type from the enum: `build | ci | docs | feat | fix | perf | refactor | revert | style | test`.
4. Pick an optional lower-case scope from the touched area (e.g. `auth`, `e2e`, `deps`).
5. Apply the [`caveman`](../caveman/SKILL.md) skill at **full** level to draft the subject — drop articles, fragments OK, short synonyms.
6. Append `Refs: <TICKET-ID>` footer when a ticket ID was found on the branch.
7. Validate by piping the message through `pnpm exec commitlint --edit` (see [Validation](#validation)).
8. Output the final message; do not run `git commit` unless the user asks.

## Commitlint rules to respect

From [`commitlint.config.js`](../../../commitlint.config.js):

- `type-enum`: only the 10 types above. No others.
- `type-case` / `scope-case`: **lower-case** only.
- `subject-case`: NEVER sentence-case, start-case, pascal-case, or upper-case → write subject in lower-case (or imperative mood with lowercase first word).
- `subject-empty`: required.
- `subject-full-stop`: no trailing `.`.
- `header-max-length`: **≤ 100 chars** total (`type(scope): subject`).
- `body-leading-blank` + `footer-leading-blank`: blank line before each.
- `body-max-line-length`: 200. `footer-max-line-length`: 100.

## Workflow

- [ ] `git status` + `git diff --staged` (or `git diff` if nothing staged).
- [ ] `git rev-parse --abbrev-ref HEAD` → extract `[A-Z]+-\d+` ticket ID if present.
- [ ] Group changes by intent. Pick the **dominant** one for the type. Mixed concerns → suggest splitting, do not invent a multi-type header.
- [ ] Choose scope from the most-touched directory/feature. Skip scope if changes span unrelated areas.
- [ ] Draft subject in **caveman full**: imperative verb, drop articles, fragments OK, short synonyms (`fix` not `implement a solution for`), no period, lowercase.
- [ ] Add a body **only** if the *why* is non-obvious from the diff. Otherwise omit.
- [ ] Append `Refs: <TICKET-ID>` footer when ticket ID found.
- [ ] Validate with `commitlint --edit` (see below). If it fails, fix and revalidate.
- [ ] Present the message; do not run `git commit` unless the user asks.

## Validation

The repo already gates commits via [`.husky/commit-msg`](../../../.husky/commit-msg) running `pnpm exec commitlint --edit $1`. Reuse that exact tool for pre-flight validation:

```bash
# Write candidate message to a temp file, then validate.
printf '%s\n' "$MESSAGE" > /tmp/commit-msg-candidate
pnpm exec commitlint --edit /tmp/commit-msg-candidate
```

Exit code `0` = valid. Non-zero = read the violations and rewrite. Do not bypass with `--no-verify`.

## Type cheatsheet

| Type | Use when |
|------|----------|
| `feat` | new user-visible capability |
| `fix` | bug fix |
| `refactor` | code change, no behavior change |
| `perf` | performance improvement |
| `style` | whitespace/formatting only |
| `test` | add/adjust tests only |
| `docs` | docs/comments only |
| `build` | build system, deps, bundler, scripts |
| `ci` | CI config and pipelines |
| `revert` | revert a previous commit |

## Examples

Subject only (caveman **full**):

```
feat(assessments): add bulk archive
```
```
fix(auth): handle expired refresh token on boot
```
```
refactor(auth): replace getLocalStorageValueWithoutQuetes with parse/stringify
```
```
test: add unit tests for storage utils
```

With auto-detected ticket footer (branch `feat/APP-1234-bulk-archive`):

```
feat(assessments): add bulk archive

Refs: APP-1234
```

Body + footer (only when *why* is non-obvious):

```
fix(api): retry survey submission on 502

Backend behind CDN occasionally returns 502 during deploys. One retry hides transient blip from user.

Refs: APP-1234
```

## Don'ts

- No emojis. No trailing period. No upper-case first letter in subject.
- No vague subjects like `update code`, `fix stuff`, `misc changes`.
- Do not invent a ticket ID — only use one if it actually appears on the branch name.
- Do not stage files or run `git commit` unless explicitly asked.
- Do not bypass commitlint with `--no-verify`.
