# Admin dashboard template

## ⚙️ Main tech stack

- **[Vite](https://vitejs.dev)** - Lightning-fast build tool with HMR;
- **[React](https://react.dev)** - Core framework with compiler optimizations;
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe development with strict mode;
- **[TanStack Router](https://tanstack.com/router/latest)** - Type-safe, file-based routing with code-splitting;
- **[TanStack Query](https://tanstack.com/query/latest)** - Powerful async state management;
- **[TanStack Form](https://tanstack.com/form/latest)** - Type-safe form state management;
- **[CSS Modules](https://github.com/css-modules/css-modules)** - Locally scoped component styles;
- **[Base UI](https://base-ui.com/react/overview/quick-start)** - Unstyled, accessible components;
- **[Ky](https://github.com/sindresorhus/ky)** - Modern HTTP client;
- **[Zod](https://zod.dev)** - TypeScript-first schema validation;
- **[Lucide React](https://lucide.dev/guide/packages/lucide-react)** - Icon library;
- **[ESLint](https://eslint.org)** - JavaScript/TypeScript linting;
- **[Prettier](https://prettier.io)** - Code formatting;
- **[StyleLint](https://stylelint.io)** - CSS linting;
- **[Husky](https://typicode.github.io/husky)** - Git hooks;
- **[Knip](https://knip.dev)** - Unused dependency detection;
- **[MSW](https://mswjs.io/docs)** - Mock Service Worker (MSW) is an API mocking library for browser and Node.js;

## 🚀 Quick start

1. Ensure [node](https://nodejs.org) >= 24 and [pnpm](https://pnpm.io) >= 11 are installed on your machine;
2. Install the dependencies by running `pnpm i`;
3. Create a `.env.local` file and add the required variables. Use `.env.local.example` as a reference;
4. **Local development only.** Run the post-install setup (Git hooks, etc.) with `pnpm prepare` - it isn't run automatically, because `ignoreScripts` is enabled in `pnpm-workspace.yaml`;

## 🤖 Commands

- Runs the local dev server at `localhost:9777`:
    ```
    pnpm dev:vite
    ```
- Runs the local dev server at `localhost:9777` in the scan mode:
    ```
    pnpm dev:vite:scan
    ```
- Runs `tsc` CLI in watch mode:
    ```
    pnpm dev:tsc
    ```
- Runs the local dev server and `tsc` together:
    ```
    pnpm dev
    ```
- Runs the local dev server in the scan mode and `tsc` together:
    ```
    pnpm dev:scan
    ```
- Builds your production site to `./dist/`:
    ```
    pnpm build
    ```
- Previews your build locally, before deploying at `localhost:9111`:
    ```
    pnpm preview
    ```
- Runs `tsc` CLI:
    ```
    pnpm tsc
    ```
- Checks your JavaScript/TypeScript for errors and warnings:
    ```
    pnpm lint:eslint
    ```
- Checks your CSS for errors and warnings:
    ```
    pnpm lint:stylelint
    ```
- Checks your code formatting:
    ```
    pnpm lint:fmt
    ```
- Checks your code all together:
    ```
    pnpm lint
    ```
- Fixes your code formatting:
    ```
    pnpm fix:fmt
    ```
- Finds and fixes unused dependencies, exports and files:
    ```
    pnpm knip
    ```
- Runs post-install setup (Git hooks, etc.):
    ```
    pnpm prepare
    ```

## 🧩 Shared configuration and updates

This project was generated from [phenomenon-configs](https://github.com/Phenomenon-Studio/phenomenon-configs).

- ESLint, TypeScript, Prettier, Stylelint and commitlint configs extend `@phenomenon-studio/*` packages. Add only
  project-specific overrides locally. Rule changes arrive as a grouped Renovate PR.
- CI runs the shared `node-ci.yml@v1` workflow ([.github/workflows/ci.yml](.github/workflows/ci.yml)).
- Template files (this README, hooks, `.gitignore`, build configs…) are updated by a weekly **Template update** PR,
  or by hand with `pnpm dlx @phenomenon-studio/create-app update`. Keep `.copier-answers.yml` committed and never
  edit it by hand.
- Installing `@phenomenon-studio/*` packages needs a GitHub token with `read:packages`:
  `echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc`.

## 🧶 Structure

### Core application structure

- `src/components` - contains shared components with business logic. These are reusable components that may include some business logic. Each component should consist of:
    - `index.tsx` - the component file itself;
    - `styles.module.css` - styles of component file. component styles (CSS Modules);
    - `types.ts` - types of component file (optional);
    - `hooks` - contains component hooks dir (optional). Should consist of:
        - `<hookName>.ts` - the hook file itself;
    - `constants.ts` - constants of component file (optional);
    - `utils` - utils dir of component file (optional). Should consist of:
        - `<utilName>.ts` - the util file itself;
    - `schemas.ts` - schemas of component file (optional);
    - `regexps.ts` - regexps of component file (optional);
    - `context` - the context dir of component file (optional). Should consist of:
        - `<ContextName>.tsx` - the context file itself;
    - `components` - the components dir of components (optional). Should consist of like `src/components`;

- `src/components/layouts` - contains layout components for different application layouts. Each layout component should:
    - have same structure as `src/components` has;
    - include `<Outlet />` as a child of component;

- `src/components/ui` - contains basic UI components without business logic like button, input etc. Each component should consist of that files:
    - `index.tsx` - the component file itself;
    - `styles.module.css` - styles of component file. component styles (CSS Modules);
    - `types.ts` - types of component file (optional);
    - `hooks` - contains component hooks dir (optional). Should consist of:
        - `<hookName>.ts` - the hook file itself;
    - `constants.ts` - constants of component file (optional);
    - `schemas.ts` - schemas of component file (optional);
    - `regexps.ts` - regexps of component file (optional);
    - `utils` - utils dir of component file (optional). Should consist of:
        - `<utilName>.ts` - the util file itself;

- `src/modules` - contains independent features that have their own area of responsibility. These features can fetch data and have complete business logic. Each module should consist of:
    - `index.tsx` - the component file itself;
    - `styles.module.css` - styles of component file. component styles (CSS Modules);
    - `types.ts` - types of component file (optional);
    - `hooks` - contains component hooks dir (optional). Should consist of:
        - `<hookName>.ts` - the hook file itself;
    - `constants.ts` - constants of component file (optional);
    - `utils` - utils dir of component file (optional). Should consist of:
        - `<utilName>.ts` - the util file itself;
    - `schemas.ts` - schemas of component file (optional);
    - `regexps.ts` - regexps of component file (optional);
    - `context` - the context dir of component file (optional). Should consist of:
        - `<ContextName>.tsx` - the context file itself;
    - `components` - the components dir of components (optional). Should consist of like `src/components`;

### Routing & navigation

- `src/routes` - application route definitions using Tanstack Router with file-based routing. Should contain `src/modules` and may have other route-specific components. Read more [here](https://tanstack.com/router/latest/docs/framework/react/overview);

### Services & API layer

- `src/services` - contains service layer for API calls and external integrations:
    - `<serviceName>/` - service directories organized by feature or domain;

### Application configuration & utilities

- `src/lib` - contains core application utilities and configurations:
    - `@http.ts` - HTTP client configuration and utilities;
    - `@queryClient.ts` - Tanstack Query client configuration;
    - `constants.ts` - global application constants;
    - `schemas.ts` - global validation schemas;
    - `regexps.ts` - global regular expressions;
    - `types.ts` - global TypeScript type definitions;
    - `utils/` - global utility functions directory:
        - `<utilDirName>/` - directory for grouped utility functions (optional);
        - `<utilName>.ts` - individual utility files;

### Global application files

- `src/hooks` - contains global hooks directory:
    - `<hookName>.ts` - global hook files;

- `src/context` - global React context providers:
    - `<ContextName>.tsx` - global context files;

- `src/styles` - contains global style files:
    - `index.css` - the main CSS file;

- `src/main.tsx` - entry point of the application;
- `src/vite-env.d.ts` - Vite environment type definitions. This file should be updated every time you add new environment variables;
- `src/routeTree.gen.ts` - auto-generated route tree file (do not edit manually);
- `src/mocks` - Mock Service Worker (MSW) configuration and request handlers:
    - `handlers.ts` - the request handlers file;
    - `browser.ts` - MSW browser service worker setup;
    - `src/mocks/api` contains mock api. Should consist of:
        - `<api>.ts` - the mock api file itself;
- `public/` - can contain static files such as images, fonts, videos, documents, favicons, etc.;

#### Build and output directories

- `dist/` - production build output directory (generated after `pnpm build`);
- `tmp/` - temporary files directory containing:
    - `bundle-visualizer.html` - bundle size analysis report (generated after build with rollup-plugin-visualizer);

#### Configuration files

- `index.html` - main HTML template file with meta tags, font loading, and root div element;
- `vite.config.ts` - Vite configuration including plugins, build settings, and dev server options;
- `tsconfig.json` - main TypeScript configuration;
- `tsconfig.app.json` - TypeScript configuration for application code;
- `tsconfig.node.json` - TypeScript configuration for Node.js (Vite config);
- `package.json` - project dependencies, scripts, and metadata;
- `pnpm-lock.yaml` - exact dependency versions lock file;
- `pnpm-workspace.yaml` - pnpm workspace and install configuration;

#### Linting and formatting configuration

- `eslint.config.js` - ESLint configuration for JavaScript/TypeScript linting;
- `prettier.config.js` - Prettier configuration for code formatting;
- `.prettierignore` - files and directories to ignore during Prettier formatting;
- `stylelint.config.js` - Stylelint configuration for CSS linting (extends `@phenomenon-studio/stylelint-config`);

#### Git and development configuration

- `.gitignore` - Git ignore rules specifying which files to exclude from version control;
- `.gitattributes` - Git attributes configuration for line endings and file handling;
- `.husky/` - Git hooks directory for pre-commit and commit-msg validation;
- `commitlint.config.js` - commit message linting configuration;

#### Editor and environment configurations

- `.editorconfig` - editor configuration for consistent coding styles;
- `.env.local.example` - example environment variables file (template for `.env.local`);
- `.env.local` - local environment variables (should be created manually, not committed to git);
