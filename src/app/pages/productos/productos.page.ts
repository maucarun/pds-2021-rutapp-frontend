import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto.models';
import { ProductoService } from "../../services/producto.service"
import { Router } from "@angular/router";

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  productos: Producto[];
  constructor(private productoService: ProductoService, private router: Router) { }

  ngOnInit() {
    this.productoService.getAll().then(
      (productos: Producto[])=> this.productos = productos
    );
  }

  ionViewWillEnter() {
    this.productoService.getAll().then(
      (productos: Producto[])=> this.productos = productos
    );
  }

}