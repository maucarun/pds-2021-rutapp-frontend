/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.models';
import { Producto } from 'src/app/models/producto.models';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto-view',
  templateUrl: './producto-view.page.html',
  styleUrls: ['./producto-view.page.scss'],
})
 export class ProductoViewPage implements OnInit {

   producto: Producto;
   user: Usuario;
   productoId: string;
   flag=true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async paramMap => {
      this.productoId = paramMap.get('id');

      if (this.productoId === 'nuevo') {
        this.flag = false;//habilito la edición de los campos
        console.log('Formulario de creación');
        this.producto = {
          idProducto: 0,
          nombre: '',
          precio_unitario: 0,
          descripcion: '',
          url_imagen: '',
          esPrincipal: false,
          cantidad: 0
        };
        return;
      }

      // console.log('Entre al view page del cliente id ' + this.productoId);

      this.producto = await this.productoService.get(this.productoId);
      // console.log('*** Producto: ', this.producto);

    });
  }

  async borrarProducto() {
    await this.productoService.delete(this.producto.idProducto.toString());
    alert('Producto eliminado');
    this.redirigirAProductos();
  }

  async editarProducto(){
    this.flag = false;//habilito la edición de los campos
  }

  async guardarProducto(){
    try {
      if (this.productoId==='nuevo'){
        const respuesta = await this.productoService.create(this.producto.idProducto.toString(), this.producto);
        alert('Producto creado');
        this.redirigirAProductos();
      } else {
        const respuesta = await this.productoService.update(this.producto.idProducto.toString(), this.producto);
        alert('Producto actualizado');
        this.redirigirAProductos();
      }
    } catch (error) {
      console.log('Hubo un error: ', error);
    }
  }

  redirigirAProductos(){
    this.router.navigateByUrl('productos', { replaceUrl: true });
  }
}


