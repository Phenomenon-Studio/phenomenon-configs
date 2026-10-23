// Shared rules come from the phenomenon-configs template and update with `copier update`. Add project-specific
// changes under "Local overrides" at the end, so template updates merge cleanly. Ignored paths live in
// .stylelintignore.

/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-standard'],
    rules: {
        'no-descending-specificity': null,
        'block-no-empty': true,
        'color-no-invalid-hex': true,
        'comment-no-empty': true,
        'declaration-block-no-duplicate-custom-properties': true,
        'declaration-block-no-duplicate-properties': [
            true,
            {
                ignore: ['consecutive-duplicates-with-different-values'],
            },
        ],
        'declaration-block-no-shorthand-property-overrides': true,
        'font-family-no-duplicate-names': true,
        'font-family-no-missing-generic-family-keyword': true,
        'function-calc-no-unspaced-operator': true,
        'function-linear-gradient-no-nonstandard-direction': true,
        'media-feature-range-notation': 'prefix',
        'keyframe-declaration-no-important': true,
        'media-feature-name-no-unknown': true,
        'named-grid-areas-no-invalid': true,
        'no-duplicate-at-import-rules': true,
        'no-duplicate-selectors': true,
        'no-empty-source': true,
        'no-invalid-double-slash-comments': true,
        'no-invalid-position-at-import-rule': true,
        'no-irregular-whitespace': true,
        'property-no-unknown': true,
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['/^global/', 'global'],
            },
        ],
        'selector-pseudo-element-no-unknown': true,
        'selector-type-no-unknown': [
            true,
            {
                ignore: ['custom-elements'],
            },
        ],
        'string-no-newline': true,
        'unit-no-unknown': true,
        'at-rule-empty-line-before': [
            'always',
            {
                except: ['blockless-after-same-name-blockless', 'first-nested'],
                ignore: ['after-comment'],
            },
        ],
        'color-hex-length': 'long',
        'comment-empty-line-before': [
            'always',
            {
                except: ['first-nested'],
                ignore: ['stylelint-commands'],
            },
        ],
        'comment-whitespace-inside': 'always',
        'custom-property-empty-line-before': [
            'always',
            {
                except: ['after-custom-property', 'first-nested'],
                ignore: ['after-comment', 'inside-single-line-block'],
            },
        ],
        'declaration-block-single-line-max-declarations': 1,
        'declaration-empty-line-before': [
            'always',
            {
                except: ['after-declaration', 'first-nested'],
                ignore: ['after-comment', 'inside-single-line-block'],
            },
        ],
        'function-name-case': 'lower',
        'length-zero-no-unit': true,
        'rule-empty-line-before': [
            'always-multi-line',
            {
                except: ['first-nested'],
                ignore: ['after-comment'],
            },
        ],
        'selector-pseudo-element-colon-notation': 'double',
        'selector-type-case': 'lower',
        'value-keyword-case': 'lower',
        'color-function-notation': null,
        'value-no-vendor-prefix': null,
        'selector-class-pattern': '^[a-z][a-z0-9-]+$',
        'selector-id-pattern': '^[a-z][a-z0-9-]+$',
        'alpha-value-notation': 'number',
        'font-family-name-quotes': 'always-unless-keyword',
        // Tailwind CSS v4 at-rules and functions.
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
        // Local overrides only.
    },
};
