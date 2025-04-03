import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// USB API'yi expose et
const api = {
  getUsbDrives: () => ipcRenderer.invoke('get-usb-drives'),
  onUsbDeviceAdded: (callback: (device: any) => void) => {
    ipcRenderer.on('usb-device-added', (_, device) => callback(device));
  },
  onUsbDeviceRemoved: (callback: (device: any) => void) => {
    ipcRenderer.on('usb-device-removed', (_, device) => callback(device));
  },
};

// Eğer contextIsolation etkinse güvenli şekilde expose et
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error('Preload hata:', error);
  }
} else {
  // Eğer contextIsolation kapalıysa, doğrudan window objesine ekle
  // @ts-ignore
  window.electron = electronAPI;
  // @ts-ignore
  window.api = api;
}
