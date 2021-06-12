import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController } from '@ionic/angular';
import { cliente } from 'src/app/models/cliente.models';
import { ClienteService } from 'src/app/services/cliente.service';
import { IonRouterOutlet } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-cliente-view',
  templateUrl: './cliente-view.page.html',
  styleUrls: ['./cliente-view.page.scss'],
})
export class ClienteViewPage implements OnInit {

  cliente: cliente;
  user: Usuario;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clienteSev: ClienteService,
    private alertCtrl: AlertController,
    private authService: AuthenticationService,
    private routerOutlet: IonRouterOutlet
  ) { }

  async ngOnInit() {
    let user = this.authService.getUser()
    this.user = JSON.parse(user)

    this.activatedRoute.paramMap.subscribe(async paramMap => {
      const clienteId = paramMap.get('idCliente');
      
      this.cliente = await this.clienteSev.get(this.user.idUsuario, clienteId)
      console.log(this.cliente);
      // this.clienteSev.get(clienteId).then(
      //   (data: cliente) => this.cliente = data
      //   )
      
      })
  }


  async borrarCliente() {
    const msjConfirmacion = await this.alertCtrl.create({
      header: 'Confirme',
      message: '¿Esta seguro de eliminar este cliente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: () => {
            //  this.clienteSev.delete(this.cliente.id);
            this.router.navigate(['/menu/clientes'])
          }
        }
      ]
    });
    await msjConfirmacion.present();
  }


  goBack() {
    this.router.navigateByUrl('/menu/clientes', {replaceUrl:true});
  }

}
