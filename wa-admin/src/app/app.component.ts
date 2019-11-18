import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';

const themes = {
  autumn: {
    primary: '#F78154',
    secondary: '#4D9078',
    tertiary: '#B4436C',
    light: '#FDE8DF',
    medium: '#FCD0A2',
    dark: '#B89876'
  },
  night: {
    primary: '#8CBA80',
    secondary: '#FCFF6C',
    tertiary: '#FE5F55',
    medium: '#BCC2C7',
    dark: '#F7F7FF',
    light: '#495867'
  },
  neon: {
    primary: '#39BFBD',
    secondary: '#4CE0B3',
    tertiary: '#FF5E79',
    light: '#F4EDF2',
    medium: '#B682A5',
    dark: '#34162A'
  }
};
@Component({
  selector: 'waa-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wa-admin';
  constructor(private theme: ThemeService) {
    // this.changeTheme('neon');
  }

  changeTheme(name) {
    this.theme.setTheme(themes[name]);
  }

  changeSpeed(val) {
    this.theme.setVariable('--speed', `${val}ms`);
  }
}
