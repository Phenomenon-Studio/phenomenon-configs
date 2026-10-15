import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Every entry must resolve and print a merged config through the real `tsc`.
const entries = ['base', 'react', 'vite', 'next', 'node'];
const fixture = join(import.meta.dirname, 'fixture');
const tsc = join(import.meta.dirname, '..', 'node_modules', '.bin', 'tsc');

for (const entry of entries) {
    const config = join(fixture, `tsconfig.${entry}.json`);
    writeFileSync(config, JSON.stringify({ extends: `../../${entry}.json`, files: [] }));
    const printed = JSON.parse(execFileSync(tsc, ['--showConfig', '-p', config], { encoding: 'utf8' }));
    if (printed.compilerOptions?.strict !== true) {
        throw new Error(`${entry}.json: strict mode is not enabled`);
    }
    console.log(`ok ${entry}.json`);
}
