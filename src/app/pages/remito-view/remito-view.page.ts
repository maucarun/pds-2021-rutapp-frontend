import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonRouterOutlet } from '@ionic/angular';
import { cliente } from 'src/app/models/cliente.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Remito } from 'src/app/models/remito.models';
import { RemitoService } from 'src/app/services/remito.service';

@Component({
  selector: 'app-remito-view',
  templateUrl: './remito-view.page.html',
  styleUrls: ['./remito-view.page.scss'],
})
export class RemitoViewPage implements OnInit {

  cliente: cliente;
  remito: Remito;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private remitoService: RemitoService,
    private alertCtrl: AlertController,
    /* private authService: AuthenticationService,
    private routerOutlet: IonRouterOutlet */
  ) { }

  async ngOnInit() {
    /* let user = this.authService.getUser()
    this.user = JSON.parse(user) */

    this.activatedRoute.paramMap.subscribe(async paramMap => {
      const remitoId = paramMap.get('idRemito');
      console.log('entre al view page del remito id ' + remitoId);
      this.remito = await this.remitoService.get(remitoId);
      console.log(this.remito);
    });
  }

  // async ionViewWillEnter() {
  //   let user = this.authService.getUser()
  //   this.user = JSON.parse(user)
  //   this.activatedRoute.paramMap.subscribe(async paramMap => {
  //     const clienteId = paramMap.get('idCliente');
  //     console.log("entre al view page del cliente id " + clienteId);
  //     this.cliente = await this.clienteSev.get(this.user.idUsuario, clienteId)
  //     console.log(this.cliente);
  //     })
  // }

  async borrarRemito() {
    const msjConfirmacion = await this.alertCtrl.create({
      header: 'Confirme',
      message: '¿Esta seguro de eliminar este remito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: () => {
            //  this.remitoService.delete(this.remito.id);
            this.router.navigate(['/remitos']);
          }
        }
      ]
    });
    await msjConfirmacion.present();
  }

}
