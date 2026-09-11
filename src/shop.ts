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
  return openStore('https://www.woolworths.co.nz/');
}

export function searchWoolworths(item: string): Promise<void> {
  return openStore('https://www.woolworths.co.nz/', `https://www.woolworths.co.nz/shop/search/products?search=${encodeURIComponent(item)}`);
}

export function shopAtPakNSave(): Promise<void> {
  return openStore('https://www.paknsave.co.nz/');
}

export function searchPakNSave(item: string): Promise<void> {
  return openStore('https://www.paknsave.co.nz/', `https://www.paknsave.co.nz/shop/search?q=${encodeURIComponent(item)}`);
}

async function openStore(homeUrl: string, searchUrl?: string): Promise<void> {
  const tabs = await chrome.tabs.query({ url: `${homeUrl}*` });
  const tab = tabs.find((candidate) => candidate.id !== undefined);

  if (tab?.id !== undefined) {
    await chrome.tabs.update(tab.id, { active: true, ...(searchUrl ? { url: searchUrl } : {}) });
    await chrome.windows.update(tab.windowId, { focused: true });
  } else {
    await chrome.tabs.create({ url: searchUrl ?? homeUrl, active: true });
  }
}
