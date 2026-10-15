import base, { resolvePlugin } from './index.js';

/**
 * Base config + Tailwind class sorting. The Tailwind plugin must be last.
 *
 * @type {import("prettier").Config}
 */
export default {
    ...base,
    plugins: [...base.plugins, resolvePlugin('prettier-plugin-tailwindcss')],
};
