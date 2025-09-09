import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DueDateFilterData, DatePresetOption } from './filter.types';

@Component({
  selector: 'app-due-date-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxModule, CalendarModule],
  template: `
    <div class="filter-item filter-container" [class.filter-active]="data.isVisible">
      <div class="filter-button" (click)="toggleFilter()">
        <i class="pi pi-calendar filter-icon"></i>
        <span>Due Date</span>
      </div>

      <!-- Due Date Filter Dialog -->
      @if (data.isVisible) {
        <div class="filter-dialog-overlay" (click)="closeFilter()"></div>
        <div class="filter-dialog" (click)="$event.stopPropagation()">
          <div class="filter-dialog-header">
            <span class="filter-dialog-title">Due Date</span>

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
            <!-- Presets Mode -->
            @if (data.mode === 'presets') {
              <div class="preset-options">
                @for (preset of data.presets; track preset.id) {
                  <div class="filter-option" (click)="togglePresetSelection(preset)">
                    <span class="option-label">{{ preset.label }}</span>
                    <p-checkbox
                      [(ngModel)]="preset.selected"
                      [binary]="true"
                      (onClick)="$event.stopPropagation()"
                    ></p-checkbox>
                  </div>
                }

                <div class="custom-date-option" (click)="switchToCustomDate()">
                  <i class="pi pi-calendar custom-date-icon"></i>
                  <span class="option-label">Custom Date</span>
                </div>
              </div>
            }

            <!-- Custom Date Mode -->
            @if (data.mode === 'custom') {
              <div class="custom-date-content">
                <p-calendar
                  [(ngModel)]="data.selectedDate"
                  [inline]="true"
                  [showButtonBar]="false"
                  (onSelect)="onDateSelect($event)"
                  dateFormat="dd/mm/yy">
                </p-calendar>

                <div class="presets-option" (click)="switchToPresets()">
                  <i class="pi pi-list presets-icon"></i>
                  <span class="option-label">Presets</span>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./filter.component.scss']
})
export class DueDateFilterComponent {
  @Input() data!: DueDateFilterData;
  @Output() dataChange = new EventEmitter<DueDateFilterData>();
  @Output() filterToggle = new EventEmitter<boolean>();
  @Output() filterClose = new EventEmitter<void>();

  toggleFilter() {
    this.data.isVisible = !this.data.isVisible;
    if (this.data.isVisible) {
      this.data.mode = 'presets'; // Always start with presets
    }
    this.filterToggle.emit(this.data.isVisible);
    this.dataChange.emit(this.data);
  }

  closeFilter() {
    this.data.isVisible = false;
    this.data.showConditionDropdown = false;
    this.filterClose.emit();
    this.dataChange.emit(this.data);
  }

  switchToCustomDate() {
    this.data.mode = 'custom';
    this.dataChange.emit(this.data);
  }

  switchToPresets() {
    this.data.mode = 'presets';
    this.dataChange.emit(this.data);
  }

  togglePresetSelection(preset: DatePresetOption) {
    preset.selected = !preset.selected;
    this.dataChange.emit(this.data);
  }

  onDateSelect(date: Date) {
    this.data.selectedDate = date;
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
}
