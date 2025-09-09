import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-workorder-list',
  standalone: true,
  imports: [TabViewModule, CardModule, ButtonModule],
  template: `
    <div class="workorder-list-panel">
      <p-tabView>
        <p-tabPanel header="To Do">
          <div class="sort-bar">Sort By: <span class="sort-priority">Priority: <b>Highest First</b> <span class="arrow">&#9660;</span></span></div>
          <div class="assigned-header">Assigned to Me (1) <span class="collapse-arrow">&#9650;</span></div>
          <div class="workorder-item">
            <div class="item-left">
              <span class="item-icon">🔄</span>
            </div>
            <div class="item-main">
              <div class="item-title">Project 000866</div>
              <div class="item-meta">Requested by Jun Ren</div>
              <div class="item-status-row">
                <button pButton label="Open" class="p-button-text p-button-sm item-status"></button>
              </div>
            </div>
            <div class="item-right">
              <span class="item-id">#1</span>
              <span class="item-overdue"><span class="overdue-icon">&#9888;</span> Overdue</span>
            </div>
          </div>
        </p-tabPanel>
        <p-tabPanel header="Done">
          <div class="empty-list">No completed work orders.</div>
        </p-tabPanel>
      </p-tabView>
    </div>
  `,
  styles: [
    `.workorder-list-panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(6,11,40,0.08); padding: 0; min-width: 400px; max-width: 480px; margin-right: 2rem; }`,
    `.sort-bar { padding: 1rem 1.5rem 0.5rem 1.5rem; color: #232b4d; font-size: 0.95rem; border-bottom: 1px solid #e5eaf2; }`,
    `.sort-priority { color: #1a6cff; cursor: pointer; }`,
    `.arrow { font-size: 0.8rem; margin-left: 0.2rem; }`,
    `.assigned-header { padding: 0.75rem 1.5rem; font-weight: 500; color: #232b4d; background: #f7faff; border-bottom: 1px solid #e5eaf2; display: flex; align-items: center; justify-content: space-between; }`,
    `.collapse-arrow { font-size: 1rem; color: #1a6cff; }`,
    `.workorder-item { display: flex; align-items: center; padding: 1rem 1.5rem; border-left: 4px solid #1a6cff; background: #f7faff; border-radius: 0 8px 8px 0; margin: 1rem 0; box-shadow: 0 1px 2px rgba(6,11,40,0.03); }`,
    `.item-left { margin-right: 1rem; }`,
    `.item-icon { font-size: 2.2rem; color: #dbeafe; }`,
    `.item-main { flex: 1; }`,
    `.item-title { font-weight: 600; color: #232b4d; font-size: 1.1rem; }`,
    `.item-meta { color: #7b8ca6; font-size: 0.95rem; margin-bottom: 0.5rem; }`,
    `.item-status-row { margin-top: 0.25rem; }`,
    `.item-status { color: #1a6cff; background: #eaf3ff; border-radius: 4px; font-size: 0.9rem; padding: 0.2rem 0.8rem; }`,
    `.item-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; }`,
    `.item-id { color: #7b8ca6; font-size: 0.95rem; }`,
    `.item-overdue { color: #e53935; font-size: 0.95rem; display: flex; align-items: center; }`,
    `.overdue-icon { margin-right: 0.2rem; font-size: 1.1rem; }`,
    `.empty-list { color: #7b8ca6; text-align: center; padding: 2rem; }`
  ]
})
export class WorkorderListComponent {} 