import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    getPrograms: (): Promise<string[]> => ipcRenderer.invoke('get-programs'), // 프로그램 목록 요청
});
