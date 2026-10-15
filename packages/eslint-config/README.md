# @phenomenon-studio/eslint-config

ESLint 10 flat configs. Each stack entry builds on `base`, so a fix in `base` reaches every stack.

| Entry | Contents |
| --- | --- |
| `base` | `@eslint/js` + `typescript-eslint` recommended, Prettier, `@stylistic/max-len`, shared rules, Node globals for tooling files |
| `react` | `react-hooks`, `@eslint-react`, `jsx-a11y-x`, function-declaration components, named effect callbacks (`src/**`) |
| `tanstack-query` | `@tanstack/eslint-plugin-query` `flat/recommended-strict` |
| `tanstack-router` | `@tanstack/eslint-plugin-router` `flat/recommended` |
| `vite` | base + react + tanstack-query + tanstack-router, ignores generated route tree and MSW worker |
| `next` | base + react + tanstack-query + `@next/eslint-plugin-next` `core-web-vitals` |

Plugins are dependencies of this package. Projects install only `eslint`, `prettier` and `typescript`.

```js
// eslint.config.js — Vite
import vite from '@phenomenon-studio/eslint-config/vite';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    ...vite,
    // Local overrides only.
]);
```

```js
// eslint.config.js — Next.js
import next from '@phenomenon-studio/eslint-config/next';
import { defineConfig } from 'eslint/config';

export default defineConfig([...next]);
```

```js
// eslint.config.js — custom composition
import { base, react, tanstackQuery } from '@phenomenon-studio/eslint-config';

export default [...base, ...react, ...tanstackQuery];
```

`react`, `tanstack-query` and `tanstack-router` carry no parser of their own. Always combine them with `base`.
