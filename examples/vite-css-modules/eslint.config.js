import vite from '@phenomenon-studio/eslint-config/vite';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    ...vite,
    // Local overrides only.
]);
