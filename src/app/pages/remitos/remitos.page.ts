import { Component, OnInit } from '@angular/core';
import { RemitoService } from '../../services/remito.service';
import { Router } from '@angular/router';
import { Remito } from 'src/app/models/remito.models';

@Component({
  selector: 'app-remitos',
  templateUrl: './remitos.page.html',
  styleUrls: ['./remitos.page.scss'],
})
export class RemitosPage implements OnInit {

  remitos: Remito[];

  constructor(private remitoService: RemitoService, private router: Router) { }

  /* Este método se ejecuta cuando se genera el componente por primera vez */
  async ngOnInit() {
    //let idCliente = await this..getCliente();
    this.remitoService.getAll(1, 'Pendiente').then(
      //this.remitoService.getAll(idCliente, 'Pendiente').then(
      (data: Remito[]) => this.remitos = data
    );
  }

  /* Este método se ejecuta cada vez que se entra al componente  */
  async ionViewWillEnter() {
    this.remitoService.getAll(1, 'Pendiente').then(
      //this.remitoService.getAll(idCliente, 'Pendiente').then(
      (data: Remito[]) => this.remitos = data
    );
  }

}
