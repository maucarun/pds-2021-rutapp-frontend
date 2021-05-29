import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClienteViewPage } from './cliente-view.page';

const routes: Routes = [
  {
    path: '',
    component: ClienteViewPage
  },
  {
    path: ':id',
    component: ClienteViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClienteViewPageRoutingModule {}
