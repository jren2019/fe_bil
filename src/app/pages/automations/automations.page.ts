import { Component } from '@angular/core';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-automations-page',
  standalone: true,
  imports: [NavMenuComponent, ButtonModule],
  template: `
    <div class="automations-layout">
      <app-nav-menu></app-nav-menu>
      <div class="automations-main">
        <div class="automations-header">
          <div class="automations-title">Automations</div>
          <button pButton label="+ New Automation" class="p-button-primary new-automation-btn"></button>
        </div>
        <div class="automations-content">
          <div class="automations-list-panel">
            <div class="automations-tabs">
              <button class="tab active">Enabled</button>
              <button class="tab">Disabled</button>
            </div>
            <div class="automation-list-item selected">
              <span class="automation-icon">⚡</span>
              <div class="automation-main">
                <div class="automation-title">Automation 1</div>
                <div class="automation-meta faded"></div>
              </div>
            </div>
            <div class="automation-list-item">
              <span class="automation-icon">⚡</span>
              <div class="automation-main">
                <div class="automation-title">Automation 2</div>
                <div class="automation-meta faded"></div>
              </div>
            </div>
            <div class="automation-list-item faded">
              <span class="automation-icon">⚡</span>
              <div class="automation-main">
                <div class="automation-title">Automation 3</div>
                <div class="automation-meta faded"></div>
              </div>
            </div>
          </div>
          <div class="automations-details-panel">
            <div class="empty-automation-icon">
              <svg width="120" height="48" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="24" r="24" fill="#EAF3FF"/>
                <circle cx="36" cy="24" r="16" fill="#F7FAFF"/>
                <circle cx="84" cy="24" r="16" fill="#F7FAFF"/>
                <path d="M60 32V16M60 16L56 20M60 16L64 20" stroke="#1A6CFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="empty-title">Start building automated workflows</div>
            <div class="empty-desc">Use conditions to trigger tasks and optimize your maintenance operations.</div>
            <button pButton label="+ New Automation" class="p-button-primary"></button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.automations-layout { display: flex; min-height: 100vh; background: #f7faff; }`,
    `.automations-main { flex: 1; padding: 2rem 2.5rem; background: #f7faff; display: flex; flex-direction: column; }`,
    `.automations-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.2rem; }`,
    `.automations-title { font-size: 2rem; font-weight: 700; color: #232b4d; }`,
    `.new-automation-btn { font-weight: 600; font-size: 1rem; margin-left: auto; }`,
    `.automations-content { display: flex; gap: 2rem; flex: 1; }`,
    `.automations-list-panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(6,11,40,0.08); min-width: 340px; max-width: 400px; padding: 0; display: flex; flex-direction: column; }`,
    `.automations-tabs { display: flex; gap: 2rem; border-bottom: 1px solid #e5eaf2; margin-bottom: 1rem; }`,
    `.tab { background: none; border: none; color: #232b4d; font-weight: 500; font-size: 1.05rem; padding: 1rem 0; border-bottom: 2px solid transparent; cursor: pointer; transition: color 0.2s, border-color 0.2s; flex: 1; text-align: center; }`,
    `.tab.active, .tab:hover { color: #1a6cff; border-bottom: 2px solid #1a6cff; }`,
    `.automation-list-item { display: flex; align-items: center; gap: 1rem; padding: 1.2rem 2rem; font-size: 1.1rem; color: #232b4d; border-left: 4px solid transparent; cursor: pointer; transition: background 0.2s, border-color 0.2s; background: #f7faff; border-radius: 0 8px 8px 0; margin-bottom: 1rem; }`,
    `.automation-list-item.selected, .automation-list-item:hover { background: #eaf3ff; border-left: 4px solid #1a6cff; }`,
    `.automation-list-item.faded { opacity: 0.5; }`,
    `.automation-icon { font-size: 1.5rem; color: #1a6cff; }`,
    `.automations-details-panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(6,11,40,0.08); flex: 1; padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }`,
    `.empty-automation-icon { margin-bottom: 2rem; }`,
    `.empty-title { font-size: 1.5rem; font-weight: 600; color: #232b4d; text-align: center; margin-bottom: 1rem; }`,
    `.empty-desc { color: #7b8ca6; font-size: 1.1rem; text-align: center; margin-bottom: 2rem; }`
  ]
})
export class AutomationsPageComponent {} 