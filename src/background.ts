// Chrome handles toolbar clicks, including after this worker goes idle.
declare const chrome: {
  sidePanel: {
    setPanelBehavior(options: { openPanelOnActionClick: boolean }): Promise<void>;
  };
};

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error: unknown) => {
  console.error('Could not enable the shopping panel toolbar button:', error);
});

export {};
