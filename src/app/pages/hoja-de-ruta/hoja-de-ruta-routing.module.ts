import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HojaDeRutaPage } from './hoja-de-ruta.page';

const routes: Routes = [
  {
    path: '',
    component: HojaDeRutaPage
  },
  {
    path: ':idHojaDeRuta',
    loadChildren: () => import('./hoja-de-ruta-view/hoja-de-ruta-view.module').then( m => m.HojaDeRutaViewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HojaDeRutaPageRoutingModule {}
