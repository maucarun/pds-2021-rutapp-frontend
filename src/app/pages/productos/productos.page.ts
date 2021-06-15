import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto.models';
import { ProductoService } from '../../services/producto.service';
import { Router } from '@angular/router';
import { HojaDeRutaService } from 'src/app/services/hojaDeRuta.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  productos: Producto[];
  constructor(private productoService: ProductoService, private router: Router, 
    private hojaDeRutaService: HojaDeRutaService,) { }

  ngOnInit() {
    this.productoService.getAll().then(
      (productos: Producto[])=> this.productos = productos
    );
    console.log('hojaDeRutaService: ', Object.values(this.hojaDeRutaService.getAll())[1]);
  }

  ionViewWillEnter() {
    this.productoService.getAll().then(
      (productos: Producto[])=> this.productos = productos
    );
  }

  agregarNuevoProducto(){
      this.router.navigateByUrl('productos/nuevo', { replaceUrl: true });
  }
}
