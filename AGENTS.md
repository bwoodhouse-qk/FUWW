# FUWW project guidance

## Product goal

FUWW (“Fuck You, Woolworths”) will be a Chrome Manifest V3 side-panel extension.
A user pastes a human-written grocery list, then the extension guides them
through searching for each item on Woolworths NZ in one reusable browser tab.

## Current MVP boundaries

- Show a textarea and a Create list button in the side panel.
- Treat each non-empty line as one item, trimming surrounding whitespace.
- Display items below the form, preserving order, duplicates, and inner text.
- Keep the list in memory only.
- Do not integrate with Woolworths, navigate tabs, or automate cart actions yet.
- Do not add features or permissions beyond this scope without a user request.

## Technology and workflow

- Use TypeScript with plain HTML and CSS, without React or another UI framework.
- Use Chrome Manifest V3 and the sidePanel permission.
- Use Vitest for unit tests; keep parsing separate from DOM rendering.
- Work in small, understandable, tested increments.
- Run `npm test` and `npm run build` after changes; fix failures before finishing.
- Render user input as text, never as HTML.
- Keep README instructions accurate and dependencies minimal.
- Do not commit or push unless the user asks.
