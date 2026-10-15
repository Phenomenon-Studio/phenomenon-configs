import { fileURLToPath } from 'node:url';
import lint from '@commitlint/lint';
import load from '@commitlint/load';

const { rules, parserPreset } = await load({ extends: [fileURLToPath(new URL('../index.js', import.meta.url))] });
const opts = parserPreset ? { parserOpts: parserPreset.parserOpts } : {};

const cases = [
    ['feat(auth): add login form', true],
    ['Added login form', false],
    ['feat: Add login form.', false],
];

for (const [message, valid] of cases) {
    const result = await lint(message, rules, opts);
    if (result.valid !== valid) {
        throw new Error(`"${message}" expected valid=${valid}`);
    }
    console.log(`ok "${message}"`);
}
