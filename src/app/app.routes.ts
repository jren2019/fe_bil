import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';
import { SettingsPageComponent } from './pages/settings/settings.page';
import { settingsRoutes } from './pages/settings/settings.routes';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:slug', component: BlogDetailComponent },
  { path: 'pricing', loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent) },
  { path: 'splash', loadComponent: () => import('./pages/splash/splash.component').then(m => m.SplashComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'getting-started', redirectTo: 'docs/getting-started' },
  { path: 'docs', redirectTo: 'docs/home' },
  { path: 'signup', loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'sales', loadComponent: () => import('./pages/sales/sales.page').then(m => m.SalesPageComponent) },
  { path: 'workorder', loadComponent: () => import('./pages/workorder/workorder.page').then(m => m.WorkorderPageComponent) },
  { path: 'purchaseorders', loadComponent: () => import('./pages/purchaseorders/purchaseorders.page').then(m => m.PurchaseordersPageComponent) },
  { path: 'reporting', loadComponent: () => import('./pages/reporting/reporting.page').then(m => m.ReportingPageComponent) },
  { path: 'requests', loadComponent: () => import('./pages/requests/requests.page').then(m => m.RequestsPageComponent) },
  { path: 'assets', loadComponent: () => import('./pages/assets/assets.page').then(m => m.AssetsPageComponent) },
  { path: 'manufacturing', loadComponent: () => import('./pages/manufacturing/manufacturing.page').then(m => m.ManufacturingPageComponent) },
  { path: 'messages',
    children: [
      { path: '', loadComponent: () => import('./pages/messages/messages.page').then(m => m.MessagesPageComponent) },
      { path: 'new', loadComponent: () => import('./pages/messages/messages.page').then(m => m.MessagesPageComponent) }
    ]
  },
  { path: 'categories', loadComponent: () => import('./pages/categories/categories.page').then(m => m.CategoriesPageComponent) },
  { path: 'category/tags/:id', loadComponent: () => import('./pages/categories/categories.page').then(m => m.CategoriesPageComponent) },
  { path: 'meters', loadComponent: () => import('./pages/meters/meters.page').then(m => m.MetersPageComponent) },
  { path: 'automations', loadComponent: () => import('./pages/automations/automations.page').then(m => m.AutomationsPageComponent) },
  { path: 'locations', loadComponent: () => import('./pages/locations/locations.page').then(m => m.LocationsPageComponent) },
  { path: 'teams', loadComponent: () => import('./pages/teams/teams.page').then(m => m.TeamsPageComponent) },
  { path: 'vendors', loadComponent: () => import('./pages/vendors/vendors.page').then(m => m.VendorsPageComponent) },
  { path: 'parts', loadComponent: () => import('./pages/parts/parts.page').then(m => m.PartsPageComponent) },
  { path: 'finance', loadComponent: () => import('./pages/finance/finance.page').then(m => m.FinancePageComponent) },
  { path: 'accounting', loadComponent: () => import('./pages/accounting/accounting.page').then(m => m.AccountingPageComponent) },
  { path: 'library', loadComponent: () => import('./pages/library/library.page').then(m => m.LibraryPageComponent) },
  { path: 'settings', component: SettingsPageComponent, children: settingsRoutes },
  { path: 'external/requests', loadComponent: () => import('./pages/external/requests/requests.component').then(m => m.ExternalRequestsComponent) },
  { path: 'external/timesheet', loadComponent: () => import('./pages/external/timesheet/timesheet.component').then(m => m.ExternalTimesheetComponent) },
  { path: '**', redirectTo: '' }
];
