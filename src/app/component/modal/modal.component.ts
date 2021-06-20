import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalPage implements OnInit {

  @Input() elementos: any;

  elementosSeleccionados: any;

  constructor(
    private modalController: ModalController,
  ) { }

  async ngOnInit() {
    await this.agregarPropSeleccionado();
  }

  async agregarPropSeleccionado() {
    this.elementos.forEach(e => e.seleccionado = false);
  }

  getSeleccionados() {
    this.elementosSeleccionados = this.elementos.filter(e => e.seleccionado);
  }

  async agregarElementos() {
    this.getSeleccionados();
    await this.modalController.dismiss(this.elementosSeleccionados, 'agregar');
  }

  async cancelar() {
    await this.modalController.dismiss(null, 'cancelar');
  }
}
