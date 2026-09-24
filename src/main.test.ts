// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { searchWoolworths, shopAtWoolworths, searchPakNSave, shopAtPakNSave } from './shop.js';

vi.mock('./shop.js', () => ({
  searchWoolworths: vi.fn().mockResolvedValue(undefined),
  shopAtWoolworths: vi.fn().mockResolvedValue(undefined),
  searchPakNSave: vi.fn().mockResolvedValue(undefined),
  shopAtPakNSave: vi.fn().mockResolvedValue(undefined),
}));

const button = (id: string) => document.querySelector<HTMLButtonElement>(`#${id}-button`)!;
const selected = () => document.querySelector('#items [aria-current="true"]')?.textContent;
function createList(text: string) {
  document.querySelector<HTMLTextAreaElement>('#grocery-list')!.value = text;
  document.querySelector('#list-form')!.dispatchEvent(new Event('submit', { cancelable: true }));
}

beforeEach(async () => {
  vi.clearAllMocks();
  vi.resetModules();
  document.documentElement.innerHTML = readFileSync('index.html', 'utf8');
  await import('./main.js');
});

describe('shopping controls', () => {
  it('opens Pak n Save and uses it for Start, Next, and Previous, then switches back', async () => {
    createList('Milk\nBread');
    button('pak').click();
    expect(shopAtPakNSave).toHaveBeenCalledExactlyOnceWith();
    expect(document.querySelector('#store-status')!.textContent).toBe('Shopping at: Pak n Save');
    expect(document.querySelector('#shop-reminder')!.textContent).toBe('Log in to Pak n Save before you start shopping.');
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
    button('start').click();
    expect(searchPakNSave).toHaveBeenLastCalledWith('Milk');
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
    button('next').click();
    expect(selected()).toBe('Bread');
    expect(searchPakNSave).toHaveBeenLastCalledWith('Bread');
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
    expect(button('next').disabled).toBe(true);
    button('previous').click();
    expect(selected()).toBe('Milk');
    expect(searchPakNSave).toHaveBeenLastCalledWith('Milk');
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
    expect(button('previous').disabled).toBe(true);
    expect(searchWoolworths).not.toHaveBeenCalled();
    button('shop').click();
    expect(shopAtWoolworths).toHaveBeenCalledExactlyOnceWith();
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
    expect(selected()).toBe('Milk');
    expect(document.querySelector('#store-status')!.textContent).toBe('Shopping at: Woolworths');
    button('start').click();
    expect(searchWoolworths).toHaveBeenCalledExactlyOnceWith('Milk');
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
  });

  it('opens Pak n Save without a list and reports store-specific errors with retry', async () => {
    vi.mocked(shopAtPakNSave).mockRejectedValueOnce(new Error('Unavailable'));
    button('pak').click();
    expect(button('shop').disabled).toBe(true);
    expect(button('pak').disabled).toBe(true);
    button('shop').click();
    await vi.waitFor(() => expect(button('pak').disabled).toBe(false));
    expect(shopAtWoolworths).not.toHaveBeenCalled();
    expect(document.querySelector('#shop-status')!.textContent).toBe('Could not open Pak n Save. Please try again.');
    for (const id of ['start', 'previous', 'next']) expect(button(id).hidden).toBe(true);
    button('pak').click();
    await vi.waitFor(() => expect(button('pak').disabled).toBe(false));
    expect(shopAtPakNSave).toHaveBeenCalledTimes(2);
    expect(document.querySelector('#shop-status')!.textContent).toBe('');
  });

  it('hides all three controls until a non-empty list is created', () => {
    for (const id of ['start', 'previous', 'next']) expect(button(id).hidden).toBe(true);
    createList(' \n\t');
    for (const id of ['start', 'previous', 'next']) expect(button(id).hidden).toBe(true);
    expect(selected()).toBeUndefined();
    createList(' Milk \nBread');
    for (const id of ['start', 'previous', 'next']) expect(button(id).hidden).toBe(false);
    expect(selected()).toBe('Milk');
    expect(button('previous').disabled).toBe(true);
    expect(button('next').disabled).toBe(false);
  });

  it('highlights and searches in both directions, stopping at boundaries', async () => {
    createList('Milk\nBread\nApples');
    expect(searchWoolworths).not.toHaveBeenCalled();
    button('previous').click();
    expect(selected()).toBe('Milk');
    expect(searchWoolworths).not.toHaveBeenCalled();
    button('next').click();
    expect(selected()).toBe('Bread');
    expect(searchWoolworths).toHaveBeenLastCalledWith('Bread');
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
    expect(button('previous').disabled).toBe(false);
    expect(button('next').disabled).toBe(false);
    button('next').click();
    expect(selected()).toBe('Apples');
    expect(searchWoolworths).toHaveBeenLastCalledWith('Apples');
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
    expect(button('next').disabled).toBe(true);
    button('next').click();
    expect(selected()).toBe('Apples');
    button('previous').click();
    expect(selected()).toBe('Bread');
    expect(searchWoolworths).toHaveBeenLastCalledWith('Bread');
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
    button('previous').click();
    expect(selected()).toBe('Milk');
    expect(searchWoolworths).toHaveBeenLastCalledWith('Milk');
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
    expect(button('previous').disabled).toBe(true);
    expect(searchWoolworths).toHaveBeenCalledTimes(4);
    expect(shopAtWoolworths).not.toHaveBeenCalled();
  });

  it('disables both navigation buttons for a single item', () => {
    createList('Milk');
    expect(selected()).toBe('Milk');
    expect(button('previous').disabled).toBe(true);
    expect(button('next').disabled).toBe(true);
    expect(button('start').hidden).toBe(false);
  });

  it('resets selection for a replacement list and hides controls when cleared', async () => {
    createList('Milk\nBread');
    button('next').click();
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
    createList('Apples\nEggs');
    expect(selected()).toBe('Apples');
    expect(button('previous').disabled).toBe(true);
    createList('');
    expect(selected()).toBeUndefined();
    for (const id of ['start', 'previous', 'next']) expect(button(id).hidden).toBe(true);
  });

  it('places Start shopping beside Create list and searches without submitting edits', async () => {
    createList('Milk\nBread & butter');
    expect(button('start').previousElementSibling?.textContent).toBe('Create list');
    button('next').click();
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
    vi.mocked(searchWoolworths).mockClear();
    document.querySelector<HTMLTextAreaElement>('#grocery-list')!.value = 'Unsaved edits';
    button('start').click();
    expect(searchWoolworths).toHaveBeenCalledExactlyOnceWith('Bread & butter');
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
  });

  it('blocks overlapping shopping actions and allows retry after failure', async () => {
    let rejectSearch!: (error: Error) => void;
    vi.mocked(searchWoolworths).mockImplementationOnce(() => new Promise((_, reject) => {
      rejectSearch = reject;
    }));
    createList('Milk\nBread');
    button('start').click();
    expect(button('start').disabled).toBe(true);
    expect(button('shop').disabled).toBe(true);
    expect(button('next').disabled).toBe(true);
    button('next').click();
    expect(selected()).toBe('Milk');
    button('start').click();
    button('shop').click();
    expect(searchWoolworths).toHaveBeenCalledTimes(1);
    expect(shopAtWoolworths).not.toHaveBeenCalled();
    rejectSearch(new Error('Chrome unavailable'));
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
    expect(button('shop').disabled).toBe(false);
    expect(button('next').disabled).toBe(false);
    expect(document.querySelector('#shop-status')!.textContent).toContain('Please try again');
  });

  it('marks the active item with a dedicated class and locks the form while shopping is busy', async () => {
    let resolveSearch!: () => void;
    vi.mocked(searchWoolworths).mockImplementationOnce(() => new Promise<void>((resolve) => {
      resolveSearch = resolve;
    }));

    createList('Milk\nBread');
    const currentItem = document.querySelector('#items [aria-current="true"]');
    expect(currentItem).not.toBeNull();
    expect(currentItem?.classList.contains('is-current')).toBe(true);

    button('start').click();
    expect(document.querySelector<HTMLButtonElement>('#list-form button[type="submit"]')!.disabled).toBe(true);
    expect(document.querySelector<HTMLTextAreaElement>('#grocery-list')!.disabled).toBe(true);

    resolveSearch();
    await vi.waitFor(() => expect(button('start').disabled).toBe(false));
    expect(document.querySelector<HTMLButtonElement>('#list-form button[type="submit"]')!.disabled).toBe(false);
    expect(document.querySelector<HTMLTextAreaElement>('#grocery-list')!.disabled).toBe(false);
  });
});
