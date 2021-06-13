import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Cliente } from 'src/app/models/cliente.models';
import { ClienteService } from 'src/app/services/cliente.service';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cliente-view',
  templateUrl: './cliente-view.page.html',
  styleUrls: ['./cliente-view.page.scss'],
})
export class ClienteViewPage implements OnInit {

  clienteForm: FormGroup;
  clienteSubmit: Cliente;
  idCliente: string;
  cliente: Cliente;
  user: Usuario;

  viewMode = false;
  editMode = false;
  createMode = false;

  get nombre() {
    return this.clienteForm.get('nombre');
  }

  get calle() {
    return this.clienteForm.get('calle');
  }
  
  get altura() {
    return this.clienteForm.get('altura');
  }

  get localidad() {
    return this.clienteForm.get('localidad');
  }

  public errorMessages = {
    nombre: [
      { type: 'required', message: 'El nombre es requerido'}
    ],
    calle: [
      { type: 'required', message: 'La calle es requerida'}
    ],
    altura: [
      { type: 'required', message: 'La altura es requerida'}
    ],
    localidad: [
      { type: 'required', message: 'La localidad es requerida'}
    ]
  };
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clienteSev: ClienteService,
    private authService: AuthenticationService,
    private alertCtrl: AlertController,
  ) { }

  async ngOnInit() {
    const user = this.authService.getUser();
    this.user = JSON.parse(user);

    this.clienteForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      altura: ['', [Validators.required]],
      localidad: ['', [Validators.required]]
    });
    console.log(this.clienteForm);

    /* Verificando si el formulario tiene id */

    this.activatedRoute.paramMap.subscribe(async paramMap => {
      this.idCliente = paramMap.get('idCliente');
      this.editMode = this.router.url.includes('/clientes/editar/');

      if (this.idCliente) {
        /* Como tiene id, completo el formulario con los datos del BE */
        try {
          this.clienteSubmit = await this.clienteSev.get(this.user.idUsuario, this.idCliente);
        } catch (error) {
          console.log("Ha ocurrido un error cargando el cliente, reintente.")
        }

        if (this.editMode) {

          //Habilito las propiedades para editar en el formulario
          console.log('Como está en modo edición, completo el formulario con los datos del BE ');
          this.cambiarWebEstado(false, true, false);
          this.clienteForm.patchValue(this.clienteSubmit)
          console.log(this.clienteSubmit);
        } else {

          //Habilito las propiedades ver en el formulario
          console.log('Como está en modo vista, completo el formulario con los datos del BE ');
          this.cambiarWebEstado(true, false, false);
          this.cliente = await this.clienteSev.get(this.user.idUsuario, this.idCliente);
          console.log(this.cliente);
        }
      } else {

        //Habilito las propiedades para crear en el formulario
        console.log('Como está en modo creación, dejo el formulario vacío');
        this.cambiarWebEstado(false, false, true);
      }
    });
  }

  // async ionViewWillEnter() {
  //   let user = this.authService.getUser()
  //   this.user = JSON.parse(user)

  //   this.activatedRoute.paramMap.subscribe(async paramMap => {
  //     const clienteId = paramMap.get('idCliente');
  //     console.log("entre al view page del cliente id " + clienteId);

  //     this.cliente = await this.clienteSev.get(this.user.idUsuario, clienteId)
  //     console.log(this.cliente);
  //     })
  // }


  async borrarCliente() {
    const msjConfirmacion = await this.alertCtrl.create({
      header: 'Confirme',
      message: '¿Esta seguro de eliminar este cliente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: () => {
            //  this.clienteSev.delete(this.cliente.id);
            this.router.navigate(['']);
          }
        }
      ]
    });
    await msjConfirmacion.present();
  }

  cambiarWebEstado(view: boolean, edit: boolean, create: boolean) {
    this.viewMode = view;
    this.editMode = edit;
    this.createMode = create;
  }

  async onSubmit(form: FormGroup, e: any) {
    // e.preventDefault();
    // const opt = this.preguntaForm.get('opciones').value;
    // if(opt.filter(opt => opt.correcta == true).length != 1 || opt.length < 2){
    //   this._toastService.presentToast('Debe seleccionar una respuesta correcta y minimo tienen que existir 2 opciones, verifique!');
    // }else{
    //   console.log(this.preguntaForm.getRawValue())
    //   this.preguntaSubmit = new Pregunta(
    //     this.pregunta.value,
    //     this.preguntaForm.get('opciones').value.filter(opt => opt.correcta == true).map(opt => opt.opcion).toString(),
    //     new Date(),
    //     new Date(),
    //     this.preguntaForm.get('opciones').value.map(opt => opt.opcion),
    //     this.user,
    //     this.tipo.value,
    //     this.puntosDonados.value
    //   );
    //   console.log(this.preguntaSubmit)
    //   try {
    //     if(this.editMode){
    //       this.preguntaSubmit.id = this.idPregunta;
    //       await this._preguntasService.putPregunta(this.preguntaSubmit)
    //         .then(res => {
    //           this._toastService.presentToast('Pregunta modificada');
    //         })
    //         .catch(err => {
    //           console.log(err)
    //           this._toastService.presentToast(err.error.message);
    //         }); 
    //     }
    //     else{
    //       await this._preguntasService.postPregunta(this.preguntaSubmit)
    //         .then(res => {
    //           this._toastService.presentToast('Pregunta Creada exitosamente!');
    //         })
    //         .catch(err => {
    //           console.log(err)
    //           this._toastService.presentToast(err.error.message);
    //         });
    //     }
    //     this._router.navigateByUrl('/tabs', { replaceUrl: true });
    //   } catch (error) {
    //     this._toastService.presentToast('Ha ocurrido un error generando pregunta, reintente.');
    //   }
  }

}