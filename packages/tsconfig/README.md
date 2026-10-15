# @phenomenon-studio/tsconfig

Strict TypeScript 6 configs: `base.json` → `react.json` → `vite.json` / `next.json`, plus `node.json` for tooling files.

`paths`, `include`, `rootDir` and `tsBuildInfoFile` resolve relative to the file that declares them. Keep them in the project.

```jsonc
// Vite: tsconfig.json = { "files": [], "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }] }
// tsconfig.app.json
{
    "extends": "@phenomenon-studio/tsconfig/vite.json",
    "compilerOptions": {
        "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
        "rootDir": "./src",
        "paths": { "@/*": ["./src/*"] }
    },
    "include": ["src"]
}
// tsconfig.node.json
{
    "extends": "@phenomenon-studio/tsconfig/node.json",
    "compilerOptions": { "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo" },
    "include": ["vite.config.ts", "eslint.config.js", "prettier.config.js", "stylelint.config.js", "commitlint.config.js"]
}
```

```jsonc
// Next.js: tsconfig.json
{
    "extends": "@phenomenon-studio/tsconfig/next.json",
    "compilerOptions": { "paths": { "@/*": ["./src/*"] } },
    "include": ["next-env.d.ts", ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "**/*.ts", "**/*.tsx"],
    "exclude": ["node_modules"],
}
```

`react.json` pins `lib` to ES2022, the API ceiling of the Vite 8 / Next 16 browser baseline. Raise it only together with `ecmaVersion` in `@phenomenon-studio/eslint-config`, and only when the browser baseline moves.
