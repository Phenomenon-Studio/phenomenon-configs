import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

// Usage: node scripts/pin-mature-versions.js <package.json>...
// Pins every exact-version dependency to the newest stable release older than `minimumReleaseAge` (3 days), the
// same rule pnpm enforces on install. Handy after adding dependencies by hand.
const MIN_AGE_MS = 3 * 24 * 60 * 60 * 1000;
const cutoff = Date.now() - MIN_AGE_MS;
const cache = new Map();

const matureVersion = (name, major) => {
    if (!cache.has(name)) {
        cache.set(name, JSON.parse(execFileSync('pnpm', ['view', name, 'time', '--json'], { encoding: 'utf8' })));
    }
    const candidates = Object.entries(cache.get(name))
        .filter(([version, time]) => {
            return /^\d+\.\d+\.\d+$/.test(version) && Date.parse(time) < cutoff && version.split('.')[0] === major;
        })
        .sort(([, a], [, b]) => {
            return Date.parse(a) - Date.parse(b);
        });

    return candidates.at(-1)?.[0];
};

for (const file of process.argv.slice(2)) {
    const pkg = JSON.parse(readFileSync(file, 'utf8'));
    for (const field of ['dependencies', 'devDependencies']) {
        for (const [name, version] of Object.entries(pkg[field] ?? {})) {
            if (!/^\d+\.\d+\.\d+$/.test(version)) {
                continue;
            }
            const mature = matureVersion(name, version.split('.')[0]);
            if (mature && mature !== version) {
                console.log(`${file}: ${name} ${version} -> ${mature}`);
                pkg[field][name] = mature;
            }
        }
    }
    writeFileSync(file, `${JSON.stringify(pkg, null, 4)}\n`);
}
