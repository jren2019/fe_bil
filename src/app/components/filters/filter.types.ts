export interface FilterCondition {
  value: 'one-of' | 'none-of';
  label: string;
}

export interface FilterOption {
  id: string;
  name: string;
  selected: boolean;
}

export interface TeamOption extends FilterOption {
  // Teams can have additional properties if needed
}

export interface UserOption extends FilterOption {
  // Users can have additional properties if needed
}

export interface LocationOption extends FilterOption {
  expanded?: boolean;
  children?: LocationOption[];
}

export interface PriorityOption extends FilterOption {
  label: string;
  color: string;
}

export interface AssetStatusOption extends FilterOption {
  label: string;
}

export interface DatePresetOption extends FilterOption {
  label: string;
}

export interface AvailableFilter {
  id: string;
  label: string;
  icon: string;
}

export type DateMode = 'presets' | 'custom';

export interface FilterState {
  isVisible: boolean;
  condition: 'one-of' | 'none-of';
  showConditionDropdown: boolean;
}

export interface AssignedToFilterData extends FilterState {
  searchTerm: string;
  teamsExpanded: boolean;
  usersExpanded: boolean;
  teams: TeamOption[];
  users: UserOption[];
}

export interface DueDateFilterData extends FilterState {
  mode: DateMode;
  selectedDate: Date | null;
  presets: DatePresetOption[];
}

export interface LocationFilterData extends FilterState {
  searchTerm: string;
  selectedLocations: string[];
  locations: LocationOption[];
}

export interface PriorityFilterData extends FilterState {
  priorities: PriorityOption[];
}

export interface AssetStatusFilterData extends FilterState {
  assetStatuses: AssetStatusOption[];
}

export interface AddFilterData {
  isVisible: boolean;
  searchTerm: string;
  availableFilters: AvailableFilter[];
  activeFilters: string[];
}
