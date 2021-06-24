import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Cliente } from 'src/app/models/cliente.models';
import { ComprobanteEntrega } from 'src/app/models/comprobanteEntrega.models';
import { Estado } from 'src/app/models/estado.models';
import { HojaDeRuta } from 'src/app/models/hojaDeRuta.models';
import { ProductoRemito } from 'src/app/models/productoRemito.models';
import { Remito } from 'src/app/models/remito.models';

@Component({
  selector: 'app-hoja-de-ruta-modal',
  templateUrl: './hoja-de-ruta-modal.component.html',
  styleUrls: ['./hoja-de-ruta-modal.component.scss'],
})
export class HojaDeRutaModalComponent{

  @Input() remitos: RemitoSeleccionable[];

  constructor(private modalController: ModalController,) { }

  get seleccionados() : RemitoSeleccionable[]{
    return this.remitos.filter(e => e.seleccionado);
  }

  async agregarElementos() {
    await this.modalController.dismiss(this.seleccionados, 'agregar');
  }

  async cancelar() {
    await this.modalController.dismiss(null, 'cancelar');
  } 
  

  diasDisponibles(rmt : Remito): string{
    let _dias: string[] = [];
    const disp = rmt.cliente.disponibilidades.sort((n1,n2) => n1.diaSemana.id_dia_semana - n2.diaSemana.id_dia_semana)
    
    rmt.cliente.disponibilidades.forEach(dia=>
        {
            console.log(dia.diaSemana.diaSemana)
            if(!_dias.includes(dia.diaSemana.diaSemana.substring(0,2)))
                _dias.push(dia.diaSemana.diaSemana.substring(0,2))
        })
        
    return _dias.join(", ")
  } 
}


class RemitoSeleccionable implements Remito{
  idRemito: number
  fechaDeCreacion: string
  total: number
  motivo: string
  tiempo_espera: number
  cliente: Cliente
  estado: Estado
  productosDelRemito: ProductoRemito[];
  comprobante: ComprobanteEntrega;
  cantidadDeItems: number;
  hojaDeRuta: HojaDeRuta;
  seleccionado:boolean = false
}