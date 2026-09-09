# FUWW

FUWW means “Fuck You, Woolworths.” The eventual goal is a Chrome Manifest V3
side-panel extension that turns a human-written grocery list into guided searches
on Woolworths NZ, using one reusable browser tab.

This first version only parses and displays a list. Paste one item per line and
click **Create list**. Empty lines are ignored and surrounding whitespace is
trimmed. Item order, duplicates, and the wording inside each line are preserved.
Creating another list replaces the displayed items. The list is held only in
memory and is lost when the panel page is closed or reloaded.

There is no Woolworths integration, tab navigation, or automatic cart behaviour.

## Getting started

Install Node.js 24 LTS (which includes npm), then run these commands from this folder:

```sh
npm install
npm test
npm run build
```

`npm test` runs the Vitest unit tests once. `npm run test:watch` reruns tests as
you edit. `npm run build` checks and compiles TypeScript, then copies the static
files into `dist/`. It does not require a development server.

## Load into Chrome

1. Run `npm run build`.
2. Open `chrome://extensions` in a current desktop version of Chrome.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select this project's **dist** folder.
5. Open Chrome's Extensions menu (the puzzle-piece icon), find **FUWW**, and
   choose **Open side panel** from its menu.
6. Paste a few lines, including a blank line, and click **Create list**. Check
   that the items appear beneath the form. Submit an empty list to clear them.

After editing the code, rebuild, click the extension's reload button on
`chrome://extensions`, and close and reopen its panel.

## Project structure

- `manifest.json`: tells Chrome this is a Manifest V3 extension and identifies
  its side-panel page. Its only permission is `sidePanel`.
- `index.html`: the panel's heading, labelled textarea, button, and results list.
- `src/styles.css`: simple styling for a narrow panel.
- `src/main.ts`: handles form submission and displays items as plain text.
- `src/parse-list.ts`: converts text into an array of shopping-list items.
- `src/parse-list.test.ts`: Vitest tests for the parser's input rules.
- `tsconfig.json`: TypeScript settings for checking and compiling the app.
- `scripts/build.mjs`: copies the HTML, CSS, and manifest after compilation.
- `package.json`: development dependencies and commands.
- `package-lock.json`: records the installed dependency versions.
- `AGENTS.md`: project scope and guidance for future coding work.
- `.gitignore`: keeps generated files and local clutter out of Git.
- `dist/`: generated extension files; load this folder into Chrome.
- `FUWW.code-workspace`: the existing editor workspace file.

The implementation uses TypeScript, plain HTML/CSS, and Vitest, without a UI
framework or bundler. Chrome runs the compiled JavaScript as a local ES module.
