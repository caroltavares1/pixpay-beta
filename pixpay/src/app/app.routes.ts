import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'contas',
    loadComponent: () => import('./contas/contas.component').then((m) => m.ContasComponent),
  },
  {
    path: 'cobranca',
    loadComponent: () => import('./cobranca/cobranca.component').then((m) => m.CobrancaComponent),
  }
];
