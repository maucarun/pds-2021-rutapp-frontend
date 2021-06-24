import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HojaDeRutaNavPage } from './hoja-de-ruta-nav.page';

const routes: Routes = [
  {
    path: '',
    component: HojaDeRutaNavPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HojaDeRutaNavPageRoutingModule {}
