import { execFileSync, spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root } from './lib.js';

// Publish every packages/* version that npm does not have yet, then tag it (Changesets prints "New tag:" for the
// release action). Uses the npm CLI, which authenticates through npm trusted publishing (GitHub OIDC): no npm token.
for (const dir of readdirSync(join(root, 'packages'))) {
    const cwd = join(root, 'packages', dir);
    const { name, version, private: isPrivate } = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
    const published = spawnSync('npm', ['view', `${name}@${version}`, 'version'], { encoding: 'utf8' });
    if (isPrivate || published.stdout.trim() === version) {
        continue;
    }
    console.log(`publishing ${name}@${version}`);
    execFileSync('npm', ['publish', '--provenance', '--access', 'public'], { cwd, stdio: 'inherit' });
}

execFileSync('pnpm', ['changeset', 'tag'], { cwd: root, stdio: 'inherit' });
