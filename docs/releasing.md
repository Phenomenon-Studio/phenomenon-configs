# Releasing

The CLI and the template share one version. `packages/create-app/package.json` is the only version source, managed by Changesets: CLI `1.4.0` and template `v1.4.0` are the same release.

| Artifact | Tag | Consumers pin |
| --- | --- | --- |
| `@phenomenon-studio/create-app` (public, npmjs.com) | `@phenomenon-studio/create-app@1.4.0` | nothing: run with `pnpm dlx` (latest) |
| Copier template (configs, starter, catalog) | `v1.4.0` (Copier ignores other tags) | `_commit` in `.copier-answers.yml` |
| Reusable workflows | `v1.4.0` + moving major **branch** `v1` (a tag would be read by Copier as a version) | `@v1` |
| Renovate preset | default branch | always latest |

## Release

1. In every PR that should reach projects (CLI, template, rules, catalog, reusable workflows), run `pnpm changeset`, pick `@phenomenon-studio/create-app` and the bump type, and describe the change. Template-only changes bump the CLI version too. Merge with regenerated `examples/` (CI enforces this).
2. On merge, `release.yml` opens or updates **build(release): version packages**. That PR bumps the version and writes the changelog.
3. Merging that PR runs `release.yml`, which:
    - publishes the CLI to npmjs.com through npm trusted publishing (GitHub OIDC). No npm token is stored. Never publish from a laptop, except the first publish.
    - tags the template `vX.Y.Z` on the same commit, moves the `vX` branch and creates the GitHub release from the changelog.
4. Projects get a **build(template): update to vX.Y.Z** PR within a week (Monday 06:00 UTC), or sooner via `workflow_dispatch` / `pnpm dlx @phenomenon-studio/create-app update`.

## Breaking changes

Breaking changes go out as major bumps only.

- Write the steps in [MIGRATIONS.md](../MIGRATIONS.md).
- Template files renamed or removed: add a Copier `_migrations` entry in `copier.yml` so `copier update` handles them.
- Workflow inputs changed incompatibly: release a new major (`v2` branch). The template's `.github/workflows/*.yml` must reference `@v2` in the same release. The update PR can't push workflow file changes with `GITHUB_TOKEN`, so it puts them in the PR body as a patch. Call that out in the release notes.
- Rule changes: list every one in the PR description, never silently.

## First release checklist

- [x] Repo `Phenomenon-Studio/phenomenon-configs` is public, default branch `main`. Anyone can run Copier against it and call the reusable workflows. No tokens needed.
- [ ] npm org `phenomenon-studio` exists on npmjs.com.
- [ ] First publish by an org member, by hand: `cd packages/create-app && npm publish --access public`. npm only allows trusted publishing on a package that already exists.
- [ ] npmjs.com → `@phenomenon-studio/create-app` → Settings → Trusted publishing → GitHub Actions: `Phenomenon-Studio/phenomenon-configs`, workflow `release.yml`. Then disallow token publishing for the package.
- [ ] Owners filled in `.github/CODEOWNERS`.
- [ ] Merge the first version PR, then `pnpm dlx @phenomenon-studio/create-app /tmp/smoke` works from any machine.
- [ ] In project repos (or org-wide): Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests", for the template update PR.
