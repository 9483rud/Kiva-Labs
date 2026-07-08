import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_CONFIG_PATH = path.join(app.getPath('userData'), 'storage-config.json');
const FLASHCARDS_FILE_NAME = 'flashcards.json';

const DEFAULT_FLASHCARDS = [
  {
    id: 1,
    front: 'What is spaced repetition?',
    back: 'A learning technique that reviews cards at increasing intervals to improve long-term memory.',
    dueIn: 'Today'
  },
  {
    id: 2,
    front: 'What is active recall?',
    back: 'Actively retrieving information from memory instead of just rereading notes.',
    dueIn: 'Today'
  },
  {
    id: 3,
    front: 'When should you review a forgotten card?',
    back: 'Review it again sooner and repeat it in shorter intervals until it sticks.',
    dueIn: 'Tomorrow'
  },
  {
    id: 4,
    front: 'How can small daily sessions help?',
    back: 'Frequent short reviews build consistency and prevent overload.',
    dueIn: 'Tomorrow'
  }
];

let storagePath = null;
let mainWindow = null;

function readConfiguredStoragePath() {
  if (!fs.existsSync(STORAGE_CONFIG_PATH)) {
    return null;
  }

  try {
    const savedState = JSON.parse(fs.readFileSync(STORAGE_CONFIG_PATH, 'utf8'));
    if (typeof savedState?.storagePath === 'string' && savedState.storagePath.trim()) {
      return savedState.storagePath;
    }
  } catch {
    return null;
  }

  return null;
}

function writeConfiguredStoragePath(targetPath) {
  fs.writeFileSync(STORAGE_CONFIG_PATH, JSON.stringify({ storagePath: targetPath }, null, 2));
}

function ensureStorageDirectory(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
  return targetPath;
}

function getFlashcardsFilePath() {
  if (!storagePath) {
    return null;
  }

  return path.join(storagePath, FLASHCARDS_FILE_NAME);
}

function ensureDefaultFlashcardsFile(targetPath) {
  if (!targetPath) {
    return;
  }

  if (!fs.existsSync(targetPath)) {
    fs.writeFileSync(targetPath, JSON.stringify(DEFAULT_FLASHCARDS, null, 2));
  }
}

async function selectStoragePath() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Choose your Kiva Labs storage folder',
    properties: ['openDirectory', 'createDirectory']
  });

  if (canceled || !filePaths?.length) {
    return null;
  }

  const chosenPath = ensureStorageDirectory(filePaths[0]);
  writeConfiguredStoragePath(chosenPath);
  storagePath = chosenPath;
  ensureDefaultFlashcardsFile(getFlashcardsFilePath());
  return chosenPath;
}

async function ensureStorageReady() {
  const configuredPath = readConfiguredStoragePath();

  if (configuredPath && fs.existsSync(configuredPath)) {
    storagePath = configuredPath;
    ensureDefaultFlashcardsFile(getFlashcardsFilePath());
    return { storagePath: configuredPath, isConfigured: true };
  }

  const selectedPath = await selectStoragePath();
  if (!selectedPath) {
    return { storagePath: null, isConfigured: false };
  }

  return { storagePath: selectedPath, isConfigured: true };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  const distIndexPath = path.join(__dirname, '..', 'dist', 'index.html');

  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else if (fs.existsSync(distIndexPath)) {
    mainWindow.loadFile(distIndexPath);
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }
}

ipcMain.handle('get-storage-path', () => storagePath || readConfiguredStoragePath());

ipcMain.handle('ensure-storage-ready', async () => ensureStorageReady());

ipcMain.handle('load-flashcards', () => {
  const configuredPath = storagePath || readConfiguredStoragePath();
  if (!configuredPath) {
    return [];
  }

  storagePath = configuredPath;
  const flashcardsPath = getFlashcardsFilePath();

  if (!flashcardsPath || !fs.existsSync(flashcardsPath)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(flashcardsPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
});

ipcMain.handle('save-flashcards', (_event, cards) => {
  const configuredPath = storagePath || readConfiguredStoragePath();
  if (!configuredPath) {
    return;
  }

  storagePath = configuredPath;
  const flashcardsPath = getFlashcardsFilePath();

  if (!flashcardsPath) {
    return;
  }

  fs.writeFileSync(flashcardsPath, JSON.stringify(cards ?? [], null, 2));
});

app.whenReady().then(async () => {
  const storageReady = await ensureStorageReady();

  if (!storageReady.storagePath) {
    app.quit();
    return;
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
