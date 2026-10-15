import { join } from 'node:path';
import { ESLint } from 'eslint';

// Load every entry, resolve the config for a source file and lint a fixture, so a broken plugin import or an
// unknown rule fails here instead of in a project.
const cwd = join(import.meta.dirname, 'fixture');
const entries = ['base', 'react', 'tanstack-query', 'tanstack-router', 'vite', 'next'];
// Add-on entries carry no parser; projects always combine them with `base`.
const addOns = new Set(['react', 'tanstack-query', 'tanstack-router']);
const { default: base } = await import('../src/base.js');

for (const entry of entries) {
    const { default: entryConfig } = await import(`../src/${entry}.js`);
    const config = addOns.has(entry) ? [...base, ...entryConfig] : entryConfig;
    const eslint = new ESLint({ cwd, overrideConfigFile: true, overrideConfig: config });
    await eslint.calculateConfigForFile('src/App.tsx');
    const [result] = await eslint.lintFiles(['src/App.tsx']);
    const errors = result.messages.filter((message) => {
        return message.severity === 2;
    });
    if (result.fatalErrorCount > 0 || errors.length > 0) {
        console.error(errors);
        throw new Error(`${entry}: fixture has lint errors`);
    }
    console.log(`ok ${entry} (${config.length} config objects)`);
}
