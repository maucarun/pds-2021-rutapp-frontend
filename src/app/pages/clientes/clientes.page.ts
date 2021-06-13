import { Component } from '@angular/core';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage {

  clientes: Cliente[];
  user: Usuario;

  constructor(private clieServ: ClienteService,
    private router: Router,
    private authService: AuthenticationService,
    private menu: MenuController
  ) { }

  /**
   * Este método se ejecuta cuando se genera el componente por
   *  primera vez.
   */
  // ngOnInit() {
  // let user = await this.authService.getUser()
  // this.user = JSON.parse(user)

  // this.clieServ.getAll(this.user.idUsuario).then(
  //   (data:cliente[])=> this.clientes= data
  // );
  // }

  /**
   * Este método se ejecuta cada vez que se entra al componente
   */
  async ionViewWillEnter() {
    const user = await this.authService.getUser();
    this.user = JSON.parse(user);

    this.clieServ.getAll(this.user.idUsuario).then(
      (data: Cliente[]) => this.clientes = data
    );

    this.menu.enable(true);
  }

  agregarNuevoCliente() {
    this.router.navigateByUrl('clientes/nuevo', { replaceUrl: true });
    // this.router.navigate(['menu','clientes','nuevo']);
  }

}
