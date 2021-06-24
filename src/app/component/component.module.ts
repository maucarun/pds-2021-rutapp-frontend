import { ModalPage } from 'src/app/component/modal/modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { HojaDeRutaModalComponent } from './hoja-de-ruta-modal/hoja-de-ruta-modal.component';
import { EntregaComponent } from './entrega/entrega.component';


@NgModule({
    declarations: [ModalPage, PopoverComponent, HojaDeRutaModalComponent, EntregaComponent],
    exports: [ModalPage, PopoverComponent, HojaDeRutaModalComponent, EntregaComponent],
    imports: [
        CommonModule, RouterModule, FormsModule, ReactiveFormsModule, IonicModule
    ]
})
export class ComponentsModule { } 
