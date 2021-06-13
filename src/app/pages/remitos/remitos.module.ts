import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RemitosPageRoutingModule } from './remitos-routing.module';
import { RemitosPage } from './remitos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RemitosPageRoutingModule
  ],
  declarations: [RemitosPage]
})
export class RemitosPageModule { }
