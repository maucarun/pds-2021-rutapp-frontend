import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController } from '@ionic/angular';
import { cliente } from 'src/app/models/cliente.models';
import { ClienteService } from 'src/app/services/cliente.service';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-cliente-view',
  templateUrl: './cliente-view.page.html',
  styleUrls: ['./cliente-view.page.scss'],
})
export class ClienteViewPage implements OnInit {

  cliente: cliente;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clienteSev: ClienteService,
    private alertCtrl: AlertController,
    private routerOutlet: IonRouterOutlet
  ) { }

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async paramMap => {
      const clienteId = paramMap.get('idCliente');
      
      this.clienteSev.get(clienteId).then(
        (data: cliente) => this.cliente = data
        )})
      console.log(this.cliente);
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
            this.router.navigate(['/clientes'])
          }
        }
      ]
    });
    await msjConfirmacion.present();
  }


  goBack() {
    this.router.navigateByUrl('/clientes', {replaceUrl:true});
  }

}
