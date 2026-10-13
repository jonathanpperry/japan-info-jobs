import { Routes } from '@angular/router';
import { MigrationPlaceholderPage } from './pages/migration-placeholder.page';

// Remove each path when its real standalone component is migrated.
const pendingRoutes = [
  'applications',
  'application/:id',
  'apply/:id/:resumeId',
  'chooseresume/:id',
  'confirm-apply',
  'confirm-apply/:id',
  'createresume',
  'editresume/:id',
  'filter-job-categories',
  'firstwithtabs',
  'job',
  'job/:id',
  'menu/:id',
  'profile',
  'resumes',
  'settings',
  'language-popover',
  'resume/:id',
];

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.page').then((m) => m.ResetPasswordPage),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/menu/menu.page').then((m) => m.MenuPage),
  },
  ...pendingRoutes.map((path) => ({
    path,
    component: MigrationPlaceholderPage,
  })),
];
