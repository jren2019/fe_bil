import { Component } from '@angular/core';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-reporting-page',
  standalone: true,
  imports: [NavMenuComponent, ButtonModule, TabViewModule],
  template: `
    <div class="reporting-layout">
      <app-nav-menu></app-nav-menu>
      <div class="reporting-main">
        <div class="reporting-header">
          <div class="reporting-title">Reporting</div>
          <div class="reporting-date-picker">
            <span class="date-range">03/29/2025 - 05/17/2025</span>
            <button pButton label="Date Presets" class="p-button-outlined p-button-sm"></button>
          </div>
          <button pButton label="Export" class="p-button-outlined export-btn"></button>
        </div>
        <div class="reporting-tabs">
          <button class="tab active">Work Orders</button>
          <button class="tab">Asset Health</button>
          <button class="tab">Reporting Details</button>
          <button class="tab">Recent Activity</button>
          <button class="tab">Export Data</button>
          <button class="tab">Custom Dashboards</button>
        </div>
        <div class="reporting-filter-bar">
          <button pButton label="Assigned To" class="p-button-text filter-btn"></button>
          <button pButton label="Due Date" class="p-button-text filter-btn"></button>
          <button pButton label="Location" class="p-button-text filter-btn"></button>
          <button pButton label="Priority" class="p-button-text filter-btn"></button>
          <button pButton label="+ Add Filter" class="p-button-outlined filter-btn add-filter"></button>
          <button pButton label="My Filters" class="p-button-outlined my-filters-btn"></button>
        </div>
        <div class="reporting-dashboard">
          <div class="dashboard-row">
            <div class="dashboard-card large">
              <div class="dashboard-card-title">Work Orders</div>
              <div class="dashboard-card-content">[Created vs. Completed Chart Placeholder]</div>
            </div>
            <div class="dashboard-card">
              <div class="dashboard-card-title">Work Orders by Type</div>
              <div class="dashboard-card-content">[Type Chart Placeholder]</div>
            </div>
          </div>
          <div class="dashboard-row">
            <div class="dashboard-card">
              <div class="dashboard-card-title">Non-Repeating vs. Repeating</div>
              <div class="dashboard-card-content">[Repeating Chart Placeholder]</div>
            </div>
            <div class="dashboard-card">
              <div class="dashboard-card-title">Status</div>
              <div class="dashboard-card-content">[Status Chart Placeholder]</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.reporting-layout { display: flex; min-height: 100vh; background: #f7faff; }`,
    `.reporting-main { flex: 1; padding: 2rem 2.5rem; background: #f7faff; }`,
    `.reporting-header { display: flex; align-items: center; gap: 2rem; margin-bottom: 1.5rem; }`,
    `.reporting-title { font-size: 2rem; font-weight: 700; color: #232b4d; margin-right: 2rem; }`,
    `.reporting-date-picker { display: flex; align-items: center; gap: 0.5rem; }`,
    `.date-range { font-size: 1rem; color: #232b4d; margin-right: 0.5rem; }`,
    `.export-btn { margin-left: auto; }`,
    `.reporting-tabs { display: flex; gap: 1.5rem; margin-bottom: 1.2rem; }`,
    `.tab { background: none; border: none; color: #232b4d; font-weight: 500; font-size: 1.05rem; padding: 0.5rem 0; border-bottom: 2px solid transparent; cursor: pointer; transition: color 0.2s, border-color 0.2s; }`,
    `.tab.active, .tab:hover { color: #1a6cff; border-bottom: 2px solid #1a6cff; }`,
    `.reporting-filter-bar { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 2rem; }`,
    `.filter-btn { color: #232b4d; background: none; border: none; font-weight: 500; }`,
    `.filter-btn.p-button-text:not(.add-filter):hover { color: #1a6cff; background: #eaf3ff; }`,
    `.add-filter { color: #1a6cff; border-color: #1a6cff; }`,
    `.add-filter:hover { background: #eaf3ff; color: #232b4d; }`,
    `.my-filters-btn { margin-left: auto; color: #1a6cff; border-color: #1a6cff; }`,
    `.reporting-dashboard { margin-top: 2rem; display: flex; flex-direction: column; gap: 2rem; }`,
    `.dashboard-row { display: flex; gap: 2rem; }`,
    `.dashboard-card { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(6,11,40,0.08); padding: 1.5rem; flex: 1; min-width: 320px; }`,
    `.dashboard-card.large { flex: 2; }`,
    `.dashboard-card-title { font-size: 1.1rem; font-weight: 600; color: #232b4d; margin-bottom: 1rem; }`,
    `.dashboard-card-content { color: #7b8ca6; font-size: 1rem; text-align: center; }`
  ]
})
export class ReportingPageComponent {} 