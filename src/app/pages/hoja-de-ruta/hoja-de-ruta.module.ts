import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HojaDeRutaPageRoutingModule } from './hoja-de-ruta-routing.module';

import { HojaDeRutaPage } from './hoja-de-ruta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HojaDeRutaPageRoutingModule
  ],
  declarations: [HojaDeRutaPage]
})
export class HojaDeRutaPageModule {}
