// Copier task for scope=configs: merge the shared tooling into the project's own package.json, which the template
// does not render (the project owns its dependencies and scripts). Runs inside the project on every copy and update.
// - devDependencies from template/tooling.jinja are added, or set to the catalog version from template/versions.jinja
//   (moved from `dependencies` when the project listed them there).
// - Scripts are added when missing; existing ones are left alone and reported when they differ.
// - `packageManager` and `engines.node` are set only when missing.
// Usage: node sync-package-json.js <stack> <styling>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [stack, styling] = process.argv.slice(2);
const template = join(import.meta.dirname, '..');

/** Parse the JSON object inside `{%- set <name> = ... -%}` of a template/*.jinja catalog. */
const readSet = (file, name) => {
    const source = readFileSync(join(template, file), 'utf8');
    const match = source.match(new RegExp(`\\{%-? set ${name} = (\\{[\\s\\S]*?\\n\\}) -?%\\}`));

    return JSON.parse(match[1]);
};

const versions = readSet('versions.jinja', 'versions');
const tooling = readSet('tooling.jinja', 'tooling');
const groups = [stack, '*', styling];

const file = join(process.cwd(), 'package.json');
const raw = readFileSync(file, 'utf8');
const pkg = JSON.parse(raw);
const changes = [];

pkg.devDependencies ??= {};
for (const name of groups.flatMap((group) => {
    return tooling.devDependencies[group];
})) {
    const version = versions.npm[name];
    if (pkg.dependencies?.[name]) {
        delete pkg.dependencies[name];
        changes.push(`moved ${name} to devDependencies`);
    }
    if (pkg.devDependencies[name] !== version) {
        changes.push(`${name}: ${pkg.devDependencies[name] ?? '(new)'} -> ${version}`);
        pkg.devDependencies[name] = version;
    }
}
pkg.devDependencies = Object.fromEntries(
    Object.entries(pkg.devDependencies).sort(([a], [b]) => {
        return a.localeCompare(b);
    })
);

pkg.scripts ??= {};
const scripts = Object.assign(
    {},
    ...groups.map((group) => {
        return tooling.scripts[group];
    })
);
for (const [name, command] of Object.entries(scripts)) {
    if (!(name in pkg.scripts)) {
        pkg.scripts[name] = command;
        changes.push(`script ${name}: added`);
    } else if (pkg.scripts[name] !== command) {
        console.warn(`script ${name} kept; the shared one is: ${command}`);
    }
}

if (!pkg.packageManager) {
    pkg.packageManager = `pnpm@${versions.runtime.pnpm}`;
    changes.push(`packageManager: pnpm@${versions.runtime.pnpm}`);
}
pkg.engines ??= {};
if (!pkg.engines.node) {
    pkg.engines.node = `>=${versions.runtime.node}`;
    changes.push(`engines.node: >=${versions.runtime.node}`);
}

const indent = raw.match(/^[ \t]+/m)?.[0] ?? '    ';
writeFileSync(file, `${JSON.stringify(pkg, null, indent)}\n`);
console.log(changes.length > 0 ? `package.json:\n  ${changes.join('\n  ')}` : 'package.json: tooling up to date');
