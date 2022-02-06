/* eslint-disable @typescript-eslint/no-unused-vars */
import { app, BrowserWindow, ipcMain, nativeTheme, Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';
const githubOAuth = require('./modules/authenticator');
const menuBuilder = require('./modules/menuBuilder');
const mb = menuBuilder();
require('dotenv').config();

// Getting Menus

const loggedOutMenu = Menu.buildFromTemplate(mb.getLoggedOutMenu());
const loggedInMenu = Menu.buildFromTemplate(mb.getLoggedInMenu());
// Github Auth Algorithm

const config = {
  clientId: process.env.GH_CLIENT_ID,
  clientSecret: process.env.GH_CLIENT_SECRET,
  authorizationUrl: 'http://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  useBasicAuthorizationHeader: false,
  redirectUri: 'gravity://auth'
};

const options = {
  scope: 'repo,admin:repo_hook,admin:org,admin:public_key,admin:org_hook,gist,notifications,user,delete_repo,write:discussion,write:packages,read:packages,delete:packages,admin:gpg_key,workflow'
};

const windowParams = {
  alwaysOnTop: true,
  autoHideMenuBar: true,
  webPreferences: {
    nodeIntegration: false
  },
  title: 'Authorize Gravity'
};

const githubAuth = githubOAuth(config, windowParams);

ipcMain.on('github-oauth', (event, arg) => {
  githubAuth.getAccessToken(options)
    .then(token => {
      Menu.setApplicationMenu(loggedInMenu);
      event.sender.send('github-oauth-reply', token);
    }, err => {
      console.log('Error while getting token', err);
    });
});

ipcMain.on('set-logout-menu', (event, arg) => {
  Menu.setApplicationMenu(loggedOutMenu);
});

ipcMain.on('set-login-menu', (event, arg) => {
  Menu.setApplicationMenu(loggedInMenu);
});

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  // const electronScreen = screen;
  // const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    // x: 0,
    // y: 0,
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system';
  });

  ipcMain.handle('currentTheme', () => {
    return { scheme: nativeTheme.themeSource, darkColorsUsed: nativeTheme.shouldUseDarkColors};
  });

  if (serve) {

    win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
