import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AutoLoginGuard } from '../../guards/auto-login.guard';

import { HojaDeRutaPage } from './hoja-de-ruta.page';

const routes: Routes = [
  {
    path: '',
    component: HojaDeRutaPage
  },
  {
    path: ':idHojaDeRuta',
    loadChildren: () => import('./hoja-de-ruta-view/hoja-de-ruta-view.module').then( m => m.HojaDeRutaViewPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'hoja/:idHojaDeRuta',
    loadChildren: () => import('./hoja-de-ruta-nav/hoja-de-ruta-nav.module').then( m => m.HojaDeRutaNavPageModule)
  },
  {
    path: 'recorrido/:idHojaDeRuta',
    loadChildren: () => import('./hoja-de-ruta-view/hoja-de-ruta-view.module').then( m => m.HojaDeRutaViewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HojaDeRutaPageRoutingModule {}
