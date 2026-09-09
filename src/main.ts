import { parseList } from './parse-list.js';
import { searchWoolworths, shopAtWoolworths } from './shop.js';

const form = document.querySelector<HTMLFormElement>('#list-form')!;
const textarea = document.querySelector<HTMLTextAreaElement>('#grocery-list')!;
const list = document.querySelector<HTMLOListElement>('#items')!;
const status = document.querySelector<HTMLParagraphElement>('#list-status')!;
const shopButton = document.querySelector<HTMLButtonElement>('#shop-button')!;
const shopStatus = document.querySelector<HTMLParagraphElement>('#shop-status')!;
const startButton = document.querySelector<HTMLButtonElement>('#start-button')!;
const previousButton = document.querySelector<HTMLButtonElement>('#previous-button')!;
const nextButton = document.querySelector<HTMLButtonElement>('#next-button')!;
let items: string[] = [];
let currentIndex = 0;
let shoppingBusy = false;

async function runShoppingAction(action: () => Promise<void>): Promise<void> {
  // Prevent repeated clicks from creating tabs while Chrome is still responding.
  if (shoppingBusy) return;
  shoppingBusy = true;
  updateSelection();
  shopStatus.textContent = '';
  try {
    await action();
  } catch {
    shopStatus.textContent = 'Could not open Woolworths. Please try again.';
  } finally {
    shoppingBusy = false;
    updateSelection();
  }
}

shopButton.addEventListener('click', () => void runShoppingAction(shopAtWoolworths));
function searchCurrentItem(): void {
  const item = items[currentIndex];
  if (item !== undefined) void runShoppingAction(() => searchWoolworths(item));
}
startButton.addEventListener('click', searchCurrentItem);

function updateSelection(): void {
  for (const [index, element] of Array.from(list.children).entries()) {
    if (index === currentIndex) element.setAttribute('aria-current', 'true');
    else element.removeAttribute('aria-current');
  }
  startButton.hidden = previousButton.hidden = nextButton.hidden = items.length === 0;
  shopButton.disabled = startButton.disabled = shoppingBusy;
  previousButton.disabled = shoppingBusy || currentIndex === 0;
  nextButton.disabled = shoppingBusy || currentIndex >= items.length - 1;
  status.textContent = items.length === 0
    ? 'No items yet.'
    : `Item ${currentIndex + 1} of ${items.length}.`;
}

function moveSelection(direction: number): void {
  const nextIndex = currentIndex + direction;
  if (shoppingBusy || nextIndex < 0 || nextIndex >= items.length) return;
  currentIndex = nextIndex;
  updateSelection();
  searchCurrentItem();
}
previousButton.addEventListener('click', () => moveSelection(-1));
nextButton.addEventListener('click', () => moveSelection(1));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  items = parseList(textarea.value);
  currentIndex = 0;

  list.replaceChildren(...items.map((item) => {
    const element = document.createElement('li');
    element.textContent = item;
    return element;
  }));

  updateSelection();
});
