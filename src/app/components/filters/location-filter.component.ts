import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { LocationFilterData, LocationOption } from './filter.types';

@Component({
  selector: 'app-location-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxModule],
  template: `
    <div class="filter-item filter-container" [class.filter-active]="data.isVisible">
      <div class="filter-button" (click)="toggleFilter()">
        <i class="pi pi-map-marker filter-icon"></i>
        <span>Location</span>
      </div>

      <!-- Location Filter Dialog -->
      @if (data.isVisible) {
        <div class="filter-dialog-overlay" (click)="closeFilter()"></div>
        <div class="filter-dialog" (click)="$event.stopPropagation()">
          <div class="filter-dialog-header">
            <span class="filter-dialog-title">Location</span>

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
            <!-- Search Input -->
            <div class="search-container">
              <i class="pi pi-search search-icon"></i>
              <input
                type="text"
                placeholder="Search locations"
                [(ngModel)]="data.searchTerm"
                class="search-input"
              />
            </div>

            <!-- Location Hierarchy -->
            <div class="location-hierarchy">
              @for (location of filteredLocations; track location.id) {
                <div class="location-item">
                  @if (location.children?.length) {
                    <button class="location-expand-btn" (click)="toggleLocationExpansion(location)">
                      <i class="pi" [class.pi-chevron-right]="!location.expanded" [class.pi-chevron-down]="location.expanded"></i>
                    </button>
                  } @else {
                    <div style="width: 1.5rem;"></div>
                  }

                  <i class="pi pi-folder location-icon"></i>
                  <span class="location-label">{{ location.name }}</span>
                  <p-checkbox
                    [(ngModel)]="location.selected"
                    [binary]="true"
                    (onChange)="onLocationSelectionChange()"
                  ></p-checkbox>
                </div>

                @if (location.expanded && location.children?.length) {
                  <div class="location-children">
                    @for (child of location.children; track child.id) {
                      <div class="location-item">
                        <div style="width: 1.5rem;"></div>
                        <i class="pi pi-file location-icon"></i>
                        <span class="location-label">{{ child.name }}</span>
                        <p-checkbox
                          [(ngModel)]="child.selected"
                          [binary]="true"
                          (onChange)="onLocationSelectionChange()"
                        ></p-checkbox>
                      </div>
                    }
                  </div>
                }
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./filter.component.scss']
})
export class LocationFilterComponent {
  @Input() data!: LocationFilterData;
  @Output() dataChange = new EventEmitter<LocationFilterData>();
  @Output() filterToggle = new EventEmitter<boolean>();
  @Output() filterClose = new EventEmitter<void>();

  get filteredLocations(): LocationOption[] {
    if (!this.data.searchTerm) return this.data.locations;
    return this.data.locations.filter(location => {
      const matchesLocation = location.name.toLowerCase().includes(this.data.searchTerm.toLowerCase());
      const matchesChildren = location.children?.some(child =>
        child.name.toLowerCase().includes(this.data.searchTerm.toLowerCase())
      );
      return matchesLocation || matchesChildren;
    });
  }

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

  toggleLocationExpansion(location: LocationOption) {
    location.expanded = !location.expanded;
    this.dataChange.emit(this.data);
  }

  onLocationSelectionChange() {
    // Update selectedLocations array based on selected locations
    this.data.selectedLocations = [];

    this.data.locations.forEach(location => {
      if (location.selected) {
        this.data.selectedLocations.push(location.id);
      }

      location.children?.forEach(child => {
        if (child.selected) {
          this.data.selectedLocations.push(child.id);
        }
      });
    });

    this.dataChange.emit(this.data);
  }
}
