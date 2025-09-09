import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { AssignedToFilterData, TeamOption, UserOption } from './filter.types';

@Component({
  selector: 'app-assigned-to-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxModule],
  template: `
    <div class="filter-item filter-container" [class.filter-active]="data.isVisible">
      <div class="filter-button" (click)="toggleFilter()">
        <i class="pi pi-user filter-icon"></i>
        <span>Assigned To</span>
      </div>

      <!-- Assigned To Filter Dialog -->
      @if (data.isVisible) {
        <div class="filter-dialog-overlay" (click)="closeFilter()"></div>
        <div class="filter-dialog" (click)="$event.stopPropagation()">
          <div class="filter-dialog-header">
            <span class="filter-dialog-title">Assigned To</span>

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
                placeholder="Search"
                [(ngModel)]="data.searchTerm"
                class="search-input"
              />
            </div>

            <!-- Teams Section -->
            <div class="filter-section">
              <div class="section-header" (click)="toggleTeamsExpanded()">
                <span class="section-title">Teams</span>
                <i class="pi" [class.pi-chevron-up]="data.teamsExpanded" [class.pi-chevron-down]="!data.teamsExpanded"></i>
              </div>
              @if (data.teamsExpanded) {
                <div class="section-content">
                  @for (team of filteredTeams; track team.id) {
                    <div class="filter-option" (click)="toggleTeamSelection(team)">
                      <div class="team-icon">🟡</div>
                      <span class="option-label">{{ team.name }}</span>
                      <p-checkbox
                        [(ngModel)]="team.selected"
                        [binary]="true"
                        (onClick)="$event.stopPropagation()"
                      ></p-checkbox>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Users Section -->
            <div class="filter-section">
              <div class="section-header" (click)="toggleUsersExpanded()">
                <span class="section-title">Users</span>
                <i class="pi" [class.pi-chevron-up]="data.usersExpanded" [class.pi-chevron-down]="!data.usersExpanded"></i>
              </div>
              @if (data.usersExpanded) {
                <div class="section-content">
                  @for (user of filteredUsers; track user.id) {
                    <div class="filter-option" (click)="toggleUserSelection(user)">
                      <div class="user-icon">🔵</div>
                      <span class="option-label">{{ user.name }}</span>
                      <p-checkbox
                        [(ngModel)]="user.selected"
                        [binary]="true"
                        (onClick)="$event.stopPropagation()"
                      ></p-checkbox>
                    </div>
                  }
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
export class AssignedToFilterComponent {
  @Input() data!: AssignedToFilterData;
  @Output() dataChange = new EventEmitter<AssignedToFilterData>();
  @Output() filterToggle = new EventEmitter<boolean>();
  @Output() filterClose = new EventEmitter<void>();

  get filteredTeams(): TeamOption[] {
    if (!this.data.searchTerm) return this.data.teams;
    return this.data.teams.filter(team =>
      team.name.toLowerCase().includes(this.data.searchTerm.toLowerCase())
    );
  }

  get filteredUsers(): UserOption[] {
    if (!this.data.searchTerm) return this.data.users;
    return this.data.users.filter(user =>
      user.name.toLowerCase().includes(this.data.searchTerm.toLowerCase())
    );
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

  toggleTeamsExpanded() {
    this.data.teamsExpanded = !this.data.teamsExpanded;
    this.dataChange.emit(this.data);
  }

  toggleUsersExpanded() {
    this.data.usersExpanded = !this.data.usersExpanded;
    this.dataChange.emit(this.data);
  }

  toggleTeamSelection(team: TeamOption) {
    team.selected = !team.selected;
    this.dataChange.emit(this.data);
  }

  toggleUserSelection(user: UserOption) {
    user.selected = !user.selected;
    this.dataChange.emit(this.data);
  }
}
