# phenomenon-configs

Shared configs, project template and CI for Phenomenon Studio frontend projects.

The public CLI **`@phenomenon-studio/create-app`** writes the shared ESLint, Prettier, Stylelint, commitlint, TypeScript, git hook, CI and Renovate configs into a new or existing project as **plain files**. Your project depends on no config package and needs no token or private registry. A rule fix lands here once and reaches every project as a reviewed **template update PR**.

```text
                 ██
  ▄ ██ ▄  ██▀▀█▄ ██▀▀█▄ ▄█▀▀█▄ ██▀▀█▄ ▄█▀▀█▄ ██▀▀██▀▀█▄ ▄█▀▀█▄ ██▀▀█▄ ▄█▀▀█▄ ██▀▀█▄
   ████   ██  ██ ██  ██ ██▀▀▀▀ ██  ██ ██  ██ ██  ██  ██ ██▀▀▀▀ ██  ██ ██  ██ ██  ██
  ▀ ██ ▀  ██▀▀▀  ██  ██ ▀█▄▄█▀ ██  ██ ▀█▄▄█▀ ██  ██  ██ ▀█▄▄█▀ ██  ██ ▀█▄▄█▀ ██  ██
          ▀▀
  studio · configs cli                                                       v1.0.0
```

| Stack | Starter | Source template |
| --- | --- | --- |
| `vite` | React SPA, TanStack Router + Query + Form, shadcn/ui + Tailwind v4 **or** CSS Modules | `Phenomenon-Studio/admin-template` |
| `next` | Next.js App Router, TanStack Query, CSS Modules | `Phenomenon-Studio/phenomenon-next-ts-template` |

**Contents:** [Before you start](#before-you-start-checklist) · [Roadmap](#roadmap) · [Commands](#commands) · [Examples](#examples) · [Keep a project up to date](#keep-a-project-up-to-date) · [Troubleshooting](#troubleshooting) · [For maintainers](#for-maintainers)

## Before you start (checklist)

Tick each one before running a command:

- [ ] **Node.js 24+**: `node -v` prints `v24.x` or newer ([nvm](https://github.com/nvm-sh/nvm): `nvm install 24`).
- [ ] **pnpm 11+**: `pnpm -v` prints `11.x` or newer (`corepack enable pnpm`, or `npm i -g pnpm`).
- [ ] **uv** (runs Copier, the template engine, so you never install Python tools by hand): `uv --version` works (`brew install uv`, or see [docs.astral.sh/uv](https://docs.astral.sh/uv/getting-started/installation/)).
- [ ] **git** is installed. For `init` / `update`, the project is a git repo with a **clean working tree** (`git status` shows nothing to commit).
- [ ] For `init`: run it from the **project root**, the folder with `package.json`.
- [ ] For the automatic weekly update PR, in the project's GitHub repo (or org-wide): **Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests"**.
- [ ] Optional: the [Renovate app](https://github.com/apps/renovate) is installed for the repo, for dependency PRs.

No npm token, GitHub token, `.npmrc` entry or org secret is needed. The CLI is on the public npm registry, and the template repo is public.

## Roadmap

```text
                     ┌──────────────────────────────┐
                     │ Do you have a project yet?   │
                     └──────────────┬───────────────┘
                  no ┌──────────────┴───────────────┐ yes
                     ▼                              ▼
  pnpm dlx @phenomenon-studio/create-app    cd existing-project
           my-app [--stack …]               pnpm dlx @phenomenon-studio/create-app init
                     │                              │
   starter app + configs + CI,              configs + hooks + CI added,
   deps installed, git initialised          package.json tooling merged, deps installed
                     │                              │
                     └──────────────┬───────────────┘
                                    ▼
                commit (keep .copier-answers.yml committed!)
                                    │
                                    ▼
          ┌──────────────── every template release (vX.Y.Z) ────────────────┐
          │ weekly "build(template): update to vX.Y.Z" PR opens by itself,   │
          │ or run `pnpm dlx @phenomenon-studio/create-app update` any time  │
          └──────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                   review diff → resolve conflicts → merge
```

## Commands

Run every command with `pnpm dlx`, so you always get the latest CLI and nothing gets installed globally. `npx @phenomenon-studio/create-app …` works too. Each command prints the same three numbered steps, runs Copier (its questions and file list appear in between) and ends with a summary box of next steps.

### `create-app` (no arguments): interactive

In a terminal, running the CLI without arguments asks what to do: **Create a new project**, **Add configs to this project** or **Update this project**. For a new project it then asks for the name and shows radio lists for the framework and styling (↑/↓ or the option number, Enter to pick). Without a terminal (CI, pipes) it prints help instead, so scripts must pass the command and flags.

### `create-app <directory>`: new project

Generates a starter app (source, README, build config) plus all shared configs, installs dependencies, initialises git and husky.

```bash
pnpm dlx @phenomenon-studio/create-app my-app
```

| Option                            | Effect                                                                |
| --------------------------------- | --------------------------------------------------------------------- |
| `--stack vite\|next`              | Skip the framework radio list                                         |
| `--styling tailwind\|css-modules` | Vite only: skip the styling radio list (Next.js apps use CSS Modules) |
| `--ref vX.Y.Z`                    | Use a specific template release instead of the latest                 |

The package name comes from the directory name in kebab-case (`My App` → `my-app`). If it can't be derived, you're asked for it.

What you see:

```text
  [1/3] Checking prerequisites
        ✔ uv 0.13.1
        ✔ Node.js 24.22.1
        ✔ pnpm 11.9.0
  [2/3] Preparing the new project
        directory  my-app
        stack      vite
        styling    Copier will ask
        template   gh:Phenomenon-Studio/phenomenon-configs @ latest release
  [3/3] Generating the project
        🎤 Package name (kebab-case)  my-app
        🎤 Styling approach           Tailwind CSS + shadcn/ui
        create  package.json, eslint.config.js, src/…    (Copier output)
        > Running task: pnpm install

  ╭─ Project created ───────────────────────────────────────────────────╮
  │ Open:    cd my-app                                                  │
  │ Env:     cp .env.local.example .env.local                           │
  │ Run:     pnpm dev                                                   │
  │ Commit:  git add -A && git commit -m "build: scaffold from phen…"   │
  ╰─────────────────────────────────────────────────────────────────────╯
```

### `create-app init`: add configs to an existing project

Adds only the tooling and leaves your app source alone:

| Added or replaced | Merged | Never touched |
| --- | --- | --- |
| `eslint.config.js`, `prettier.config.js`, `stylelint.config.js`, `commitlint.config.js`, `tsconfig*.json`, `.husky/*`, `.editorconfig`, `.gitattributes`, `.prettierignore`, `.stylelintignore`, `.nvmrc`, `pnpm-workspace.yaml`, `renovate.json`, `.github/workflows/{ci,template-update}.yml` | `package.json`: tooling devDependencies added or set to the platform version, missing scripts added (`lint`, `lint:*`, `fix:fmt`, `tsc`, `prepare`), `packageManager`/`engines.node` set if absent. Your own scripts and dependencies stay. | `src/`, `public/`, `.gitignore`, README, env files, framework config (`vite.config.ts`, `next.config.ts`) |

```bash
cd my-existing-project
pnpm dlx @phenomenon-studio/create-app init
```

| Option                            | Effect                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------ |
| `--stack vite\|next`              | Override detection (`next` or `vite` in `package.json`)                        |
| `--styling tailwind\|css-modules` | Override detection (`tailwindcss` in `package.json` → `tailwind`)              |
| `--overwrite`                     | Replace existing config files without asking per file (review with `git diff`) |
| `--ref vX.Y.Z`                    | Use a specific template release                                                |

What you see:

```text
  [1/3] Checking prerequisites
        ✔ uv 0.13.1
        ✔ Node.js 24.22.1
        ✔ pnpm 11.9.0
  [2/3] Inspecting the existing project
        project     legacy-shop
        stack       vite
        styling     tailwind
        stylesheet  ./src/app.css
        template    gh:Phenomenon-Studio/phenomenon-configs @ latest release
        ✔ Git working tree is clean
  [3/3] Adding the shared configs
        • Copier asks before replacing each existing config file.
        conflict  eslint.config.js   Overwrite eslint.config.js? [Y/n]
        > Running task: sync-package-json.js vite tailwind
        package.json:
          eslint: 9.0.0 -> 10.11.0
          typescript-eslint: (new) -> 8.71.1
          script lint: added
        > Running task: pnpm install

  ╭─ Shared configs added ───────────────────────────────────────────────╮
  │ Review:  git diff (move project rules under "Local overrides")       │
  │ Fix:     pnpm fix:fmt && pnpm lint && pnpm tsc                        │
  │ Commit:  git add -A && git commit -m "build: adopt phenomenon-configs"│
  │ Later:   pnpm dlx @phenomenon-studio/create-app update               │
  ╰──────────────────────────────────────────────────────────────────────╯
```

After `init`, follow [docs/migrating.md](docs/migrating.md): remove old config files and plugins, then fix what the shared rules report.

### `create-app update`: pull the latest template release

Works in any project created by `create-app` or adopted with `init`, because both have `.copier-answers.yml`. Copier does a **3-way merge**: template changes are applied on top of your local edits. Where both changed the same lines you get `<<<<<<<` conflict markers to resolve.

```bash
pnpm dlx @phenomenon-studio/create-app update            # latest release
pnpm dlx @phenomenon-studio/create-app update --ref v1.4.0
pnpm dlx @phenomenon-studio/create-app update --defaults # no prompts for new questions
```

What you see:

```text
  [1/3] Checking prerequisites
        ✔ uv 0.13.1 · ✔ Node.js 24.22.1 · ✔ pnpm 11.9.0
  [2/3] Reading the project
        template  v1.3.0
        scope     configs
        stack     next
        target    gh:Phenomenon-Studio/phenomenon-configs @ latest release
        ✔ Git working tree is clean
  [3/3] Applying the template update (3-way merge)
        Updating to template version 1.4.0 …                (Copier output)

  ╭─ Update applied ──────────────────────────────────────────╮
  │ Review:   git diff                                        │
  │ Conflicts: git grep -n '^<<<<<<< '                        │
  │ Verify:   pnpm lint && pnpm tsc && pnpm build             │
  │ Commit:   git commit -am "build(template): update"        │
  ╰───────────────────────────────────────────────────────────╯
```

`create-app --help` lists everything and `create-app --version` prints the CLI version. Colors switch off automatically in CI logs and pipes, or when `NO_COLOR` is set.

## Examples

**New Vite admin app with Tailwind + shadcn/ui**

```bash
pnpm dlx @phenomenon-studio/create-app acme-admin --stack vite --styling tailwind
cd acme-admin && cp .env.local.example .env.local && pnpm dev
```

**New Next.js site, pinned to a release**

```bash
pnpm dlx @phenomenon-studio/create-app acme-site --stack next --ref v1.4.0
```

**Existing Next.js project adopts the shared configs**

```bash
cd acme-legacy-site
git switch -c build/adopt-phenomenon-configs
pnpm dlx @phenomenon-studio/create-app init            # answers each overwrite prompt
git diff                                               # keep project rules under "Local overrides"
pnpm fix:fmt && pnpm lint && pnpm tsc
git add -A && git commit -m "build: adopt phenomenon-configs"
```

**Existing Vite + Tailwind project, accept every shared config at once**

```bash
pnpm dlx @phenomenon-studio/create-app init --overwrite  # stylesheet for Tailwind class sorting is detected
```

**Bring a project up to date by hand (no waiting for Monday's PR)**

```bash
git switch -c build/template-update
pnpm dlx @phenomenon-studio/create-app update
git grep -n '^<<<<<<< ' || echo "no conflicts"
pnpm lint && pnpm tsc && pnpm build && git commit -am "build(template): update"
```

**Keep a project-specific rule through updates**

```js
// eslint.config.js, at the end of the array
    // Local overrides only.
    {
        files: ['src/legacy/**'],
        rules: { 'no-console': 'off' }, // legacy logger, removal tracked in #123
    },
]);
```

## Keep a project up to date

| What changed | How it reaches the project |
| --- | --- |
| A lint/TS/format rule, an ESLint or Prettier plugin | Template release → weekly **Template update** PR (`copier update`) |
| A non-extendable file (`.gitignore`, hooks, `vite.config.ts`…) | Template release → weekly **Template update** PR |
| A dependency version (react, next, vite, Node, pnpm…) | Project Renovate PR (shared preset) **or** the template update PR when the platform catalog moved |
| The CI pipeline | Picked up automatically on the next run (`node-ci.yml@v1`); majors need a template update |

The weekly update PR (`.github/workflows/template-update.yml`, Mondays 06:00 UTC, or **Run workflow** by hand) needs no secret. It uses the project's `GITHUB_TOKEN` and starts CI on its branch through `workflow_dispatch`. `GITHUB_TOKEN` can't push `.github/workflows` changes, so those come as a patch in the PR body. Apply it with `git apply` before merging.

Keep project-specific changes under `// Local overrides only.` in each config so updates merge cleanly. [docs/dependency-versions.md](docs/dependency-versions.md) covers how dependency versions flow.

## Troubleshooting

| Message | Fix |
| --- | --- |
| `uvx not found` | `brew install uv`, then open a new terminal |
| `Uncommitted changes. Commit or stash them first` | `git stash` or commit, then rerun `update` |
| `This project already uses the template` | It was adopted already. Use `update` |
| `No package.json in the current directory` | `cd` to the project root before `init` |
| `<<<<<<<` markers after update | Edit each file to keep both intents, remove the markers, rerun `pnpm lint` |
| Template update PR fails to open | Turn on "Allow GitHub Actions to create and approve pull requests" in the repo or org settings |
| `pnpm install` rejects a version as too new | The project enforces a 3-day `minimumReleaseAge`. Wait, or pin an older version |

## What lives where

Each file goes to the first channel that fits:

1. CI pipeline → **reusable workflow** in `.github/workflows/`.
2. Dependency policy → **Renovate preset** in `renovate/`.
3. Everything else, configs included → **Copier template** in `template/`. Tooling every project gets lives in the template root, and the starter app lives in `scope == 'app'` layers.

```text
copier.yml                       # template questions (scope · stack · styling); Copier reads it from the repo root
template/
├─ versions.jinja                # dependency catalog: every version a generated project gets
├─ tooling.jinja                 # tooling devDependencies + scripts per stack/styling (both scopes)
├─ tasks/sync-package-json.js    # scope=configs: merges tooling into the project's own package.json
└─ project/                      # rendered files (_subdirectory)
   ├─ …                          # tooling for every project: eslint/prettier/stylelint/commitlint configs, tsconfig*,
   │                             #   husky, CI, renovate, pnpm-workspace.yaml (+ package.json, .gitignore for scope=app)
   ├─ {{ '.' if scope == 'app' and stack == 'vite' else '' }}/   # vite starter: merged into the root, skipped otherwise
   ├─ {{ '.' if scope == 'app' and stack == 'vite' and styling == 'tailwind' else '' }}/      # shadcn/ui kit, pages
   ├─ {{ '.' if scope == 'app' and stack == 'vite' and styling == 'css-modules' else '' }}/   # CSS Modules kit, pages
   └─ {{ '.' if scope == 'app' and stack == 'next' else '' }}/   # next starter
packages/
└─ create-app/                   # @phenomenon-studio/create-app (public, npmjs.com): create · init · update
examples/                        # generated by Copier, committed, built in CI (workspace members)
├─ answers/<example>.yml
├─ vite/                       # stack=vite, styling=tailwind
├─ vite-css-modules/           # stack=vite, styling=css-modules
└─ next/
.github/workflows/
├─ node-ci.yml                   # reusable: lint · tsc · test · build (projects pin @v1)
├─ template-update.yml           # reusable: scheduled `copier update` → PR (GITHUB_TOKEN only)
├─ template-check.yml            # this repo: lint, example drift, example builds, configs-only test, upgrade test
├─ sync-examples.yml             # re-renders examples/ on Renovate branches
├─ release.yml                   # Changesets → npmjs.com (trusted publishing, no token)
└─ release-template.yml          # tag vX.Y.Z + move vX
renovate/default.json            # shared Renovate preset for projects
renovate.json                    # this repo's Renovate (extends the preset + catalog managers)
```

## For maintainers

### Setup

```bash
pnpm install               # workspace: packages/create-app + examples/*
brew install uv            # examples are rendered with Copier
```

### Everyday commands

```bash
pnpm examples:regen              # re-render examples/ from the working tree
pnpm check                       # lint · typecheck · test · build for every example
pnpm lint:root                   # this repo's scripts and CLI (linted with the config rendered into examples/)
pnpm template:configs-test vite  # bare project + `init` (scope=configs) from the working tree, then fmt/lint/tsc
pnpm template:update-test vite   # render the last vX.Y.Z tag, copier update to HEAD, build
node packages/create-app/bin/create-app.js --help   # run the CLI from source
```

Examples are pnpm workspace members rendered from the working tree, so a change that breaks a stack fails in the same PR. This repo lints and formats itself with the configs rendered into `examples/vite-css-modules`. Every template change must ship with regenerated examples, and CI fails on drift.

### Update dependency versions (any time)

Every version a project gets lives in [`template/versions.jinja`](template/versions.jinja). Renovate opens PRs for it weekly. To update by hand at any time, use pnpm's interactive picker:

```bash
pnpm deps:outdated   # what's behind, across the root and every example
pnpm deps:update     # pnpm update --interactive --latest --recursive, then writes the picks into
                     # template/versions.jinja, re-renders examples/ and refreshes the lockfile
pnpm check           # prove every stack still lints, type-checks and builds
```

`pnpm deps:update` works because the examples are workspace members whose `package.json` is rendered from the catalog. pnpm edits them, and `scripts/catalog-from-examples.js` copies the chosen versions back (`pnpm deps:sync` reruns only that part). If you edit `versions.jinja` by hand, run `pnpm examples:regen && pnpm install`. Versions must be at least 3 days old (`minimumReleaseAge`). `node scripts/pin-mature-versions.js <package.json>` finds the newest version that qualifies.

### Change a config rule

1. Edit the rendered file in `template/project/`, e.g. `eslint.config.js.jinja`, `prettier.config.js.jinja`, `stylelint.config.js.jinja`, `commitlint.config.js`, `tsconfig*.jinja`. A new plugin goes into `template/tooling.jinja` (both scopes) and `template/versions.jinja`.
2. `pnpm examples:regen && pnpm install && pnpm check && pnpm template:configs-test vite && pnpm template:configs-test next`.
3. List every rule change in the PR description. Behaviour never changes silently.
4. After merge, cut a template release ([docs/releasing.md](docs/releasing.md)). Projects get the update PR.

### Rules for changes

- Prefer fewer `copier.yml` questions. Each one doubles what CI must cover.
- Tool versions are pinned in `template/versions.jinja`, never as ranges.
- CLI changes need a changeset (`pnpm changeset`). Template changes ship with a `vX.Y.Z` tag.

See [docs/releasing.md](docs/releasing.md) to ship, [docs/migrating.md](docs/migrating.md) to move an existing project onto the platform, [docs/dependency-versions.md](docs/dependency-versions.md) for version flow, [docs/audit.md](docs/audit.md) for how the original templates were merged, and [MIGRATIONS.md](MIGRATIONS.md) for breaking changes.

## License

[MIT](LICENSE) © Phenomenon Studio
