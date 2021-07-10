/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Remito } from 'src/app/models/remito.models';
import { RemitoService } from 'src/app/services/remito.service';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Cliente } from 'src/app/models/cliente.models';
import { ClienteService } from 'src/app/services/cliente.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ModalPage } from 'src/app/component/modal/modal.component';
import { ProductoRemito } from 'src/app/models/productoRemito.models';
import { Estado } from 'src/app/models/estado.models';
import { ToastService } from 'src/app/services/toast.service';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-remito-view',
  templateUrl: './remito-view.page.html',
  styleUrls: ['./remito-view.page.scss'],
})
export class RemitoViewPage implements OnInit {
  idRemito: string;
  remito: Remito;

  /** Props de fecha */
  mesesCustomizados = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiempre', 'Octubre', 'Noviembre', 'Diciembre'];
  fechaDeHoy: string = new Date().toISOString();

  /** Props de objetos necesarios */
  user: Usuario;
  clientes: Cliente[];
  prsDisponibles: ProductoRemito[];

  /** Props de vista */
  viewMode = false;
  editMode = false;
  createMode = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private remitoService: RemitoService,
    private alertCtrl: AlertController,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private modalController: ModalController,
    private toastService: ToastService,
  ) { }

  async ngOnInit() {
    this.user = this.authService.getUsuario();
    this.clientes = await this.clienteService.getAll();
    await this.convertirProductosEnPr();

    /* Verificando si la página tiene id */
    this.activatedRoute.paramMap.subscribe(async paramMap => {
      this.idRemito = paramMap.get('idRemito');
      this.editMode = this.router.url.includes('/remitos/editar/');

      if (this.idRemito) {
        /* Como tiene id, completo el formulario con los datos del BE */

        if (this.editMode) {

          //Habilito las propiedades para editar en el formulario
          console.log('Como está en modo edición, completo el formulario con los datos del BE ');
          this.cambiarWebEstado(false, true, false);
          this.remito = await this.remitoService.get(this.idRemito);
          console.log(this.remito);
        } else {

          //Habilito las propiedades ver en el formulario
          console.log('Como está en modo vista, completo el formulario con los datos del BE ');
          this.cambiarWebEstado(true, false, false);
          this.remito = await this.remitoService.get(this.idRemito);
        }
      } else {
        console.log('Como está en modo creación, dejo el formulario vacío');
        //Habilito las propiedades para crear en el formulario
        this.cambiarWebEstado(false, false, true);

        const nuevoRemito = {} as Remito; //Manera de instanciar un objeto del tipo interfaz
        const estadoRemito = {} as Estado;
        estadoRemito.nombre = 'Pendiente';
        estadoRemito.tipo = 'Remito';

        nuevoRemito.total = 0;
        nuevoRemito.cantidadDeItems = 0;
        nuevoRemito.fechaDeCreacion = new Date().toISOString();
        nuevoRemito.productosDelRemito = [];
        nuevoRemito.estado = estadoRemito;
        nuevoRemito.cliente = this.clientes[0];

        //const tiempoDeEsperaDefault = new Date();
        //tiempoDeEsperaDefault.setHours(0, 0, 0);
        //nuevoRemito.tiempo_espera = 0; //tiempoDeEsperaDefault.toISOString();

        this.remito = nuevoRemito;
      }
    });
  }

  async convertirProductosEnPr() {
    const productos = await this.productoService.getAll();
    this.prsDisponibles = [];
    productos.forEach(p => {
      const productoDelRemito = {} as ProductoRemito; // Instancio un pr
      productoDelRemito.producto = p;
      productoDelRemito.precio_unitario = p.precio_unitario;
      productoDelRemito.cantidad = 1;
      productoDelRemito.descuento = 0;

      this.prsDisponibles.push(productoDelRemito);
    });
  }

  async borrarRemito() {
    const msjConfirmacion = await this.alertCtrl.create({
      header: 'Confirme',
      message: '¿Está seguro de eliminar este remito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: async () => {
            await this.remitoService.cancelarRemito(this.idRemito)
              .then(() => {
                this.toastService.presentToast('Remito eliminado');
                this.volverAListaRemitos();
              })
              .catch(err => {
                console.log(err);
                this.toastService.presentToast(err.error.message);
              });
          }
        }
      ]
    });
    await msjConfirmacion.present();
  }

  eliminarProducto(producto: ProductoRemito) {
    this.remito.productosDelRemito = this.remito.productosDelRemito.filter(rp => producto !== rp);
    this.calcularTotal();
  }

  calcularTotal() {
    this.remito.cantidadDeItems = this.remito.productosDelRemito.length;
    this.remito.total = this.remito.productosDelRemito.reduce((total, pr) => total + (pr.precio_unitario * pr.cantidad * (1 - pr.descuento / 100)), 0);
  }

  cambiarWebEstado(view: boolean, edit: boolean, create: boolean) {
    this.viewMode = view;
    this.editMode = edit;
    this.createMode = create;
  }

  async presentModal() {
    /* Filtramos los productos del back no presentes en el remito */

    const elementosSinSeleccionar = this.prsDisponibles.filter(p => !this.remito.productosDelRemito.some(pr => pr.producto.idProducto === p.producto.idProducto));

    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        elementos: elementosSinSeleccionar
      }
    });
    await modal.present();
    await modal.onWillDismiss().then((respuestaModal) => {
      console.log(respuestaModal);
      console.log(this.remito.productosDelRemito);
      if (respuestaModal.role !== 'cancelar' && respuestaModal.role !== 'backdrop') {
        /* Quiero setear cada uno de los productos en el remito.ProductosDelRemito */
        respuestaModal.data.forEach(producto => this.remito.productosDelRemito.push(producto));
        this.calcularTotal();
        console.log(this.remito);
      }
    });
  }

  async guardarRemito() {
    this.remito.fechaDeCreacion = this.formatearFecha(this.remito.fechaDeCreacion);
    console.log(this.remito);
    if (this.createMode) {
      console.log(this.remito);
      await this.remitoService.guardarRemito(this.remito);
    } else {
      delete this.remito.comprobante;
      await this.remitoService.actualizarRemito(this.remito);
    }
    this.volverAListaRemitos();
  }

  formatearFecha(fecha: string) {
    const date = new Date(fecha);
    return date.getFullYear() + '-' +
      ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
      ('00' + date.getDate()).slice(-2);
  }

  formatearHora(hora: string) {
    const date = new Date(hora);
    return ('00' + date.getHours()).slice(-2) + ':' +
      ('00' + date.getMinutes()).slice(-2);
  }

  editarRemito() {
    this.router.navigate(['remitos/editar/' + this.idRemito]);
  }

  volverAListaRemitos() {
    this.router.navigate(['/remitos']);
  }

  generatePDF() {
    const element = document.getElementById('invoice');
    domtoimage.toPng(element).then((imgData) => {
      const doc = new jsPDF('p', 'pt', 'a4');
      doc.addImage(imgData, 'PNG', 0, 0);
      doc.save(`${this.remito.fechaDeCreacion}_remito_${this.remito.idRemito}.pdf`);
    });
  }
}

/**
 * this.editMode = params["id"] != null;
      if (idSubasta){
        try {
          this.subasta = await this.subastasService.getSubastaById(idSubasta);
          console.log(this.subasta);
          this.lotes = this.subasta.lotes; // al asignar los lotes de la subasta directamente hay que modificar la asignacion de las imagenes ya que de lo contrario se verá un error de asignacion de variables

          this.subastaForm.patchValue(this.subasta);
          // this.imagen.setValue(this.subasta.img);
          this.categoria.setValue(""+this.subasta.categoria.id);
          this.fechaIni.setValue(this.subasta.fecha_ini);
          this.fechaFin.setValue(this.subasta.fecha_fin);

        } catch (error) {
          this.toastService.presentToast('Ha ocurrido un error cargando subasta a editar, reintente.');
        }

      }
 */
