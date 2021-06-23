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
import { ToastService } from 'src/app/services/toast.service';

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

  public errorMessages = {
    nombre: [
      { type: 'required', message: 'El nombre es requerido' }
    ],
    cuit: [
      { type: 'required', message: 'El CUIT es requerido' }
    ],
    promedio_espera: [
      { type: 'required', message: 'El promedio de espera es requerido' }
    ],
    calle: [
      { type: 'required', message: 'La calle es requerida' }
    ],
    altura: [
      { type: 'required', message: 'La altura es requerida' }
    ],
    localidad: [
      { type: 'required', message: 'La localidad es requerida' }
    ],
    contactos: [
      { type: 'required', message: 'Ingresar al menos un contacto' }
    ],
    disponibilidades: [
      { type: 'required', message: 'Ingresar al menos una disponibilidad' }
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private authService: AuthenticationService,
    private alertCtrl: AlertController,
    private loading: LoadingService,
    private toastService: ToastService,
  ) { }

  get nombre() {
    return this.clienteForm.get('nombre');
  }

  get cuit() {
    return this.clienteForm.get('cuit');
  }

  get promedio_espera() {
    return this.clienteForm.get('promedio_espera');
  }

  get observaciones() {
    return this.clienteForm.get('observaciones');
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

  get provincia() {
    return this.clienteForm.get('provincia');
  }

  /** cForm hace referencia a clienteForm */
  contactos(cForm) {
    return cForm.controls.contactos.controls;
  }

  telefonos(cForm) {
    return cForm.controls.telefonos.controls;
  }

  emails(cForm) {
    return cForm.controls.emails.controls;
  }

  get disponibilidades() {
    return this.clienteForm.get('disponibilidades');
  }

  async ngOnInit() {
    this.loading.present('Cargando...');//si la carga es demasiado rápida, eliminarlo
    const user = this.authService.getUser();
    this.user = JSON.parse(user);

    /** Inicializamos las propiedades del cliente */
    this.cliente = {
      idCliente: null,
      nombre: '',
      observaciones: '',
      cuit: '',
      promedio_espera: 0,
      activo: true,
      propietario: this.user,
      direccion: {} as Direccion,
      disponibilidades: {} as Disponibilidad[],
      urlImagenPerfil: '',
      contactos: {} as Contacto[],
    };

    /** Creando formulario con sus propiedades */
    this.clienteForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      cuit: ['', [Validators.required]],
      observaciones: ['', [Validators.required]],
      promedio_espera: ['', [Validators.required]],
      direccion: this.formBuilder.group({
        calle: ['', [Validators.required]],
        altura: ['', [Validators.required]],
        localidad: ['', [Validators.required]],
        provincia: ['', [Validators.required]],
      }),
      contactos: this.formBuilder.array([]),
      disponibilidades: this.formBuilder.array([])
    });
    console.log(this.clienteForm);

    /* Verificando si la página tiene id */
    this.activatedRoute.paramMap.subscribe(async paramMap => {
      this.idCliente = paramMap.get('id');
      /** Obtenemos un batch de disponibilidades para los 7 dias de la semana */
      this.disponibilidadesNuevas = await this.clienteService.getDisponibilidades();
      this.disponibilidadesNuevas.forEach((d: any) => d.seleccionado = false);

      if (this.idCliente === 'nuevo') {
        this.viewMode = false;
        console.log('Solicitud de cliente nuevo');

        // this.clienteForm.patchValue({
        //   disponibilidades: this.disponibilidadesNuevas,
        // });

        /** Inyectamos el batch de disponibilidades en el clienteForm */
        this.inyectarDisponibilidades();

        return this.loading.dismiss();
      }

      console.log('Obtuve el cliente id ' + this.idCliente);
      this.cliente = await this.clienteService.get(this.user.idUsuario, this.idCliente);
      console.log(this.cliente);

      /** Pegamos las props del cliente en el formulario */
      this.clienteForm.patchValue({
        nombre: this.cliente.nombre,
        observaciones: this.cliente.observaciones,
        cuit: this.cliente.cuit,
        promedio_espera: this.cliente.promedio_espera,
        activo: this.cliente.activo,
        propietario: this.user,
        direccion: this.cliente.direccion,
        contactos: this.cliente.contactos,
        disponibilidades: this.cliente.disponibilidades,
        urlImagenPerfil: this.cliente.urlImagenPerfil
      });

      // this.clienteForm.patchValue(this.cliente)

      /** Pegamos los contactos del cliente en el formulario */
      if (this.cliente.contactos.length >= 1) {
        this.cliente.contactos.forEach((contacto, i = 0) => {
          const controls = this.clienteForm.controls.contactos as FormArray;
          controls.push(this.obtenerContactoForm(contacto.nombre, contacto.apellido));
          console.log(controls.get(`${i}.telefonos`) as FormArray);
          if (contacto.telefonos.length >= 1) {
            contacto.telefonos.forEach((t) => {
              const controlsTel = controls.get(`${i}.telefonos`) as FormArray;
              controlsTel.removeAt(0);
              controlsTel.push(this.obtenerTelefonoForm(t.telefono));
            });
          }
          if (contacto.emails.length >= 1) {
            contacto.emails.forEach((e) => {
              const controlsEm = controls.get(`${i}.emails`) as FormArray;
              controlsEm.removeAt(0);
              controlsEm.push(this.obtenerEmailForm(e.direccion));
            });
          }
        });
      }
      console.log(this.clienteForm);

      /** Reemplazamos los dias de la semana con los datos del BE en disponibilidadesNuevas */
      this.cliente.disponibilidades.forEach((dispCliente: Disponibilidad) => {
        this.disponibilidadesNuevas.forEach((disp: any) => {

          if (disp.diaSemana.diaSemana === dispCliente.diaSemana.diaSemana) {
            disp.hora_apertura = dispCliente.hora_apertura;
            disp.hora_cierre = dispCliente.hora_cierre;
            disp.seleccionado = true;
          }
        });
      });

      /** Inyectamos disponibilidadesNuevas/disponibilidades del BE en el clienteForm */
      this.inyectarDisponibilidades();

      this.clienteForm.disable();
      this.loading.dismiss();
    });
  }

  inyectarDisponibilidades() {
    this.disponibilidadesNuevas.forEach((d: any) => {
      // console.log(d);
      const controls = this.clienteForm.controls.disponibilidades as FormArray;
      // console.log(d.diaSemana.diaSemana);
      controls.push(
        this.formBuilder.group({
          diaSemana: [d.diaSemana.diaSemana],
          disponibilidadSeleccionado: [d.seleccionado, []],
          hora_apertura: [d.hora_apertura, []],
          hora_cierre: [d.hora_cierre, []],
        })
      );
    });
  }

  formatearHora(hora: string) {
    const date = new Date(hora);
    return ('00' + date.getHours()).slice(-2) + ':' +
      ('00' + date.getMinutes()).slice(-2);
  }

  obtenerDisponibilidadForm() {
    return this.formBuilder.group({
      disponibilidadSeleccionado: ['', []],
      hora_apertura: ['', []],
      hora_cierre: ['', []],
    });
  }

  obtenerDisponibiladesSeleccionadas() {
    this.cliente.disponibilidades = this.disponibilidadesNuevas.filter((e: any) => e.seleccionado);
  }

  obtenerContactoForm(name?: string, apellido?: string) {
    return this.formBuilder.group({
      nombre: [name, [Validators.required]],
      apellido: [apellido, [Validators.required]],
      telefonos: new FormArray([this.obtenerTelefonoForm()]),
      emails: new FormArray([this.obtenerEmailForm()])
    });
  }

  obtenerTelefonoForm(telefono?: string) {
    return this.formBuilder.group({
      // id_telefono: [],
      telefono: [telefono, [Validators.required]],
      // esPrincipal: []
    });
  }

  obtenerEmailForm(email?: string) {
    return this.formBuilder.group({
      direccion: [email, [Validators.required]],
    });
  }

  addContactoFormRow() {
    const controls = this.clienteForm.controls.contactos as FormArray;
    controls.push(this.obtenerContactoForm());
  }

  addTelefonoFormRow(i: number, telefono?: string) {
    const control = this.clienteForm.get(`contactos.${i}.telefonos`) as FormArray;
    control.push(this.obtenerTelefonoForm(telefono));
  }

  addEmailFormRow(i: number) {
    const control = this.clienteForm.get(`contactos.${i}.emails`) as FormArray;
    control.push(this.obtenerEmailForm());
  }

  async removeContactoFormRow(i: number) {
    const controls = this.clienteForm.controls.contactos as FormArray;

    const msjConfirmacion = await this.alertCtrl.create({
      header: 'Confirme',
      message: '¿Esta seguro de eliminar este contacto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: async () => {
            controls.removeAt(i);
          }
        }
      ]
    });
    await msjConfirmacion.present();
  }

  async removeTelefonoFormRow(i: number, j: number) {
    const control = this.clienteForm.get(`contactos.${i}.telefonos`) as FormArray;
    control.removeAt(j);
  }

  async removeEmailFormRow(i: number, j: number) {
    const control = this.clienteForm.get(`contactos.${i}.emails`) as FormArray;
    control.removeAt(j);
  }

  async editarCliente() {
    /** Habilito la edición de los campos */
    this.viewMode = false;
    this.clienteForm.enable();
  }

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
          handler: async () => {
            await this.clienteService.delete(this.idCliente)
              .then(() => {
                this.toastService.presentToast('Eliminado el cliente ' + this.idCliente);
                this.router.navigate(['clientes']);
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

  async onSubmit(form: FormGroup, e: any) {
    e.preventDefault();
    //console.log(form);
    const dispSeleccionadas = this.clienteForm.get('disponibilidades').value;
    const disponibilidadesFiltradas = dispSeleccionadas.filter(dsp => dsp.disponibilidadSeleccionado);
    const contactosAgregados = this.clienteForm.get('contactos').value;
    //console.log(contactosAgregados.length)
    if (disponibilidadesFiltradas.length < 1) { this.toastService.presentToast('Debe seleccionar al menos una disponibilidad'); }
    else if (contactosAgregados.length < 1) { this.toastService.presentToast('Debe añadir al menos un contacto'); }
    else {
      /** Como el objeto cliente está vacío, tenemos que setetarle cada una de las propiedades del form */
      this.cliente.nombre = this.clienteForm.get('nombre').value;
      this.cliente.observaciones = this.clienteForm.get('observaciones').value;
      this.cliente.cuit = this.clienteForm.get('cuit').value;
      this.cliente.promedio_espera = this.clienteForm.get('promedio_espera').value;
      // this.cliente.direccion.calle = this.clienteForm.get('calle').value;
      // this.cliente.direccion.altura = this.clienteForm.get('altura').value;
      // this.cliente.direccion.localidad = this.clienteForm.get('localidad').value;
      // this.cliente.direccion.provincia = this.clienteForm.get('provincia').value;
      this.cliente.direccion = this.clienteForm.get('direccion').value;
      console.log(this.cliente.direccion);
      this.cliente.disponibilidades = disponibilidadesFiltradas;
      /**Deberiamos llamar al servicio de Google */
      this.cliente.direccion.latitud = 0.0;
      this.cliente.direccion.longitud = 0.0;

      /**
       * Seteamos las props de contactos.
       * Como el contacto por ahora tiene un solo telefono y un solo email
       *  no hacemos un forEach para setear una lista de telefonos e emails
       *  al contacto.
       */
      this.cliente.contactos = this.clienteForm.get('contactos').value;
      // this.clienteForm.get('contactos').value.forEach(cf => {
      //   //const telefonos = {} as Telefono[];
      //   //const emails = {} as Email[];
      //   const contacto = {} as Contacto;
      //   contacto.telefonos = [];
      //   contacto.emails = [];
      //   //c.telefonos.forEach(t => {
      //   const telefono = {} as Telefono;
      //   telefono.telefono = cf.telefono;
      //   //telefonos.push(telefono);
      //   //});
      //   //c.emails.forEach(em => {
      //   const email = {} as Email;
      //   email.direccion = cf.email;
      //   //emails.push(email);
      //   //});
      //   contacto.nombre = cf.nombre;
      //   contacto.apellido = cf.apellido;
      //   contacto.telefonos.push(telefono);
      //   contacto.emails.push(email);
      //   this.cliente.contactos.push(contacto);
      // });

      console.log(this.cliente);

      try {
        if (this.idCliente === 'nuevo') {
          /** Seteamos las props de disponibilidades */
          disponibilidadesFiltradas.forEach(d => {
            d.hora_apertura = this.formatearHora(d.hora_apertura);
            d.hora_cierre = this.formatearHora(d.hora_cierre);
            /** Volvemos a transformar el dia de la semana en un objeto DiaSemana */
            this.disponibilidadesNuevas.forEach(disp => {
              if (d.diaSemana === disp.diaSemana.diaSemana) {
                d.diaSemana = disp.diaSemana;
              }
            });
          });

          /** Como es un nuevo cliente hago el llamado al POST */
          await this.clienteService.create(this.cliente)
            .then(() => {
              this.toastService.presentToast('Cliente creado exitosamente!');
              this.router.navigate(['clientes']);
            })
            .catch(err => {
              console.log(err);
              this.toastService.presentToast(err.error.message);
              this.clienteForm.disable();
            });
        }
        else {
          const idCliente = Number(this.idCliente); /** Transformo el id a number para comparar con el id que recibí del BE */
          if (idCliente === this.cliente.idCliente) {
            /** Seteamos las props de disponibilidades */
            disponibilidadesFiltradas.forEach(d => {
              d.hora_apertura = d.hora_apertura;
              d.hora_cierre = d.hora_cierre;
              /** Volvemos a transformar el dia de la semana en un objeto DiaSemana */
              this.disponibilidadesNuevas.forEach(disp => {
                if (d.diaSemana === disp.diaSemana.diaSemana) {
                  d.diaSemana = disp.diaSemana;
                }
              });
            });

            /** Como estoy editando un cliente hago el llamado al PUT */
            await this.clienteService.update(this.cliente)
              .then(() => {
                this.toastService.presentToast('Cliente editado exitosamente!');
                this.router.navigate(['clientes']);
              })
              .catch(err => {
                console.log(err);
                this.toastService.presentToast(err.error.message);
                this.clienteForm.disable();
              });
          } else {
            this.toastService.presentToast('El id del cliente obtenido ' + this.cliente.idCliente + ' no coincide con el de la URL ' + idCliente);
            this.clienteForm.disable();
          }
        }
      }
      catch {

      }
    }

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
