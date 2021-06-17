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
    private hojaDeRutaService: HojaDeRutaService,) {
  }

  ngOnInit() {
    this.productos = [];
    this.productoService.getAll().then(
      (productos: Producto[])=> this.productos = productos
    )
    .then( ()=>{
      this.corregirURL();
    })
    .catch(e =>console.error(e));
    console.log('hojaDeRutaService: ', Object.values(this.hojaDeRutaService.getAll())[1]);
  }

  corregirURL(){
    if (this.productos.length){
      this.productos.forEach(producto => {
        if(producto.url_imagen.indexOf('|')!==-1){
          producto.url_imagen = producto.url_imagen.split('|')[1];
        }
      });
      console.log('Buscando |');
    }else{
      console.log('No hay imagen');
    }
  }

  agregarNuevoProducto() {
    this.router.navigateByUrl('productos/nuevo', { replaceUrl: true });
  }
}
