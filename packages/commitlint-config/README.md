# @phenomenon-studio/commitlint-config

Conventional Commits with the team's limits: header ≤ 100, body lines ≤ 200, lower-case types and scopes.

```js
// commitlint.config.js
export { default } from '@phenomenon-studio/commitlint-config';
```

```sh
# .husky/commit-msg
pnpm exec commitlint --edit
```
