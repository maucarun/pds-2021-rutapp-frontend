import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HojaDeRutaNavPageRoutingModule } from './hoja-de-ruta-nav-routing.module';

import { HojaDeRutaNavPage } from './hoja-de-ruta-nav.page';
import { ComponentsModule } from 'src/app/component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HojaDeRutaNavPageRoutingModule,
    ComponentsModule
  ],
  declarations: [HojaDeRutaNavPage]
})
export class HojaDeRutaNavPageModule {}
