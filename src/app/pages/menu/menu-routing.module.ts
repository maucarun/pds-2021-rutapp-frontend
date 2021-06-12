import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        /**
         * La diferencia entre loadChildren y asignar el componente es que loadChildren
         *  trabaja de forma LAZY. Es decir, cuando entras en la página, recién ahí te carga la página (LAZY fetch).
         * De la otra forma, apenas entres a la aplicación te va a cargar todas las páginas (EAGER fetch)
         */
        path: 'clientes',
        children: [
          {
            path: '',
            loadChildren: () => import('../clientes/clientes.module').then(m => m.ClientesPageModule)
          },
          {
            path: ':idCliente',
            loadChildren: () => import('../cliente-view/cliente-view.module').then(m => m.ClienteViewPageModule)
          },
          // {
          //   path: 'nuevo',
          //   loadChildren: () => import('./pages/cliente-new/cliente-new.module').then(m => m.ClienteNewPageModule)
          // },
          {
            path: '',
            redirectTo: '/menu/clientes',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'productos',
        children: [
          {
            path: "",
            loadChildren: () => import('../productos/productos.module').then(m => m.ProductosPageModule)
          },
          {
            path: ':idProducto',
            loadChildren: () => import('../producto-view/producto-view.module').then(m => m.ProductoViewPageModule)
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule { }
/*
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesPageRoutingModule
  ],
  declarations: [ClientesPage]
})
export class ClientesPageModule {}
*/
