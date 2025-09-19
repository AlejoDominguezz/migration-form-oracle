import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/listado', pathMatch: 'full' },
  { path: 'listado', loadComponent: () => import('./pages/listado/listado.component').then(m => m.ListadoComponent) },
  { path: 'formulario/:id', loadComponent: () => import('./pages/formulario/formulario.component').then(m => m.FormularioComponent) },
  { path: 'formulario', loadComponent: () => import('./pages/formulario/formulario.component').then(m => m.FormularioComponent) }
];
