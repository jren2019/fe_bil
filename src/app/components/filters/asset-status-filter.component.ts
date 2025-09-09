import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

interface AssetStatusOption {
  id: string;
  name: string;
  label: string;
  selected: boolean;
}

interface AssetStatusFilterData {
  isVisible: boolean;
  condition: 'one-of' | 'none-of';
  showConditionDropdown: boolean;
  assetStatuses: AssetStatusOption[];
}

@Component({
  selector: 'app-asset-status-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxModule],
  template: `
    <div class="filter-item filter-container" [class.filter-active]="data.isVisible">
      <div class="filter-button" (click)="toggleFilter()">
        <i class="pi pi-info-circle filter-icon"></i>
        <span>Asset Status</span>
      </div>

      <!-- Asset Status Filter Dialog -->
      @if (data.isVisible) {
        <div class="filter-dialog-overlay" (click)="closeFilter()"></div>
        <div class="filter-dialog" (click)="$event.stopPropagation()">
          <div class="filter-dialog-header">
            <span class="filter-dialog-title">Asset Status</span>

            <div class="condition-dropdown-container" (click)="$event.stopPropagation()">
              <button class="condition-dropdown-btn" (click)="toggleConditionDropdown()">
                <span class="condition-dropdown-label">{{ getConditionLabel() }}</span>
                <i class="pi pi-chevron-down" [class.rotated]="data.showConditionDropdown"></i>
              </button>

              @if (data.showConditionDropdown) {
                <div class="condition-dropdown-menu">
                  <div class="condition-dropdown-item"
                       [class.active]="data.condition === 'one-of'"
                       (click)="selectCondition('one-of')">
                    One of
                  </div>
                  <div class="condition-dropdown-item"
                       [class.active]="data.condition === 'none-of'"
                       (click)="selectCondition('none-of')">
                    None of
                  </div>
                </div>
              }
            </div>

            <button class="filter-delete-btn" (click)="closeFilter()">
              <i class="pi pi-trash"></i>
            </button>
          </div>

          <div class="filter-dialog-content">
            <!-- Asset Status Options -->
            <div class="filter-section">
              <div class="section-content">
                @for (status of data.assetStatuses; track status.id) {
                  <div class="filter-option" (click)="toggleStatusSelection(status)">
                    <div class="status-indicator" [class]="status.id"></div>
                    <span class="option-label">{{ status.label }}</span>
                    <p-checkbox
                      [(ngModel)]="status.selected"
                      [binary]="true"
                      (onClick)="$event.stopPropagation()"
                    ></p-checkbox>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./filter.component.scss']
})
export class AssetStatusFilterComponent {
  @Input() data!: AssetStatusFilterData;
  @Output() dataChange = new EventEmitter<AssetStatusFilterData>();
  @Output() filterToggle = new EventEmitter<boolean>();
  @Output() filterClose = new EventEmitter<void>();

  toggleFilter() {
    this.data.isVisible = !this.data.isVisible;
    this.filterToggle.emit(this.data.isVisible);
    this.dataChange.emit(this.data);
  }

  closeFilter() {
    this.data.isVisible = false;
    this.data.showConditionDropdown = false;
    this.filterClose.emit();
    this.dataChange.emit(this.data);
  }

  toggleConditionDropdown() {
    this.data.showConditionDropdown = !this.data.showConditionDropdown;
    this.dataChange.emit(this.data);
  }

  selectCondition(condition: 'one-of' | 'none-of') {
    this.data.condition = condition;
    this.data.showConditionDropdown = false;
    this.dataChange.emit(this.data);
  }

  getConditionLabel(): string {
    return this.data.condition === 'one-of' ? 'One of' : 'None of';
  }

  toggleStatusSelection(status: AssetStatusOption) {
    status.selected = !status.selected;
    this.dataChange.emit(this.data);
  }
}
