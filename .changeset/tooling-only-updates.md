---
'@phenomenon-studio/create-app': minor
---

`update` runs Copier with `--skip-tasks` (the update steps now run as template migrations), which fixes updates of projects adopted with `init`. `create` and `init` fail loudly if Copier did not write `.copier-answers.yml`.
