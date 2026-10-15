# @phenomenon-studio/create-app

npm wrapper around [Copier](https://copier.readthedocs.io), run through `uvx`, so frontend developers never install Python tools by hand. It needs [uv](https://docs.astral.sh/uv/) (`brew install uv`).

```bash
pnpm dlx @phenomenon-studio/create-app my-app [--stack vite|next] [--ref v1.4.0]
pnpm dlx @phenomenon-studio/create-app update [--ref v1.4.0] [--defaults]   # inside a project
```

The Copier version is pinned in `bin/create-app.js`, and Renovate updates it.

`--styling` (Vite only): `tailwind` (Tailwind v4 + shadcn/ui, default) or `css-modules` (CSS Modules + Base UI).
