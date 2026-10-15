import base from '@phenomenon-studio/eslint-config/base';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['templates-examples/**', 'template/**', 'examples/**', '**/test/fixture/**']),
    ...base,
    {
        // CLI scripts and smoke tests report through stdout.
        files: ['scripts/**', 'packages/*/test/**', 'packages/create-app/bin/**'],
        rules: {
            'no-console': 'off',
        },
    },
]);
