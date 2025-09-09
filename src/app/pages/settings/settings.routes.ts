import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'general',
    pathMatch: 'full'
  },
  {
    path: 'general',
    loadComponent: () => import('./general.page').then(m => m.GeneralSettingsPageComponent)
  },
  {
    path: 'features',
    loadComponent: () => import('./features.page').then(m => m.FeaturesSettingsPageComponent)
  },
  {
    path: 'subscription',
    loadComponent: () => import('./subscription.page').then(m => m.SubscriptionSettingsPageComponent)
  },
  {
    path: 'teammates',
    loadComponent: () => import('./teammates.page').then(m => m.TeammatesSettingsPageComponent)
  },
  {
    path: 'customization',
    loadComponent: () => import('./customization.page').then(m => m.CustomizationSettingsPageComponent)
  },
  {
    path: 'integrations',
    loadComponent: () => import('./integrations.page').then(m => m.IntegrationsSettingsPageComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./privacy.page').then(m => m.PrivacySettingsPageComponent)
  },
  {
    path: 'manufacturing',
    loadComponent: () => import('./manufacturing.page').then(m => m.ManufacturingSettingsPageComponent)
  }
];
