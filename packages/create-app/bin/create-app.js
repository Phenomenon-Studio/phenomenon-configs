#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';

// renovate: datasource=pypi depName=copier
const COPIER_VERSION = '9.19.1';
const TEMPLATE = 'gh:Phenomenon-Studio/phenomenon-configs';

const HELP = `Usage:
  create-app <directory> [--stack vite|next] [--styling tailwind|css-modules] [--ref vX.Y.Z]
                                                               Create a project
  create-app update [--ref vX.Y.Z] [--defaults]                Update the project in the current directory
                                                               to the latest (or given) template release

Options:
  --stack      Skip the stack question (vite | next)
  --styling    Skip the styling question for Vite (tailwind | css-modules)
  --ref        Template git tag to use (default: latest release)
  --defaults   Accept previous answers without prompting (update only)
  --template   Template source (default: ${TEMPLATE})
  -h, --help   Show this help

Requires uv (https://docs.astral.sh/uv/): brew install uv`;

const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
        stack: { type: 'string' },
        styling: { type: 'string' },
        ref: { type: 'string' },
        defaults: { type: 'boolean', default: false },
        template: { type: 'string', default: TEMPLATE },
        help: { type: 'boolean', short: 'h', default: false },
    },
});

if (values.help || positionals.length === 0) {
    console.log(HELP);
    process.exit(0);
}

const uv = spawnSync('uvx', ['--version'], { stdio: 'ignore' });
if (uv.error || uv.status !== 0) {
    console.error('uvx not found. Install uv first: brew install uv (or see https://docs.astral.sh/uv/)');
    process.exit(1);
}

const copier = ['--from', `copier==${COPIER_VERSION}`, 'copier'];
const ref = values.ref ? ['--vcs-ref', values.ref] : [];
const [command, directory] = positionals;

const args =
    command === 'update'
        ? [...copier, 'update', '--trust', '--skip-answered', ...ref, ...(values.defaults ? ['--defaults'] : [])]
        : [
              ...copier,
              'copy',
              '--trust',
              ...ref,
              ...(values.stack ? ['--data', `stack=${values.stack}`] : []),
              ...(values.styling ? ['--data', `styling=${values.styling}`] : []),
              values.template,
              directory ?? command,
          ];

const result = spawnSync('uvx', args, { stdio: 'inherit' });
process.exit(result.status ?? 1);
