# @phenomenon-studio/prettier-config

120 columns, 4 spaces, single quotes (double in CSS/HTML/SVG), import sorting with `@ianvs/prettier-plugin-sort-imports`. The `/tailwind` entry adds `prettier-plugin-tailwindcss`.

```json
// package.json — no Tailwind
{ "prettier": "@phenomenon-studio/prettier-config" }
```

```js
// prettier.config.js — Tailwind v4 (point at the CSS file that imports tailwindcss)
import config from '@phenomenon-studio/prettier-config/tailwind';

export default { ...config, tailwindStylesheet: './src/styles/index.css' };
```

Plugins are referenced by absolute path, so they resolve from this package instead of the project.
