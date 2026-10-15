import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { copier, root } from './lib.js';

const TEMPLATE_SOURCE = 'gh:Phenomenon-Studio/phenomenon-configs';

// Re-render every examples/<stack> from the local template (working tree, uncommitted changes included) with the
// fixed answers in examples/answers/<stack>.yml. CI fails when the committed examples differ from this output.
// Usage: node scripts/regen-examples.js [stack...]
const only = process.argv.slice(2);
const stacks = readdirSync(join(root, 'examples/answers'))
    .map((file) => {
        return file.replace(/\.yml$/, '');
    })
    .filter((stack) => {
        return only.length === 0 || only.includes(stack);
    });

for (const stack of stacks) {
    const destination = join(root, 'examples', stack);
    // Start clean so files removed from the template disappear from the example too.
    for (const entry of readdirSync(destination, { withFileTypes: true }).filter(Boolean)) {
        if (entry.name !== 'node_modules') {
            rmSync(join(destination, entry.name), { recursive: true, force: true });
        }
    }
    copier([
        'copy',
        '--trust',
        '--defaults',
        '--overwrite',
        '--skip-tasks',
        // A nested pnpm-workspace.yaml would turn the example into its own workspace root (and make pnpm try to
        // install it from the registry). Its settings are install policy, which the platform root already applies.
        '--exclude',
        'pnpm-workspace.yaml',
        '--vcs-ref=HEAD',
        '--data-file',
        join(root, 'examples/answers', `${stack}.yml`),
        root,
        destination,
    ]);
    // The answers file records where and at which commit the example was rendered. Both change per machine and per
    // commit, so write what a real project records instead and keep the drift check stable.
    const answersFile = join(destination, '.copier-answers.yml');
    const answers = readFileSync(answersFile, 'utf8')
        .replace(/^_commit: .*\n/m, '')
        .replace(/^_src_path: .*$/m, `_src_path: ${TEMPLATE_SOURCE}`);
    writeFileSync(answersFile, answers);
    console.log(`regenerated examples/${stack}`);
}

execFileSync('pnpm', ['exec', 'prettier', '--write', '--log-level=warn', 'examples/*/package.json'], {
    cwd: root,
    stdio: 'inherit',
});
