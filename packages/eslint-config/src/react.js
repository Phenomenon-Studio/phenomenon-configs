import eslintReact from '@eslint-react/eslint-plugin';
import eslintPluginStylistic from '@stylistic/eslint-plugin';
import eslintPluginJSXA11yX from 'eslint-plugin-jsx-a11y-x';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

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

/** React rules for application source (`src/**`). */
export default defineConfig([
    {
        files: ['src/**/*.{ts,tsx}'],
        extends: [
            eslintPluginReactHooks.configs.flat.recommended,
            eslintReact.configs['recommended-typescript'],
            eslintPluginJSXA11yX.configs.recommended,
        ],
        plugins: {
            '@stylistic': eslintPluginStylistic,
        },
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
            // Keep in sync with `lib` in @phenomenon-studio/tsconfig/react.json.
            ecmaVersion: 2022,
            globals: globals.browser,
        },
    },
]);
