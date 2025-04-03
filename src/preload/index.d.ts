import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getUsbDrives: () => Promise<string[]>;
      onUsbDeviceAdded: (callback: (device: { device: string; volume: string; type: string }) => void) => void;
      onUsbDeviceRemoved: (callback: (device: { device: string; volume: string; type: string }) => void) => void;
    };
  }
}
