import { defineConfig, globalIgnores } from 'eslint/config';
import base from './base.js';
import react from './react.js';
import tanstackQuery from './tanstack-query.js';
import tanstackRouter from './tanstack-router.js';

/** Vite + React SPA with TanStack Router and TanStack Query. */
export default defineConfig([
    globalIgnores(['src/routeTree.gen.ts', 'public/mockServiceWorker.js']),
    ...base,
    ...react,
    ...tanstackQuery,
    ...tanstackRouter,
]);
