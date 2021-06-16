import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RemitoViewPage } from './remito-view.page';

const routes: Routes = [
  {
    path: '',
    component: RemitoViewPage
  },
  {
    path: ':id',
    component: RemitoViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemitoViewPageRoutingModule { }
