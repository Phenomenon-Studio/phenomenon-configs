import eslintPluginTanstackRouter from '@tanstack/eslint-plugin-router';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['src/**/*.{ts,tsx}'],
        extends: [eslintPluginTanstackRouter.configs['flat/recommended']],
        rules: {
            '@tanstack/router/create-route-property-order': 'warn',
        },
    },
]);
