import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'clientes',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'clientes',
    canActivate:[AuthGuard],
    children: [
      {
        path: "",
        loadChildren: () => import('./pages/clientes/clientes.module').then(m => m.ClientesPageModule)
      }
    ]
  },
  {
    path: 'cliente',
    canActivate:[AuthGuard],
    children: [
      {
        path: ":id",
        loadChildren: () => import('./pages/clientes/cliente-view/cliente-view.module').then(m => m.ClienteViewPageModule)
      }
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
