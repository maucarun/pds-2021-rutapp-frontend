import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClienteNewPage } from './cliente-new.page';

const routes: Routes = [
  {
    path: '',
    component: ClienteNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClienteNewPageRoutingModule {}
