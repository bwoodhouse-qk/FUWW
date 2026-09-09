import { parseList } from './parse-list.js';

const form = document.querySelector<HTMLFormElement>('#list-form')!;
const textarea = document.querySelector<HTMLTextAreaElement>('#grocery-list')!;
const list = document.querySelector<HTMLOListElement>('#items')!;
const status = document.querySelector<HTMLParagraphElement>('#list-status')!;

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
