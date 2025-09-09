import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { FilterService } from '../filter.service';
import { AssignedToFilterComponent } from '../assigned-to-filter.component';
import { DueDateFilterComponent } from '../due-date-filter.component';
import { PriorityFilterComponent } from '../priority-filter.component';
import { AddFilterComponent } from '../add-filter.component';

import { 
  FilterConfiguration,
  AssignedToFilterData,
  DueDateFilterData,
  PriorityFilterData,
  AddFilterData
} from '../filter.types';

@Component({
  selector: 'app-filters-container',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AssignedToFilterComponent,
    DueDateFilterComponent,
    PriorityFilterComponent,
    AddFilterComponent
  ],
  templateUrl: './filters-container.component.html',
  styleUrls: ['./filters-container.component.scss']
})
export class FiltersContainerComponent implements OnInit, OnDestroy {
  @Output() filtersChange = new EventEmitter<{ [key: string]: any }>();
  
  enabledFilters: FilterConfiguration[] = [];
  showMoreActions = false;
  private destroy$ = new Subject<void>();

  constructor(private filterService: FilterService) {}

  ngOnInit() {
    // Subscribe to enabled filters
    this.filterService.enabledFilters$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => {
        this.enabledFilters = filters.sort((a, b) => a.order - b.order);
      });

    // Subscribe to filter data changes and emit to parent
    this.filterService.filterData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.emitFilterChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFilterData(filterId: string): any {
    return this.filterService.getFilterData(filterId);
  }

  getAddFilterData(): AddFilterData {
    return this.filterService.getFilterData('add-filter');
  }

  onFilterDataChange(filterId: string, data: any) {
    this.filterService.updateFilterData(filterId, data);
  }

  onAddFilterDataChange(data: AddFilterData) {
    this.filterService.updateFilterData('add-filter', data);
  }

  onFilterToggle(filterId: string, isVisible: boolean) {
    // Close other filters when one is opened
    if (isVisible) {
      this.closeOtherFilters(filterId);
    }
  }

  onFilterClose(filterId: string) {
    const data = this.getFilterData(filterId);
    if (data) {
      data.isVisible = false;
      this.filterService.updateFilterData(filterId, data);
    }
  }

  onFilterAdd(filterId: string) {
    this.filterService.addFilter(filterId);
  }

  private closeOtherFilters(exceptFilterId: string) {
    this.enabledFilters.forEach(filter => {
      if (filter.id !== exceptFilterId && filter.enabled) {
        const data = this.getFilterData(filter.id);
        if (data && data.isVisible) {
          data.isVisible = false;
          data.showConditionDropdown = false;
          this.filterService.updateFilterData(filter.id, data);
        }
      }
    });

    // Also close add filter
    const addFilterData = this.getAddFilterData();
    if (addFilterData && addFilterData.isVisible) {
      addFilterData.isVisible = false;
      this.filterService.updateFilterData('add-filter', addFilterData);
    }

    // Also close more actions dropdown
    this.closeMoreActions();
  }

  private emitFilterChanges() {
    const activeFilters = this.filterService.getActiveFilterValues();
    this.filtersChange.emit(activeFilters);
  }

  toggleMoreActions() {
    this.showMoreActions = !this.showMoreActions;
  }

  closeMoreActions() {
    this.showMoreActions = false;
  }

  openMyFilters() {
    // Future implementation for user filter preferences
    console.log('Opening My Filters preferences...');
    this.closeMoreActions();
  }

  resetAllFilters() {
    this.filterService.resetAllFilters();
    this.closeMoreActions();
  }
}
