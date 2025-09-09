import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  AssignedToFilterData, 
  DueDateFilterData, 
  PriorityFilterData, 
  LocationFilterData, 
  AssetStatusFilterData,
  AddFilterData,
  FilterConfiguration,
  FilterType,
  TeamOption,
  UserOption,
  PriorityOption,
  DatePresetOption,
  LocationOption,
  AssetStatusOption,
  AvailableFilter
} from './filter.types';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private enabledFiltersSubject = new BehaviorSubject<FilterConfiguration[]>([]);
  public enabledFilters$ = this.enabledFiltersSubject.asObservable();

  private filterDataSubject = new BehaviorSubject<Map<string, any>>(new Map());
  public filterData$ = this.filterDataSubject.asObservable();

  constructor() {
    this.initializeDefaultFilters();
  }

  private initializeDefaultFilters() {
    // This will come from database/user preferences in the future
    const defaultFilters: FilterConfiguration[] = [
      {
        id: 'assigned-to',
        type: 'assigned-to',
        label: 'Assigned To',
        icon: 'pi-user',
        enabled: true,
        order: 1
      },
      {
        id: 'due-date',
        type: 'due-date',
        label: 'Due Date',
        icon: 'pi-calendar',
        enabled: true,
        order: 2
      },
      {
        id: 'priority',
        type: 'priority',
        label: 'Priority',
        icon: 'pi-flag',
        enabled: false,
        order: 3
      },
      {
        id: 'location',
        type: 'location',
        label: 'Location',
        icon: 'pi-map-marker',
        enabled: false,
        order: 4
      },
      {
        id: 'asset-status',
        type: 'asset-status',
        label: 'Asset Status',
        icon: 'pi-cog',
        enabled: false,
        order: 5
      }
    ];

    this.enabledFiltersSubject.next(defaultFilters);
    this.initializeFilterData();
  }

  private initializeFilterData() {
    const filterDataMap = new Map();

    // Initialize Assigned To Filter Data
    filterDataMap.set('assigned-to', this.createAssignedToFilterData());

    // Initialize Due Date Filter Data
    filterDataMap.set('due-date', this.createDueDateFilterData());

    // Initialize Priority Filter Data
    filterDataMap.set('priority', this.createPriorityFilterData());

    // Initialize Location Filter Data
    filterDataMap.set('location', this.createLocationFilterData());

    // Initialize Asset Status Filter Data
    filterDataMap.set('asset-status', this.createAssetStatusFilterData());

    // Initialize Add Filter Data
    filterDataMap.set('add-filter', this.createAddFilterData());

    this.filterDataSubject.next(filterDataMap);
  }

  private createAssignedToFilterData(): AssignedToFilterData {
    return {
      isVisible: false,
      condition: 'one-of',
      showConditionDropdown: false,
      searchTerm: '',
      teamsExpanded: true,
      usersExpanded: true,
      teams: [
        { id: 'maintenance', name: 'Maintenance Team', selected: false },
        { id: 'engineering', name: 'Engineering Team', selected: false },
        { id: 'operations', name: 'Operations Team', selected: false }
      ],
      users: [
        { id: 'jun-ren', name: 'Jun Ren', selected: false },
        { id: 'sarah-johnson', name: 'Sarah Johnson', selected: false },
        { id: 'mike-wilson', name: 'Mike Wilson', selected: false },
        { id: 'tom-anderson', name: 'Tom Anderson', selected: false }
      ]
    };
  }

  private createDueDateFilterData(): DueDateFilterData {
    return {
      isVisible: false,
      condition: 'one-of',
      showConditionDropdown: false,
      mode: 'presets',
      selectedDate: null,
      presets: [
        { id: 'today', name: 'Today', label: 'Today', selected: false },
        { id: 'tomorrow', name: 'Tomorrow', label: 'Tomorrow', selected: false },
        { id: 'this-week', name: 'This Week', label: 'This Week', selected: false },
        { id: 'next-week', name: 'Next Week', label: 'Next Week', selected: false },
        { id: 'overdue', name: 'Overdue', label: 'Overdue', selected: false }
      ]
    };
  }

  private createPriorityFilterData(): PriorityFilterData {
    return {
      isVisible: false,
      condition: 'one-of',
      showConditionDropdown: false,
      priorities: [
        { id: 'high', name: 'High', label: 'High', color: 'red', selected: false },
        { id: 'medium', name: 'Medium', label: 'Medium', color: 'orange', selected: false },
        { id: 'low', name: 'Low', label: 'Low', color: 'green', selected: false },
        { id: 'none', name: 'None', label: 'None', color: 'none', selected: false }
      ]
    };
  }

  private createLocationFilterData(): LocationFilterData {
    return {
      isVisible: false,
      condition: 'one-of',
      showConditionDropdown: false,
      searchTerm: '',
      selectedLocations: [],
      locations: [
        { id: 'general', name: 'General', selected: false },
        { id: 'building-a', name: 'Building A', selected: false },
        { id: 'warehouse', name: 'Warehouse', selected: false },
        { id: 'factory-floor', name: 'Factory Floor', selected: false }
      ]
    };
  }

  private createAssetStatusFilterData(): AssetStatusFilterData {
    return {
      isVisible: false,
      condition: 'one-of',
      showConditionDropdown: false,
      assetStatuses: [
        { id: 'operational', name: 'Operational', label: 'Operational', selected: false },
        { id: 'maintenance', name: 'Under Maintenance', label: 'Under Maintenance', selected: false },
        { id: 'down', name: 'Down', label: 'Down', selected: false },
        { id: 'retired', name: 'Retired', label: 'Retired', selected: false }
      ]
    };
  }

  private createAddFilterData(): AddFilterData {
    return {
      isVisible: false,
      searchTerm: '',
      availableFilters: [
        { id: 'assigned-to', label: 'Assigned To', icon: 'pi-user' },
        { id: 'due-date', label: 'Due Date', icon: 'pi-calendar' },
        { id: 'priority', label: 'Priority', icon: 'pi-flag' },
        { id: 'location', label: 'Location', icon: 'pi-map-marker' },
        { id: 'asset-status', label: 'Asset Status', icon: 'pi-cog' }
      ],
      activeFilters: ['assigned-to', 'due-date'] // Default enabled filters
    };
  }

  // Public methods
  getEnabledFilters(): FilterConfiguration[] {
    return this.enabledFiltersSubject.value;
  }

  getFilterData(filterId: string): any {
    return this.filterDataSubject.value.get(filterId);
  }

  updateFilterData(filterId: string, data: any): void {
    const currentData = this.filterDataSubject.value;
    currentData.set(filterId, data);
    this.filterDataSubject.next(currentData);
  }

  enableFilter(filterId: string): void {
    const filters = this.enabledFiltersSubject.value;
    const filter = filters.find(f => f.id === filterId);
    if (filter) {
      filter.enabled = true;
      this.enabledFiltersSubject.next(filters);
    }
  }

  disableFilter(filterId: string): void {
    const filters = this.enabledFiltersSubject.value;
    const filter = filters.find(f => f.id === filterId);
    if (filter) {
      filter.enabled = false;
      // Also close the filter if it's open
      const filterData = this.getFilterData(filterId);
      if (filterData && filterData.isVisible) {
        filterData.isVisible = false;
        this.updateFilterData(filterId, filterData);
      }
      this.enabledFiltersSubject.next(filters);
    }
  }

  getAvailableFilters(): AvailableFilter[] {
    const enabledFilters = this.getEnabledFilters().filter(f => f.enabled);
    const enabledIds = enabledFilters.map(f => f.id);
    
    return this.getEnabledFilters()
      .filter(f => !enabledIds.includes(f.id))
      .map(f => ({
        id: f.id,
        label: f.label,
        icon: f.icon
      }));
  }

  addFilter(filterId: string): void {
    this.enableFilter(filterId);
    
    // Update add filter data
    const addFilterData = this.getFilterData('add-filter');
    if (addFilterData) {
      addFilterData.activeFilters.push(filterId);
      addFilterData.isVisible = false;
      this.updateFilterData('add-filter', addFilterData);
    }
  }

  removeFilter(filterId: string): void {
    this.disableFilter(filterId);
    
    // Update add filter data
    const addFilterData = this.getFilterData('add-filter');
    if (addFilterData) {
      addFilterData.activeFilters = addFilterData.activeFilters.filter((id: string) => id !== filterId);
      this.updateFilterData('add-filter', addFilterData);
    }
  }

  // Method to update filter configuration (for future database integration)
  updateFilterConfiguration(filters: FilterConfiguration[]): void {
    this.enabledFiltersSubject.next(filters);
    // In the future, this would also save to database
  }

  // Method to reset all filters
  resetAllFilters(): void {
    this.initializeFilterData();
  }

  // Method to get active filter values (for applying to data)
  getActiveFilterValues(): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    const filterData = this.filterDataSubject.value;
    
    filterData.forEach((data, filterId) => {
      if (data.isVisible || this.hasSelectedValues(data, filterId)) {
        result[filterId] = this.extractFilterValues(data, filterId);
      }
    });
    
    return result;
  }

  private hasSelectedValues(data: any, filterId: string): boolean {
    switch (filterId) {
      case 'assigned-to':
        return data.teams.some((t: TeamOption) => t.selected) || 
               data.users.some((u: UserOption) => u.selected);
      case 'due-date':
        return data.selectedDate !== null || 
               data.presets.some((p: DatePresetOption) => p.selected);
      case 'priority':
        return data.priorities.some((p: PriorityOption) => p.selected);
      case 'location':
        return data.locations.some((l: LocationOption) => l.selected);
      case 'asset-status':
        return data.assetStatuses.some((a: AssetStatusOption) => a.selected);
      default:
        return false;
    }
  }

  private extractFilterValues(data: any, filterId: string): any {
    switch (filterId) {
      case 'assigned-to':
        return {
          condition: data.condition,
          selectedTeams: data.teams.filter((t: TeamOption) => t.selected),
          selectedUsers: data.users.filter((u: UserOption) => u.selected)
        };
      case 'due-date':
        return {
          condition: data.condition,
          mode: data.mode,
          selectedDate: data.selectedDate,
          selectedPresets: data.presets.filter((p: DatePresetOption) => p.selected)
        };
      case 'priority':
        return {
          condition: data.condition,
          selectedPriorities: data.priorities.filter((p: PriorityOption) => p.selected)
        };
      case 'location':
        return {
          condition: data.condition,
          selectedLocations: data.locations.filter((l: LocationOption) => l.selected)
        };
      case 'asset-status':
        return {
          condition: data.condition,
          selectedStatuses: data.assetStatuses.filter((a: AssetStatusOption) => a.selected)
        };
      default:
        return data;
    }
  }
}
