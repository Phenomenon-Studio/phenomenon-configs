# Dependency versions

Every version a generated project starts with is written once, in [`template/versions.jinja`](../template/versions.jinja). Rendered files read from it: `package.json` (dependencies, `packageManager`, `engines`), `.nvmrc` and the CI workflows. Projects then keep versions current through two channels that share one policy, [`renovate/default.json`](../renovate/default.json).

## Where a version is defined

| Dependency | Defined in | Updated by |
| --- | --- | --- |
| Framework/runtime deps (react, next, vite, zod…) | `versions.jinja` → `npm` | Renovate custom manager (`renovate.json`) |
| Lint/format tools and plugins (eslint, typescript-eslint, prettier plugins, stylelint-config-standard…) | `versions.jinja` → `npm`, listed per stack in [`tooling.jinja`](../template/tooling.jinja) | Renovate custom manager |
| Node.js major (`.nvmrc`, `engines.node`) | `versions.jinja` → `runtime.node` | Renovate custom manager (`node-version`) |
| pnpm (`packageManager`, `engines.pnpm`) | `versions.jinja` → `runtime.pnpm` | Renovate custom manager |
| Copier (create-app CLI, template-update workflow) | `// renovate: datasource=pypi depName=copier` comments | Renovate custom manager |
| GitHub Actions in reusable workflows | `.github/workflows/*.yml` | Renovate `github-actions` manager |

Projects have no shared config package to install. The configs are plain files rendered by the template, and every tool and plugin they load is a direct devDependency of the project.

## How a version change travels

```text
                      ┌──────────────── this repo ─────────────────┐            ┌──────── project ────────┐
Renovate PR ─────────▶ template/versions.jinja                      │
Rule change ─────────▶ template/project/*.config.js                 │
                      │   sync-examples.yml re-renders examples/    │
                      │   template-check builds both stacks         │
                      │   merge → release-template (vX.Y.Z)         │──copier──▶ Template update PR
                      └─────────────────────────────────────────────┘  update   (tooling files, tooling deps)

                                                                         Renovate ▶ project's own deps
                                                                         (shared preset: same groups,
                                                                          3-day release age, schedule)
```

- **New projects** always start from the catalog at the template tag they were created from.
- **Existing projects** get rule changes and **tooling** catalog moves through the weekly template update PR. Updates never re-render `package.json`: the Copier migration [`template/tasks/sync-package-json.js`](../template/tasks/sync-package-json.js) sets the tooling devDependencies to the catalog versions and adds missing scripts, in both scopes. Runtime dependencies (react, next, vite…) move only through the project's own Renovate.
- **Configs-only projects** (`scope=configs`) never get `package.json` from the template. The same script merges the tooling into it on `init`.

## Adding or changing a dependency in the template

1. Add the line to `versions.jinja` (`"name": "x.y.z"`, one per line, keep alphabetical order).
2. Reference it from `template/project/{% if scope == 'app' %}package.json{% endif %}.jinja` with `{{ dep('name') }}`, or add tooling the configs load to `template/tooling.jinja`, which reaches both scopes.
3. `pnpm examples:regen && pnpm install && pnpm check`.
4. Commit the template, the regenerated examples and `pnpm-lock.yaml` together.

Use a version at least 3 days old. This repo installs with `minimumReleaseAge: 4320`, and a fresher pin fails `pnpm install` here. Generated projects only require 60 minutes, because catalog versions are vetted here first. `node scripts/pin-mature-versions.js <package.json>` finds the newest version old enough.

## Renovate setup (once per org)

- Install the Renovate GitHub app for the org, or run it self-hosted. Everything resolves from public registries, so it needs no secrets.
