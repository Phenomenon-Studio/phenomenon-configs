// Terminal output for the CLI: banner, numbered steps, status lines and a summary box. No dependencies. Colors turn
// off for NO_COLOR, FORCE_COLOR=0, dumb terminals and non-TTY output (CI logs, pipes).
import { styleText } from 'node:util';

const out = process.stdout;
const forced = process.env.FORCE_COLOR;
const colors = !('NO_COLOR' in process.env) && forced !== '0' && (Boolean(forced) || Boolean(out.hasColors?.()));
const depth = { 2: 256, 3: 2 ** 24 }[forced];
const supports = (count) => {
    return colors && (depth ? depth >= count : Boolean(out.hasColors?.(count)));
};
const trueColor = supports(2 ** 24);

/** @param {Parameters<typeof styleText>[0]} format @param {string} text */
const paint = (format, text) => {
    return colors ? styleText(format, text, { validateStream: false }) : text;
};

export const dim = (text) => {
    return paint('dim', text);
};
export const bold = (text) => {
    return paint('bold', text);
};
export const accent = (text) => {
    return paint('magenta', text);
};
export const success = (text) => {
    return paint('green', text);
};
export const danger = (text) => {
    return paint('red', text);
};
export const code = (text) => {
    return paint('cyan', text);
};

// Wordmark from the brand logo: orange asterisk + bold lowercase "phenomenon". Glyphs are drawn on a pixel grid
// (# = filled) and printed with half blocks, two pixel rows per terminal line.
const GLYPHS = {
    '*': ['......', '......', '..##..', '#.##.#', '.####.', '.####.', '#.##.#', '..##..', '......', '......'],
    p: ['......', '......', '#####.', '##..##', '##..##', '##..##', '#####.', '##....', '##....', '......'],
    h: ['##....', '##....', '#####.', '##..##', '##..##', '##..##', '##..##', '##..##', '......', '......'],
    e: ['......', '......', '.####.', '##..##', '######', '##....', '##..##', '.####.', '......', '......'],
    n: ['......', '......', '#####.', '##..##', '##..##', '##..##', '##..##', '##..##', '......', '......'],
    o: ['......', '......', '.####.', '##..##', '##..##', '##..##', '##..##', '.####.', '......', '......'],
    m: [
        '..........',
        '..........',
        '#########.',
        '##..##..##',
        '##..##..##',
        '##..##..##',
        '##..##..##',
        '##..##..##',
        '..........',
        '..........',
    ],
};

/** Render `text` with GLYPHS into terminal lines of half blocks. */
const render = (text) => {
    const pixels = GLYPHS[text[0]].map((_, row) => {
        return [...text]
            .map((char) => {
                return GLYPHS[char][row];
            })
            .join('.');
    });
    const lines = [];
    for (let row = 0; row < pixels.length; row += 2) {
        lines.push(
            [...pixels[row]]
                .map((top, column) => {
                    const bottom = pixels[row + 1][column] === '#';
                    if (top === '#') {
                        return bottom ? '█' : '▀';
                    }

                    return bottom ? '▄' : ' ';
                })
                .join('')
        );
    }

    return lines;
};

// Brand orange (#F7893B); 256-color and 16-color terminals get the closest match.
const orange = (text) => {
    if (!colors) {
        return text;
    }
    if (trueColor) {
        return `\x1b[38;2;247;137;59m${text}\x1b[39m`;
    }

    return supports(256) ? `\x1b[38;5;208m${text}\x1b[39m` : paint('yellow', text);
};

export const banner = (version) => {
    const star = render('*');
    const word = render('phenomenon');
    const width = star[0].length + 2 + word[0].length;
    console.log();
    for (const [index, line] of word.entries()) {
        console.log(`  ${orange(star[index])}  ${paint(['bold', 'white'], line)}`.trimEnd());
    }
    const tagline = 'studio · configs cli';
    const versionLabel = `v${version}`;
    const gap = ' '.repeat(Math.max(width - tagline.length - versionLabel.length, 1));
    console.log(`  ${dim(tagline)}${gap}${dim(versionLabel)}`);
    console.log();
};

let total = 0;
let current = 0;

/** Start a numbered sequence of `count` steps. */
export const steps = (count) => {
    total = count;
    current = 0;
};

export const step = (text) => {
    current += 1;
    console.log(`${accent(`  [${current}/${total}]`)} ${bold(text)}`);
};

export const ok = (text) => {
    console.log(`        ${paint('green', '✔')} ${text}`);
};

export const info = (text) => {
    console.log(`        ${dim('•')} ${text}`);
};

export const warn = (text) => {
    console.log(`        ${paint('yellow', '!')} ${text}`);
};

export const error = (text) => {
    console.error(`\n  ${paint('red', '✖')} ${text}\n`);
};

/** Aligned `key  value` rows under the current step. */
export const table = (rows) => {
    const width = Math.max(
        ...rows.map(([key]) => {
            return key.length;
        })
    );
    for (const [key, value] of rows) {
        console.log(`        ${dim(key.padEnd(width))}  ${value}`);
    }
};

const visibleLength = (text) => {
    return text.replace(/\x1b\[[0-9;]*m/g, '').length;
};

/** Rounded box with a title and lines, for the final summary. */
export const box = (title, lines) => {
    const width = Math.max(visibleLength(title), ...lines.map(visibleLength)) + 2;
    const edge = (text) => {
        return paint('magenta', text);
    };
    console.log();
    console.log(`  ${edge(`╭─ ${bold(title)} ${'─'.repeat(Math.max(width - visibleLength(title) - 3, 0))}╮`)}`);
    for (const line of lines) {
        console.log(`  ${edge('│')} ${line}${' '.repeat(width - visibleLength(line) - 1)}${edge('│')}`);
    }
    console.log(`  ${edge(`╰${'─'.repeat(width)}╯`)}`);
    console.log();
};
