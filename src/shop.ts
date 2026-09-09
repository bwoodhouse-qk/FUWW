// Only the Chrome API methods this feature needs; no runtime dependency.
interface ShoppingChrome {
  tabs: {
    query(options: { url: string }): Promise<{ id?: number; windowId: number }[]>;
    create(options: { url: string; active: boolean }): Promise<unknown>;
    update(id: number, options: { active: boolean; url?: string }): Promise<unknown>;
  };
  windows: {
    update(id: number, options: { focused: boolean }): Promise<unknown>;
  };
}

declare const chrome: ShoppingChrome;

export function shopAtWoolworths(): Promise<void> {
  return openWoolworths();
}

export function searchWoolworths(item: string): Promise<void> {
  return openWoolworths(`https://www.woolworths.co.nz/shop/search/products?search=${encodeURIComponent(item)}`);
}

async function openWoolworths(searchUrl?: string): Promise<void> {
  const tabs = await chrome.tabs.query({ url: 'https://www.woolworths.co.nz/*' });
  const tab = tabs.find((candidate) => candidate.id !== undefined);

  if (tab?.id !== undefined) {
    await chrome.tabs.update(tab.id, { active: true, ...(searchUrl ? { url: searchUrl } : {}) });
    await chrome.windows.update(tab.windowId, { focused: true });
  } else {
    await chrome.tabs.create({ url: searchUrl ?? 'https://www.woolworths.co.nz/', active: true });
  }
}
