import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, dirname } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import { platform } from 'os'
import { promisify } from 'util'

// 🚀 __dirname alternatifi:
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return result.canceled ? null : result.filePaths[0]
})

ipcMain.handle('read-directory', async (_event, dirPath: string) => {
  const files = await fs.promises.readdir(dirPath, { withFileTypes: true })
  return files.map((file) => ({
    name: file.name,
    path: path.join(dirPath, file.name),
    isDirectory: file.isDirectory()
  }))
})
ipcMain.handle('get-file-size', async (_event, filePath) => {
  const stat = await fs.promises.stat(filePath)
  return stat.size
})
ipcMain.handle('zip-files', async (event, paths: string[]) => {
  try {
    const outputZipPath = path.join(app.getPath('temp'), `archive-${Date.now()}.zip`)
    await zipFilesWithStructure(outputZipPath, paths, (progress) => {
      event.sender.send('zip-progress', progress);
    })
    return outputZipPath
  } catch (error) {
    console.error('ZIP oluşturulamadı:', error)
    throw new Error('ZIP oluşturulamadı')
  }
})

const execAsync = promisify(exec)

// Windows için: C:, D: gibi diskleri listeler
ipcMain.handle('list-root-disks', async () => {
  const os = platform()

  if (os === 'win32') {
    const { stdout } = await execAsync('wmic logicaldisk get name')
    console.log(stdout)
    const lines = stdout.trim().split('\n').slice(1) // başlık satırını atla
    const drives = lines.map((line) => line.trim()).filter((line) => line.length > 0)
    return drives
  }

  // Linux / macOS için: root dizin altındaki bağlanan dizinleri döndür
  return ['/']
})

function zipFilesWithStructure(
  outputPath: string,
  items: string[],
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => resolve())
    archive.on('error', err => reject(err))

    if (onProgress) {
      archive.on('progress', ({ fs }) => {
        const percent = fs.totalBytes ? (fs.processedBytes / fs.totalBytes) * 100 : 0;
        onProgress(Math.round(percent));
      })
    }

    archive.pipe(output)

    for (const itemPath of items) {
      const stat = fs.statSync(itemPath)
      if (stat.isDirectory()) {
        archive.directory(itemPath, path.basename(itemPath))
      } else {
        archive.file(itemPath, { name: path.basename(itemPath) })
      }
    }

    archive.finalize()
  })
}

// 🚀 **USB Depolama Aygıtlarını Listele**
ipcMain.handle('get-usb-drives', async () => {
  return new Promise((resolve, reject) => {
    let command = ''

    if (process.platform === 'win32') {
      // Windows için sadece USB depolama aygıtlarını çeken komut
      command = 'wmic logicaldisk where "drivetype=2" get deviceid, volumename, description'
    } else if (process.platform === 'linux') {
      // Linux için sadece USB depolama aygıtlarını gösteren komut
      command = 'lsblk -o NAME,MOUNTPOINT,SIZE,TRAN | grep usb'
    } else if (process.platform === 'darwin') {
      // macOS için sadece USB depolama aygıtlarını getiren komut
      command = "diskutil list | grep 'external, physical'"
    } else {
      return reject('Desteklenmeyen platform!')
    }

    exec(command, (error, stdout) => {
      if (error) {
        return reject(error)
      }

      const devices = stdout
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      console.log(devices)
      resolve(devices)
    })
  })
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
