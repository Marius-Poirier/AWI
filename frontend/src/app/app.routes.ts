import { Routes } from '@angular/router';
import { authGuard } from './shared/auth/auth-guard';

export const routes: Routes = [
    {
    path: 'login',
    loadComponent: () => import('./shared/auth/login/login').then(m => m.Login)
    },
    /*
    {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
    },
    */
    {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
    }
];