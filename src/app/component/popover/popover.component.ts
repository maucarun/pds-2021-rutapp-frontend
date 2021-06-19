import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent {

  @Input() estados: any;

  constructor(public popoverController: PopoverController) { }

  seleccionar(estado: string) {
    this.popoverController.dismiss(estado, 'filtrar');
  }

  async cancelar() {
    await this.popoverController.dismiss(null, 'cancelar');
  }

}
