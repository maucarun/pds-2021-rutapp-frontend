import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  @Input() estados: any;

  constructor(public popoverController: PopoverController) { }

  ngOnInit() { }

  seleccionar(estado: string) {
    this.popoverController.dismiss(estado, 'filtrar');
  }

  async cancelar() {
    await this.popoverController.dismiss(null, 'cancelar');
  }

}
