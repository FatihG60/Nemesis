import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join, dirname } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

// 🚀 __dirname alternatifi:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// 🚀 **USB Depolama Aygıtlarını Listele**
ipcMain.handle('get-usb-drives', async () => {
  return new Promise((resolve, reject) => {
    let command = '';

    if (process.platform === 'win32') {
      // Windows için sadece USB depolama aygıtlarını çeken komut
      command = 'wmic logicaldisk where "drivetype=2" get deviceid, volumename, description';
    } else if (process.platform === 'linux') {
      // Linux için sadece USB depolama aygıtlarını gösteren komut
      command = "lsblk -o NAME,MOUNTPOINT,SIZE,TRAN | grep usb";
    } else if (process.platform === 'darwin') {
      // macOS için sadece USB depolama aygıtlarını getiren komut
      command = "diskutil list | grep 'external, physical'";
    } else {
      return reject('Desteklenmeyen platform!');
    }

    exec(command, (error, stdout) => {
      if (error) {
        return reject(error);
      }

      const devices = stdout
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

        console.log(devices);
      resolve(devices);
    });
  });
});

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.on('ping', () => console.log('pong'));

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
