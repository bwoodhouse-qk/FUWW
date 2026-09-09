import { parseList } from './parse-list.js';
import { shopAtWoolworths } from './shop.js';

const form = document.querySelector<HTMLFormElement>('#list-form')!;
const textarea = document.querySelector<HTMLTextAreaElement>('#grocery-list')!;
const list = document.querySelector<HTMLOListElement>('#items')!;
const status = document.querySelector<HTMLParagraphElement>('#list-status')!;
const shopButton = document.querySelector<HTMLButtonElement>('#shop-button')!;
const shopStatus = document.querySelector<HTMLParagraphElement>('#shop-status')!;

shopButton.addEventListener('click', async () => {
  // Prevent repeated clicks from creating tabs while Chrome is still responding.
  shopButton.disabled = true;
  shopStatus.textContent = '';
  try {
    await shopAtWoolworths();
  } catch {
    shopStatus.textContent = 'Could not open Woolworths. Please try again.';
  } finally {
    shopButton.disabled = false;
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const items = parseList(textarea.value);

  list.replaceChildren(...items.map((item) => {
    const element = document.createElement('li');
    element.textContent = item;
    return element;
  }));

  status.textContent = items.length === 0
    ? 'No items yet.'
    : `${items.length} ${items.length === 1 ? 'item' : 'items'}.`;
});
