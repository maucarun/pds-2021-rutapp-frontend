import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { timeout } from 'rxjs/operators';
import { ComprobanteEntrega } from 'src/app/models/comprobanteEntrega.models';
import { Remito } from 'src/app/models/remito.models';
import { Visita } from 'src/app/models/routific.models';

@Component({
  selector: 'entrega-component',
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.scss'],
})

export class EntregaComponent {
  @Input() visita: Visita;
  horaInicio: Date = new Date()
  estado: string = 'visitar'
  comprobante: ComprobanteEntrega = {} as ComprobanteEntrega
  nombreValido: boolean = true
  docValido: boolean = true
  motivoValido: boolean = true
  motivoCancelacion: string = ''
  submitted = false
  horaInicioEspera: number

  constructor(private modalController: ModalController) { }

  /*
  ngOnInit() {
    this.comprobante = {} as ComprobanteEntrega
    this.comprobante.fechaHoraEntrega = new Date()
  }
  */

  async cancelar() {
    this.submitted = false
    this.estado = 'cancelar'
   /* this.estado = 'seleccionecancelacion'*/
  }

  async suspender() {
    await this.modalController.dismiss({ estado: 2 }, 'suspendido');
  }

  async anular() {
    this.submitted = false
    this.estado = 'cancelar'
  }
  async volver(){
    this.submitted = false
    this.estado = 'entregar'
  }

  async finalizarCancelacion() {
    this.submitted = true
    if(this.motivoCancelacion===''){
      this.motivoValido = false
      return
    }
    await this.modalController.dismiss({ motivo: this.motivoCancelacion }, 'cancelado');
  }
  
get tieneTelefono(){
  return this.visita.remito &&
  this.visita.remito.cliente &&
  this.visita.remito.cliente.contactos &&
  this.visita.remito.cliente.contactos.length > 0 &&
  this.visita.remito.cliente.contactos[0].telefonos &&
  this.visita.remito.cliente.contactos[0].telefonos.length > 0 &&
  this.visita.remito.cliente.contactos[0].telefonos[0].telefono &&
  this.visita.remito.cliente.contactos[0].telefonos[0].telefono !== ""
}


  enviarMje() {
    window.open('https://api.whatsapp.com/send?phone=+5491139368836&text=Su pedido está en camino');
    // window.open('https://api.whatsapp.com/send?phone=54' + this.visita.remito.cliente.contactos[0].telefonos[0].telefono)
  }
  entregar() {
    this.horaInicioEspera = Date.now()
    this.estado = 'entregar'
    this.comprobante = {} as ComprobanteEntrega
    this.comprobante.fechaHoraEntrega = new Date()
  }

  async finalizarEntregar() {
    this.submitted = true
    if (!this.comprobante.nombreCompleto || this.comprobante.nombreCompleto === '') {
      this.nombreValido = false
      return
    }

    if (!this.comprobante.dni || this.comprobante.dni === '') {
      this.docValido = false
      return
    }

    const difEnMilisegundos = Date.now() - this.horaInicioEspera
    const difEnMinutos = Math.round((difEnMilisegundos/1000)/60)

    await this.modalController.dismiss({ horaInicio: this.horaInicio, comprobante: this.comprobante, tiempoEspera: difEnMinutos }, 'entregado');
    this.submitted = true
  }
}

export class EntregaCliente {
  inicioRecorrido: Date
  finRecorrido: Date
}
