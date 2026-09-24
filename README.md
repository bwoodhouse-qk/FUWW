# FUWW

FUWW means “Fuck You, Woolworths.” The eventual goal is a Chrome Manifest V3
side-panel extension that turns a human-written grocery list into guided searches
on Woolworths NZ or Pak n Save, using one reusable browser tab per store.

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
The item list scrolls independently, with Previous and Next kept below it in view.
Navigation scrolls the selected item into view. Once a non-empty list is created,
the setup area above can scroll independently so it does not push navigation
off-screen. Before list creation, or after clearing the list, the setup area
uses the normal page layout without its own scrollbar.

Click **Start shopping** to search for the highlighted item. FUWW navigates the
existing Woolworths tab to `/shop/search/products?search=...`, encoding the item
text safely in the URL, and focuses the tab and its window. If no matching tab
exists, it opens the search in a new active tab. **Start shopping** sits beside
**Create list**. Previous and Next highlight and immediately search the new item.
You can also click any item to highlight and search it in the selected store.
Each item is a keyboard-accessible button: use Tab to focus it, then Enter or Space.
Shopping buttons briefly disable while Chrome responds to prevent overlapping actions.
Creating a list does not search. Editing the textarea
does not change the saved list until you click **Update list**. This button
appears when you change the textarea after creating a list, and hides again
after applying or undoing those changes. Add lines, delete lines, or edit their text.

Update list preserves the highlighted item, including when lines above it change.
Editing the selected line keeps that edited line selected. Removing it selects
the next remaining item, or the last remaining item if there is no next one.
Removing every line clears selection and hides shopping controls. Updating never
starts a search. **Create list** still starts a fresh list at the first item.
Since plain text has no item IDs, identical duplicates are matched in occurrence
order and line edits are inferred from neighbouring text.

There is no interaction with login, product selection, or the trolley.

## Pak n Save

Click **Shop at Pak n Save** to open `https://www.paknsave.co.nz/`, or focus
an existing tab on that host without changing its page. This also selects Pak n
Save for **Start shopping**, **Previous**, and **Next**. Its searches use
`https://www.paknsave.co.nz/shop/search?q=...` with encoded item text.

The panel shows the selected store and updates the login reminder. Click
**Shop at Woolworths** to switch back. Switching stores preserves your list and
highlighted item. Each store reuses its own tab, including across Chrome windows.
The selected store stays in memory for the panel session and defaults to
Woolworths when the panel page reloads. The list controls behave the same for both stores.

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
15. Click Shop at Pak n Save with no list: its homepage should open and the
    selected-store label and login reminder should change. Click again and
    confirm no duplicate tab is created.
16. Create a list and repeat Start shopping, Previous, and Next with Pak n Save.
    Confirm the highlighted item matches the live search, including `bread & butter`
    and `kūmara`. Test with its tab in another window and with no Pak n Save tab open.
17. With both stores open, switch back and forth using their Shop buttons.
    Confirm the list and highlighted item stay the same and searches navigate
    only the selected store's tab. Check tab focus and live results manually;
    automated tests use mocked Chrome APIs.

After editing the code, rebuild, click the extension's reload button on
`chrome://extensions`, and close and reopen its panel.

To check scrolling manually, create a long list and step forward and backward
through it. Confirm the current item stays visible and the navigation buttons
stay in place. Repeat in a short Chrome window and with a long, wrapped item;
items taller than the list viewport are shown from their top. The automated
scroll tests use simulated geometry because jsdom does not perform layout.

To check editing, select a middle item, add and delete lines above it, and click
Update list. Confirm the same item stays highlighted and no search starts. Rename
it, then remove it, checking the edited item and then the next item are selected.
Clear all lines, apply the update, and add a new list. Verify scrolling and shopping
still work with the updated items in Chrome.

## Permissions

`sidePanel` enables the panel. The host permissions
`https://www.woolworths.co.nz/*` and `https://www.paknsave.co.nz/*` let FUWW find
existing tabs on those specific HTTPS hosts. Creating and activating tabs and focusing windows need no additional
permission. FUWW does not request the broad `tabs` permission or inject scripts.
See the [Chrome tabs API documentation](https://developer.chrome.com/docs/extensions/reference/api/tabs).
This update adds only the Pak n Save host permission. After rebuilding and
reloading the extension, allow that site permission if Chrome asks.

## Project structure

- `manifest.json`: tells Chrome this is a Manifest V3 extension and identifies
  its side-panel page and the permissions explained above.
- `index.html`: the panel's heading, labelled textarea, button, and results list.
- `src/styles.css`: simple styling for a narrow panel.
- `src/main.ts`: handles list creation, current-item navigation, and shopping buttons.
- `src/main.test.ts`: tests the real panel HTML using jsdom, a test-only DOM environment.
- `src/parse-list.ts`: converts text into an array of shopping-list items.
- `src/parse-list.test.ts`: Vitest tests for the parser's input rules.
- `src/update-selection.ts`: matches the selected item to an edited list.
- `src/update-selection.test.ts`: tests selection across additions, edits, and deletions.
- `src/shop.ts`: opens either store, searches via encoded URLs, and shares tab-reuse logic.
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
