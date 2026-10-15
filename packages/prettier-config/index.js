import { fileURLToPath } from 'node:url';

export const resolvePlugin = (name) => {
    return fileURLToPath(import.meta.resolve(name));
};

/**
 * Plugins are passed as absolute paths, not names: Prettier resolves plugin names from the project root, where they are
 * not installed (they are dependencies of this package). prettier-plugin-tailwindcss still detects and chains the
 * import sorter from its path.
 *
 * @type {import("prettier").Config}
 */
export default {
    printWidth: 120,
    proseWrap: 'never',
    arrowParens: 'always',
    endOfLine: 'lf',
    trailingComma: 'es5',
    tabWidth: 4,
    singleQuote: true,
    overrides: [
        {
            files: ['**/*.css', '**/*.html', '**/*.svg'],
            options: {
                singleQuote: false,
            },
        },
    ],
    plugins: [resolvePlugin('@ianvs/prettier-plugin-sort-imports')],
    // One order for every stack; framework-specific groups (`next`, `@/providers`, `@/context`, `@/icons`) are no-ops
    // where a project has no such imports.
    importOrder: [
        '<TYPES>(react)',
        '<TYPES>(next)',
        '<TYPES>',
        '<TYPES>^@/',
        '<TYPES>^[./]',
        '^react$',
        '^react-dom',
        '^next',
        '<BUILTIN_MODULES>',
        '<THIRD_PARTY_MODULES>',
        '^@/lib',
        '^(@/lib/constants|@/lib/schemas|@/lib/regexps|@/lib/utils)(/.*)$',
        '^(@/hooks|@/context|@/providers)(/.*)$',
        '^@/services',
        '^@/modules',
        '^@/components',
        '^@/components/layouts',
        '^@/components/ui',
        '^@/icons',
        '^[./].*/lib',
        '^[./].*/constants',
        '^[./].*/schemas',
        '^[./].*/regexps',
        '^[./].*/regexes',
        '^[./].*/api',
        '^[./].*/utils',
        '^[./].*/context',
        '^[./].*/providers',
        '^[./].*/hooks',
        '^[./].*/components',
        '^[./].*/components/layouts',
        '^[./]',
        '\\.css$',
        '^[./].*/public/',
    ],
    importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
    importOrderTypeScriptVersion: '5.0.0',
};
