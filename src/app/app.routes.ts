import { Routes } from '@angular/router';
import { MigrationPlaceholderPage } from './pages/migration-placeholder.page';

// Legacy routes awaiting migration
const pendingRoutes = [
  'login',
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
  'menu',
  'menu/:id',
  'profile',
  'register',
  'resumes',
  'settings',
  'language-popover',
  'reset-password',
  'resume/:id',
];

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
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
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },

  // Temporary routes for pages awaiting migration
  ...pendingRoutes.map((path) => ({
    path,
    component: MigrationPlaceholderPage,
  })),
];
