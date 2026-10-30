import { execSync } from 'node:child_process';
import { existsSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { rollup } from 'rollup';
import terser from '@rollup/plugin-terser';

const variants = {
    'only-variable': `import { variable as effcss } from '../dist/index.js'; export const utils = { effcss };`,
    'only-className': `import { className as effcss } from '../dist/index.js'; export const utils = { effcss };`,
    'only-theme': `import { theme as effcss } from '../dist/index.js'; export const utils = { effcss };`,
    'all-utils': `import * as effcss from '../dist/index.js'; export const utils = { effcss };`
};
const root = resolve(import.meta.dirname, '..');
const distEntry = resolve(root, 'dist/index.js');
const tmpPrefix = resolve(root, 'bench/.tmp-');

if (!existsSync(distEntry)) {
    console.log('dist is missing, running build...');
    execSync('npm run build', { cwd: root, stdio: 'inherit' });
}

// 1. Generate entry files
const names = Object.keys(variants);
for (const name of names) {
    writeFileSync(`${tmpPrefix}${name}.mjs`, variants[name]);
}

// 2. Bundle each variant
const sizes = {};
for (const name of names) {
    const bundle = await rollup({ input: `${tmpPrefix}${name}.mjs` });
    const file = resolve(root, `bench/${name}.bundle.js`);
    await bundle.write({ file, format: 'es', plugins: [terser()] });
    await bundle.close();
    sizes[name] = statSync(file).size;
}

// 3. Clean up entry files
for (const name of names) {
    rmSync(`${tmpPrefix}${name}.mjs`, { force: true });
    rmSync(`bench/${name}.bundle.js`, { force: true });
}

// 4. Print sizes
const kb = (bytes) => `${(bytes / 1024).toFixed(2)} KB`;
const pad = (s, n) => String(s).padEnd(n);

console.log('\nBundle size report');
console.log('------------------');
for (const name of names) {
    console.log(`${pad(name.replaceAll('-', ' '), 16)} ${pad(sizes[name] + ' B', 10)} ${pad(kb(sizes[name]), 10)}`);
}
