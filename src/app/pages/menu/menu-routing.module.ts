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
        loadChildren: () => import('../clientes/clientes.module').then(m => m.ClientesPageModule)
      },
      {
        path: 'productos',
        loadChildren: () => import('../productos/productos.module').then(m => m.ProductosPageModule)
      },
      {
        path: '',
        redirectTo: '/menu/clientes',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule { }
