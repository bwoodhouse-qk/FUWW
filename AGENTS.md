# Queerly Kiwi Pink Trolley project guidance

## Product goal

Queerly Kiwi Pink Trolley (QKPT) will be a Chrome Manifest V3 side-panel extension.
A user pastes a human-written grocery list, then the extension guides them
through searching for each item on Woolworths NZ or Pak n Save, reusing a tab
for each store.

## Current MVP boundaries

- Show a textarea and a Create list button in the side panel.
- Treat each non-empty line as one item, trimming surrounding whitespace.
- Display items below the form, preserving order, duplicates, and inner text.
- Keep the list in memory only.
- Show Update list when the textarea has unsaved changes after initial creation.
  Apply additions, deletions, and edits without searching. Preserve the selected
  item (including a renamed line); if removed, select the next remaining item,
  or the last remaining item when there is no next item. An empty list has no selection.
- Provide Shop at Woolworths and Shop at Pak n Save buttons and a reminder to log in first.
- The last store button clicked selects the store for all subsequent searches;
  default to Woolworths and show the selected store. Keep the current list and item.
- Open the selected store's homepage in a new tab, or focus an existing matching
  tab and its window without navigating that tab.
- Select the first item after list creation. Provide Previous and Next navigation
  with disabled boundaries; hide navigation and Start shopping for empty lists.
- Place Start shopping beside Create list. Search the selected item on Start
  shopping and after Previous or Next changes the selection, using an encoded store
  search URL in a reused tab (or a new tab if none exists), then focus that tab.
- Do not interact with login, product selection, or the trolley.
- Do not add features or permissions beyond this scope without a user request.

## Technology and workflow

- Use TypeScript with plain HTML and CSS, without React or another UI framework.
- Use Chrome Manifest V3, the sidePanel permission, and host access limited to
  `https://www.woolworths.co.nz/*` and `https://www.paknsave.co.nz/*` for finding existing tabs.
- Use Vitest for unit tests; keep parsing separate from DOM rendering.
- Work in small, understandable, tested increments.
- Run `npm test` and `npm run build` after changes; fix failures before finishing.
- Render user input as text, never as HTML.
- Keep README instructions accurate and dependencies minimal.
- Do not commit or push unless the user asks.
