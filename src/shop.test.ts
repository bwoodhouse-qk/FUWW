import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { searchWoolworths, shopAtWoolworths } from './shop.js';

const browser = {
  tabs: {
    query: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  windows: { update: vi.fn() },
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal('chrome', browser);
  browser.tabs.query.mockResolvedValue([]);
});

afterEach(() => vi.unstubAllGlobals());

describe('shopAtWoolworths', () => {
  it('opens the homepage in a new active tab when no match exists', async () => {
    await shopAtWoolworths();

    expect(browser.tabs.query).toHaveBeenCalledWith({ url: 'https://www.woolworths.co.nz/*' });
    expect(browser.tabs.create).toHaveBeenCalledExactlyOnceWith({
      url: 'https://www.woolworths.co.nz/', active: true,
    });
    expect(browser.tabs.update).not.toHaveBeenCalled();
    expect(browser.windows.update).not.toHaveBeenCalled();
  });

  it('activates an existing tab and focuses its window without navigating it', async () => {
    browser.tabs.query.mockResolvedValue([{ id: 42, windowId: 8 }]);
    await shopAtWoolworths();

    expect(browser.tabs.update).toHaveBeenCalledExactlyOnceWith(42, { active: true });
    expect(browser.windows.update).toHaveBeenCalledExactlyOnceWith(8, { focused: true });
    expect(browser.tabs.create).not.toHaveBeenCalled();
  });

  it('chooses just the first usable tab when multiple matches exist', async () => {
    browser.tabs.query.mockResolvedValue([
      { windowId: 1 }, { id: 0, windowId: 2 }, { id: 99, windowId: 3 },
    ]);
    await shopAtWoolworths();

    expect(browser.tabs.update).toHaveBeenCalledExactlyOnceWith(0, { active: true });
    expect(browser.windows.update).toHaveBeenCalledExactlyOnceWith(2, { focused: true });
    expect(browser.tabs.create).not.toHaveBeenCalled();
  });

  it('reuses the tab on a later click', async () => {
    browser.tabs.query.mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: 7, windowId: 1 }]);
    await shopAtWoolworths();
    await shopAtWoolworths();

    expect(browser.tabs.create).toHaveBeenCalledTimes(1);
    expect(browser.tabs.update).toHaveBeenCalledExactlyOnceWith(7, { active: true });
  });

  it('reports query failure without opening a potentially duplicate tab', async () => {
    browser.tabs.query.mockRejectedValue(new Error('Query failed'));
    await expect(shopAtWoolworths()).rejects.toThrow('Query failed');
    expect(browser.tabs.create).not.toHaveBeenCalled();
  });

  it('reports activation failure without creating another tab', async () => {
    browser.tabs.query.mockResolvedValue([{ id: 42, windowId: 8 }]);
    browser.tabs.update.mockRejectedValue(new Error('Tab closed'));
    await expect(shopAtWoolworths()).rejects.toThrow('Tab closed');
    expect(browser.tabs.create).not.toHaveBeenCalled();
    expect(browser.windows.update).not.toHaveBeenCalled();
  });
});

describe('searchWoolworths', () => {
  it('creates a new active tab directly at the encoded search URL', async () => {
    await searchWoolworths('milk & bread + 50% #1 / kūmara?');
    expect(browser.tabs.create).toHaveBeenCalledExactlyOnceWith({
      url: 'https://www.woolworths.co.nz/shop/search/products?search=milk%20%26%20bread%20%2B%2050%25%20%231%20%2F%20k%C5%ABmara%3F',
      active: true,
    });
    expect(browser.tabs.update).not.toHaveBeenCalled();
  });

  it('navigates an existing tab and focuses its window for each search', async () => {
    browser.tabs.query.mockResolvedValue([{ id: 42, windowId: 8 }]);
    await searchWoolworths('Milk');
    await searchWoolworths('Bread');
    expect(browser.tabs.query).toHaveBeenCalledWith({ url: 'https://www.woolworths.co.nz/*' });
    expect(browser.tabs.update).toHaveBeenNthCalledWith(1, 42, {
      active: true, url: 'https://www.woolworths.co.nz/shop/search/products?search=Milk',
    });
    expect(browser.tabs.update).toHaveBeenNthCalledWith(2, 42, {
      active: true, url: 'https://www.woolworths.co.nz/shop/search/products?search=Bread',
    });
    expect(browser.windows.update).toHaveBeenCalledWith(8, { focused: true });
    expect(browser.windows.update).toHaveBeenCalledTimes(2);
    expect(browser.tabs.create).not.toHaveBeenCalled();
  });
});
