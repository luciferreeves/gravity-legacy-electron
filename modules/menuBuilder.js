'use strict';

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow;

module.exports = function () {

    const isMac = process.platform === 'darwin'

    const loggedOutMenuTemplate = [
        ...(isMac ? [{
            label: 'Gravity',
            submenu: [
                {
                    label: 'About Gravity',
                    role: 'about',
                },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        {
            label: 'File',
            submenu: [
                isMac ? { role: 'close' } : { role: 'quit' },
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [
                        { role: 'close' }
                    ])
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Gravity Help',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://github.com/luciferreeves/gravity')
                    }
                }
            ]
        }
    ]

    const loggedInMenuTemplate = [
        ...(isMac ? [{
            label: 'Gravity',
            submenu: [
                {
                    label: 'About Gravity',
                    role: 'about',
                },
                { type: 'separator' },
                {
                    label: 'Preferences',
                    accelerator: 'CmdOrCtrl+,'
                },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        {
            label: 'File',
            submenu: [
                {
                    label: 'New',
                    submenu: [
                        {
                            'label': 'Gist',
                            accelerator: 'CmdOrCtrl+Shift+G'
                        },
                        {
                            'label': 'Organization',
                            accelerator: 'CmdOrCtrl+Shift+O'
                        },
                        {
                            'label': 'Project',
                            accelerator: 'CmdOrCtrl+Shift+P'
                        },
                        {
                            'label': 'Repository',
                            accelerator: 'CmdOrCtrl+Shift+R'
                        },
                    ]
                },
                {
                    label: 'Generate',
                    submenu: [
                        {
                            'label': 'Gitignore'
                        },
                        {
                            'label': 'License'
                        },
                    ]
                },
                {
                    label: 'Open Repository',
                    accelerator: 'CmdOrCtrl+O'
                },
                { type: 'separator' },
                {
                    label: 'Account',
                    submenu: [
                        {
                            label: 'My Gists',
                            accelerator: 'CmdOrCtrl+Alt+Shift+G'
                        },
                        {
                            label: 'My Organisations',
                            accelerator: 'CmdOrCtrl+Alt+Shift+O'
                        },
                        {
                            label: 'My Projects',
                            accelerator: 'CmdOrCtrl+Alt+Shift+P'
                        },
                        {
                            label: 'My Repositories',
                            accelerator: 'CmdOrCtrl+Alt+Shift+R'
                        },
                        { type: 'separator' },
                        {
                            'label': 'Profile'
                        },
                        {
                            label: 'Billing',
                            submenu: [
                                {
                                    label: 'Actions Billing'
                                },
                                {
                                    label: 'Packages Billing'
                                },
                                {
                                    label: 'Storage Billing'
                                }
                            ]
                        }
                    ]
                },
                {
                    label: 'Logout'
                },
                { type: 'separator' },
                isMac ? { role: 'close' } : { role: 'quit' },
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startspeaking' },
                            { role: 'stopspeaking' }
                        ]
                    }
                ] : [
                        { role: 'delete' },
                        { type: 'separator' },
                        { role: 'selectAll' }
                    ])
            ]
        },
        {
            label: 'Activity',
            submenu: [
                {
                    label: 'Events',
                    submenu: [
                        {
                            label: 'Public Events'
                        },
                        {
                            label: 'Organization Events'
                        },
                    ]
                },
                {
                    label: 'Feeds'
                },
                { type: 'separator' },
                {
                    label: 'Notifications',
                    accelerator: 'CmdOrCtrl+Shift+N'
                },
                { type: 'separator' },
                {
                    label: 'Starred Repositories',
                    accelerator: 'CmdOrCtrl+Shift+8'
                },
                {
                    label: 'Subscribed Respositories'
                },
            ]
        },
        {
            label: 'Search',
            submenu: [
                {
                    label: 'Search Repositories',
                    accelerator: 'CmdOrCtrl+F'
                },
                {
                    label: 'Search Topics'
                },
                {
                    label: 'Search Users'
                },
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                { type: 'separator' },
                { role: 'toggledevtools' },
                { role: 'reload' },
                { role: 'forcereload' },
                { type: 'separator' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [
                        { role: 'close' }
                    ])
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Gravity Help',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://github.com/luciferreeves/gravity')
                    }
                }
            ]
        }
    ]

    function getLoggedOutMenu() {
        return loggedOutMenuTemplate;
    }

    function getLoggedInMenu() {
        return loggedInMenuTemplate;
    }

    function showAboutMenu() {

        const win = new BrowserWindow({
            autoHideMenuBar: true,
            width: 600,
            height: 350,
            frame: false,
            titleBarStyle: 'hidden',
            webPreferences: {
                nodeIntegration: true
            },
            show: false,
        })

        win.setResizable(false);
        win.setMinimizable(false);
        win.setFullScreenable(false);
        win.setMaximizable(false);

        win.removeMenu();

        win.loadFile('views/about.html');

        win.once('ready-to-show', () => {
            win.show();
        });
    }

    return {
        getLoggedOutMenu: getLoggedOutMenu,
        getLoggedInMenu: getLoggedInMenu
    }

}

