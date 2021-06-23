import { Component } from '@angular/core';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MenuController } from '@ionic/angular';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss', './../../app.component.scss'],
})
export class ClientesPage {

  clientes: Cliente[];
  clientesBackup: Cliente[];
  user: Usuario;
  buscarCliente: string;

  constructor(
    private clieServ: ClienteService,
    private router: Router,
    private authService: AuthenticationService,
    private menu: MenuController,
    private avatarService: AvatarService
  ) { }

  /** Este método se ejecuta cuando se genera el componente por primera vez.
     ngOnInit() { }
   */

  /** Este método se ejecuta cada vez que se entra al componente */
  async ionViewWillEnter() {
    const user = await this.authService.getUser();
    this.user = JSON.parse(user);
    this.buscarCliente = '';

    this.clieServ.getAll(this.user.idUsuario).then(
      (data: Cliente[]) => this.clientes = data
    ).then(
      () => {
        for (const cliente of this.clientes) {
          cliente.urlImagenPerfil = this.avatarService.getAvatar(cliente.nombre);
        }
        this.clientesBackup = this.clientes;
      }
    );

    this.menu.enable(true);
  }

  async getClientesBusqueda(ev: any) {
    this.clientes = this.clientesBackup;

    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.clientes = this.clientes.filter((cliente) => (cliente.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1));
    }
  }

  agregarNuevoCliente() {
    this.router.navigate(['clientes/nuevo']);
  }

}
