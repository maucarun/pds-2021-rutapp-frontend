import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Remito } from 'src/app/models/remito.models';
import { RemitoService } from 'src/app/services/remito.service';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Cliente } from 'src/app/models/cliente.models';
import { ClienteService } from 'src/app/services/cliente.service';
import { Producto } from 'src/app/models/producto.models';
import { ProductoService } from 'src/app/services/producto.service';
import { ModalPage } from 'src/app/component/modal/modal.component';

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
  productos: Producto[];

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
  ) { }

  async ngOnInit() {
    const user = this.authService.getUser();
    this.user = JSON.parse(user);
    this.clientes = await this.clienteService.getAll(this.user.idUsuario);
    this.productos = await this.productoService.getAll();

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
        } else {

          //Habilito las propiedades ver en el formulario
          console.log('Como está en modo vista, completo el formulario con los datos del BE ');
          this.cambiarWebEstado(true, false, false);
          this.remito = await this.remitoService.get(this.idRemito);
          // console.log(this.remito);
        }
      } else {

        //Habilito las propiedades para crear en el formulario
        console.log('Como está en modo creación, dejo el formulario vacío');
        this.cambiarWebEstado(false, false, true);
        const nuevoRemito = {} as Remito;
        nuevoRemito.total = 0;
        nuevoRemito.cantidadDeItems = 0;
        nuevoRemito.fechaDeCreacion = new Date().toISOString();
        this.remito = nuevoRemito;
      }
    });
  }

  async borrarRemito() {
    const msjConfirmacion = await this.alertCtrl.create({
      header: 'Confirme',
      message: '¿Esta seguro de eliminar este remito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: async () => {
            //  this.remitoService.delete(this.remito.id);
            await this.remitoService.cancelarRemito(this.idRemito)
            this.router.navigate(['/remitos']);
          }
        }
      ]
    });
    await msjConfirmacion.present();
  }

  eliminarProducto(producto: Producto) {
    this.remito.productos = this.remito.productos.filter(p => producto !== p);
    this.calcularTotal();
  }

  calcularTotal() {
    this.remito.cantidadDeItems = this.remito.productos.length;
    this.remito.total = this.remito.productos.reduce((total, e) => total + (e.precio_unitario * e.cantidad), 0);
  }

  cambiarWebEstado(view: boolean, edit: boolean, create: boolean) {
    this.viewMode = view;
    this.editMode = edit;
    this.createMode = create;
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        elementos: this.productos,
        elementosSeleccionados: this.remito.productos
      }
    });
    await modal.present();
    await modal.onWillDismiss().then((respuestaModal) => {
      console.log(respuestaModal);
      if (respuestaModal.role !== 'cancelar' && respuestaModal.role !== 'backdrop') {
        this.remito.productos = respuestaModal.data;
        this.remito.productos.forEach((e) => {
          if (e.cantidad === undefined) { e.cantidad = 1; }
        });
        this.calcularTotal();
      }
    });
  }

  async guardarRemito() {
    // fechaDeCreacion: string; listo
    // total: number; listo
    // motivo: string; listo
    // tiempo_espera: number; 
    // cliente: Cliente; listo
    // estado: Estado; lo hace el be
    // productos: Producto[]; listo
    // comprobante: ComprobanteEntrega; no aplica
    // cantidadDeItems: number; listo
    console.log(this.remito);
    
    // await this.remitoService.guardarRemito(this.remito);
    // this.router.navigate(['/remitos']);
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