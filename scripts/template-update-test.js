import { execFileSync, spawnSync } from 'node:child_process';
import { appendFileSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { copier, root } from './lib.js';

// Proves existing projects can upgrade: render <stack> from the last released template tag, commit it, `copier update`
// to the current commit, then assert no conflicts and a green lint/typecheck/build.
// Usage: node scripts/template-update-test.js <stack> [--keep]
const [stack, flag] = process.argv.slice(2);
if (!stack) {
    throw new Error('Usage: node scripts/template-update-test.js <stack> [--keep]');
}

const git = (args, cwd) => {
    return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
};

const lastTag = git(['tag', '--list', 'v*.*.*', '--sort=-v:refname'], root).split('\n')[0];
if (!lastTag) {
    console.log('No template release yet (no vX.Y.Z tag); nothing to upgrade from.');
    process.exit(0);
}

const work = mkdtempSync(join(tmpdir(), `template-update-${stack}-`));
const project = join(work, 'project');

copier([
    'copy',
    '--trust',
    '--defaults',
    '--skip-tasks',
    `--vcs-ref=${lastTag}`,
    '--data-file',
    join(root, 'examples/answers', `${stack}.yml`),
    root,
    project,
]);
git(['init', '--quiet'], project);
git(['add', '-A'], project);
git(['-c', 'user.name=ci', '-c', 'user.email=ci@example.com', 'commit', '--quiet', '-m', 'scaffold'], project);

copier(
    ['update', '--trust', '--defaults', '--skip-answered', '--skip-tasks', '--vcs-ref=HEAD', '--conflict', 'inline'],
    {
        cwd: project,
    }
);

const conflicts = spawnSync('git', ['grep', '-l', '-e', '^<<<<<<< ', '--', '.'], { cwd: project, encoding: 'utf8' });
if (conflicts.status === 0) {
    throw new Error(`copier update ${lastTag} -> HEAD left conflicts in:\n${conflicts.stdout}`);
}
console.log(readFileSync(join(project, '.copier-answers.yml'), 'utf8'));

// Use this checkout's config packages (they may be unreleased in a "Version packages" PR); everything else installs
// from the public registry like a consumer would.
const overrides = readdirSync(join(root, 'packages'))
    .map((dir) => {
        const { name } = JSON.parse(readFileSync(join(root, 'packages', dir, 'package.json'), 'utf8'));

        return `  '${name}': link:${join(root, 'packages', dir)}\n`;
    })
    .join('');
appendFileSync(join(project, 'pnpm-workspace.yaml'), `overrides:\n${overrides}`);

for (const args of [['install', '--no-frozen-lockfile'], ['lint'], ['tsc'], ['build']]) {
    execFileSync('pnpm', args, { cwd: project, stdio: 'inherit', env: { ...process.env, NEXT_WORKSPACE_ROOT: '/' } });
}

if (flag !== '--keep') {
    rmSync(work, { recursive: true, force: true });
}
console.log(`ok ${stack}: ${lastTag} -> HEAD upgrades cleanly`);
