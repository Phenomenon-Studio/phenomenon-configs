// Interactive questions for the CLI: an arrow-key radio list and a validated text input. No dependencies. Only used
// when both stdin and stdout are terminals; otherwise the CLI asks for flags instead.
import { emitKeypressEvents } from 'node:readline';
import { createInterface } from 'node:readline/promises';
import * as ui from './ui.js';

const { stdin, stdout } = process;

export const interactive = Boolean(stdin.isTTY && stdout.isTTY);

const answered = (question, value) => {
    stdout.write(`\x1b[2K  ${ui.success('✔')} ${ui.bold(question)} ${ui.accent(value)}\n`);
};

/**
 * Radio list: ↑/↓ (or k/j, or the option number) to move, enter to pick.
 *
 * @template T
 * @param {string} question
 * @param {{ label: string, value: T, hint?: string }[]} choices
 * @param {number} [initial]
 * @returns {Promise<T>}
 */
export const select = (question, choices, initial = 0) => {
    return new Promise((resolve) => {
        let index = initial;
        const lines = choices.length + 1;

        const draw = (first) => {
            if (!first) {
                stdout.write(`\x1b[${lines}A`);
            }
            stdout.write(`\x1b[2K  ${ui.accent('?')} ${ui.bold(question)} ${ui.dim('↑/↓ · enter')}\n`);
            for (const [position, choice] of choices.entries()) {
                const active = position === index;
                const radio = active ? ui.accent('◉') : ui.dim('○');
                const label = active ? ui.bold(choice.label) : choice.label;
                stdout.write(`\x1b[2K    ${radio} ${label}${choice.hint ? `  ${ui.dim(choice.hint)}` : ''}\n`);
            }
        };

        const cleanup = () => {
            stdin.off('keypress', onKey);
            stdin.setRawMode(false);
            stdin.pause();
            stdout.write('\x1b[?25h');
        };

        const onKey = (input, key = {}) => {
            if (key.ctrl && key.name === 'c') {
                cleanup();
                stdout.write('\n');
                process.exit(130);
            }
            const number = Number.parseInt(input, 10);
            if (key.name === 'up' || key.name === 'k') {
                index = (index - 1 + choices.length) % choices.length;
            } else if (key.name === 'down' || key.name === 'j' || key.name === 'tab') {
                index = (index + 1) % choices.length;
            } else if (number >= 1 && number <= choices.length) {
                index = number - 1;
            } else if (key.name === 'return') {
                cleanup();
                stdout.write(`\x1b[${lines}A\x1b[0J`);
                answered(question, choices[index].label);
                resolve(choices[index].value);

                return;
            } else {
                return;
            }
            draw(false);
        };

        emitKeypressEvents(stdin);
        stdin.setRawMode(true);
        stdin.resume();
        stdout.write('\x1b[?25l');
        draw(true);
        stdin.on('keypress', onKey);
    });
};

/**
 * Text input with a default (enter accepts it) and a validator returning an error message or undefined.
 *
 * @param {string} question
 * @param {{ initial?: string, validate?: (value: string) => string | undefined }} [options]
 * @returns {Promise<string>}
 */
export const text = async (question, { initial = '', validate } = {}) => {
    const readline = createInterface({ input: stdin, output: stdout });
    readline.on('SIGINT', () => {
        stdout.write('\n');
        process.exit(130);
    });
    try {
        for (;;) {
            const hint = initial ? ` ${ui.dim(`(${initial})`)}` : '';
            const value =
                (await readline.question(`  ${ui.accent('?')} ${ui.bold(question)}${hint} `)).trim() || initial;
            const problem = validate?.(value);
            if (!problem) {
                stdout.write('\x1b[1A\x1b[2K');
                answered(question, value);

                return value;
            }
            stdout.write(`    ${ui.danger('✖')} ${problem}\n`);
        }
    } finally {
        readline.close();
    }
};
