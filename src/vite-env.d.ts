/// <reference types="vite/client" />

declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';
declare module '*.styl';

declare global {
  interface Window {
    electronAPI?: {
      getStoragePath: () => Promise<string | null>;
      ensureStorageReady: () => Promise<{ storagePath: string | null; isConfigured: boolean }>;
      loadFlashcards: () => Promise<unknown>;
      saveFlashcards: (cards: unknown) => Promise<void>;
    };
  }
}

export {};