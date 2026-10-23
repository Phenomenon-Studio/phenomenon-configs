# Migrations

Manual steps for breaking releases, newest first. Each major release adds a section. Copier `_migrations` in `copier.yml` automate file renames and removals.

## Template v1.0.0 / create-app 1.0.0

First release. Shared configs are rendered into projects as plain files. There are no `@phenomenon-studio/*` config packages. Existing projects adopt the platform with [docs/migrating.md](docs/migrating.md).
