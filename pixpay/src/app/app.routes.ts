import { CanMatchFn, Router, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, AuthGuard } from '@angular/fire/auth-guard';

const redirectUnauthorizedToAuth = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

/* import { AuthService } from './auth/auth.service';
import { inject } from '@angular/core';
import { switchMap, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';

const authGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userIsAuthenticated.pipe(
    take(1),
    switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        return authService.autoLogin();
      } else {
        return of(isAuthenticated);
      }
    }),
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigateByUrl('/auth');
      }
    })
  );
} */

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth/auth.page').then(m => m.AuthPage),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome }

  },
  /*   {
      path: '**',
      redirectTo: '',
      pathMatch: 'full'
    }, */
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToAuth }
  },

  {
    path: 'contas',
    loadComponent: () => import('./contas/contas.component').then((m) => m.ContasComponent),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToAuth }
  },
  {
    path: 'cobranca',
    loadComponent: () => import('./cobranca/cobranca.component').then((m) => m.CobrancaComponent),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToAuth }
  },


];
