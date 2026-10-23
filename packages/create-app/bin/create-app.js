#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseArgs } from 'node:util';
import * as ui from './ui.js';

// renovate: datasource=pypi depName=copier
const COPIER_VERSION = '9.19.1';
const TEMPLATE = 'gh:Phenomenon-Studio/phenomenon-configs';
const { version: VERSION } = JSON.parse(readFileSync(join(import.meta.dirname, '../package.json'), 'utf8'));

const HELP = `${ui.bold('Usage')}
  ${ui.code('create-app <directory>')} [--stack vite|next] [--styling tailwind|css-modules] [--ref vX.Y.Z]
      Create a new project: starter app + shared configs.
  ${ui.code('create-app init')} [--stack vite|next] [--styling tailwind|css-modules] [--ref vX.Y.Z] [--overwrite]
      Add the shared configs to the existing project in the current directory.
  ${ui.code('create-app update')} [--ref vX.Y.Z] [--defaults]
      Pull the latest (or given) template release into the project in the current directory.

${ui.bold('Options')}
  --stack      Skip the stack question (vite | next). init detects it from package.json
  --styling    Skip the styling question (tailwind | css-modules). init detects it from package.json
  --ref        Template git tag to use (default: latest release)
  --overwrite  Replace existing config files without asking (init only; review with git diff)
  --defaults   Accept previous answers without prompting (update only)
  --template   Template source (default: ${TEMPLATE})
  -v, --version  Print the CLI version
  -h, --help     Show this help

${ui.bold('Examples')}
  ${ui.dim('$')} pnpm dlx @phenomenon-studio/create-app my-app --stack vite
  ${ui.dim('$')} cd existing-project && pnpm dlx @phenomenon-studio/create-app init
  ${ui.dim('$')} pnpm dlx @phenomenon-studio/create-app update

Requires uv (https://docs.astral.sh/uv/): ${ui.code('brew install uv')}`;

const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
        stack: { type: 'string' },
        styling: { type: 'string' },
        ref: { type: 'string' },
        overwrite: { type: 'boolean', default: false },
        defaults: { type: 'boolean', default: false },
        template: { type: 'string', default: TEMPLATE },
        version: { type: 'boolean', short: 'v', default: false },
        help: { type: 'boolean', short: 'h', default: false },
    },
});

if (values.version) {
    console.log(VERSION);
    process.exit(0);
}

ui.banner(VERSION);

if (values.help || positionals.length === 0) {
    console.log(HELP);
    console.log();
    process.exit(0);
}

const fail = (message) => {
    ui.error(message);
    process.exit(1);
};

const run = (command, args, options = {}) => {
    return spawnSync(command, args, { encoding: 'utf8', ...options });
};

/** Guess `stack`, `styling` and the Tailwind entry stylesheet from the existing project (init only). */
const detect = () => {
    const file = join(process.cwd(), 'package.json');
    if (!existsSync(file)) {
        fail('No package.json in the current directory. Run init from the root of an existing project.');
    }
    const pkg = JSON.parse(readFileSync(file, 'utf8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const stack = ['next', 'vite'].find((name) => {
        return name in deps;
    });
    const styling = 'tailwindcss' in deps ? 'tailwind' : 'css-modules';

    return {
        name: pkg.name,
        stack,
        styling,
        tailwind_stylesheet: styling === 'tailwind' ? findTailwindStylesheet() : undefined,
    };
};

/** First CSS file under src/ that imports Tailwind, as `./src/...` (Prettier's tailwindStylesheet). */
const findTailwindStylesheet = () => {
    const src = join(process.cwd(), 'src');
    if (!existsSync(src)) {
        return undefined;
    }
    const file = readdirSync(src, { recursive: true, encoding: 'utf8' })
        .filter((name) => {
            return name.endsWith('.css') && !name.includes('node_modules');
        })
        .sort()
        .find((name) => {
            return /@import\s+['"]tailwindcss['"]/.test(readFileSync(join(src, name), 'utf8'));
        });

    return file ? `./${relative(process.cwd(), join(src, file))}` : undefined;
};

/** Report uncommitted changes: Copier refuses to update a dirty repo, and a clean tree makes `git diff` reviewable. */
const checkGit = ({ required }) => {
    const status = run('git', ['status', '--porcelain']);
    if (status.status !== 0) {
        ui.warn('Not a git repository: changes cannot be reviewed with git diff.');
        return;
    }
    if (status.stdout.trim() === '') {
        ui.ok('Git working tree is clean');
    } else if (required) {
        fail('Uncommitted changes. Commit or stash them first: Copier only updates a clean working tree.');
    } else {
        ui.warn('Uncommitted changes: commit them first so the result is easy to review.');
    }
};

const data = (answers) => {
    return Object.entries(answers).flatMap(([key, value]) => {
        return value ? ['--data', `${key}=${value}`] : [];
    });
};

const copier = (args) => {
    console.log();
    const result = spawnSync('uvx', ['--from', `copier==${COPIER_VERSION}`, 'copier', ...args], { stdio: 'inherit' });
    console.log();
    if (result.status !== 0) {
        fail(`Copier exited with code ${result.status ?? 1}. Nothing above was committed; fix the error and rerun.`);
    }
};

const ref = values.ref ? ['--vcs-ref', values.ref] : [];
const source = `${values.template}${values.ref ? ` @ ${values.ref}` : ' @ latest release'}`;
const [command, directory] = positionals;

ui.steps(3);
ui.step('Checking prerequisites');
const uv = run('uvx', ['--version']);
if (uv.error || uv.status !== 0) {
    fail('uvx not found. Install uv first: brew install uv (or see https://docs.astral.sh/uv/)');
}
ui.ok(`uv ${uv.stdout.trim().replace(/^uvx?\s+/, '')}`);
ui.ok(`Node.js ${process.versions.node}`);
const pnpm = run('pnpm', ['--version']);
if (pnpm.status === 0) {
    ui.ok(`pnpm ${pnpm.stdout.trim()}`);
} else {
    ui.warn('pnpm not found: the dependency install step will fail. Install it: corepack enable pnpm');
}

if (command === 'update') {
    ui.step('Reading the project');
    if (!existsSync('.copier-answers.yml')) {
        fail('No .copier-answers.yml here. Run update from a project created with create-app (or adopted with init).');
    }
    const answers = readFileSync('.copier-answers.yml', 'utf8');
    const answer = (key) => {
        return answers.match(new RegExp(`^${key}: (.+)$`, 'm'))?.[1];
    };
    ui.table([
        ['template', answer('_commit') ?? 'unknown'],
        ['scope', answer('scope') ?? 'app'],
        ['stack', answer('stack') ?? '?'],
        ['target', source],
    ]);
    checkGit({ required: true });

    ui.step('Applying the template update (3-way merge)');
    copier(['update', '--trust', '--skip-answered', ...ref, ...(values.defaults ? ['--defaults'] : [])]);
    ui.box('Update applied', [
        `Review:   ${ui.code('git diff')}`,
        `Conflicts: ${ui.code("git grep -n '^<<<<<<< '")} ${ui.dim('(resolve, keep local intent)')}`,
        `Verify:   ${ui.code('pnpm lint && pnpm tsc && pnpm build')}`,
        `Commit:   ${ui.code('git commit -am "chore(template): update"')}`,
    ]);
} else if (command === 'init') {
    ui.step('Inspecting the existing project');
    if (existsSync('.copier-answers.yml')) {
        fail('This project already uses the template (.copier-answers.yml exists). Run `create-app update` instead.');
    }
    const detected = detect();
    const answers = {
        scope: 'configs',
        stack: values.stack ?? detected.stack,
        styling: values.styling ?? detected.styling,
        tailwind_stylesheet: detected.tailwind_stylesheet,
    };
    ui.table([
        ['project', detected.name ?? '(unnamed)'],
        ['stack', answers.stack ?? 'not detected, Copier will ask'],
        ['styling', answers.styling],
        ...(answers.tailwind_stylesheet ? [['stylesheet', answers.tailwind_stylesheet]] : []),
        ['template', source],
    ]);
    checkGit({ required: false });

    ui.step('Adding the shared configs');
    ui.info(
        values.overwrite
            ? 'Existing config files are replaced (--overwrite).'
            : 'Copier asks before replacing each existing config file.'
    );
    copier([
        'copy',
        '--trust',
        ...ref,
        ...data(answers),
        ...(values.overwrite ? ['--overwrite'] : []),
        values.template,
        '.',
    ]);
    ui.box('Shared configs added', [
        `Review:  ${ui.code('git diff')} ${ui.dim('(move project rules under "Local overrides")')}`,
        `Fix:     ${ui.code('pnpm fix:fmt && pnpm lint && pnpm tsc')}`,
        `Commit:  ${ui.code('git add -A && git commit -m "build: adopt phenomenon-configs"')}`,
        `Later:   ${ui.code('pnpm dlx @phenomenon-studio/create-app update')}`,
    ]);
} else {
    const target = directory ?? command;
    ui.step('Preparing the new project');
    if (existsSync(target) && readdirSync(target).length > 0) {
        fail(`${target} exists and is not empty. Pick a new directory, or run init inside an existing project.`);
    }
    ui.table([
        ['directory', target],
        ['stack', values.stack ?? 'Copier will ask'],
        ['styling', values.styling ?? (values.stack === 'next' ? 'css-modules' : 'Copier will ask')],
        ['template', source],
    ]);

    ui.step('Generating the project');
    copier([
        'copy',
        '--trust',
        ...ref,
        ...data({ scope: 'app', stack: values.stack, styling: values.styling }),
        values.template,
        target,
    ]);
    ui.box('Project created', [
        `Open:    ${ui.code(`cd ${target}`)}`,
        `Env:     ${ui.code('cp .env.local.example .env.local')}`,
        `Run:     ${ui.code('pnpm dev')}`,
        `Commit:  ${ui.code('git add -A && git commit -m "chore: scaffold from phenomenon-configs"')}`,
    ]);
}
