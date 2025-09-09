import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-workorder-filter',
  standalone: true,
  imports: [InputTextModule, ButtonModule, DropdownModule],
  template: `
    <div class="workorder-filter-bar">
      <button pButton label="Assigned To" class="p-button-text filter-btn"></button>
      <button pButton label="Due Date" class="p-button-text filter-btn"></button>
      <button pButton label="Location" class="p-button-text filter-btn"></button>
      <button pButton label="Priority" class="p-button-text filter-btn"></button>
      <button pButton label="+ Add Filter" class="p-button-outlined filter-btn add-filter"></button>
    </div>
  `,
  styles: [
    `.workorder-filter-bar { display: flex; gap: 0.5rem; align-items: center; padding: 1rem 0 1rem 0; border-bottom: 1px solid #232b4d; background: #0d153b; }`,
    `.filter-btn { color: #cad9e1; background: none; border: none; font-weight: 500; }`,
    `.filter-btn.p-button-text:not(.add-filter):hover { color: #67b8c5; background: #1e254d; }`,
    `.add-filter { color: #67b8c5; border-color: #67b8c5; }`,
    `.add-filter:hover { background: #1e254d; color: #fff; }`
  ]
})
export class WorkorderFilterComponent {} 