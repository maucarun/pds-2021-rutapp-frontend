import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canLoad: [AutoLoginGuard]
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/clientes/clientes.module').then(m => m.ClientesPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'clientes/:id',
    loadChildren: () => import('./pages/cliente-view/cliente-view.module').then(m => m.ClienteViewPageModule),
    //canLoad: [AuthGuard]
  },
  {
    path: 'productos',
    loadChildren: () => import('./pages/productos/productos.module').then(m => m.ProductosPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'productos/:id',
    loadChildren: () => import('./pages/producto-view/producto-view.module').then(m => m.ProductoViewPageModule)
    //canLoad: [AuthGuard]
  },
  {
    path: 'remitos',
    loadChildren: () => import('./pages/remitos/remitos.module').then(m => m.RemitosPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'remitos/:id',
    loadChildren: () => import('./pages/remito-view/remito-view.module').then(m => m.RemitoViewPageModule),
    //canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
