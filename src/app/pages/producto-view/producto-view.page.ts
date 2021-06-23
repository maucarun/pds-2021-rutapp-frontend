/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.models';
import { Producto } from 'src/app/models/producto.models';
import { ProductoService } from 'src/app/services/producto.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-producto-view',
  templateUrl: './producto-view.page.html',
  styleUrls: ['./producto-view.page.scss'],
})
export class ProductoViewPage implements OnInit {

  producto: Producto;
  user: Usuario;
  productoId: string;
  isView = true;
  public_id: string;//es el id de la imagen, se usa para eliminar la imagen

  constructor(
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,
    private router: Router,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public loading: LoadingService,
    public alertController: AlertController
  ) { }

  async ngOnInit() {
    this.loading.present('Cargando...');//si la carga es demasiado rápida, eliminarlo
    this.activatedRoute.paramMap.subscribe(async paramMap => {
      this.productoId = paramMap.get('id');

      if (this.productoId === 'nuevo') {
        this.isView = false;//habilito la edición de los campos
        // console.log('Formulario de creación');
        this.producto = {
          idProducto: 0,
          nombre: '',
          precio_unitario: 0,
          descripcion: '',
          url_imagen: '',
          esPrincipal: false,
          cantidad: 0
        };
        return this.loading.dismiss();;
      }

      this.producto = await this.productoService.get(this.productoId);
      this.corregirURL();
      this.loading.dismiss();
    });
  }

  async borrarProducto() {
    // const respuesta = this.presentAlertConfirm();
    // console.log('respuesta: ', respuesta);
    const confirmacion = confirm('Estás seguro?');
    if (confirmacion) {
      // const respuesta = await
      this.productoService.delete(this.producto.idProducto.toString())
        .then(res =>
        // {if(res.status===200)
        // )}
        {
          alert('Producto eliminado');
          this.redirigirAProductos();
        });

    }
    // const respuesta = await this.productoService.delete(this.producto.idProducto.toString());
    // alert('Producto eliminado');
    // this.redirigirAProductos();
  }

  async editarProducto() {
    this.isView = false;//habilito la edición de los campos
  }

  async guardarProducto() {
    try {
      if (this.productoId === 'nuevo') {
        this.loading.present('Cargando...');
        this.productoService.create(this.producto.idProducto.toString(), this.producto)
          .then(
            () => {
              this.loading.dismiss();
              this.presentToast('Se ha creado correctamente!');
              this.redirigirAProductos();
            },
            error => {
              console.log(error);
              this.loading.dismiss();
            }
          );
      } else {
        //public_id viejo | imagen nueva
        this.producto.url_imagen = this.public_id + '|' + this.producto.url_imagen;
        this.loading.present('Cargando...');
        this.productoService.update(this.producto)
          .then(
            () => {
              this.loading.dismiss();
              this.presentToast('Se ha actualizado correctamente!');
              this.corregirURL();
              // this.redirigirAProductos();
            },
            error => {
              console.log(error);
              this.loading.dismiss();
            }
          );
      }
    } catch (error) {
      console.log('Hubo un error: ', error);
    }
  }

  redirigirAProductos() {
    this.router.navigateByUrl('productos', { replaceUrl: true });
  }

  corregirURL() {
    if (this.producto.url_imagen && (this.producto.url_imagen.indexOf('|') !== -1)) {
      // console.log('hay imagen');
      this.public_id = this.producto.url_imagen.split('|')[0];
      this.producto.url_imagen = this.producto.url_imagen.split('|')[1];
    }
  }

  async changeListener($event: { target: { files: any[] } }): Promise<void> {
    const imagenBase64 = await this.getBase64($event.target.files[0]);
    this.producto.url_imagen = imagenBase64.toString();
  }

  getBase64(file: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }



  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  // async presentAlertConfirm() {
  //   const alert = await this.alertController.create({
  //     cssClass: 'my-custom-class',
  //     header: 'Estás seguro?',
  //     message: 'No habrá marcha atrás!!!',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: async(blah) => {
  //           console.log('Cancelado: blah');
  //           // await this.productoService.delete(this.producto.idProducto.toString());
  //           // alert('Producto eliminado');
  //           this.redirigirAProductos();
  //         }
  //       }, {
  //         text: 'Okay',
  //         handler: () => {
  //           console.log('Okay');
  //         }
  //       }
  //     ]
  //   });

  //   return await alert.present();
  // }
}
