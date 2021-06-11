import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Clientes', url: '/clientes', icon: 'people' },
    { title: 'Productos', url: '/productos', icon: 'cart' },
    { title: 'Hoja de ruta', url: '/hojasderuta', icon: 'location' },
    { title: 'Perfil', url: '/perfil', icon: 'person' },
    { title: 'Acerca de', url: '/about', icon: 'information' }
  ];
  public labels = [];
  constructor(
    private storage: Storage
  ) { }
  
  async ngOnInit() {
    await this.storage.create();
  }
}