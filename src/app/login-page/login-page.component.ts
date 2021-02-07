/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private _electronService: ElectronService) { }

  ngOnInit(): void {
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async setTheme(theme: string) {
    const themeInvoker = await this._electronService.ipcRenderer.invoke('currentTheme');
    const currentSelectedTheme = themeInvoker.scheme; // light, dark or system
    const isCurrentColorSchemeDark = themeInvoker.darkColorsUsed; // dark = true or false
    const currentSelectedThemeElement = document.getElementsByClassName('selected')[0];
    currentSelectedThemeElement.classList.remove('selected');
    document.getElementById(theme).classList.add('selected');

    // Dark theme is clicked and the system theme is selected currently and the current system theme is light
    // or Dark theme is clicked and the light theme is selected currently
    // then go ahead and toggle the dark mode

    if (theme === 'dark' && currentSelectedTheme === 'system' && !isCurrentColorSchemeDark || theme === 'dark' && currentSelectedTheme === 'light') {
      await this._electronService.ipcRenderer.invoke('dark-mode:toggle');
    }

    // light theme is clicked and the system theme is selected currently and the current system theme is dark
    // or light theme is clicked and the dark theme is selected currently
    // then go ahead and toggle the light mode

    if (theme === 'light' && currentSelectedTheme === 'system' && isCurrentColorSchemeDark || theme === 'light' && currentSelectedTheme === 'dark') {
      await this._electronService.ipcRenderer.invoke('dark-mode:toggle');
    }

    // system theme is clicked

    if (theme === 'system') {
      await this._electronService.ipcRenderer.invoke('dark-mode:system');
    }
  }
  
  showDataIsSafeDialog() {
    const options = {
      type: 'info',
      buttons: ['Yes, please', 'No, thanks'],
      defaultId: 1,
      title: 'Question',
      message: 'That is a great question!',
      detail: 'Gravity recieves no data at all. Whatever login info is fetched from GitHub, is all stored on your local system. Gravity\'s code is open-source and available for your review. Do you want me to take you to the code repository?',
    };

    this._electronService.remote.dialog.showMessageBox(null, options).then(response => {
      if (response.response === 0) {
        this._electronService.remote.shell.openExternal('https://github.com/luciferreeves/gravity/');
      }
    });

  }

  authenticate() {
    this._electronService.ipcRenderer.send('github-oauth', 'getToken');
    this._electronService.ipcRenderer.on('github-oauth-reply', (event, { access_token }) => {
      console.log(access_token);
    });
  }
}
