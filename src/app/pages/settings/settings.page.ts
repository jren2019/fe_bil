import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, InputTextModule, NavMenuComponent],
  template: `
    <div class="settings-layout">
      <app-nav-menu></app-nav-menu>
      <div class="settings-main">
        <div class="settings-tabs">
          <a routerLink="/settings/general" routerLinkActive="active">General</a>
          <a routerLink="/settings/features" routerLinkActive="active">Features</a>
          <a routerLink="/settings/subscription" routerLinkActive="active">Subscription</a>
          <a routerLink="/settings/teammates" routerLinkActive="active">Manage Teammates</a>
          <a routerLink="/settings/customization" routerLinkActive="active">Customizations</a>
          <a routerLink="/settings/integrations" routerLinkActive="active">Integrations</a>
          <a routerLink="/settings/manufacturing" routerLinkActive="active">Manufacturing</a>
          <a routerLink="/settings/privacy" routerLinkActive="active">Data & Privacy</a>
        </div>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `.settings-layout { display: flex; min-height: 100vh; background: #f7faff; }`,
    `.settings-main { flex: 1; padding: 2rem 2.5rem; background: #f7faff; }`,
    `.settings-tabs { display: flex; gap: 2.5rem; border-bottom: 2px solid #e5eaf2; margin-bottom: 2.5rem; }`,
    `.settings-tabs a { font-size: 1.1rem; color: #232b4d; text-decoration: none; padding-bottom: 0.7rem; border-bottom: 2px solid transparent; transition: border 0.2s, color 0.2s; font-weight: 500; }`,
    `.settings-tabs a.active, .settings-tabs a:focus { color: #1a6cff; border-bottom: 2px solid #1a6cff; }`
  ]
})
export class SettingsPageComponent {}
