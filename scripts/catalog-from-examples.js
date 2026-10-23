import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readVersions, root } from './lib.js';

// Write the dependency versions found in examples/*/package.json back into template/versions.jinja. Lets maintainers
// bump the catalog with `pnpm update --interactive` (it edits the examples, which are workspace members), then
// `pnpm deps:update` re-renders the examples from the updated catalog. When examples disagree, the highest version
// wins. Usage: node scripts/catalog-from-examples.js
const { source, file, versions, json } = readVersions();

const compare = (a, b) => {
    const parse = (version) => {
        return version.split(/[.-]/).map((part) => {
            return Number.parseInt(part, 10) || 0;
        });
    };
    const [left, right] = [parse(a), parse(b)];
    for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
        const difference = (left[index] ?? 0) - (right[index] ?? 0);
        if (difference !== 0) {
            return difference;
        }
    }

    return 0;
};

const found = {};
for (const dir of readdirSync(join(root, 'examples'))) {
    if (dir === 'answers') {
        continue;
    }
    const pkg = JSON.parse(readFileSync(join(root, 'examples', dir, 'package.json'), 'utf8'));
    for (const [name, version] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
        if (!found[name] || compare(version, found[name]) > 0) {
            found[name] = version;
        }
    }
}

const next = { ...versions, npm: { ...versions.npm } };
let changed = 0;
for (const name of Object.keys(next.npm)) {
    if (!found[name]) {
        console.warn(`${name}: not used by any example, left at ${next.npm[name]}`);
    } else if (found[name] !== next.npm[name]) {
        console.log(`${name}: ${next.npm[name]} -> ${found[name]}`);
        next.npm[name] = found[name];
        changed += 1;
    }
}

writeFileSync(file, source.replace(json, JSON.stringify(next, null, 4)));
console.log(
    changed > 0 ? `template/versions.jinja: ${changed} version(s) updated` : 'template/versions.jinja: up to date'
);
