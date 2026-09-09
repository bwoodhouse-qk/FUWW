// Only the Chrome API methods this feature needs; no runtime dependency.
interface ShoppingChrome {
  tabs: {
    query(options: { url: string }): Promise<{ id?: number; windowId: number }[]>;
    create(options: { url: string; active: boolean }): Promise<unknown>;
    update(id: number, options: { active: boolean }): Promise<unknown>;
  };
  windows: {
    update(id: number, options: { focused: boolean }): Promise<unknown>;
  };
}

declare const chrome: ShoppingChrome;

export async function shopAtWoolworths(): Promise<void> {
  const tabs = await chrome.tabs.query({ url: 'https://www.woolworths.co.nz/*' });
  const tab = tabs.find((candidate) => candidate.id !== undefined);

  if (tab?.id !== undefined) {
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  } else {
    await chrome.tabs.create({ url: 'https://www.woolworths.co.nz/', active: true });
  }
}
