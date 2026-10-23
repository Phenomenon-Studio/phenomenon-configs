import eslintReact from '@eslint-react/eslint-plugin';
import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import eslintPluginStylistic from '@stylistic/eslint-plugin';
import eslintPluginTanstackQuery from '@tanstack/eslint-plugin-query';
import eslintPluginJSXA11yX from 'eslint-plugin-jsx-a11y-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Shared rules come from the phenomenon-configs template and update with `copier update`. Add project-specific
// changes under "Local overrides" at the end, so template updates merge cleanly.

/** @param {string} hook */
const namedCallback = (hook) => {
    const message = `Use a named function for ${hook} callbacks for better debugging and readability.`;

    return [
        { selector: `CallExpression[callee.name="${hook}"] > ArrowFunctionExpression`, message },
        {
            selector: `CallExpression[callee.object.name="React"][callee.property.name="${hook}"] > ArrowFunctionExpression`,
            message,
        },
    ];
};

const componentDeclaration =
    'Define named components as function declarations (`function Foo() {}`), not arrow/function expressions.';

export default defineConfig([
    globalIgnores([
        '**/node_modules/**',
        '**/dist/**',
        '**/tmp/**',
        '**/coverage/**',
        '**/storybook-static/**',
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),
    {
        files: ['**/*.{js,jsx,ts,tsx,cjs,mjs}'],
        extends: [eslint.configs.recommended, tseslint.configs.recommended, eslintPluginPrettierRecommended],
        plugins: {
            '@stylistic': eslintPluginStylistic,
        },
        rules: {
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-import-type-side-effects': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
            'arrow-body-style': ['error', 'always'],
            'no-nested-ternary': ['error'],
            eqeqeq: ['error', 'always'],
            'no-alert': ['error'],
            'no-unneeded-ternary': ['error'],
            'require-await': ['error'],
            '@stylistic/max-len': [
                'error',
                {
                    code: 120,
                    ignoreUrls: true,
                    ignoreRegExpLiterals: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                },
            ],
            'no-loop-func': ['error'],
            'no-unused-vars': 'off',
            'no-unused-expressions': 'off',
            'no-console': ['warn'],
            'no-debugger': ['error'],
            'max-nested-callbacks': [
                'error',
                {
                    max: 7,
                },
            ],
            'no-var': ['error'],
            'no-control-regex': ['off'],
        },
    },
    {
        // Tooling files (configs, scripts) run in Node.
        files: ['**/*.{js,ts,cjs,mjs}'],
        ignores: ['src/**'],
        languageOptions: {
            ecmaVersion: 2025,
            globals: globals.node,
        },
    },
    {
        // React application source.
        files: ['src/**/*.{ts,tsx}'],
        extends: [
            eslintPluginReactHooks.configs.flat.recommended,
            eslintReact.configs['recommended-typescript'],
            eslintPluginJSXA11yX.configs.recommended,
            eslintPluginTanstackQuery.configs['flat/recommended-strict'],
        ],
        settings: {
            'react-x': {
                version: 'detect',
            },
        },
        rules: {
            'no-restricted-syntax': [
                'error',
                ...namedCallback('useEffect'),
                ...namedCallback('useLayoutEffect'),
                ...namedCallback('useImperativeHandle'),
                {
                    selector: 'VariableDeclarator[id.name=/^[A-Z]/] > ArrowFunctionExpression',
                    message: componentDeclaration,
                },
                {
                    selector: 'VariableDeclarator[id.name=/^[A-Z]/] > FunctionExpression',
                    message: componentDeclaration,
                },
            ],
            'jsx-a11y-x/label-has-associated-control': [
                2,
                {
                    labelComponents: ['Label', 'FieldLabel'],
                    labelAttributes: ['label'],
                    controlComponents: ['Input', 'PasswordInput'],
                    depth: 3,
                },
            ],
            '@stylistic/jsx-self-closing-comp': [
                'error',
                {
                    component: true,
                    html: true,
                },
            ],
            '@eslint-react/no-forward-ref': 'error',
            '@eslint-react/jsx-no-useless-fragment': ['error', { allowExpressions: false }],
            '@eslint-react/jsx-no-children-prop': 'off',
            // `eslint-plugin-react-hooks` is the single owner of hooks + React Compiler rules; these are the
            // eslint-react duplicates.
            '@eslint-react/exhaustive-deps': 'off',
            '@eslint-react/rules-of-hooks': 'off',
            '@eslint-react/error-boundaries': 'off',
            '@eslint-react/immutability': 'off',
            '@eslint-react/purity': 'off',
            '@eslint-react/refs': 'off',
            '@eslint-react/set-state-in-effect': 'off',
            '@eslint-react/set-state-in-render': 'off',
            '@eslint-react/static-components': 'off',
            '@eslint-react/unsupported-syntax': 'off',
            '@eslint-react/use-memo': 'off',
        },
    },
    {
        files: ['src/**/*.{js,ts,tsx}'],
        languageOptions: {
            // Keep in sync with `lib` in tsconfig.json.
            ecmaVersion: 2022,
            globals: globals.browser,
        },
    },
    {
        files: ['**/*.{js,jsx,ts,tsx,cjs,mjs}'],
        extends: [nextPlugin.configs['core-web-vitals']],
    },
    // Local overrides only.
]);
