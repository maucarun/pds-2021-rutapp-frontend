import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { HojaDeRutaService, PaginacionService } from 'src/app/services/hojaDeRuta.service';
import { Remito } from 'src/app/models/remito.models';
import { Estado } from 'src/app/models/estado.models';
import { HojaDeRutaModalComponent } from 'src/app/component/hoja-de-ruta-modal/hoja-de-ruta-modal.component';
import { Cliente } from 'src/app/models/cliente.models';
import { ProductoRemito } from 'src/app/models/productoRemito.models';
import { ComprobanteEntrega } from 'src/app/models/comprobanteEntrega.models';
import { HojaDeRuta } from 'src/app/models/hojaDeRuta.models';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';


@Component({
  selector: 'app-hoja-de-ruta-nav',
  templateUrl: './hoja-de-ruta-nav.page.html',
  styleUrls: ['./hoja-de-ruta-nav.page.scss'],
})
export class HojaDeRutaNavPage {

  hojaForm: FormGroup;
  idHoja: string;
  hoja: HojaDeRuta;
  user: Usuario;
  remitosDisponibles: RemitoSeleccionable[];
  estadosHdr: Estado[];
  submitted = false;
  editable: boolean = null;

  constructor(
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private hojaServ: HojaDeRutaService,
    private loading: LoadingService,
    private authService: AuthenticationService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastService: ToastService,
  ) {
    this.hojaForm = this.formBuilder.group({
      justificacion: new FormControl('', []),
      // estado: this.formBuilder.group({
      //   id_estado: new FormControl('', []),
      //   nombre: ['', [Validators.required]],
      //   tipo: new FormControl('', [])
      // }),
      estado: new FormControl('', []),
      kms_recorridos: new FormControl('', []),
      fecha_hora_inicio: new FormControl('', []),
      fecha_hora_fin: new FormControl('', []),
    });
  }

  async ionViewWillEnter() {
    this.loading.present('Cargando...');
    this.user = await this.authService.getUsuario();

    this.activatedRoute.paramMap.subscribe(async paramMap => {
      this.idHoja = paramMap.get('idHojaDeRuta');
      if (this.idHoja !== 'crear') {
        try {
          this.hoja = await this.hojaServ.get(this.idHoja);

          this.hoja.remitos.sort((a, b) => a.estado.id_estado - b.estado.id_estado);

          this.editable = false;
          this.hojaForm.patchValue(this.hoja);
        } catch (error) {
          console.log('Ha ocurrido un error cargando la hoja de ruta, reintente.');
        }
      } else {
        await this.inicializarNuevaHoja();
        this.editable = true;
        // this.hojaForm.patchValue(this.hoja)
        this.hojaForm.patchValue({
          estado: this.hoja.estado,
          kms_recorridos: this.hoja.kms_recorridos
        });
        /** Desactivar la selección de estado porque por defecto es "Pendiente" */
        this.hojaForm.get('estado').disable();
        console.log(this.hojaForm);
      }
      return this.loading.dismiss();
    });
  }




  // ###############                    ###############

  async inicializarNuevaHoja() {
    this.hoja = {} as HojaDeRuta;
    this.hoja.kms_recorridos = 0;
    this.hoja.estado = { id_estado: 2, nombre: 'Pendiente', tipo: 'HojaDeRuta' } as Estado;
    this.hoja.remitos = [] as Remito[];
    await this.hojaServ.getEstados().then(data => this.estadosHdr = data);
    await this.hojaServ.getRemitosDisponibles().then((data: PaginacionService) => this.remitosDisponibles = data.reultado);
    this.editable = true;
  }

  // ------------         Validadores del formulario         ------------

  get validarJustificacion(): boolean {
    let estado = this.hoja.estado
    if (estado && estado.nombre === 'Suspendida' && (!this.hoja.justificacion || this.hoja.justificacion === "")) {
      this.toastService.presentToast('Debe ingresar el motivo de la suspensión')
      return false
    }
    return true
  }

  /*   get validarMks(): boolean {
      let estado = this.hoja.estado
      if (estado && estado.nombre === 'En Curso' && (!this.hoja.kms_recorridos || this.hoja.kms_recorridos <= 0)){
        this.toastService.presentToast('Debe ingresar los kilometros recorridos')
        return false
      }
      return true
    } */

  /* get validarFechas(): string {
    if (this.hoja.estado.nombre == '' && this.hoja.estado.nombre !== 'Suspendida'){
      if (!this.hoja.fecha_hora_inicio) {
        return "Debe ingresar la fecha y hora inicial"
      }
      else
        if (this.hoja.estado.nombre === 'Completada') {
          return "Debe ingresar la fecha y hora final"
        }
        else {return null}
      } else {return null}
  } */

  soloNros(event: any) {
    this.hoja.kms_recorridos = event.target.value.replace(/[^0-9]*/g, '');
  }

  diasDisponibles(rmt: Remito): string {
    let _dias: string[] = [];
    const sorter = {
      'Lu': 1,
      'Ma': 2,
      'Mi': 3,
      'Ju': 4,
      'Vi': 5,
      'Sa': 6,
      'Do': 7
    }
    rmt.cliente.disponibilidades.forEach(dia => {
      if (!_dias.includes(dia.diaSemana.diaSemana.substring(0, 2)))
        _dias.push(dia.diaSemana.diaSemana.substring(0, 2))
    })
    _dias.sort(function sortByDay(a, b) {
      let day1 = a;
      let day2 = b;
      return sorter[day1] - sorter[day2];
    });
    return _dias.join(", ")
  }

  async validarGuardado(): Promise<boolean> {
    this.submitted = true;

    return this.hojaForm.valid &&
      this.hoja.remitos.length > 0 &&
      this.validarJustificacion
    //&& this.validarFechas && this.validarMks
  }

  get hayRemitosPendientes() {
    let dia = new Date().getDay();
    if (dia === 0) { dia = 7; }

    return (this.hoja.remitos.filter(item => (item.estado === null || item.estado.nombre == 'Pendiente') &&
      (item.cliente.disponibilidades.filter(disp =>
        disp.diaSemana.id_dia_semana === dia)).length > 0).length > 0);
  }

  // ###############          Ventanas modales          ###############

  async ingresarTexto(texto: string, titulo: string, placeholder: string): Promise<string> {
    let respuesta: string;
    const alertMotivo = await this.alertCtrl.create({
      header: titulo, //'Motivo',
      //message: 'Por favor ingrese el motivo de la suspensión',
      message: texto,
      inputs: [
        {
          name: 'texto',
          placeholder, // 'Ingrese el motivo',
          type: 'textarea',

        }
      ],
      buttons: [
        {
          text: 'Aceptar',
          handler: (data) => {
            alertMotivo.dismiss(true);
            return data.texto.value;
          },
          role: 'aceptar'
        },
        {
          text: 'Cancelar',
          handler: (data) => {
            alertMotivo.dismiss(false);
            return null;
          },
          role: 'cancel'
        }
      ],
      backdropDismiss: false
    });
    await alertMotivo.present();
    await alertMotivo.onDidDismiss().then((data) => {
      respuesta = data as string;
    });
    return respuesta;
  }

  async confirmacion(mensaje: string, titulo: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'Aceptar',
          handler: (): boolean => {
            alert.dismiss(true);
            return false;
          }
        }],
      backdropDismiss: false
    });
    await alert.present();
    await alert.onDidDismiss().then();
  }

  async seleccione(mensaje: string): Promise<boolean> {
    let confirma;
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          handler: (): boolean => {
            alert.dismiss(false);
            return false;
          },
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (): boolean => {
            alert.dismiss(true);
            return false;
          },
          role: 'aceptar'
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
    await alert.onDidDismiss().then((data) => {
      console.log(data)
      confirma = data;
    });
    return confirma;
  }

  async mostrarModalRemitos() {
    const modal = await this.modalCtrl.create({
      component: HojaDeRutaModalComponent,
      backdropDismiss: false,
      componentProps: {
        remitos: this.remitosDisponibles
      }
    });

    await modal.present();
    await modal.onWillDismiss().then((respuestaModal) => {
      if (respuestaModal.role !== 'cancelar') {
        respuestaModal.data.forEach((rto: Remito) => {
          this.hoja.remitos.push(rto);
          this.remitosDisponibles = this.remitosDisponibles.filter(x => x !== rto);
        });
      }
    });
  }

  // ###############          Crear Editar y Borrar          ###############

  async editarHoja() {

    await this.hojaServ.getEstados().then(data => { this.estadosHdr = data.filter(estado => estado.nombre !== 'Completada'); })
    await this.hojaServ.getRemitosDisponibles().then((data: PaginacionService) => this.remitosDisponibles = data.reultado)
    this.editable = true
  }

  eliminarRemito(rto: Remito) {
    this.hoja.remitos = this.hoja.remitos.filter(r => rto !== r);
    const rtos = rto as RemitoSeleccionable;
    rtos.seleccionado = false;
    this.remitosDisponibles.push(rtos);
  }

  async borrarHoja() {
    let confirma: any;
    let motivo: any;
    if (this.idHoja) {
      await this.seleccione('¿Esta seguro que desea suspender esta hoja de ruta?').then(
        (rta: any) => {
          confirma = rta //.data
          console.log(rta)
        }
      ).catch(
        err => console.log('error')
      );
      if (confirma.role !== 'cancel') {
        await this.ingresarTexto('Por favor ingrese el motivo de la suspensión', 'Motivo', 'Motivo de a suspensión').then(
          (rta: any) => {
            motivo = rta
            console.log(rta)
          }
        );
        if (motivo.role === 'cancel') return
        if (motivo.data.values.texto !== '') {
          try {
            await this.hojaServ.delete(this.idHoja, motivo.data.values.texto)
            await this.confirmacion(
              'Se ha suspendido la hoja de ruta ' + this.idHoja + ' correctamente.',
              'Operación Exitosa!')
          } catch (e) {
            await this.confirmacion(
              'No se pudo suspender la hoja de ruta ' + this.idHoja + '.',
              'Operación Fallida!'
            )
          }
          this.editable = false
          this.submitted = false
          await this.ionViewWillEnter()
        } else {
          await this.confirmacion(
            'No se pudo suspender la hoja de ruta ' + this.idHoja + ' porque no ha indicado el motivo.',
            'Operación Fallida!'
          ).finally(async () => {
            this.editable = false;
            this.submitted = false;
            await this.ionViewWillEnter();
          }
          );
        }
      }
    }
  }

  async guardarHoja() {
    this.submitted = true;
    let confirma = false;
    console.log('Guardando la hoja de ruta');
    console.log(this.hojaForm);

    await this.validarGuardado().then(rta => confirma = rta);
    if (!confirma) { return; }

    confirma = false
    let mensaje = ''
    let titulo = ''
    if (this.hoja) {
      await this.seleccione('¿Esta seguro que desea guardar esta hoja de ruta?').then(
        rta => confirma = rta
      );
      if (confirma) {

        //this.hoja.estado = this.hojaForm.get('estado').value;

        if (this.editable && this.hoja.id_hoja_de_ruta > 0) {
          await this.hojaServ.update(this.hoja).then(_ => {
            mensaje = 'Se ha modificado la hoja de ruta ' + this.idHoja + ' correctamente.';
            titulo = 'Operación Exitosa!';
          }
          ).catch(_ => {
            mensaje = 'No se pudo modificar la hoja de ruta ' + this.idHoja + '.';
            titulo = 'Operación Fallida!';
          }
          );
        }
        else {
          await this.hojaServ.save(this.hoja).then(_ => {
            titulo = 'Operación Exitosa!';
            mensaje = 'Se ha creado la nueva hoja de ruta correctamente.';
          }
          ).catch(_ => {
            titulo = 'Operación Fallida!';
            mensaje = 'No se pudo crear la nueva hoja de ruta';
          }
          );
        }
        await this.confirmacion(
          mensaje, titulo
        );
      }
    }
    this.submitted = false;
    this.editable = false;
    await this.ionViewWillEnter();
  }

  compareFn(e1: Estado, e2: Estado): boolean {
    return e1 && e2 ? e1.id_estado == e2.id_estado : e1 == e2;
  }
  navegarClick() {
    this.router.navigateByUrl('hojasderuta/recorrido/' + this.hoja.id_hoja_de_ruta, { replaceUrl: true });
  }
}


class RemitoSeleccionable implements Remito {
  idRemito: number;
  fechaDeCreacion: string;
  total: number;
  motivo: string;
  tiempo_espera: number;
  cliente: Cliente;
  estado: Estado;
  productosDelRemito: ProductoRemito[];
  comprobante: ComprobanteEntrega;
  cantidadDeItems: number;
  hojaDeRuta: HojaDeRuta;
  seleccionado = false;
}
