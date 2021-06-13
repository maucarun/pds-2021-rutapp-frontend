import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RemitoViewPage } from '../remito-view/remito-view.page';
import { RemitosPage } from './remitos.page';

const routes: Routes = [
  {
    path: '',
    component: RemitosPage
  },
  {
    path: ':idRemito',
    component: RemitoViewPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemitosPageRoutingModule { }
