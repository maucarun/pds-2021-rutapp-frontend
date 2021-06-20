import { Component } from '@angular/core';
import { RemitoService } from '../../services/remito.service';
import { Router } from '@angular/router';
import { Remito } from 'src/app/models/remito.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Usuario } from 'src/app/models/usuario.models';
import { AvatarService } from 'src/app/services/avatar.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/component/popover/popover.component';

@Component({
  selector: 'app-remitos',
  templateUrl: './remitos.page.html',
  styleUrls: ['./remitos.page.scss', './../../app.component.scss'],
})
export class RemitosPage {

  remito: Remito;
  remitos: Remito[];
  remitosBackup: Remito[];
  user: Usuario;
  estados: string[];
  estadoSeleccionado: string;
  buscarRemito: string;

  constructor(
    private remitoService: RemitoService,
    private router: Router,
    private authService: AuthenticationService,
    private avatarService: AvatarService,
    public popoverController: PopoverController
  ) { }

  /* Este método se ejecuta cada vez que se entra al componente  */
  async ionViewWillEnter() {
    const user = await this.authService.getUser();
    this.user = JSON.parse(user);
    this.buscarRemito = '';

    this.remitoService.getAll(this.user.idUsuario).then(
      (data: Remito[]) => this.remitos = data
    ).then(
      () => {
        for (const remito of this.remitos) {
          console.log(remito);
          if (remito.estado.nombre == "Pendiente") {
            remito.cliente.urlImagenPerfil = this.avatarService.getAvatarPendiente(remito.cliente.nombre);
          } else if (remito.estado.nombre == "Entregado") {
            remito.cliente.urlImagenPerfil = this.avatarService.getAvatarEntregado(remito.cliente.nombre);
          } else {
            remito.cliente.urlImagenPerfil = this.avatarService.getAvatarCancelado(remito.cliente.nombre);
          }
        }
        this.remitosBackup = this.remitos;
        this.obtenerEstados();
      }
    );
  }

  async getRemitosBusqueda(ev: any) {
    this.remitos = await this.remitosBackup;

    const val = ev.target.value;

    if (val && val.trim() != '') {
      this.remitos = this.remitos.filter((remito) => {
        return (remito.cliente.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  agregarNuevoRemito() {
    this.router.navigate(['remitos/nuevo']);
  }

  obtenerEstados() {
    this.estados = [... new Set(this.remitos.map(r => r.estado.nombre))];
  }

  filtrarRemitos() {
    const estado = this.estadoSeleccionado;
    this.remitos = this.remitosBackup;
    if (estado !== null) {
      this.remitos = this.remitos.filter((remito) => {
        return (remito.estado.nombre == estado)
      }
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
      this.filtrarRemitos();
      this.buscarRemito = '';
    });
  }

}
