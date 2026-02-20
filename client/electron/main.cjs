const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let localServerProcess = null;

const isDev = !app.isPackaged;

// ------------------------------------------------------------------
// Determine the correct local-server binary or script to run
// ------------------------------------------------------------------
function getServerSpawnArgs() {
    if (isDev) {
        // Dev mode: run with system node from source
        return {
            cmd: 'node',
            args: [path.join(__dirname, '../../local-server/src/index.js')],
            cwd: path.join(__dirname, '../../local-server'),
        };
    }

    // Production: use pre-compiled pkg binary from extraResources
    const platform = process.platform; // 'win32' | 'linux' | 'darwin'
    const binName = platform === 'win32' ? 'local-server-win.exe' : 'local-server-linux';
    const binPath = path.join(process.resourcesPath, 'server-bins', binName);

    if (!fs.existsSync(binPath)) {
        console.error(`[Main] Server binary not found at: ${binPath}`);
        // Fallback: try spawning from node if binary missing (user has node installed)
        return {
            cmd: 'node',
            args: [path.join(process.resourcesPath, 'local-server', 'src', 'index.js')],
            cwd: path.join(process.resourcesPath, 'local-server'),
        };
    }

    return {
        cmd: binPath,
        args: [],
        cwd: path.dirname(binPath),
    };
}

// ------------------------------------------------------------------
// Start local server subprocess
// ------------------------------------------------------------------
function startLocalServer() {
    const { cmd, args, cwd } = getServerSpawnArgs();

    console.log(`[Main] Starting local-server: ${cmd} ${args.join(' ')}`);

    const env = {
        ...process.env,
        PORT: '5001',
        NODE_ENV: 'production',
        // Store SQLite DB in user's data directory — persists across app updates
        DB_PATH: path.join(app.getPath('userData'), 'school.sqlite'),
    };

    // Make binary executable on Linux
    if (!isDev && process.platform !== 'win32') {
        try { require('fs').chmodSync(cmd, 0o755); } catch (_) { }
    }

    localServerProcess = spawn(cmd, args, {
        cwd,
        env,
        shell: false,
        // Detach slightly so it doesn't get killed abruptly on Windows
        windowsHide: true,
    });

    localServerProcess.stdout?.on('data', d => console.log('[LocalServer]', d.toString().trim()));
    localServerProcess.stderr?.on('data', d => console.error('[LocalServer ERR]', d.toString().trim()));
    localServerProcess.on('exit', code => console.log('[LocalServer] exited with code', code));
}

// ------------------------------------------------------------------
// Create the main browser window
// ------------------------------------------------------------------
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
        title: 'Sikkim Edu',
    });

    const startUrl = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../dist/index.html')}`;

    mainWindow.loadURL(startUrl);

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
}

// ------------------------------------------------------------------
// App lifecycle
// ------------------------------------------------------------------
app.whenReady().then(() => {
    startLocalServer();
    // Give local server 2s to boot before opening the window
    setTimeout(createWindow, isDev ? 0 : 2000);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (localServerProcess) {
        localServerProcess.kill();
        localServerProcess = null;
    }
    if (process.platform !== 'darwin') app.quit();
});
