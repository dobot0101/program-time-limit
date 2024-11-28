import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { exec } from 'child_process';

let mainWindow: BrowserWindow | null;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Preload 스크립트
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
});

// 실행 중인 프로그램 목록 가져오기
ipcMain.handle('get-programs', async (): Promise<string[]> => {
    const platform = process.platform;
    const command = platform === 'win32' ? 'tasklist' : 'ps -ax';

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
            if (error) {
                reject(`Error fetching programs: ${error.message}`);
                return;
            }

            const programs = platform === 'win32'
                ? parseWindowsProcesses(stdout)
                : parseMacProcesses(stdout);

            resolve(programs);
        });
    });
});

// Windows 프로세스 파싱
function parseWindowsProcesses(stdout: string): string[] {
    return stdout
        .split('\n')
        .slice(3) // 헤더 제거
        .map(line => line.trim().split(/\s+/)[0]) // 프로세스 이름
        .filter(name => name);
}

// Mac 프로세스 파싱
function parseMacProcesses(stdout: string): string[] {
    return stdout
        .split('\n')
        .slice(1) // 헤더 제거
        .map(line => line.trim().split(/\s+/).pop() || '') // 프로세스 이름
        .filter(name => name);
}
