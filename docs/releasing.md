# Releasing

The CLI and the template ship on separate lines.

| Artifact | Version source | Tag | Consumers pin |
| --- | --- | --- | --- |
| `@phenomenon-studio/create-app` (public, npmjs.com) | Changesets | `@phenomenon-studio/create-app@1.1.0` | nothing: run with `pnpm dlx` (latest) |
| Copier template (configs, starter, catalog) | git tag | `v1.4.0` (Copier ignores other tags) | `_commit` in `.copier-answers.yml` |
| Reusable workflows | same tag + moving major **branch** (a tag would be read by Copier as a version) | `v1.4.0`, `v1` | `@v1` |
| Renovate preset | default branch | — | always latest |

Config rule changes are template changes. They ship with a `vX.Y.Z` tag and reach projects as a template update PR. No package needs publishing.

## CLI

1. In the PR, run `pnpm changeset` and pick the bump type.
2. On merge, `release.yml` opens or updates **chore(release): version packages**. That PR bumps the version and writes the changelog.
3. Merging that PR publishes to npmjs.com from CI through npm trusted publishing (GitHub OIDC). No npm token is stored. Never publish from a laptop, except the first publish.

## Template and workflows

1. Merge template or workflow changes with regenerated `examples/`. CI enforces this.
2. Actions → **Release template** → `vX.Y.Z`. The workflow validates that the version is greater than the last one, tags it, moves the `vX` branch and creates a GitHub release with generated notes.
3. Projects get a **chore(template): update to vX.Y.Z** PR within a week (Monday 06:00 UTC), or sooner via `workflow_dispatch` / `pnpm dlx @phenomenon-studio/create-app update`.

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
- [ ] Run **Release template** with `v1.0.0`, then `pnpm dlx @phenomenon-studio/create-app /tmp/smoke` works from any machine.
- [ ] In project repos (or org-wide): Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests", for the template update PR.
