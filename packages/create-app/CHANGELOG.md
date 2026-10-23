# @phenomenon-studio/create-app

## 1.0.1

### Patch Changes

- [`a711a94`](https://github.com/Phenomenon-Studio/phenomenon-configs/commit/a711a94c9a5df4336482c0b6a6668c915ea22952) Thanks [@m-kolomoyets](https://github.com/m-kolomoyets)! - Fix "Validation error for question 'project_name'" when creating a project: the package name now comes from the directory (or is asked). Running `create-app` with no arguments starts an interactive wizard, and missing `--stack` / `--styling` are picked from arrow-key radio lists.
