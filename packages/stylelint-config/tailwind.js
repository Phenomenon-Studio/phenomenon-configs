import base from './index.js';

/** Base + Tailwind CSS v4 at-rules and functions. @type {import('stylelint').Config} */
export default {
    ...base,
    rules: {
        ...base.rules,
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'theme',
                    'source',
                    'utility',
                    'variant',
                    'custom-variant',
                    'plugin',
                    'tailwind',
                    'apply',
                    'layer',
                    'config',
                    'variants',
                    'responsive',
                    'screen',
                ],
            },
        ],
        'function-no-unknown': [true, { ignoreFunctions: ['theme'] }],
        'at-rule-prelude-no-invalid': [true, { ignoreAtRules: ['/^apply$/'] }],
        'import-notation': null,
    },
};
