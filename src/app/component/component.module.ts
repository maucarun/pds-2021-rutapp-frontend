import { ModalPage } from 'src/app/component/modal/modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';

@NgModule({
    declarations: [ModalPage, PopoverComponent],
    exports: [ModalPage, PopoverComponent],
    imports: [
        CommonModule, RouterModule, FormsModule, ReactiveFormsModule, IonicModule
    ]
})
export class ComponentsModule { }
