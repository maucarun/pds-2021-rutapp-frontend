import { Component, OnInit } from '@angular/core';
import { RemitoService } from '../../services/remito.service';
import { Router } from '@angular/router';
import { Remito } from 'src/app/models/remito.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Usuario } from 'src/app/models/usuario.models';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-remitos',
  templateUrl: './remitos.page.html',
  styleUrls: ['./remitos.page.scss'],
})
export class RemitosPage {
  
  remito: Remito;
  remitos: Remito[];
  user: Usuario;

  constructor(
    private remitoService: RemitoService, 
    private router: Router,
    private authService: AuthenticationService,
    private avatarService: AvatarService
  ) { }


  /* Este método se ejecuta cada vez que se entra al componente  */
  async ionViewWillEnter() {
    const user = await this.authService.getUser();
    this.user = JSON.parse(user);

    this.remitoService.getAll(this.user.idUsuario).then(
      (data: Remito[]) => this.remitos = data
    ).then(
      () => {
        for ( const remito of this.remitos) {
          console.log(remito);
          if (remito.estado.nombre == "Pendiente") {
            remito.cliente.urlImagenPerfil = this.avatarService.getAvatarPendiente(remito.cliente.nombre);
          } else if (remito.estado.nombre == "Entregado") {
            remito.cliente.urlImagenPerfil = this.avatarService.getAvatarEntregado(remito.cliente.nombre);
          } else {
            remito.cliente.urlImagenPerfil = this.avatarService.getAvatarCancelado(remito.cliente.nombre);
          }
        }
      }
    );
  }

  agregarNuevoRemito() {
    this.router.navigate(['remitos/nuevo']);
  }

}
