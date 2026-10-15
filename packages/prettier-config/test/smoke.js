import * as prettier from 'prettier';

const input = `import { z } from 'zod'\nimport { useState } from "react"\nexport const a = { b: useState, c: z }\n`;
const expected = `import { useState } from 'react';\nimport { z } from 'zod';\n\nexport const a = { b: useState, c: z };\n`;

for (const entry of ['index', 'tailwind']) {
    const { default: config } = await import(`../${entry}.js`);
    const output = await prettier.format(input, { ...config, filepath: 'fixture.ts' });
    if (output !== expected) {
        throw new Error(`${entry}: unexpected output\n${output}`);
    }
    console.log(`ok ${entry}`);
}

// Markdown must format (the import sorter must not try to load optional parsers such as ember).
const { default: base } = await import('../index.js');
await prettier.format('# Title\n', { ...base, filepath: 'README.md' });
console.log('ok markdown');

// Tailwind classes are sorted while imports are still sorted in the same file.
const { default: tailwind } = await import('../tailwind.js');
const tsx = `import { z } from 'zod'\nimport { useState } from 'react'\nexport const A = () => <div className="p-4 flex" />\n`;
const sorted = await prettier.format(tsx, { ...tailwind, filepath: 'fixture.tsx' });
if (!sorted.includes('className="flex p-4"') || !sorted.startsWith("import { useState } from 'react';")) {
    throw new Error(`tailwind: classes or imports not sorted\n${sorted}`);
}
console.log('ok tailwind class + import sorting');
