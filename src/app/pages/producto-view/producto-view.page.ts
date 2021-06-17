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
   public_id: string;//es el id de la imagen, se usa para eliminar la imagen

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

      this.producto = await this.productoService.get(this.productoId);
      this.corregirURL();
    });
  }

  async borrarProducto() {
    const respuesta = await this.productoService.delete(this.producto.idProducto.toString());
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
        //public_id viejo | imagen nueva
        this.producto.url_imagen = this.public_id+'|'+ this.producto.url_imagen;
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

  corregirURL(){
    if (this.producto.url_imagen && (this.producto.url_imagen.indexOf('|')!==-1)){
      console.log('hay imagen');
      this.public_id = this.producto.url_imagen.split('|')[0];
      this.producto.url_imagen = this.producto.url_imagen.split('|')[1];
    }else{
      console.log('No hay imagen');
    }
  }

  async changeListener($event): Promise<void> {
    const imagenBase64 = await this.getBase64($event.target.files[0]);
    this.producto.url_imagen = imagenBase64.toString();
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
}
