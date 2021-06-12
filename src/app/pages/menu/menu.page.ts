import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage {
  public appPages = [
    { title: 'Clientes', url: '/menu/clientes', icon: 'people' },
    { title: 'Productos', url: '/menu/productos', icon: 'cart' },
    { title: 'Hoja de ruta', url: '/menu/hojasderuta', icon: 'location' },
    { title: 'Perfil', url: '/menu/perfil', icon: 'person' },
    { title: 'Acerca de', url: '/menu/about', icon: 'information' }
  ];

  selectedPath = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
  ) { 
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('', { replaceUrl: true });
  }
}
