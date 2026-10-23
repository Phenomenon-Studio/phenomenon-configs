import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const root = join(import.meta.dirname, '..');

// Same Copier version as the create-app CLI (Renovate bumps both).
const cli = readFileSync(join(root, 'packages/create-app/bin/create-app.js'), 'utf8');
export const COPIER_VERSION = cli.match(/const COPIER_VERSION = '([^']+)'/)[1];

// Copier commits inside a temp repo and deletes it right after; git's background auto-gc can still be writing there,
// which fails the cleanup with "Directory not empty: '.git'". Turn auto-gc off for Copier runs.
export const GIT_NO_AUTO_GC = {
    GIT_CONFIG_COUNT: '2',
    GIT_CONFIG_KEY_0: 'gc.auto',
    GIT_CONFIG_VALUE_0: '0',
    GIT_CONFIG_KEY_1: 'maintenance.auto',
    GIT_CONFIG_VALUE_1: 'false',
};

export const copier = (args, options = {}) => {
    return execFileSync('uvx', ['--from', `copier==${COPIER_VERSION}`, 'copier', ...args], {
        stdio: 'inherit',
        ...options,
        env: { ...process.env, ...GIT_NO_AUTO_GC, ...options.env },
    });
};

const VERSIONS_FILE = join(root, 'template/versions.jinja');

/** Parse the JSON object inside `{%- set versions = ... -%}` in template/versions.jinja. */
export const readVersions = () => {
    const source = readFileSync(VERSIONS_FILE, 'utf8');
    const match = source.match(/\{%-? set versions = (\{[\s\S]*?\n\}) -?%\}/);

    return { source, file: VERSIONS_FILE, versions: JSON.parse(match[1]), json: match[1] };
};
