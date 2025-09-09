import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddFilterData, AvailableFilter } from './filter.types';

@Component({
  selector: 'app-add-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-item filter-container" [class.filter-active]="data.isVisible">
      <div class="filter-button" (click)="toggleFilter()">
        <i class="pi pi-plus filter-icon"></i>
        <span>Add Filter</span>
      </div>

      <!-- Add Filter Dialog -->
      @if (data.isVisible) {
        <div class="filter-dialog-overlay" (click)="closeFilter()"></div>
        <div class="filter-dialog" (click)="$event.stopPropagation()">
          <div class="filter-dialog-header">
            <span class="filter-dialog-title">Add Filter</span>

            <button class="filter-delete-btn" (click)="closeFilter()">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div class="filter-dialog-content">
            <!-- Search Input -->
            <div class="search-container">
              <i class="pi pi-search search-icon"></i>
              <input
                type="text"
                placeholder="Search filters"
                [(ngModel)]="data.searchTerm"
                class="search-input"
              />
            </div>

            <!-- Available Filters List -->
            <div class="add-filter-list">
              @for (filter of filteredAvailableFilters; track filter.id) {
                <div class="add-filter-item" (click)="addFilter(filter.id)">
                  <i class="filter-item-icon" [class]="filter.icon"></i>
                  <span class="filter-item-label">{{ filter.label }}</span>
                </div>
              }

              @if (filteredAvailableFilters.length === 0) {
                <div class="add-filter-item">
                  <span class="filter-item-label">No filters available</span>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./filter.component.scss']
})
export class AddFilterComponent {
  @Input() data!: AddFilterData;
  @Output() dataChange = new EventEmitter<AddFilterData>();
  @Output() filterToggle = new EventEmitter<boolean>();
  @Output() filterClose = new EventEmitter<void>();
  @Output() filterAdd = new EventEmitter<string>();

  get filteredAvailableFilters(): AvailableFilter[] {
    if (!this.data.searchTerm) {
      return this.data.availableFilters.filter(filter => !this.data.activeFilters.includes(filter.id));
    }
    return this.data.availableFilters.filter(filter =>
      !this.data.activeFilters.includes(filter.id) &&
      filter.label.toLowerCase().includes(this.data.searchTerm.toLowerCase())
    );
  }

  toggleFilter() {
    this.data.isVisible = !this.data.isVisible;
    this.filterToggle.emit(this.data.isVisible);
    this.dataChange.emit(this.data);
  }

  closeFilter() {
    this.data.isVisible = false;
    this.data.searchTerm = '';
    this.filterClose.emit();
    this.dataChange.emit(this.data);
  }

  addFilter(filterId: string) {
    this.filterAdd.emit(filterId);
    this.closeFilter();
  }
}
