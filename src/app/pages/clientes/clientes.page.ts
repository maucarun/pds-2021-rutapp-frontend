import { Component, OnInit } from '@angular/core';
import { cliente } from "../../models/cliente.models";
import { ClienteService } from "../../services/cliente.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  clientes: cliente[];

  constructor(private clieServ: ClienteService, private router: Router) { }

  ngOnInit() {
    this.clieServ.getAll().then(
      (data:cliente[])=> this.clientes= data
    );
  }

  ionViewWillEnter() {
    this.clieServ.getAll().then(
      (data:cliente[])=> this.clientes= data
    );
  }
}
