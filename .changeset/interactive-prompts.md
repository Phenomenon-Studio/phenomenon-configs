---
'@phenomenon-studio/create-app': patch
---

Fix "Validation error for question 'project_name'" when creating a project: the package name now comes from the directory (or is asked). Running `create-app` with no arguments starts an interactive wizard, and missing `--stack` / `--styling` are picked from arrow-key radio lists.
