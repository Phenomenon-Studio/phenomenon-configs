# @phenomenon-studio/create-app

Public CLI that adds the Phenomenon Studio shared configs to a project and keeps them updated. It can also create a new project with a starter app. Nothing gets installed into your project: the configs are rendered as plain files (`eslint.config.js`, `prettier.config.js`, `tsconfig*.json`…) that you own and can edit.

It wraps [Copier](https://copier.readthedocs.io) run through `uvx`, so it needs [uv](https://docs.astral.sh/uv/) (`brew install uv`). No tokens or registry setup.

```bash
# New project: starter app + configs
pnpm dlx @phenomenon-studio/create-app my-app [--stack vite|next] [--styling tailwind|css-modules] [--ref v1.4.0]

# Existing project: configs only (run in the project root; stack and styling are detected from package.json)
pnpm dlx @phenomenon-studio/create-app init [--overwrite]

# Pull the latest template release into a project created or adopted above (3-way merge keeps local edits)
pnpm dlx @phenomenon-studio/create-app update [--ref v1.4.0] [--defaults]
```

`init` merges the tooling devDependencies and scripts into your `package.json`. It doesn't replace the file.

The Copier version is pinned in `bin/create-app.js`, and Renovate updates it.

## License

[MIT](LICENSE) © Phenomenon Studio
