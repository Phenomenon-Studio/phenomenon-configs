import config from '@phenomenon-studio/prettier-config/tailwind';

/** @type {import("prettier").Config} */
export default {
    ...config,
    tailwindStylesheet: './src/styles/index.css',
};
