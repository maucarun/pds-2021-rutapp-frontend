import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HojaDeRutaViewPage } from './hoja-de-ruta-view.page';

const routes: Routes = [
  {
    path: '',
    component: HojaDeRutaViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HojaDeRutaViewPageRoutingModule {}
