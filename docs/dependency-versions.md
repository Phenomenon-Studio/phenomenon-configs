# Dependency versions

Every version a generated project starts with is written once, in [`template/versions.jinja`](../template/versions.jinja). Rendered files read from it: `package.json` (dependencies, `packageManager`, `engines`), `.nvmrc` and the CI workflows. Projects then keep versions current through two channels that share one policy, [`renovate/default.json`](../renovate/default.json).

## Where a version is defined

| Dependency | Defined in | Updated by |
| --- | --- | --- |
| ESLint/Prettier/Stylelint plugins, typescript-eslint, configs | `packages/*/package.json` `dependencies` | Renovate in this repo → package release |
| `@phenomenon-studio/*` in projects | `versions.jinja` → `platform` (written by script) | `pnpm version-packages` on release |
| Framework/runtime deps (react, next, vite, zod…) | `versions.jinja` → `npm` | Renovate custom manager (`renovate.json`) |
| Node.js major (`.nvmrc`, `engines.node`) | `versions.jinja` → `runtime.node` | Renovate custom manager (`node-version`) |
| pnpm (`packageManager`, `engines.pnpm`) | `versions.jinja` → `runtime.pnpm` | Renovate custom manager |
| Copier (create-app CLI, template-update workflow) | `// renovate: datasource=pypi depName=copier` comments | Renovate custom manager |
| GitHub Actions in reusable workflows | `.github/workflows/*.yml` | Renovate `github-actions` manager |

The tools themselves (`eslint`, `prettier`, `stylelint`, `typescript`, `@commitlint/cli`) stay direct dependencies of each project, because their binaries must resolve from the project. The config packages declare them as wide `peerDependencies`.

## How a version change travels

```text
                      ┌──────────────── this repo ─────────────────┐            ┌──────── project ────────┐
Renovate PR ─────────▶ template/versions.jinja                      │
                      │   sync-examples.yml re-renders examples/    │
                      │   template-check builds both stacks         │
                      │   merge → release-template (vX.Y.Z)         │──copier──▶ Template update PR
                      └─────────────────────────────────────────────┘  update   (package.json, .nvmrc…)

Renovate PR ─────────▶ packages/*/package.json (plugin bump)
                      │   changeset → "Version packages" PR         │
                      │   sync-template-versions → versions.jinja   │──npm────▶ Renovate PR
                      └─────────────────────────────────────────────┘  publish  (@phenomenon-studio/* group)

                                                                         Renovate ▶ project's own deps
                                                                         (shared preset: same groups,
                                                                          3-day release age, schedule)
```

- **New projects** always start from the catalog at the template tag they were created from.
- **Existing projects** get catalog moves through the weekly template update PR, or earlier through their own Renovate. Both edit the same `package.json` lines. When Renovate already moved a dependency to the same version, Copier's 3-way merge sees identical edits and applies nothing. When the versions differ, the PR shows a conflict on that line. Keep the newer version.
- **Config packages** never need a template update. A rule or plugin change is a package release, and the Renovate group `phenomenon platform` automerges patch and minor.

## Adding or changing a dependency in the template

1. Add the line to `versions.jinja` (`"name": "x.y.z"`, one per line, keep alphabetical order).
2. Reference it from `template/project/package.json.jinja` with `{{ dep('name') }}`.
3. `pnpm examples:regen && pnpm install && pnpm check`.
4. Commit the template, the regenerated examples and `pnpm-lock.yaml` together.

Use a version at least 3 days old. Generated projects install with `minimumReleaseAge: 4320`, and a fresher pin fails `pnpm install`. `node scripts/pin-mature-versions.js <package.json>` finds the newest version old enough.

## Renovate setup (once per org)

- Install the Renovate GitHub app for the org, or run it self-hosted.
- Add the org secret `RENOVATE_GITHUB_PACKAGES_TOKEN` (a PAT with `read:packages`) to the Renovate app's encrypted secrets, so it can resolve `@phenomenon-studio/*` on GitHub Packages.
- Add the org secret `PLATFORM_TEMPLATE_TOKEN` (fine-grained PAT: read `phenomenon-configs`; contents and pull requests write on project repos) for the template update workflow.
