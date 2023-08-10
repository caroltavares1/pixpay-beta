import { CanMatchFn, Router, Routes } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { inject } from '@angular/core';

const authGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.IsAuthenticated) {
    router.navigate(['/auth'])
  }

  return authService.IsAuthenticated;
}

export const routes: Routes = [
  {
    path: 'home',
    canMatch: [authGuard],
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'contas',
    canMatch: [authGuard],
    loadComponent: () => import('./contas/contas.component').then((m) => m.ContasComponent),
  },
  {
    path: 'cobranca',
    canMatch: [authGuard],
    loadComponent: () => import('./cobranca/cobranca.component').then((m) => m.CobrancaComponent),
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then(m => m.AuthPage)
  }

];
