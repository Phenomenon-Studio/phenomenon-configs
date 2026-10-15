import stylelint from 'stylelint';

const css = `@import "tailwindcss";\n\n@theme {\n    --color-brand: #ff0000;\n}\n\n.card {\n    @apply p-4;\n\n    color: #000000;\n}\n`;

for (const entry of ['index', 'tailwind']) {
    const { default: config } = await import(`../${entry}.js`);
    const { results } = await stylelint.lint({ code: css, config });
    const errors = results[0].warnings.filter((warning) => {
        return warning.severity === 'error';
    });
    if (entry === 'tailwind' && errors.length > 0) {
        console.error(errors);
        throw new Error(`${entry}: Tailwind fixture has errors`);
    }
    console.log(`ok ${entry}`);
}
