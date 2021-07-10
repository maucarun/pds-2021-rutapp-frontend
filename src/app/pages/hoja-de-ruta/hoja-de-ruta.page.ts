import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, PopoverController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/component/popover/popover.component';
import { HojaDeRuta } from 'src/app/models/hojaDeRuta.models';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HojaDeRutaService, PaginacionService } from 'src/app/services/hojaDeRuta.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-hoja-de-ruta',
  templateUrl: './hoja-de-ruta.page.html',
  styleUrls: ['./hoja-de-ruta.page.scss', './../../app.component.scss'],
})
export class HojaDeRutaPage {

  hojasderuta: HojaDeRuta[];
  user: Usuario;
  miEstado: 'Cancelada';
  hdRBackup: HojaDeRuta[];
  buscarHdR: string;
  estados: string[];
  estadoSeleccionado: string;

  constructor(private hojaServ: HojaDeRutaService,
    private authService: AuthenticationService,
    private loading: LoadingService,
    private menu: MenuController,
    public popoverController: PopoverController,
    private router: Router,
  ) { }

  async ionViewWillEnter() {
    this.loading.present('Cargando...');
    this.user = null;
    const user = this.authService.getUsuario();
    this.user = user;
    this.hojasderuta = null;
    this.buscarHdR = '';
    
    console.log("Buscaré las hojas de ruta del usuario " + this.user.idUsuario);
    await this.hojaServ.getAll().then(
      (data: PaginacionService) => this.hojasderuta = data.reultado
    ).then(() => {
      this.hdRBackup = this.hojasderuta;
      this.obtenerEstados();
      this.loading.dismiss()
    });

    this.menu.enable(true);
  }

  async getHdRBusqueda(ev: any) {
    this.hojasderuta = this.hdRBackup;

    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.hojasderuta = this.hojasderuta.filter((hdr) => (('hoja de ruta n°' + hdr.id_hoja_de_ruta).indexOf(val.toLowerCase()) > -1));
    }
  }

  obtenerEstados() {
    this.estados = [... new Set(this.hojasderuta.map(hdr => hdr.estado.nombre))];
  }

  filtrarHdR() {
    const estado = this.estadoSeleccionado;
    this.hojasderuta = this.hdRBackup;
    if (estado !== null) {
      this.hojasderuta = this.hojasderuta.filter((hdr) => (hdr.estado.nombre === estado)
      );
    }
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      componentProps: { estados: this.estados }
    });
    await popover.present();
    await popover.onWillDismiss().then((respuestaPopover) => {
      console.log(respuestaPopover);

      if (respuestaPopover.role === 'cancelar' || respuestaPopover.role === 'backdrop') {
        this.estadoSeleccionado = null;
      } else {
        this.estadoSeleccionado = respuestaPopover.data;
      }
      this.filtrarHdR();
      this.buscarHdR = '';
    });
  }

  agregarNuevaHojaDeRuta() {
    this.router.navigate(['hojasderuta/hoja/crear']);
  }
}
