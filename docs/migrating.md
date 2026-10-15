# Moving an existing project onto the platform

These steps are a first draft. Rewrite them after the M6 pilot migrations (one project per stack). The goal is the same files a fresh project gets, a `.copier-answers.yml` so future template updates apply, and local overrides kept only where the team agrees they are needed.

## 1. Adopt the template

On a clean branch of the project:

```bash
uvx copier copy --trust --skip-tasks --data project_name=<name> --data stack=<vite|next> \
    gh:Phenomenon-Studio/phenomenon-configs .
```

Copier asks before overwriting each file. Accept the shared files: configs, hooks, `.gitignore`, `package.json` scripts and devDependencies. Keep the project's own `src/`, `public/`, README and env examples. Review `git diff` file by file: app dependencies the template does not know about must be added back to `package.json`.

## 2. Remove what the packages now own

Delete these from `package.json`. The config packages ship them:

- `@eslint/js`, `@eslint/eslintrc`, `typescript-eslint` / `@typescript-eslint/*`, `eslint-config-next`, `eslint-config-prettier`, every `eslint-plugin-*` and `@eslint-react/*`, `@stylistic/eslint-plugin`, `globals`
- `@ianvs/prettier-plugin-sort-imports`, `prettier-plugin-tailwindcss`
- `stylelint-config-standard`, `@commitlint/config-conventional`
- `npm-run-all`, `package-lock.json` (Next projects move to pnpm)

Then run `pnpm install`.

## 3. Fix what the shared rules report

```bash
pnpm fix:fmt && pnpm lint && pnpm tsc && pnpm build
```

For Next projects, expect the changes listed in [audit.md](audit.md#next-phenomenon-next-ts-template):

- arrow-function components become function declarations
- effect callbacks get names
- `import type`
- ky 2 hook signatures

If a rule must stay different in one project, add it under `// Local overrides only.` in `eslint.config.js` and note why in the PR. If several projects need the same override, change the shared package instead.

## 4. Turn on updates

- Commit `.copier-answers.yml`. It records the template tag; adopting at an older tag is fine.
- `renovate.json` extends the shared preset. Merge the onboarding PR if the Renovate app asks.
- `.github/workflows/ci.yml` calls `node-ci.yml@v1`. Add project-specific public env vars to its `build-env`.
- `.github/workflows/template-update.yml` opens a PR when the template moves on. It needs the `PLATFORM_TEMPLATE_TOKEN` org secret.

## Acceptance

- CI is green, and the only lint rule changes are ones the team approved.
- A test template release reaches the project as an update PR.
