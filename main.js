const { app, BrowserWindow } = require('electron');

let win

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        //frame: false,
        icon: 'img/icon.png',
        webPreferences: {
            pageVisibility: true,
            backgroundThrottling: false,
        },
    });
    win.setMenu(null);
    //win.setResizable(false);
    win.loadFile('index.html');
    win.webContents.openDevTools();
    win.on('closed', () => {
        win = null;
    });
}
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});