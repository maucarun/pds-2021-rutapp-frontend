import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, PopoverController} from '@ionic/angular';
import { Remito } from 'src/app/models/remito.models';
import { RemitoService } from 'src/app/services/remito.service';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente.models';
import { ClienteService } from 'src/app/services/cliente.service';
import { Producto } from 'src/app/models/producto.models';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-remito-view',
  templateUrl: './remito-view.page.html',
  styleUrls: ['./remito-view.page.scss'],
})
export class RemitoViewPage implements OnInit {

  remitoForm: FormGroup;
  remitoSubmit: Remito;
  idRemito: string;
  remito: Remito;
  user: Usuario;
  clientes: Cliente[];
  productos: Producto[];
  productosAgregados: Producto[];

  viewMode = false;
  editMode = false;
  createMode = false;

  get nombreDeCliente() {
    return this.remitoForm.get('nombreDeCliente');
  }

  get pedidos() {
    return this.remitoForm.get('pedidos');
  }
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private remitoService: RemitoService,
    private alertCtrl: AlertController,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private popoverController: PopoverController
  ) { }

  async ngOnInit() {
    const user = this.authService.getUser();
    this.user = JSON.parse(user);
    this.clientes = await this.clienteService.getAll(this.user.idUsuario);
    this.productos = await this.productoService.getAll();

    this.remitoForm = this.formBuilder.group({
      nombreDeCliente: ['', [Validators.required]],
      pedidos: ['', [Validators.required]],
    });
    console.log(this.remitoForm);

    /* Verificando si la página tiene id */

    // this.activatedRoute.paramMap.subscribe(async paramMap => {
    //   const remitoId = paramMap.get('idRemito');
    //   console.log('entre al view page del remito id ' + remitoId);
    //   this.remito = await this.remitoService.get(remitoId);
    //   console.log(this.remito);
    // });

    this.activatedRoute.paramMap.subscribe(async paramMap => {
      this.idRemito = paramMap.get('idRemito');
      this.editMode = this.router.url.includes('/remitos/editar/');

      if (this.idRemito) {
        /* Como tiene id, completo el formulario con los datos del BE */
        try {
          this.remitoSubmit = await this.remitoService.get(this.idRemito);
        } catch (error) {
          console.log("Ha ocurrido un error cargando el remito, reintente.")
        }

        if (this.editMode) {

          //Habilito las propiedades para editar en el formulario
          console.log('Como está en modo edición, completo el formulario con los datos del BE ');
          this.cambiarWebEstado(false, true, false);
          this.remitoForm.patchValue(this.remitoSubmit)
          console.log(this.remitoSubmit);
        } else {

          //Habilito las propiedades ver en el formulario
          console.log('Como está en modo vista, completo el formulario con los datos del BE ');
          this.cambiarWebEstado(true, false, false);
          this.remito = await this.remitoService.get(this.idRemito);
          console.log(this.remito);
        }
      } else {

        //Habilito las propiedades para crear en el formulario
        console.log('Como está en modo creación, dejo el formulario vacío');
        this.cambiarWebEstado(false, false, true);
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
          handler: () => {
            //  this.remitoService.delete(this.remito.id);
            this.router.navigate(['/remitos']);
          }
        }
      ]
    });
    await msjConfirmacion.present();
  }

  eliminarProducto(producto: Producto) {
    this.productos = this.productos.filter(p => producto != p)
  }

  agregarProducto(producto: Producto) {
    this.productosAgregados.push(producto)
  }

  cambiarWebEstado(view: boolean, edit: boolean, create: boolean) {
    this.viewMode = view;
    this.editMode = edit;
    this.createMode = create;
  }

}
