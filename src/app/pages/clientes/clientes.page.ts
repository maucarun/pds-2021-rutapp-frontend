import { Component, OnInit } from '@angular/core';
import { cliente } from "../../models/cliente.models";
import { ClienteService } from "../../services/cliente.service";
import { Router } from "@angular/router";
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage {

  clientes: cliente[];
  user: Usuario;

  constructor(private clieServ: ClienteService, 
    private router: Router,
    private authService: AuthenticationService
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
    let user = await this.authService.getUser()
    this.user = JSON.parse(user)

    this.clieServ.getAll(this.user.idUsuario).then(
      (data:cliente[])=> this.clientes= data
    );
  }
  
}
