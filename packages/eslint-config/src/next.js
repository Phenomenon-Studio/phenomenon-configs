import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig, globalIgnores } from 'eslint/config';
import base from './base.js';
import react from './react.js';
import tanstackQuery from './tanstack-query.js';

/** Next.js App Router with TanStack Query. */
export default defineConfig([
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
    ...base,
    ...react,
    ...tanstackQuery,
    {
        files: ['**/*.{js,jsx,ts,tsx,cjs,mjs}'],
        extends: [nextPlugin.configs['core-web-vitals']],
    },
]);
