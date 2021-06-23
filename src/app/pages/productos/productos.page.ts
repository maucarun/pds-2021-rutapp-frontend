import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto.models';
import { ProductoService } from '../../services/producto.service';
import { Router } from '@angular/router';
import { HojaDeRutaService } from 'src/app/services/hojaDeRuta.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss', './../../app.component.scss'],
})
export class ProductosPage implements OnInit {

  productos: Producto[];
  productosBackup: Producto[];
  buscarProducto: string;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private hojaDeRutaService: HojaDeRutaService,
  ) { }

  ngOnInit() {
    // this.productos = [];
    // this.productoService.getAll().then(
    //   (productos: Producto[])=> this.productos = productos
    // )
    // .then( ()=>{
    //   this.corregirURL();
    // })
    // .catch(e =>console.error(e));
    // console.log('hojaDeRutaService: ', Object.values(this.hojaDeRutaService.getAll())[1]);
  }

  ionViewWillEnter() {
    this.productos = [];

    this.buscarProducto = '';
    this.productoService.getAll().then(
      (productos: Producto[]) => this.productos = productos
    )
      .then(() => {
        this.corregirURL();
        this.productosBackup = this.productos;
      })
      .catch(e => console.error(e));
  }

  corregirURL() {
    if (this.productos.length) {
      this.productos.forEach(producto => {
        if (producto.url_imagen.indexOf('|') !== -1) {
          producto.url_imagen = producto.url_imagen.split('|')[1];
        }
      });
      console.log('Buscando |');
    } else {
      console.log('No hay imagen');
    }
  }

  async getProductosBusqueda(ev: any) {
    this.productos = this.productosBackup;

    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.productos = this.productos.filter((producto) => (producto.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1));
    }
  }

  agregarNuevoProducto() {
    this.router.navigateByUrl('productos/nuevo', { replaceUrl: true });
  }
  // verProducto(idProducto: string){
  //   this.router.navigateByUrl('productos/'+idProducto, { replaceUrl: true });
  // }
}
