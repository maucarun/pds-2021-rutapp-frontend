import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  activePageTitle = 'Clientes';

  appPages = [
    { title: 'Clientes', url: '', icon: 'people' },
    { title: 'Productos', url: '/productos', icon: 'cart' },
    { title: 'Remitos', url: '/remitos', icon: 'reader' },
    { title: 'Hoja de ruta', url: '/hojasderuta', icon: 'location' },
    { title: 'Perfil', url: '/perfil', icon: 'person' },
    { title: 'Acerca de', url: '/about', icon: 'information' }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

}
