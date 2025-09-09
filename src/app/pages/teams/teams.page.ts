import { Component } from '@angular/core';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [NavMenuComponent, ButtonModule, InputTextModule, TabViewModule, TableModule],
  template: `
    <div class="teams-layout">
      <app-nav-menu></app-nav-menu>
      <div class="teams-main">
        <div class="teams-header">
          <div class="teams-title">Teams / Users</div>
          <input pInputText type="text" placeholder="Search Users" class="teams-search" />
          <button pButton label="+ Invite Users" class="p-button-primary invite-users-btn"></button>
        </div>
        <p-tabView>
          <p-tabPanel header="Users">
            <p-table [value]="users" class="users-table">
              <ng-template pTemplate="header">
                <tr>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Teams</th>
                  <th>Last Visit</th>
                  <th></th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-user>
                <tr>
                  <td>
                    <img src="/assets/user-avatar.svg" alt="User" class="user-avatar" />
                    {{ user.name }}
                  </td>
                  <td class="role">{{ user.role }}</td>
                  <td>{{ user.teams }}</td>
                  <td>{{ user.lastVisit }}</td>
                  <td><button pButton icon="pi pi-ellipsis-v" class="p-button-text"></button></td>
                </tr>
              </ng-template>
            </p-table>
          </p-tabPanel>
          <p-tabPanel header="Teams">
            <div class="teams-placeholder">[Teams Table Placeholder]</div>
          </p-tabPanel>
        </p-tabView>
      </div>
    </div>
  `,
  styles: [
    `.teams-layout { display: flex; min-height: 100vh; background: #f7faff; }`,
    `.teams-main { flex: 1; padding: 2rem 2.5rem; background: #f7faff; display: flex; flex-direction: column; }`,
    `.teams-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.2rem; }`,
    `.teams-title { font-size: 2rem; font-weight: 700; color: #232b4d; }`,
    `.teams-search { width: 320px; margin-left: auto; }`,
    `.invite-users-btn { font-weight: 600; font-size: 1rem; margin-left: 1rem; }`,
    `.users-table { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(6,11,40,0.08); }`,
    `.user-avatar { width: 32px; height: 32px; border-radius: 50%; margin-right: 0.75rem; vertical-align: middle; }`,
    `.role { color: #6c7a89; }`,
    `.teams-placeholder { padding: 2rem; color: #7b8ca6; text-align: center; }`
  ]
})
export class TeamsPageComponent {
  users = [
    { name: 'Jun Ren', role: 'Administrator', teams: '', lastVisit: 'Today' }
  ];
} 