import { copyFile, cp } from 'node:fs/promises';

// TypeScript has already created dist/src and compiled the application.
for (const file of ['manifest.json', 'index.html', 'src/styles.css']) {
  await copyFile(new URL(`../${file}`, import.meta.url), new URL(`../dist/${file}`, import.meta.url));
}

await cp(new URL('../icons/', import.meta.url), new URL('../dist/icons/', import.meta.url), { recursive: true });

console.log('Extension built in dist/');
