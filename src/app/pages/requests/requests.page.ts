import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

interface Request {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  requestedByAvatar: string;
  location: string;
  asset: string;
  workType: 'preventive' | 'corrective' | 'inspection';
  estimatedTime: string;
  createdAt: Date;
  dueDate?: Date;
  requestId: string;
  workOrderId?: string;
  isApproved: boolean;
  isUnread?: boolean;
}

interface ViewMode {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-requests-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NavMenuComponent, ButtonModule, InputTextModule, DropdownModule, DialogModule, TableModule, PaginatorModule],
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss']
})
export class RequestsPageComponent implements OnInit {
  // View modes
  viewModes: ViewMode[] = [
    { value: 'panel', label: 'Panel View', icon: '📋' },
    { value: 'table', label: 'Table View', icon: '📊' }
  ];

  currentViewMode: string = 'panel';
  showViewDropdown = false;
  searchTerm = '';

  // Panel view state
  selectedRequestId: number = 1;

  // Paginator properties
  paginatorRows = 10;

  // Dialog states
  showRequestDialog = false;
  selectedRequestForDialog: Request | null = null;
  showNewRequestModal = false;

  // Filter states
  activeFilters = {
    asset: false,
    location: false,
    priority: false,
    status: false
  };

  // Mock data for requests
  allRequests: Request[] = [];

  constructor() {
    console.log('RequestsPageComponent constructor called');
    this.initializeMockData();
  }

  ngOnInit() {
    console.log('RequestsPageComponent ngOnInit called');
    console.log('All requests:', this.allRequests);
    console.log('Filtered requests:', this.filteredRequests);
    this.initializeDefaultSelection();
  }

  private initializeMockData() {
    this.allRequests = [
      {
        id: 1,
        title: 'test',
        description: 'Test request for equipment maintenance',
        status: 'approved',
        priority: 'medium',
        requestedBy: 'lus',
        requestedByAvatar: 'L',
        location: 'General',
        asset: 'Test Asset',
        workType: 'corrective',
        estimatedTime: '1h',
        createdAt: new Date('2025-05-18'),
        requestId: '6843458',
        workOrderId: '2',
        isApproved: true,
        isUnread: false
      },
      {
        id: 2,
        title: 'HVAC System Check',
        description: 'Routine inspection and maintenance of HVAC system in Building A',
        status: 'in-progress',
        priority: 'high',
        requestedBy: 'John Smith',
        requestedByAvatar: 'JS',
        location: 'Building A',
        asset: 'HVAC Unit A1',
        workType: 'preventive',
        estimatedTime: '3h',
        createdAt: new Date('2025-05-17'),
        dueDate: new Date('2025-05-20'),
        requestId: '6843459',
        workOrderId: '3',
        isApproved: true,
        isUnread: true
      },
      {
        id: 3,
        title: 'Elevator Maintenance',
        description: 'Monthly safety inspection and maintenance for elevator #1',
        status: 'open',
        priority: 'critical',
        requestedBy: 'Sarah Johnson',
        requestedByAvatar: 'SJ',
        location: 'Main Building',
        asset: 'Elevator #1',
        workType: 'inspection',
        estimatedTime: '2h',
        createdAt: new Date('2025-05-16'),
        dueDate: new Date('2025-05-19'),
        requestId: '6843460',
        isApproved: false,
        isUnread: true
      },
      {
        id: 4,
        title: 'Generator Service',
        description: 'Emergency generator requires oil change and battery check',
        status: 'completed',
        priority: 'medium',
        requestedBy: 'Mike Wilson',
        requestedByAvatar: 'MW',
        location: 'Basement',
        asset: 'Emergency Generator',
        workType: 'preventive',
        estimatedTime: '1.5h',
        createdAt: new Date('2025-05-15'),
        requestId: '6843461',
        workOrderId: '4',
        isApproved: true,
        isUnread: false
      },
      {
        id: 5,
        title: 'Boiler Repair',
        description: 'Boiler #2 pressure valve needs replacement due to leak',
        status: 'rejected',
        priority: 'high',
        requestedBy: 'Lisa Chen',
        requestedByAvatar: 'LC',
        location: 'Mechanical Room',
        asset: 'Boiler #2',
        workType: 'corrective',
        estimatedTime: '4h',
        createdAt: new Date('2025-05-14'),
        requestId: '6843462',
        isApproved: false,
        isUnread: false
      },
      {
        id: 6,
        title: 'test',
        description: 'Test request for equipment maintenance',
        status: 'approved',
        priority: 'medium',
        requestedBy: 'lus',
        requestedByAvatar: 'L',
        location: 'General',
        asset: 'Test Asset',
        workType: 'corrective',
        estimatedTime: '1h',
        createdAt: new Date('2025-05-18'),
        requestId: '6843458',
        workOrderId: '2',
        isApproved: true,
        isUnread: false
      },
      {
        id: 7,
        title: 'test',
        description: 'Test request for equipment maintenance',
        status: 'approved',
        priority: 'medium',
        requestedBy: 'lus',
        requestedByAvatar: 'L',
        location: 'General',
        asset: 'Test Asset',
        workType: 'corrective',
        estimatedTime: '1h',
        createdAt: new Date('2025-05-18'),
        requestId: '6843458',
        workOrderId: '2',
        isApproved: true,
        isUnread: false
      },
      {
        id: 8,
        title: 'test',
        description: 'Test request for equipment maintenance',
        status: 'approved',
        priority: 'medium',
        requestedBy: 'lus',
        requestedByAvatar: 'L',
        location: 'General',
        asset: 'Test Asset',
        workType: 'corrective',
        estimatedTime: '1h',
        createdAt: new Date('2025-05-18'),
        requestId: '6843458',
        workOrderId: '2',
        isApproved: true,
        isUnread: false
      },
      {
        id: 9,
        title: 'test',
        description: 'Test request for equipment maintenance',
        status: 'approved',
        priority: 'medium',
        requestedBy: 'lus',
        requestedByAvatar: 'L',
        location: 'General',
        asset: 'Test Asset',
        workType: 'corrective',
        estimatedTime: '1h',
        createdAt: new Date('2025-05-18'),
        requestId: '6843458',
        workOrderId: '2',
        isApproved: true,
        isUnread: false
      },
      {
        id: 10,
        title: 'test',
        description: 'Test request for equipment maintenance',
        status: 'approved',
        priority: 'medium',
        requestedBy: 'lus',
        requestedByAvatar: 'L',
        location: 'General',
        asset: 'Test Asset',
        workType: 'corrective',
        estimatedTime: '1h',
        createdAt: new Date('2025-05-18'),
        requestId: '6843458',
        workOrderId: '2',
        isApproved: true,
        isUnread: false
      },
    ];

    console.log('Mock data initialized:', this.allRequests.length, 'requests');
  }

  private initializeDefaultSelection() {
    // Auto-select the first request on load
    if (this.allRequests.length > 0) {
      this.selectedRequestId = this.allRequests[0].id;
    }
  }

  get currentViewModeLabel(): string {
    const mode = this.viewModes.find(m => m.value === this.currentViewMode);
    return mode ? mode.label : 'Panel View';
  }

  get filteredRequests(): Request[] {
    if (!this.searchTerm) {
      return this.allRequests;
    }

    const term = this.searchTerm.toLowerCase();
    return this.allRequests.filter(request =>
      request.title.toLowerCase().includes(term) ||
      request.description.toLowerCase().includes(term) ||
      request.requestedBy.toLowerCase().includes(term) ||
      request.location.toLowerCase().includes(term) ||
      request.asset.toLowerCase().includes(term)
    );
  }

  get selectedRequest(): Request | undefined {
    return this.allRequests.find(request => request.id === this.selectedRequestId);
  }

  // View mode methods
  toggleViewDropdown() {
    this.showViewDropdown = !this.showViewDropdown;
  }

  closeViewDropdown() {
    this.showViewDropdown = false;
  }

  selectViewMode(viewMode: string) {
    this.currentViewMode = viewMode;
    this.showViewDropdown = false;
  }

  // Panel view methods
  selectRequest(id: number) {
    this.selectedRequestId = id;
    // Mark as read when selected
    const request = this.allRequests.find(r => r.id === id);
    if (request && request.isUnread) {
      request.isUnread = false;
    }
  }

  updateStatus(newStatus: 'open' | 'approved' | 'in-progress' | 'completed' | 'rejected') {
    if (this.selectedRequest) {
      this.selectedRequest.status = newStatus;
      console.log(`Request ${this.selectedRequest.id} status updated to: ${newStatus}`);
    }
  }

  // Table view methods
  onRequestRowClick(request: Request) {
    this.selectedRequestForDialog = request;
    this.showRequestDialog = true;

    // Mark as read
    if (request.isUnread) {
      request.isUnread = false;
    }
  }

  // Paginator methods
  onPageChange(event: any) {
    this.paginatorRows = event.rows;
  }

  // Dialog methods (for backward compatibility)
  openRequestDetails(request: Request) {
    this.selectedRequestForDialog = request;
    this.showRequestDialog = true;

    // Mark as read
    if (request.isUnread) {
      request.isUnread = false;
    }
  }

  openNewRequestModal() {
    this.showNewRequestModal = true;
  }

  // Utility methods
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'open': return 'status-open';
      case 'approved': return 'status-approved';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'rejected': return 'status-rejected';
      default: return 'status-default';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'open': return '🔓';
      case 'approved': return '✅';
      case 'in-progress': return '🔄';
      case 'completed': return '✅';
      case 'rejected': return '❌';
      default: return '📋';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'open': return 'Open';
      case 'approved': return 'Approved';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  }
}
