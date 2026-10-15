# Releasing

Packages and the template ship on separate lines.

| Artifact | Version source | Tag | Consumers pin |
| --- | --- | --- | --- |
| `@phenomenon-studio/*` | Changesets | `@phenomenon-studio/eslint-config@1.1.0` | exact version (Renovate bumps) |
| Copier template | git tag | `v1.4.0` (Copier ignores other tags) | `_commit` in `.copier-answers.yml` |
| Reusable workflows | same tag + moving major tag | `v1.4.0`, `v1` | `@v1` |
| Renovate preset | default branch | — | always latest |

## Packages

1. In the PR, run `pnpm changeset` and pick the packages and bump types.
2. On merge, `release.yml` opens or updates **chore(release): version packages**. That PR bumps versions, writes changelogs, updates `template/versions.jinja` (`platform`), regenerates `examples/` and refreshes the lockfile.
3. Merging that PR publishes to GitHub Packages from CI. Never publish from a laptop.
4. Projects receive a grouped Renovate PR (`phenomenon platform`). Patch and minor automerge once CI is green.

The catalog now points at the new versions. Cut a template release so new projects and `copier update` pick them up.

## Template and workflows

1. Merge template or workflow changes with regenerated `examples/`. CI enforces this.
2. Actions → **Release template** → `vX.Y.Z`. The workflow validates that the version is greater than the last one, tags it, moves `vX` and creates a GitHub release with generated notes.
3. Projects get a **chore(template): update to vX.Y.Z** PR within a week (Monday 06:00 UTC), or sooner via `workflow_dispatch` / `pnpm dlx @phenomenon-studio/create-app update`.

## Breaking changes

Breaking changes go out as major bumps only.

- Write the steps in [MIGRATIONS.md](../MIGRATIONS.md).
- Template files renamed or removed: add a Copier `_migrations` entry in `copier.yml` so `copier update` handles them.
- Workflow inputs changed incompatibly: release a new major tag (`v2`). The template's `.github/workflows/*.yml` must reference `@v2` in the same release.
- Rule changes: list every one in the PR description, never silently.

## First release checklist

- [ ] Repo created as `Phenomenon-Studio/phenomenon-configs` (private), default branch `main`.
- [ ] Settings → Actions → General → Access: "Accessible from repositories in the organization", so projects can call the reusable workflows.
- [ ] Packages: after the first publish, grant each package's Actions access to project repos (or org-wide read).
- [ ] Org secrets `PLATFORM_TEMPLATE_TOKEN` and `RENOVATE_GITHUB_PACKAGES_TOKEN` (see [dependency-versions.md](dependency-versions.md#renovate-setup-once-per-org)).
- [ ] Owners filled in `.github/CODEOWNERS`.
- [ ] First push to `main` → `release.yml` publishes the unpublished `1.0.0` packages (no changeset needed).
- [ ] Run **Release template** with `v1.0.0`, then `uvx copier copy --trust gh:Phenomenon-Studio/phenomenon-configs /tmp/smoke` works from outside the repo.
