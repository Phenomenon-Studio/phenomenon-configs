import next from '@phenomenon-studio/eslint-config/next';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    ...next,
    // Local overrides only.
]);
