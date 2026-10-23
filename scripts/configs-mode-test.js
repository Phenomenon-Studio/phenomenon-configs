import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { copier, readVersions, root } from './lib.js';

// Proves `create-app init` works on a project the template did not create: write a bare <stack> app, add the shared
// configs from this working tree (scope=configs, Copier tasks included), then assert a green fmt/lint/typecheck.
// Usage: node scripts/configs-mode-test.js <vite|next> [--keep]
const [stack, flag] = process.argv.slice(2);
if (!['vite', 'next'].includes(stack)) {
    throw new Error('Usage: node scripts/configs-mode-test.js <vite|next> [--keep]');
}

const { versions } = readVersions();
const pick = (...names) => {
    return Object.fromEntries(
        names.map((name) => {
            return [name, versions.npm[name]];
        })
    );
};

const component = (name, exportKeyword = 'export') => {
    return `${exportKeyword} function ${name}() {\n    return <h1>Hello</h1>;\n}\n`;
};

// One fixture per styling: Vite + Tailwind, Next.js + CSS Modules.
const styling = { vite: 'tailwind', next: 'css-modules' };
const fixtures = {
    vite: {
        'package.json': {
            name: 'existing-vite',
            private: true,
            type: 'module',
            scripts: { dev: 'vite', build: 'vite build' },
            dependencies: pick('react', 'react-dom'),
            devDependencies: { ...pick('@types/react', '@types/react-dom', 'tailwindcss', 'vite'), eslint: '9.0.0' },
        },
        'src/App.tsx': component('App'),
        'src/index.css': "@import 'tailwindcss';\n",
    },
    next: {
        'package.json': {
            name: 'existing-next',
            private: true,
            scripts: { dev: 'next dev', build: 'next build' },
            dependencies: pick('next', 'react', 'react-dom'),
            devDependencies: pick('@types/react', '@types/react-dom'),
        },
        'src/app/page.tsx': component('Page', 'export default'),
        'src/app/layout.tsx': [
            "import type { ReactNode } from 'react';",
            '',
            'export default function RootLayout({ children }: { children: ReactNode }) {',
            '    return (',
            '        <html lang="en">',
            '            <body>{children}</body>',
            '        </html>',
            '    );',
            '}',
            '',
        ].join('\n'),
    },
};

const work = mkdtempSync(join(tmpdir(), `configs-mode-${stack}-`));
const project = join(work, 'project');
for (const [file, content] of Object.entries(fixtures[stack])) {
    mkdirSync(dirname(join(project, file)), { recursive: true });
    writeFileSync(join(project, file), typeof content === 'string' ? content : `${JSON.stringify(content, null, 2)}\n`);
}

const git = (args) => {
    return execFileSync('git', args, { cwd: project, encoding: 'utf8' });
};
git(['init', '--quiet']);
git(['add', '-A']);
git(['-c', 'user.name=ci', '-c', 'user.email=ci@example.com', 'commit', '--quiet', '-m', 'existing project']);

copier([
    'copy',
    '--trust',
    '--defaults',
    '--overwrite',
    '--vcs-ref=HEAD',
    '--data',
    'scope=configs',
    '--data',
    `stack=${stack}`,
    '--data',
    `styling=${styling[stack]}`,
    '--data',
    'tailwind_stylesheet=./src/index.css',
    root,
    project,
]);

const pkg = JSON.parse(readFileSync(join(project, 'package.json'), 'utf8'));
if (
    pkg.devDependencies.eslint !== versions.npm.eslint ||
    pkg.scripts.dev !== fixtures[stack]['package.json'].scripts.dev
) {
    throw new Error(`package.json was not merged as expected:\n${JSON.stringify(pkg, null, 2)}`);
}

for (const args of [['fix:fmt'], ['lint'], ['tsc']]) {
    execFileSync('pnpm', args, { cwd: project, stdio: 'inherit' });
}

if (flag !== '--keep') {
    rmSync(work, { recursive: true, force: true });
}
console.log(`ok ${stack}: shared configs added to an existing project`);
