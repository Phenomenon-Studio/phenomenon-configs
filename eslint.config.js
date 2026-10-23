import { defineConfig, globalIgnores } from 'eslint/config';
// This repo lints itself with the config the template renders (examples/ is regenerated from template/).
import shared from './examples/vite-css-modules/eslint.config.js';

export default defineConfig([
    globalIgnores(['templates-examples/**', 'template/project/**', 'examples/**']),
    ...shared,
    {
        // CLI scripts and tasks report through stdout.
        files: ['scripts/**', 'template/tasks/**', 'packages/create-app/bin/**'],
        rules: {
            'no-console': 'off',
        },
    },
]);
