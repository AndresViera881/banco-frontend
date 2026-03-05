import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./features/clientes/pages/clientes-page/clientes-page.component').then(
        m => m.ClientesPageComponent
      )
  },
  {
    path: 'cuentas',
    loadComponent: () =>
      import('./features/cuentas/pages/cuentas-page/cuentas-page.component').then(
        m => m.CuentasPageComponent
      )
  },
  {
    path: 'movimientos',
    loadComponent: () =>
      import('./features/movimientos/pages/movimientos-page/movimientos-page.component').then(
        m => m.MovimientosPageComponent
      )
  },
  {
    path: 'reportes',
    loadComponent: () =>
      import('./features/reportes/pages/reportes-page/reportes-page.component').then(
        m => m.ReportesPageComponent
      )
  },
  { path: '**', redirectTo: '/clientes' }
];
