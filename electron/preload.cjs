const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getStoragePath: () => ipcRenderer.invoke('get-storage-path'),
  ensureStorageReady: () => ipcRenderer.invoke('ensure-storage-ready'),
  loadFlashcards: () => ipcRenderer.invoke('load-flashcards'),
  saveFlashcards: (cards) => ipcRenderer.invoke('save-flashcards', cards)
});
