// app.routes.ts
import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./core/components/address/address-manager.component').then(m => m.AddressManagerComponent)
  },
  {
    path: 'features',
    loadChildren: () => import('./core/components/address/address-manager.component').then(m => m.AddressManagerComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./core/components/address/address-manager.component').then(m => m.AddressManagerComponent)
  }
];