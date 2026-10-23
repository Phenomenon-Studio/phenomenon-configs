#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import * as prompts from './prompts.js';
import * as ui from './ui.js';

// renovate: datasource=pypi depName=copier
const COPIER_VERSION = '9.19.1';
const TEMPLATE = 'gh:Phenomenon-Studio/phenomenon-configs';
const { version: VERSION } = JSON.parse(readFileSync(join(import.meta.dirname, '../package.json'), 'utf8'));

const HELP = `${ui.bold('Usage')}
  ${ui.code('create-app')}
      Interactive: pick what to do, then name, stack and styling from lists.
  ${ui.code('create-app <directory>')} [--stack vite|next] [--styling tailwind|css-modules] [--ref vX.Y.Z]
      Create a new project: starter app + shared configs.
  ${ui.code('create-app init')} [--stack vite|next] [--styling tailwind|css-modules] [--ref vX.Y.Z] [--overwrite]
      Add the shared configs to the existing project in the current directory.
  ${ui.code('create-app update')} [--ref vX.Y.Z] [--defaults]
      Pull the latest (or given) template release into the project in the current directory.

${ui.bold('Options')}
  --stack      vite | next. Asked with a list when omitted; init detects it from package.json
  --styling    tailwind | css-modules. Asked with a list when omitted (Vite); init detects it
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

const STACKS = [
    { label: 'Vite', value: 'vite', hint: 'React SPA · TanStack Router + Query + Form' },
    { label: 'Next.js', value: 'next', hint: 'App Router · TanStack Query' },
];
const STYLINGS = [
    { label: 'Tailwind CSS', value: 'tailwind', hint: 'Tailwind v4 + shadcn/ui' },
    { label: 'CSS Modules', value: 'css-modules', hint: 'plain CSS Modules + Base UI' },
];
const KEBAB = /^[a-z0-9][a-z0-9-]*$/;

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

if (values.help || (positionals.length === 0 && !prompts.interactive)) {
    console.log(HELP);
    console.log();
    process.exit(0);
}

const fail = (message) => {
    ui.error(message);
    process.exit(1);
};

/** Check a flag value against its choices. */
const option = (name, value, choices) => {
    if (
        value !== undefined &&
        !choices.some((choice) => {
            return choice.value === value;
        })
    ) {
        fail(
            `--${name} must be one of: ${choices
                .map((choice) => {
                    return choice.value;
                })
                .join(', ')}`
        );
    }

    return value;
};

/** A flag value, else a radio list in a terminal, else an error naming the flag. */
const choose = (name, value, question, choices, initial = 0) => {
    if (option(name, value, choices)) {
        return Promise.resolve(value);
    }
    if (!prompts.interactive) {
        fail(
            `Pass --${name} ${choices
                .map((choice) => {
                    return choice.value;
                })
                .join('|')} (no terminal to ask in).`
        );
    }

    return prompts.select(question, choices, initial);
};

/** Package name from a directory: lowercase, anything else than letters/digits becomes a dash. */
const toKebab = (directory) => {
    return basename(resolve(directory))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const validateName = (value) => {
    return KEBAB.test(value) ? undefined : 'Use kebab-case: lowercase letters, digits and dashes (e.g. acme-admin)';
};

// No arguments in a terminal: ask what to do.
if (positionals.length === 0) {
    const action = await prompts.select('What do you want to do?', [
        { label: 'Create a new project', value: 'create', hint: 'starter app + shared configs' },
        { label: 'Add configs to this project', value: 'init', hint: 'existing project in the current folder' },
        { label: 'Update this project', value: 'update', hint: 'pull the latest template release' },
    ]);
    if (action === 'create') {
        positionals.push(await prompts.text('Project name', { initial: 'my-app', validate: validateName }));
    } else {
        positionals.push(action);
    }
    console.log();
}

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
        `Commit:   ${ui.code('git commit -am "build(template): update"')}`,
    ]);
} else if (command === 'init') {
    ui.step('Inspecting the existing project');
    if (existsSync('.copier-answers.yml')) {
        fail('This project already uses the template (.copier-answers.yml exists). Run `create-app update` instead.');
    }
    const detected = detect();
    const answers = {
        scope: 'configs',
        stack: option('stack', values.stack, STACKS) ?? detected.stack,
        styling: option('styling', values.styling, STYLINGS) ?? detected.styling,
        tailwind_stylesheet: detected.tailwind_stylesheet,
    };
    if (!answers.stack) {
        ui.warn('Stack not detected (no next or vite in package.json).');
        answers.stack = await choose('stack', undefined, 'Framework', STACKS);
    }
    ui.table([
        ['project', detected.name ?? '(unnamed)'],
        ['stack', answers.stack],
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
    let name = toKebab(target);
    if (validateName(name)) {
        if (!prompts.interactive) {
            fail(`Cannot derive a package name from "${target}". Use a kebab-case directory name.`);
        }
        name = await prompts.text('Package name', { validate: validateName });
    }
    const stack = await choose('stack', values.stack, 'Framework', STACKS);
    // New Next.js apps ship CSS Modules only.
    const styling =
        stack === 'next'
            ? (option('styling', values.styling, STYLINGS) ?? 'css-modules')
            : await choose('styling', values.styling, 'Styling', STYLINGS);
    ui.table([
        ['directory', target],
        ['name', name],
        ['stack', stack],
        ['styling', styling],
        ['template', source],
    ]);

    ui.step('Generating the project');
    // Every answer is known, so Copier asks nothing (the title defaults from the name).
    copier([
        'copy',
        '--trust',
        '--defaults',
        ...ref,
        ...data({ scope: 'app', project_name: name, stack, styling }),
        values.template,
        target,
    ]);
    ui.box('Project created', [
        `Open:    ${ui.code(`cd ${/\s/.test(target) ? JSON.stringify(target) : target}`)}`,
        `Env:     ${ui.code('cp .env.local.example .env.local')}`,
        `Run:     ${ui.code('pnpm dev')}`,
        `Commit:  ${ui.code('git add -A && git commit -m "build: scaffold from phenomenon-configs"')}`,
    ]);
}
