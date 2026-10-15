import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readVersions, root } from './lib.js';

// Write the current version of every packages/* into the "platform" section of template/versions.jinja, so new
// projects and `copier update` pick up the release. Runs as part of `pnpm version-packages` (Changesets).
const { source, file, versions, json } = readVersions();
const next = { ...versions, platform: { ...versions.platform } };

for (const dir of readdirSync(join(root, 'packages'))) {
    const pkg = JSON.parse(readFileSync(join(root, 'packages', dir, 'package.json'), 'utf8'));
    if (pkg.name in next.platform && next.platform[pkg.name] !== pkg.version) {
        console.log(`${pkg.name}: ${next.platform[pkg.name]} -> ${pkg.version}`);
        next.platform[pkg.name] = pkg.version;
    }
}

writeFileSync(file, source.replace(json, JSON.stringify(next, null, 4)));
