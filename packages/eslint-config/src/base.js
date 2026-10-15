import eslint from '@eslint/js';
import eslintPluginStylistic from '@stylistic/eslint-plugin';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Framework-agnostic rules for every JS/TS file. Stack entries (`vite`, `next`) build on this, so a fix here
 * reaches every project.
 */
export default defineConfig([
    globalIgnores(['**/node_modules/**', '**/dist/**', '**/tmp/**', '**/coverage/**', '**/storybook-static/**']),
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
]);
