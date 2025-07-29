import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'register',
        loadComponent: () => import('./components/auth/sign-up/sign-up.component')
    },
    {
        path: 'login',
        loadComponent: () => import('./components/auth/sign-in/sign-in.component')
    },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home.component')
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
