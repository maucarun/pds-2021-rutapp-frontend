import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { HojaDeRuta } from 'src/app/models/hojaderuta.models';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HojaDeRutaService, PaginacionService } from 'src/app/services/hojaDeRuta.service';

@Component({
  selector: 'app-hoja-de-ruta',
  templateUrl: './hoja-de-ruta.page.html',
  styleUrls: ['./hoja-de-ruta.page.scss'],
})
export class HojaDeRutaPage {

  hojasderuta: HojaDeRuta[];
  user: Usuario;
  miEstado: String = "Cancelada"

  constructor(private hojaServ: HojaDeRutaService,
    private router: Router,
    private authService: AuthenticationService,
    private menu: MenuController
  ) { }

  async ionViewWillEnter() {
    
    
    const user = await this.authService.getUsuario()
    this.user = user;
    this.hojasderuta = null

    await this.hojaServ.getAll().then(
      (data: PaginacionService) => this.hojasderuta = data.reultado
    );

    this.menu.enable(true);
  }
  
  agregarNuevaHojaDeRuta() {
    
    this.router.navigate(['hojasderuta/hoja/crear']);
    
   }
}
