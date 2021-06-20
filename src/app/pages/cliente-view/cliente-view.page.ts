/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Cliente } from 'src/app/models/cliente.models';
import { ClienteService } from 'src/app/services/cliente.service';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Direccion } from 'src/app/models/direccion.models';
import { Disponibilidad } from 'src/app/models/disponibilidad.models';
import { Contacto } from 'src/app/models/contacto.models';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-cliente-view',
  templateUrl: './cliente-view.page.html',
  styleUrls: ['./cliente-view.page.scss'],
})
export class ClienteViewPage implements OnInit {
  lat = -34.5770106;
  lng = -58.5406398;

  clienteForm: FormGroup;
  clienteSubmit: Cliente;
  idCliente: string;
  cliente: Cliente;
  user: Usuario;
  disponibilidadesNuevas: Disponibilidad[];

  viewMode = true;
  /* editMode = false;
  createMode = false; */

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

  get contactos() {
    return this.clienteForm.get('contactos');
  }

  get disponibilidades() {
    return this.clienteForm.get('disponibilidades');
  }

  public errorMessages = {
    nombre: [
      { type: 'required', message: 'El nombre es requerido' }
    ],
    calle: [
      { type: 'required', message: 'La calle es requerida' }
    ],
    altura: [
      { type: 'required', message: 'La altura es requerida' }
    ],
    localidad: [
      { type: 'required', message: 'La localidad es requerida' }
    ]
  };
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private authService: AuthenticationService,
    private alertCtrl: AlertController,
    public loading: LoadingService,
  ) { }

  async ngOnInit() {
    this.loading.present();//si la carga es demasiado rápida, eliminarlo
    const user = this.authService.getUser();
    this.user = JSON.parse(user);

    this.clienteForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      altura: ['', [Validators.required]],
      localidad: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      cuit: ['', [Validators.required]],
      observaciones: ['', [Validators.required]],
      promedio_espera: ['', [Validators.required]],
      contactos: this.formBuilder.array([]),
      disponibilidades: this.formBuilder.array([])
    });



    /* Verificando si la página tiene id */

    this.activatedRoute.paramMap.subscribe(async paramMap => {
      this.idCliente = paramMap.get('id');

      //this.editMode = this.router.url.includes('/clientes/editar/');

      if (this.idCliente === 'nuevo') {
        this.viewMode = false;

        console.log('entramos al cliente nuevo');

        this.disponibilidadesNuevas = await this.clienteService.getDisponibilidades();
        this.disponibilidadesNuevas.forEach((d: any) => d.seleccionado = false);

        this.cliente = {
          idCliente: 0,
          nombre: '',
          observaciones: '',
          cuit: '',
          promedio_espera: 0,
          activo: true,
          propietario: this.user,
          direccion: {} as Direccion,
          disponibilidades: {} as Disponibilidad[],
          contactos: {} as Contacto[],
          urlImagenPerfil: '',
        };

        this.disponibilidadesNuevas.forEach((d: any) => {
          console.log(d);
          const controls = this.clienteForm.controls.disponibilidades as FormArray;
          console.log(d.diaSemana.diaSemana)
          controls.push(
            this.formBuilder.group({
              disponibilidadDiaSemana: [d.diaSemana.diaSemana],
              disponibilidadSeleccionado: [d.seleccionado, [Validators.required]],
              disponibilidadHoraApertura: [d.hora_apertura, [Validators.required]],
              disponibilidadHoraCierre: [d.hora_cierre, [Validators.required]],
            })
          );
        });

        this.clienteForm.patchValue({
          disponibilidades: this.disponibilidadesNuevas,
        });

        console.log(this.clienteForm);
        //console.log(this.disponibilidadesNuevas)

        return this.loading.dismiss();
      }

      this.cliente = await this.clienteService.get(this.user.idUsuario, this.idCliente);

      console.log(this.cliente);

      this.clienteForm.patchValue({
        nombre: this.cliente.nombre,
        observaciones: this.cliente.observaciones,
        cuit: this.cliente.cuit,
        promedio_espera: this.cliente.promedio_espera,
        activo: this.cliente.activo,
        propietario: this.user,
        calle: this.cliente.direccion.calle,
        altura: this.cliente.direccion.altura,
        localidad: this.cliente.direccion.localidad,
        provincia: this.cliente.direccion.provincia,
        disponibilidades: this.cliente.disponibilidades,
        urlImagenPerfil: this.cliente.urlImagenPerfil
      });

      this.cliente.contactos.forEach(contacto => {
        //console.log(contacto);
        const controls = this.clienteForm.controls.contactos as FormArray;
        controls.push(
          this.formBuilder.group({
            contactoNombre: [contacto.nombre, [Validators.required]],
            contactoApellido: [contacto.apellido, [Validators.required]],
            contactoTelefono: [contacto.telefonos[0].telefono, [Validators.required]],
            contactoEmail: [contacto.emails[0].direccion, [Validators.required]],
          })
        );
      });

      this.clienteForm.disable();

      this.loading.dismiss();
    });
  }

  obtenerDisponibilidadForm() {
    //const arrays = [];
    //for (let i = 0; i < 7; i++) {
    //arrays.push(
    return this.formBuilder.group({
      disponibilidadSeleccionado: ['', [Validators.required]],
      disponibilidadHoraApertura: ['', [Validators.required]],
      disponibilidadHoraCierre: ['', [Validators.required]],
    });
    //);}
    //console.log(arrays)
    //return arrays;
  }

  obtenerContactoForm() {
    return this.formBuilder.group({
      contactoNombre: ['', [Validators.required]],
      contactoApellido: ['', [Validators.required]],
      contactoEmail: ['', [Validators.required]],
      contactoTelefono: ['', [Validators.required]],
    });
  }

  addContactoFormRow(e: any) {
    e.preventDefault();
    const controls = this.clienteForm.controls.contactos as FormArray;
    controls.push(this.obtenerContactoForm());
  }

  removeContactoFormRow(i: number) {
    const controls = this.clienteForm.controls.contactos as FormArray;
    if (window.confirm('¿Está seguro que desea borrar esta contacto?')) {
      controls.removeAt(i);
    }
  }


  /* Como tiene id, completo el formulario con los datos del BE */
  /*   try {
      this.clienteSubmit = await this.clienteSev.get(this.user.idUsuario, this.idCliente);
    } catch (error) {
      console.log("Ha ocurrido un error cargando el cliente, reintente.")
    }
  
    if (this.editMode) { */

  //Habilito las propiedades para editar en el formulario
  /*        console.log('Como está en modo edición, completo el formulario con los datos del BE ');
         this.cambiarWebEstado(false, true, false); */
  // this.clienteForm.patchValue(this.clienteSubmit)
  /* El patch value solo se puede usar si son las mismas propiedades del objeto */
  /*         this.calle.setValue(this.clienteSubmit.direccion.calle)
          console.log(this.clienteSubmit);
        } else { */

  //Habilito las propiedades ver en el formulario
  /*      console.log('Como está en modo vista, completo el formulario con los datos del BE ');
       this.cambiarWebEstado(true, false, false);
       this.cliente = await this.clienteSev.get(this.user.idUsuario, this.idCliente);
       console.log(this.cliente);
     }
   } else { */

  //Habilito las propiedades para crear en el formulario
  //console.log('Como está en modo creación, dejo el formulario vacío');
  //this.cambiarWebEstado(false, false, true);
  /*    }
     }); */
  //}

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

  /*  cambiarWebEstado(view: boolean, edit: boolean, create: boolean) {
     this.viewMode = view;
     this.editMode = edit;
     this.createMode = create;
   } */

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