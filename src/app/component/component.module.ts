import { ModalPage } from 'src/app/component/modal/modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [ModalPage],
    exports: [ModalPage],
    imports: [
        CommonModule, RouterModule, FormsModule, ReactiveFormsModule, IonicModule
    ]
})
export class ComponentsModule { }
