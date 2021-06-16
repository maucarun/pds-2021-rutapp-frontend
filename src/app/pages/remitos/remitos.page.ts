import { Component, OnInit } from '@angular/core';
import { RemitoService } from '../../services/remito.service';
import { Router } from '@angular/router';
import { Remito } from 'src/app/models/remito.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Usuario } from 'src/app/models/usuario.models';

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
    private authService: AuthenticationService
  ) { }


  /* Este método se ejecuta cada vez que se entra al componente  */
  async ionViewWillEnter() {
    const user = await this.authService.getUser();
    this.user = JSON.parse(user);

    this.remitoService.getAll(this.user.idUsuario).then(
      //this.remitoService.getAll(idCliente, 'Pendiente').then(
      (data: Remito[]) => this.remitos = data
    );
  }

  agregarNuevoRemito() {
    this.router.navigateByUrl('remitos/nuevo', { replaceUrl: true });
  }

}
