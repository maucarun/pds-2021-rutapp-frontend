import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HojaDeRutaViewPageRoutingModule } from './hoja-de-ruta-view-routing.module';

import { HojaDeRutaViewPage } from './hoja-de-ruta-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HojaDeRutaViewPageRoutingModule
  ],
  declarations: [HojaDeRutaViewPage]
})
export class HojaDeRutaViewPageModule {}
