import eslintPluginTanstackQuery from '@tanstack/eslint-plugin-query';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['src/**/*.{ts,tsx}'],
        extends: [eslintPluginTanstackQuery.configs['flat/recommended-strict']],
    },
]);
