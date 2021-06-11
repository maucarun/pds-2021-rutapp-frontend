import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'
import { AutoLoginGuard } from './guards/auto-login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canLoad: [AutoLoginGuard]
  },
  {
    path: 'clientes',
    canLoad:[AuthGuard],
    children: [
      {
        path: "",
        loadChildren: () => import('./pages/clientes/clientes.module').then(m => m.ClientesPageModule)
      },
      {
        path: ":idCliente",
        loadChildren: () => import('./pages/cliente-view/cliente-view.module').then(m => m.ClienteViewPageModule)
      }
    ]
  },
  {
    path: 'productos',
    canLoad:[AuthGuard],
    children: [
      {
        path: "",
        loadChildren: () => import('./pages/productos/productos.module').then( m => m.ProductosPageModule)
      },
      {
        path: ':idProducto',
        loadChildren: () => import('./pages/producto-view/producto-view.module').then( m => m.ProductoViewPageModule)
      }
    ]
  },
  // {
  //   path: 'hojasderuta',
  //   canActivate:[AuthGuard],
  //   children: [
  //     {
  //       path: "",
  //       // loadChildren: () => import('./pages/clientes/clientes.module').then(m => m.ClientesPageModule)
  //     }
  //   ]
  // },
  // {
  //   path: 'perfil',
  //   canActivate:[AuthGuard],
  //   children: [
  //     {
  //       path: "",
  //       // loadChildren: () => import('./pages/clientes/clientes.module').then(m => m.ClientesPageModule)
  //     }
  //   ]
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
