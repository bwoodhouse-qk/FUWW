# FUWW

FUWW means “Fuck You, Woolworths.” The eventual goal is a Chrome Manifest V3
side-panel extension that turns a human-written grocery list into guided searches
on Woolworths NZ, using one reusable browser tab.

This version parses and displays a list. Paste one item per line and
click **Create list**. Empty lines are ignored and surrounding whitespace is
trimmed. Item order, duplicates, and the wording inside each line are preserved.
Creating another list replaces the displayed items. The list is held only in
memory and is lost when the panel page is closed or reloaded.

Click **Shop at Woolworths** to open the Woolworths NZ homepage in a new tab.
If a tab on `https://www.woolworths.co.nz/` is already open (including any path),
FUWW activates the first matching tab and focuses its window, keeping its current
page. Log in to Woolworths before you start shopping.

After creating a non-empty list, the first item is highlighted. **Previous** and
**Next** change the current item, stopping at the ends of the list. These buttons
and **Start shopping** are hidden until a non-empty list is created. Creating a
replacement list selects its first item; submitting blank input hides the controls.

Click **Start shopping** to search for the highlighted item. FUWW navigates the
existing Woolworths tab to `/shop/search/products?search=...`, encoding the item
text safely in the URL, and focuses the tab and its window. If no matching tab
exists, it opens the search in a new active tab. **Start shopping** sits beside
**Create list**. Previous and Next highlight and immediately search the new item.
Shopping buttons briefly disable while Chrome responds to prevent overlapping actions.
Creating a list does not search. Editing the textarea
does not change the saved list until you click Create list again.

There is no interaction with login, product selection, or the trolley.

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
7. With no Woolworths NZ tabs open, click **Shop at Woolworths**. Confirm that
   one new tab opens at `https://www.woolworths.co.nz/`.
8. Click it again: the existing tab should activate without adding another tab.
9. Move that tab into another Chrome window and navigate to another page on the
   same site. Click the button in FUWW again: that window and tab should focus,
   keeping the page you selected. With multiple matching tabs, only one activates.
10. Check that the login reminder appears beside the button and list creation
    still works. FUWW does not log you in or select products.
11. Reopen the panel and confirm Start shopping, Previous, and Next are hidden.
    Create a three-item list: the first item should be highlighted and Previous
    disabled. Step forward and back; Next should be disabled at the last item.
    Each Previous/Next selection change should search the newly highlighted item
    in the reused Woolworths tab. Check Start shopping sits beside Create list.
12. Click Start shopping on the second item. Confirm the existing tab shows
    search results for that item, including when the tab is in another window.
    Repeat for another item and check no extra tabs appear. Close all Woolworths
    tabs and repeat: one new tab should open directly to search results.
13. Try `bread & butter` and `kūmara` to check the live site's handling of encoded
    text. The route was checked against the public site, but the complete flow
    still needs manual verification in Chrome; automated tests mock Chrome and
    do not verify the site's results or redirects.
14. Create a single-item list (both navigation buttons disabled), replace it
    with another list (first item selected), then submit blank input (controls hidden).

After editing the code, rebuild, click the extension's reload button on
`chrome://extensions`, and close and reopen its panel.

## Permissions

`sidePanel` enables the panel. The host permission
`https://www.woolworths.co.nz/*` lets FUWW find existing tabs on that specific
HTTPS host. Creating and activating tabs and focusing windows need no additional
permission. FUWW does not request the broad `tabs` permission or inject scripts.
See the [Chrome tabs API documentation](https://developer.chrome.com/docs/extensions/reference/api/tabs).
This search feature adds no permissions; the existing Woolworths host permission
also covers navigation to its search page.

## Project structure

- `manifest.json`: tells Chrome this is a Manifest V3 extension and identifies
  its side-panel page and the permissions explained above.
- `index.html`: the panel's heading, labelled textarea, button, and results list.
- `src/styles.css`: simple styling for a narrow panel.
- `src/main.ts`: handles list creation, current-item navigation, and shopping buttons.
- `src/main.test.ts`: tests the real panel HTML using jsdom, a test-only DOM environment.
- `src/parse-list.ts`: converts text into an array of shopping-list items.
- `src/parse-list.test.ts`: Vitest tests for the parser's input rules.
- `src/shop.ts`: opens Woolworths, searches via encoded URLs, and reuses its tab.
- `src/shop.test.ts`: tests tab creation, reuse, and failures with mocked Chrome APIs.
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
