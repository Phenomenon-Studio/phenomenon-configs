# Moving an existing project onto the platform

These steps are a first draft. Rewrite them after the M6 pilot migrations (one project per stack). The goal is the same config files a fresh project gets, a `.copier-answers.yml` so future template updates apply, and local overrides kept only where the team agrees they are needed.

## 1. Add the shared configs

On a clean branch of the project root:

```bash
pnpm dlx @phenomenon-studio/create-app init       # detects stack and styling from package.json
# or: uvx copier copy --trust --data scope=configs gh:Phenomenon-Studio/phenomenon-configs .
```

`init` adds only the tooling: ESLint, Prettier, Stylelint, commitlint, `tsconfig*.json`, husky hooks, `.editorconfig`, `pnpm-workspace.yaml`, CI, template update and Renovate. It doesn't touch `src/`, `.gitignore` or the app's own dependencies. Copier asks before replacing each existing config file (`--overwrite` replaces them all). Review `git diff` file by file and move project-specific rules under `// Local overrides only.`

`package.json` is merged, not replaced. The tooling devDependencies are added or set to the catalog version, missing scripts are added (`lint`, `lint:*`, `fix:fmt`, `tsc`, `prepare`), and existing scripts are kept.

To move the whole project onto the starter structure instead, generate a new app (`create-app <dir>`) and port `src/` into it.

## 2. Remove what the configs no longer need

Delete what the shared configs replace:

- `.eslintrc*`, `@eslint/eslintrc`, `eslint-config-next` (the configs use `@next/eslint-plugin-next` directly), unused `eslint-plugin-*`
- old Prettier/Stylelint/commitlint config files in other formats (`.prettierrc`, `.stylelintrc`, `commitlint.config.cjs`…)
- `npm-run-all`, `package-lock.json` / `yarn.lock` (projects use pnpm)

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

If a rule must stay different in one project, add it under `// Local overrides only.` in `eslint.config.js` and note why in the PR. If several projects need the same override, change the template instead.

## 4. Turn on updates

- Commit `.copier-answers.yml`. It records the template tag; adopting at an older tag is fine.
- `renovate.json` extends the shared preset. Merge the onboarding PR if the Renovate app asks.
- `.github/workflows/ci.yml` calls `node-ci.yml@v1`. Add project-specific public env vars to its `build-env`.
- `.github/workflows/template-update.yml` opens a PR when the template moves on. It uses the repo's own `GITHUB_TOKEN`, so no secret is needed. Turn on Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests".

## Acceptance

- CI is green, and the only lint rule changes are ones the team approved.
- A test template release reaches the project as an update PR.
