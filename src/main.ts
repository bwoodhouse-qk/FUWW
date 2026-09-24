import { parseList } from './parse-list.js';
import { searchWoolworths, shopAtWoolworths, searchPakNSave, shopAtPakNSave } from './shop.js';

const form = document.querySelector<HTMLFormElement>('#list-form')!;
const textarea = document.querySelector<HTMLTextAreaElement>('#grocery-list')!;
const list = document.querySelector<HTMLOListElement>('#items')!;
const status = document.querySelector<HTMLParagraphElement>('#list-status')!;
const shopButton = document.querySelector<HTMLButtonElement>('#shop-button')!;
const pakButton = document.querySelector<HTMLButtonElement>('#pak-button')!;
const storeStatus = document.querySelector<HTMLParagraphElement>('#store-status')!;
const reminder = document.querySelector<HTMLParagraphElement>('#shop-reminder')!;
const shopStatus = document.querySelector<HTMLParagraphElement>('#shop-status')!;
const startButton = document.querySelector<HTMLButtonElement>('#start-button')!;
const previousButton = document.querySelector<HTMLButtonElement>('#previous-button')!;
const nextButton = document.querySelector<HTMLButtonElement>('#next-button')!;
let items: string[] = [];
let currentIndex = 0;
let shoppingBusy = false;
const stores = {
  woolworths: { name: 'Woolworths', open: shopAtWoolworths, search: searchWoolworths },
  paknsave: { name: 'Pak n Save', open: shopAtPakNSave, search: searchPakNSave },
};
let selectedStore: keyof typeof stores = 'woolworths';

async function runShoppingAction(action: () => Promise<void>): Promise<void> {
  // Prevent repeated clicks from creating tabs while Chrome is still responding.
  if (shoppingBusy) return;
  shoppingBusy = true;
  updateSelection();
  shopStatus.textContent = '';
  try {
    await action();
  } catch {
    shopStatus.textContent = `Could not open ${stores[selectedStore].name}. Please try again.`;
  } finally {
    shoppingBusy = false;
    updateSelection();
  }
}

function chooseStore(store: keyof typeof stores): void {
  if (shoppingBusy) return;
  selectedStore = store;
  storeStatus.textContent = `Shopping at: ${stores[store].name}`;
  reminder.textContent = `Log in to ${stores[store].name} before you start shopping.`;
  void runShoppingAction(stores[store].open);
}
shopButton.addEventListener('click', () => chooseStore('woolworths'));
pakButton.addEventListener('click', () => chooseStore('paknsave'));

function lockListControls(): void {
  textarea.disabled = shoppingBusy;
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (submitButton) submitButton.disabled = shoppingBusy;
}

function searchCurrentItem(): void {
  const item = items[currentIndex];
  if (item !== undefined) void runShoppingAction(() => stores[selectedStore].search(item));
}
startButton.addEventListener('click', searchCurrentItem);

function updateSelection(): void {
  document.querySelector('main')!.classList.toggle('has-items', items.length > 0);
  for (const [index, element] of Array.from(list.children).entries()) {
    if (index === currentIndex) {
      element.setAttribute('aria-current', 'true');
      element.classList.add('is-current');
    } else {
      element.removeAttribute('aria-current');
      element.classList.remove('is-current');
    }
  }
  startButton.hidden = previousButton.hidden = nextButton.hidden = items.length === 0;
  shopButton.disabled = pakButton.disabled = startButton.disabled = shoppingBusy;
  previousButton.disabled = shoppingBusy || currentIndex === 0;
  nextButton.disabled = shoppingBusy || currentIndex >= items.length - 1;
  lockListControls();
  status.textContent = items.length === 0
    ? 'No items yet.'
    : `Item ${currentIndex + 1} of ${items.length}.`;
}

function revealCurrentItem(): void {
  const item = list.children[currentIndex];
  if (!item) return;
  const viewport = list.getBoundingClientRect();
  const bounds = item.getBoundingClientRect();
  // Scroll only the list, leaving the setup area and navigation in place.
  if (bounds.top < viewport.top || bounds.height > list.clientHeight) {
    list.scrollTop += bounds.top - viewport.top;
  } else if (bounds.bottom > viewport.bottom) {
    list.scrollTop += bounds.bottom - viewport.bottom;
  }
}

function moveSelection(direction: number): void {
  const nextIndex = currentIndex + direction;
  if (shoppingBusy || nextIndex < 0 || nextIndex >= items.length) return;
  currentIndex = nextIndex;
  updateSelection();
  revealCurrentItem();
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
  list.scrollTop = 0;

  updateSelection();
});
