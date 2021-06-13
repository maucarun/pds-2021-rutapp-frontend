import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteNewPage } from '../cliente-new/cliente-new.page';
import { ClienteViewPage } from '../cliente-view/cliente-view.page';

import { ClientesPage } from './clientes.page';

const routes: Routes = [
  {
    path: '',
    component: ClientesPage,
  },
  {
    path: 'nuevo',
    component: ClienteViewPage
  },
  {
    path: ':idCliente',
    component: ClienteViewPage
  },
  {
    path: 'editar/:idCliente',
    component: ClienteViewPage
  },
];

    //   children: [
    //     {
    //       path: ':idCliente',
    //       loadChildren: () => import('../cliente-view/cliente-view.module').then(m => m.ClienteViewPageModule)
    //       // loadChildren: '../cliente-view/cliente-view.module#ClienteViewPageModule'
    //     },
    //     {
    //       path: 'nuevo',
    //       loadChildren: () => import('../cliente-new/cliente-new.module').then(m => m.ClienteNewPageModule)
    //     },
    //     {
    //       path: '',
    //       redirectTo: '/menu/clientes',
    //       pathMatch: 'full'
    //     }
    //   ]
    // }];
    
    // children: [
    //   {
    //     path: ':idCliente',
    //     component: ClienteViewPage
    //   },
    //   {
    //     path: 'nuevo',
    //     component: ClienteNewPage
    //   },
    //   {
    //     path: '',
    //     redirectTo: '/menu/clientes',
    //     pathMatch: 'full'
    //   }
    // ]
//   }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesPageRoutingModule { }
