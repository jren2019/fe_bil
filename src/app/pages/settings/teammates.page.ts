import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teammates-settings-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="teammates-layout">
      <div class="teammates-title">Manage Teammates</div>
      <div class="tabs-row">
        <div class="tab-btn" [class.active]="activeTab === 'users'" (click)="activeTab = 'users'">Users</div>
        <div class="tab-btn" [class.active]="activeTab === 'teams'" (click)="activeTab = 'teams'">Teams</div>
        <div class="tab-btn" [class.active]="activeTab === 'roles'" (click)="activeTab = 'roles'">Roles and Permissions</div>
        @if (activeTab === 'users') {
          <button class="invite-btn">+ Invite Users</button>
        }
        @if (activeTab === 'teams') {
          <button class="create-btn">+ Create Team</button>
        }
        @if (activeTab === 'roles') {
          <button class="new-role-btn">&#128274; New Role</button>
        }
        @if (activeTab !== 'users' && activeTab !== 'teams') {
          <input class="search-bar" placeholder="Search Roles and Permissions" />
        }
        @if (activeTab === 'users') {
          <input class="search-bar" placeholder="Search Users" />
        }
        @if (activeTab === 'teams') {
          <input class="search-bar" placeholder="Search Teams" />
        }
      </div>
      <div class="tab-content">
        <!-- Users Tab -->
        @if (activeTab === 'users') {
          <div class="org-defaults-title">Organization Defaults</div>
          <div class="org-defaults-card">
            <div class="org-row">
              <div class="org-col">
                <div class="org-label">Rates and Visibility</div>
                <div class="org-desc">Administrators will still be able to see everything.</div>
              </div>
              <div class="org-col">
                <div class="org-label">WORK ORDERS VISIBILITY*</div>
                <div class="org-value">Full Visibility</div>
              </div>
            </div>
            <hr />
            <div class="org-row">
              <div class="org-col">
                <div class="org-label">Scheduling Capacity</div>
                <div class="org-desc">Settings will be reflected in the workload view.</div>
              </div>
              <div class="org-col">
                <div class="org-label">WORKING DAYS</div>
                <div class="org-value">Mon, Tue, Wed, Thu, Fri</div>
              </div>
              <div class="org-col">
                <div class="org-label">HOURS PER WORKING DAY</div>
                <div class="org-value">8 <span class="unit">h</span> 0 <span class="unit">m</span></div>
              </div>
              <div class="org-col">
                <div class="org-label">SCHEDULABLE USERS</div>
                <div class="org-value">Full users</div>
              </div>
            </div>
          </div>
          <div class="user-settings-title">User Settings</div>
          <div class="user-settings-desc">Use the table below to customize settings for specific users.</div>
          <table class="users-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>ROLE</th>
                <th>FULL USER VISIBILITY</th>
                <th>SCHEDULABLE USERS</th>
                <th>WORKING DAYS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="avatar avatar-blue">&#127744;</span> Jun Ren</td>
                <td>Administrator</td>
                <td>Full Visibility</td>
                <td><span class="toggle-off"></span> Unscheduled</td>
                <td>Mon, Tue, Wed, Thu, Fri</td>
              </tr>
              <tr>
                <td><span class="avatar avatar-dot">&#11044;</span> luss</td>
                <td>Requester Only</td>
                <td>–</td>
                <td>–</td>
                <td>–</td>
              </tr>
            </tbody>
          </table>
        }
        <!-- Teams Tab -->
        @if (activeTab === 'teams') {
          <div class="my-teams-title">My Teams (1)</div>
          <div class="teams-card">
            <table class="teams-table">
              <thead>
                <tr>
                  <th>TEAM NAME</th>
                  <th>TEAM ADMINISTRATOR</th>
                  <th>MEMBERS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="avatar avatar-orange">TT</span> Test team<br /><span class="team-you">You</span></td>
                  <td><span class="avatar avatar-blue">&#127744;</span> Jun Ren</td>
                  <td><span class="avatar avatar-blue">&#127744;</span> 1 Member</td>
                </tr>
              </tbody>
            </table>
          </div>
        }
        <!-- Roles and Permissions Tab -->
        @if (activeTab === 'roles') {
          <div class="default-roles-title">Default Roles</div>
          <table class="roles-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Users Assigned</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Administrator</td>
                <td>1</td>
                <td>Administrator accounts are for the people who manage and administer your organization.</td>
              </tr>
              <tr>
                <td>Full User</td>
                <td>0</td>
                <td>Full User accounts are for maintenance teams, and other people in your organization who do and manage work.</td>
              </tr>
              <tr>
                <td>Requester Only</td>
                <td>1</td>
                <td>Requester accounts are designed for users to let the organization know about work that needs to be done.</td>
              </tr>
            </tbody>
          </table>
          <div class="custom-roles-title">Custom Roles</div>
          <div class="custom-roles-empty">No custom roles available.</div>
        }
      </div>
    </div>
  `,
  styles: [
    `.teammates-layout { max-width: 1100px; margin: 0 auto; padding: 2.5rem 0 1.5rem 0; }`,
    `.teammates-title { font-size: 2.2rem; font-weight: 700; color: #232b4d; margin-bottom: 1.5rem; }`,
    `.tabs-row { display: flex; align-items: center; gap: 2.5rem; border-bottom: 2.5px solid #eaf3ff; margin-bottom: 2.2rem; position: relative; }`,
    `.tab-btn { font-size: 1.15rem; font-weight: 600; color: #7b8ca6; padding: 0.7rem 0; cursor: pointer; border-bottom: 2.5px solid transparent; transition: color 0.2s, border-bottom 0.2s; }`,
    `.tab-btn.active { color: #1a6cff; border-bottom: 2.5px solid #1a6cff; }`,
    `.invite-btn, .create-btn, .new-role-btn { margin-left: auto; background: #1a6cff; color: #fff; border: none; border-radius: 6px; padding: 0.5rem 1.3rem; font-size: 1.05rem; font-weight: 600; cursor: pointer; }`,
    `.search-bar { margin-left: 1.5rem; padding: 0.5rem 1.1rem; border: 1.5px solid #e5eaf2; border-radius: 6px; font-size: 1.05rem; min-width: 220px; }`,
    `.tab-content { margin-top: 2.2rem; }`,
    `.org-defaults-title, .user-settings-title, .my-teams-title, .default-roles-title, .custom-roles-title { font-size: 1.25rem; font-weight: 700; color: #232b4d; margin-bottom: 1.1rem; }`,
    `.org-defaults-card { background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(6,11,40,0.06); padding: 1.5rem 2rem; border: 1px solid #e5eaf2; margin-bottom: 2.2rem; }`,
    `.org-row { display: flex; align-items: flex-start; gap: 2.5rem; margin-bottom: 1.2rem; }`,
    `.org-col { flex: 1; min-width: 0; }`,
    `.org-label { color: #7b8ca6; font-size: 1.05rem; font-weight: 600; margin-bottom: 0.2rem; }`,
    `.org-desc { color: #232b4d; font-size: 1.05rem; margin-bottom: 0.2rem; }`,
    `.org-value { color: #232b4d; font-size: 1.05rem; font-weight: 600; }`,
    `.unit { color: #7b8ca6; font-size: 0.98rem; margin-left: 0.2rem; }`,
    `.user-settings-desc { color: #7b8ca6; font-size: 1.05rem; margin-bottom: 1.1rem; }`,
    `.users-table, .teams-table, .roles-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(6,11,40,0.06); border: 1px solid #e5eaf2; }`,
    `.users-table th, .users-table td, .teams-table th, .teams-table td, .roles-table th, .roles-table td { padding: 1rem 1.2rem; text-align: left; font-size: 1.05rem; }`,
    `.users-table th, .teams-table th, .roles-table th { color: #7b8ca6; font-weight: 700; background: #f7faff; }`,
    `.users-table td, .teams-table td, .roles-table td { color: #232b4d; font-weight: 500; border-top: 1px solid #e5eaf2; }`,
    `.avatar { display: inline-block; width: 2.1rem; height: 2.1rem; border-radius: 50%; text-align: center; line-height: 2.1rem; font-size: 1.2rem; font-weight: 700; margin-right: 0.7rem; vertical-align: middle; }`,
    `.avatar-blue { background: #eaf3ff; color: #1a6cff; }`,
    `.avatar-dot { background: #eaf3ff; color: #7b8ca6; font-size: 1.5rem; }`,
    `.avatar-orange { background: #ffe3b3; color: #ffb300; }`,
    `.toggle-off { display: inline-block; width: 38px; height: 22px; background: #eaf3ff; border-radius: 12px; position: relative; margin-right: 0.5rem; vertical-align: middle; }`,
    `.toggle-off:after { content: ''; width: 18px; height: 18px; background: #7b8ca6; border-radius: 50%; position: absolute; top: 2px; left: 2px; }`,
    `.team-you { color: #7b8ca6; font-size: 0.98rem; }`,
    `.teams-card { background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(6,11,40,0.06); border: 1px solid #e5eaf2; padding: 1.5rem 2rem; max-width: 900px; }`,
    `.default-roles-title, .custom-roles-title { margin-top: 2.2rem; }`,
    `.custom-roles-empty { color: #7b8ca6; font-size: 1.05rem; margin-top: 0.7rem; }`,
    `@media (max-width: 900px) { .tabs-row { flex-wrap: wrap; gap: 1.2rem; } .teammates-layout { padding: 1.2rem 0; } .tab-content { margin-top: 1.2rem; } }`
  ],
})
export class TeammatesSettingsPageComponent {
  activeTab: 'users' | 'teams' | 'roles' = 'users';
}
