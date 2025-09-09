import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import { PaginatorModule } from 'primeng/paginator';

interface WorkOrder {
  id: number;
  title: string;
  status: 'open' | 'in-progress' | 'on-hold' | 'complete';
  priority: 'high' | 'medium' | 'low' | 'none';
  requestedBy: string;
  assignedTo: string;
  dueDate?: Date;
  startDate?: Date;
  isOverdue: boolean;
  isUnread: boolean;
  description: string;
  location: string;
  category: string;
  estimatedTime: string;
  workType: 'preventive' | 'corrective' | 'inspection' | 'manufacturing-order' | 'project';
  createdAt: Date;
  createdBy: string;
  updatedOn: Date;
  completedAt?: Date;
  asset: string;
  parentId?: number;
  subWorkOrders?: WorkOrder[];
}

interface ViewMode {
  value: string;
  label: string;
  icon: string;
}

interface WorkOrderGroup {
  title: string;
  count: number;
  workOrders: WorkOrder[];
  expanded: boolean;
}

// Timesheet Interfaces
interface TimesheetEntry {
  id: string;
  workOrderId: number; // The specific work order (parent or sub)
  userId: string;
  userName: string;
  userType: 'staff' | 'contractor' | 'supervisor' | 'manager';
  date: Date;
  startTime: string; // "09:00"
  duration: number; // minutes
  description: string;
  status: 'draft' | 'submitted' | 'approved';
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectRelease {
  id: string;
  workOrderId: number;
  version: string;
  time: Date;
  bomPath?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ECN (Engineering Change Notice) Interfaces
interface ECN {
  id: string;
  number: string; // ECN-YYYY-####
  title: string;
  description: string;
  reason: string;
  status: 'draft' | 'under_review' | 'approved' | 'released' | 'closed';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  workOrderId: number;
  createdBy: string;
  createdAt: Date;
  approvedAt?: Date;
  closedAt?: Date;
  targetDate?: Date;
}

interface ECNItem {
  id: string;
  ecnId: string;
  itemId: string;
  partNumber: string;
  oldRevision: string;
  newRevision: string;
  changeType: 'add' | 'remove' | 'qty_change' | 'spec_change';
  impact: string;
  quantity?: number;
}

interface ECNApproval {
  id: string;
  ecnId: string;
  role: 'engineering' | 'qa' | 'procurement' | 'project_manager';
  approverId: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
  decision?: 'approve' | 'reject';
  comments?: string;
}

interface ECNAttachment {
  id: string;
  ecnId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: Date;
}

interface BOMItem {
  id: string;
  partNumber: string;
  quantity: number;
  revision: string;
  description: string;
  changeType?: 'add' | 'remove' | 'qty_change' | 'spec_change' | 'unchanged';
}

interface CostImpact {
  material: number;
  labor: number;
  total: number;
}

interface ProductionImpact {
  leadTime: number;
  wipUnits: number;
  resourceHours: number;
}

interface UserRole {
  type: 'staff' | 'contractor' | 'supervisor' | 'manager';
  permissions: {
    canLogTime: boolean;
    canEditOwnTimesheet: boolean;
    canEditOthersTimesheet: boolean;
    canApproveTimesheet: boolean;
    canViewAllTimesheets: boolean;
    canGenerateReports: boolean;
  };
}

interface TimesheetWeek {
  weekStart: Date;
  weekEnd: Date;
  days: TimesheetDay[];
  totalHours: number;
}

interface TimesheetDay {
  date: Date;
  dayName: string;
  entries: TimesheetEntry[];
  totalHours: number;
  targetHours: number; // Expected work hours for the day
}

@Component({
  selector: 'app-workorder-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavMenuComponent,
    ButtonModule,
    TableModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    TextareaModule,
    CalendarModule,
    CheckboxModule,
    FileUploadModule,
    TabViewModule,
    PaginatorModule
  ],
  templateUrl: './workorder.page.html',
  styleUrls: ['./workorder.page.scss']
})
export class WorkorderPageComponent implements OnInit {
  // constructor(private cdr: ChangeDetectorRef) {}

  viewModes: ViewMode[] = [
    { value: 'todo', label: 'To Do View', icon: '📋' },
    { value: 'table', label: 'Table View', icon: '📊' },
    { value: 'calendar', label: 'Calendar View', icon: '📅' },
    { value: 'workload', label: 'Workload View', icon: '⚡' }
  ];

  get currentViewModeLabel(): string {
    const mode = this.viewModes.find(vm => vm.value === this.currentViewMode);
    return mode ? mode.label : 'To Do View';
  }

  currentViewMode: string = 'todo';
  showViewDropdown = false;
  searchTerm = '';
  filteredWorkOrdersCache: WorkOrder[] = [];

  // Sub-workorders navigation state
  currentView: 'details' | 'sub-workorders' = 'details';
  parentWorkOrder: WorkOrder | null = null;
  breadcrumbs: WorkOrder[] = [];
  currentHierarchyLevel: number = 0;

  // Selection and UI state
  selectedWorkOrderId: number = 1;
  activeTab: string = 'todo';
  showSortDropdown = false;

  // Bulk operations state
  selectedWorkOrderIds: Set<number> = new Set();
  bulkSelectionMode: boolean = false;
  showBulkActions: boolean = false;

  // Dialog states
  showWorkOrderDialog = false;
  showNewWorkOrderModal = false;
  showAddCostModal = false;
  showBulkStartDateModal = false;
  showCreateSubWorkOrderModal = false;
  selectedWorkOrderForDialog: WorkOrder | null = null;

  // Navigation and filtering
  currentSortOption = { value: 'priority-high', label: 'Priority: Highest First' };
  unreadFirstEnabled = true;
  priorityExpanded = false;

  // Form data
  newWorkOrder = {
    title: '',
    workType: '',
    priority: '',
    description: '',
    location: '',
    asset: '',
    assignedTo: '',
    category: '',
    startDate: null as Date | null,
    dueDate: null as Date | null,
    estimatedTime: ''
  };

  // BOM Upload related properties
  uploadedBOM: any = null;
  showBOMPreview: boolean = false;

  // Additional properties for template compatibility
  newComment: string = '';
  comments: any[] = [];

  // Mode states
  isDefaultMode: boolean = true;
  isCommentsMode: boolean = false;
  isEditMode: boolean = false;
  isPartsMode: boolean = false;
  isCostsMode: boolean = false;
  isTimesheetMode: boolean = false;
  editingEntry: TimesheetEntry | null = null;
  showAddEntryModal: boolean = false;
  newTimeEntry: Partial<TimesheetEntry> = {};
  isLoading: boolean = false;

  // Work Order Tab Management
  activeWorkOrderTab: string = 'details';

  // Releases Management
  releases: ProjectRelease[] = [];
  showAddReleaseModal: boolean = false;
  newRelease: Partial<ProjectRelease> = {};

  // ECN Management
  activeECNTab: string = 'dashboard';
  ecnStatusFilter: string = 'all';
  selectedECN: ECN | null = null;
  ecns: ECN[] = [];
  ecnItems: ECNItem[] = [];
  ecnApprovals: ECNApproval[] = [];
  ecnAttachments: ECNAttachment[] = [];
  newECN: Partial<ECN> = {};
  currentBOMItems: BOMItem[] = [];
  proposedBOMItems: BOMItem[] = [];

  showActionsMenu: boolean = false;

  // Edit form data
  editForm: any = {
    location: '',
    asset: '',
    assetStatus: ''
  };

  // Filter states
  showAssignedToFilter: boolean = false;
  showDueDateFilter: boolean = false;
  showPriorityFilter: boolean = false;
  showStartDateFilter: boolean = false;
  showAddFilterDialog: boolean = false;

  // Filter dropdown states
  showAssignedToConditionDropdown: boolean = false;
  showDueDateConditionDropdown: boolean = false;
  showPriorityConditionDropdown: boolean = false;
  showStartDateConditionDropdown: boolean = false;

  // Filter conditions
  assignedToCondition: string = 'one-of';
  dueDateCondition: string = 'one-of';
  priorityCondition: string = 'one-of';
  startDateCondition: string = 'one-of';

  // Filter modes
  dueDateMode: string = 'presets';
  startDateMode: string = 'presets';

  // Filter search terms
  assignedToSearchTerm: string = '';
  addFilterSearchTerm: string = '';

  // Filter expansion states
  teamsExpanded: boolean = true;
  usersExpanded: boolean = true;

  // Date selections
  selectedDate: Date | null = null;
  selectedStartDate: Date | null = null;

  // Filter data arrays
  activeFilters: string[] = [];
  filteredTeams: any[] = [];
  filteredUsers: any[] = [];
  filteredAvailableFilters: any[] = [
    { id: 'assigned-to', label: 'Assigned To', icon: 'pi-user' },
    { id: 'due-date', label: 'Due Date', icon: 'pi-calendar' },
    { id: 'priority', label: 'Priority', icon: 'pi-flag' },
    { id: 'start-date', label: 'Start Date', icon: 'pi-calendar-plus' }
  ];

  // Priority options for filter
  priorityOptions: any[] = [
    { id: 'high', label: 'High', color: 'red', selected: false },
    { id: 'medium', label: 'Medium', color: 'orange', selected: false },
    { id: 'low', label: 'Low', color: 'green', selected: false },
    { id: 'none', label: 'None', color: 'none', selected: false }
  ];

  // Date presets
  dueDatePresets: any[] = [
    { id: 'today', label: 'Today', selected: false },
    { id: 'tomorrow', label: 'Tomorrow', selected: false },
    { id: 'this-week', label: 'This Week', selected: false },
    { id: 'next-week', label: 'Next Week', selected: false }
  ];

  startDatePresets: any[] = [
    { id: 'today', label: 'Today', selected: false },
    { id: 'tomorrow', label: 'Tomorrow', selected: false },
    { id: 'this-week', label: 'This Week', selected: false },
    { id: 'next-week', label: 'Next Week', selected: false }
  ];

  // Calendar and workload properties
  calendarViewMode: string = 'month';
  calendarFilters: any = {
    assignedTo: { active: false },
    priority: { active: false },
    dueDate: { active: false }
  };

  showBanner: boolean = true;

  dayHeaders: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarWeeks: any[] = [];
  weekDays: any[] = [];

  // Workload data - will be calculated from actual work orders
  currentWorkloadWeek: Date = new Date();
  workloadWeekDays: any[] = [];
  workloadUsers: any[] = [];
  totalScheduledHours: number = 0;
  totalCapacityHours: number = 0;
  unscheduledCounts = {
    overdue: 0,
    dueSoon: 0,
    open: 0,
    onHold: 0
  };

  newSubWorkOrder = {
    title: '',
    workType: '',
    priority: '',
    description: '',
    assignedTo: '',
    category: '',
    startDate: null as Date | null,
    dueDate: null as Date | null,
    estimatedTime: ''
  };

  newCost = {
    user: '',
    cost: 0,
    description: '',
    category: ''
  };

  bulkStartDate: Date | null = null;
  paginatorRows = 10;

  // Timesheet properties
  currentTimesheetWeek: Date = new Date();
  timesheetEntries: TimesheetEntry[] = [];
  currentUserRole: UserRole = {
    type: 'staff',
    permissions: {
      canLogTime: true,
      canEditOwnTimesheet: true,
      canEditOthersTimesheet: false,
      canApproveTimesheet: false,
      canViewAllTimesheets: false,
      canGenerateReports: false
    }
  };
  showTimeEntryModal: boolean = false;
  selectedTimesheetDate: Date | null = null;
  selectedTimeSlot: string | null = null;
  isCalendarView: boolean = false; // Default to list view for better data display
  isEditingTimeEntry: boolean = false;
  editingTimeEntryId: string | null = null;
  
  // Resize functionality
  isResizing: boolean = false;
  resizingEntry: TimesheetEntry | null = null;
  resizeHandle: 'top' | 'bottom' | null = null;
  resizeStartY: number = 0;
  resizeStartTime: number = 0;
  resizeStartDuration: number = 0;

  // Dropdown options
  workTypeOptions = [
    { label: 'Preventive', value: 'preventive' },
    { label: 'Corrective', value: 'corrective' },
    { label: 'Inspection', value: 'inspection' },
    { label: 'Manufacturing Order', value: 'manufacturing-order' },
    { label: 'Project', value: 'project' }
  ];

  formPriorityOptions = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
    { label: 'None', value: 'none' }
  ];

  locationOptions = [
    { label: 'General', value: 'General' },
    { label: 'Building A', value: 'Building A' },
    { label: 'Warehouse', value: 'Warehouse' }
  ];

  assetOptions = [
    { label: 'Test', value: 'Test' },
    { label: 'HVAC Unit 1', value: 'HVAC Unit 1' },
    { label: 'Equipment A', value: 'Equipment A' }
  ];

  assignedToOptions = [
    { label: 'Jun Ren', value: 'Jun Ren' },
    { label: 'Sarah Johnson', value: 'Sarah Johnson' },
    { label: 'Mike Wilson', value: 'Mike Wilson' },
    { label: 'Tom Anderson', value: 'Tom Anderson' }
  ];

  categoryOptions = [
    { label: 'Electrical', value: 'Electrical' },
    { label: 'HVAC', value: 'HVAC' },
    { label: 'Inspection', value: 'Inspection' },
    { label: 'Quality Control', value: 'Quality Control' }
  ];

  // Mock data for work orders
  allWorkOrders: WorkOrder[] = [
    {
      id: 1,
      title: '000866 - Blue Dragon Basket Line',
      status: 'open',
      priority: 'high',
      requestedBy: 'Jun Ren',
      assignedTo: 'Jun Ren',
      dueDate: new Date('2025-06-27'),
      startDate: undefined,
      isOverdue: false,
      isUnread: true,
      description: 'High priority Project 000866',
      location: 'General',
      category: 'Electrical',
      estimatedTime: '1h',
      workType: 'preventive',
      createdAt: new Date('2025-06-20'),
      asset: 'Test',
      createdBy: 'Jun Ren',
      updatedOn: new Date('2025-06-26'),
      subWorkOrders: [
        {
          id: 101,
          title: 'Machine 1',
          status: 'open',
          priority: 'medium',
          requestedBy: 'Jun Ren',
          assignedTo: 'Sarah Johnson',
          dueDate: new Date('2025-06-26'),
          startDate: new Date('2025-06-25'),
          isOverdue: false,
          isUnread: false,
          description: 'Manufacture Machine 1',
          location: 'General',
          category: 'Inspection',
          estimatedTime: '30min',
          workType: 'inspection',
          createdAt: new Date('2025-06-20'),
          asset: 'Test',
          createdBy: 'Jun Ren',
          updatedOn: new Date('2025-06-25'),
          parentId: 1
        },
        {
          id: 102,
          title: 'Machine 2',
          status: 'open',
          priority: 'high',
          requestedBy: 'Jun Ren',
          assignedTo: 'Jun Ren',
          dueDate: new Date('2025-06-27'),
          startDate: undefined,
          isOverdue: false,
          isUnread: true,
          description: 'Manufacture Machine 2',
          location: 'General',
          category: 'Electrical',
          estimatedTime: '45min',
          workType: 'preventive',
          createdAt: new Date('2025-06-20'),
          asset: 'Test',
          createdBy: 'Jun Ren',
          updatedOn: new Date('2025-06-26'),
          parentId: 1,
          subWorkOrders: [
            {
              id: 1021,
              title: 'Manufacture part 1 for Machine 2',
              status: 'open',
              priority: 'medium',
              requestedBy: 'Jun Ren',
              assignedTo: 'Mike Wilson',
              dueDate: new Date('2025-06-27'),
              startDate: new Date('2025-06-26'),
              isOverdue: false,
              isUnread: false,
              description: 'sub task for Manufacturing Machine 2',
              location: 'General',
              category: 'Electrical',
              estimatedTime: '15min',
              workType: 'inspection',
              createdAt: new Date('2025-06-20'),
              asset: 'Test',
              createdBy: 'Jun Ren',
              updatedOn: new Date('2025-06-26'),
              parentId: 102
            },
            {
              id: 1022,
              title: 'Manufacture part 2 for Machine 2',
              status: 'open',
              priority: 'medium',
              requestedBy: 'Jun Ren',
              assignedTo: 'Mike Wilson',
              dueDate: new Date('2025-06-27'),
              startDate: new Date('2025-06-26'),
              isOverdue: false,
              isUnread: false,
              description: 'sub task for Manufacturing Machine 2',
              location: 'General',
              category: 'Electrical',
              estimatedTime: '15min',
              workType: 'inspection',
              createdAt: new Date('2025-06-20'),
              asset: 'Test',
              createdBy: 'Jun Ren',
              updatedOn: new Date('2025-06-26'),
              parentId: 102
            }
          ]
        },
        {
          id: 103,
          title: 'Machine 3',
          status: 'open',
          priority: 'low',
          requestedBy: 'Jun Ren',
          assignedTo: 'Tom Anderson',
          dueDate: new Date('2025-06-28'),
          startDate: undefined,
          isOverdue: false,
          isUnread: false,
          description: 'Manufacture Machine 3',
          location: 'General',
          category: 'Quality Control',
          estimatedTime: '20min',
          workType: 'inspection',
          createdAt: new Date('2025-06-20'),
          asset: 'Test',
          createdBy: 'Jun Ren',
          updatedOn: new Date('2025-06-26'),
          parentId: 1
        }
      ]
    },
    {
      id: 2,
      title: '000703 Nirvana Door Line',
      status: 'complete',
      priority: 'medium',
      requestedBy: 'Sarah Johnson',
      assignedTo: 'Mike Wilson',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      startDate: new Date(), // Today
      isOverdue: false,
      isUnread: false,
      description: 'Complete HVAC system quarterly maintenance',
      location: 'Building A',
      category: 'HVAC',
      estimatedTime: '4h',
      workType: 'preventive',
      createdAt: new Date('2025-06-28'),
      asset: 'HVAC Unit 1',
      createdBy: 'Sarah Johnson',
      updatedOn: new Date(),
      subWorkOrders: [
        {
          id: 201,
          title: 'Filter replacement',
          status: 'complete',
          priority: 'high',
          requestedBy: 'Sarah Johnson',
          assignedTo: 'Mike Wilson',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
          startDate: new Date(), // Today
          isOverdue: false,
          isUnread: false,
          description: 'Replace air filters',
          location: 'Building A',
          category: 'HVAC',
          estimatedTime: '1h',
          workType: 'preventive',
          createdAt: new Date('2025-06-28'),
          completedAt: new Date(),
          asset: 'HVAC Unit 1',
          createdBy: 'Sarah Johnson',
          updatedOn: new Date(),
          parentId: 2
        },
        {
          id: 202,
          title: 'System diagnostics',
          status: 'in-progress',
          priority: 'medium',
          requestedBy: 'Sarah Johnson',
          assignedTo: 'Mike Wilson',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
          isOverdue: false,
          isUnread: false,
          description: 'Run comprehensive system diagnostics',
          location: 'Building A',
          category: 'HVAC',
          estimatedTime: '2h',
          workType: 'inspection',
          createdAt: new Date('2025-06-28'),
          asset: 'HVAC Unit 1',
          createdBy: 'Sarah Johnson',
          updatedOn: new Date(),
          parentId: 2
        }
      ]
    },
    // Add some completed work orders for the Done tab
    {
      id: 3,
      title: '000670 Toucan Wire Grate',
      status: 'complete',
      priority: 'high',
      requestedBy: 'Safety Officer',
      assignedTo: 'Tom Anderson',
      dueDate: new Date('2025-06-20'),
      startDate: new Date('2025-06-15'),
      isOverdue: false,
      isUnread: false,
      description: 'Annual safety inspection of all equipment completed successfully',
      location: 'Warehouse',
      category: 'Inspection',
      estimatedTime: '3h',
      workType: 'inspection',
      createdAt: new Date('2025-06-10'),
      completedAt: new Date('2025-06-20'),
      asset: 'Equipment A',
      createdBy: 'Safety Officer',
      updatedOn: new Date('2025-06-20')
    },
    {
      id: 4,
      title: '000877 - Yellow Dinosaur Basket Line',
      status: 'open',
      priority: 'high',
      requestedBy: 'Jun Ren',
      assignedTo: 'Jun Ren',
      dueDate: new Date('2025-06-27'),
      startDate: undefined,
      isOverdue: false,
      isUnread: true,
      description: 'High priority Project 000877',
      location: 'General',
      category: 'Electrical',
      estimatedTime: '1h',
      workType: 'preventive',
      createdAt: new Date('2025-06-20'),
      asset: 'Test',
      createdBy: 'Jun Ren',
      updatedOn: new Date('2025-06-26'),
      subWorkOrders: [
        {
          id: 401,
          title: 'Machine 1',
          status: 'open',
          priority: 'medium',
          requestedBy: 'Jun Ren',
          assignedTo: 'Sarah Johnson',
          dueDate: new Date('2025-06-26'),
          startDate: new Date('2025-06-25'),
          isOverdue: false,
          isUnread: false,
          description: 'Manufacture Machine 1',
          location: 'General',
          category: 'Inspection',
          estimatedTime: '30min',
          workType: 'inspection',
          createdAt: new Date('2025-06-20'),
          asset: 'Test',
          createdBy: 'Jun Ren',
          updatedOn: new Date('2025-06-25'),
          parentId: 1
        },
        {
          id: 402,
          title: 'Machine 2',
          status: 'open',
          priority: 'high',
          requestedBy: 'Jun Ren',
          assignedTo: 'Jun Ren',
          dueDate: new Date('2025-06-27'),
          startDate: undefined,
          isOverdue: false,
          isUnread: true,
          description: 'Manufacture Machine 2',
          location: 'General',
          category: 'Electrical',
          estimatedTime: '45min',
          workType: 'preventive',
          createdAt: new Date('2025-06-20'),
          asset: 'Test',
          createdBy: 'Jun Ren',
          updatedOn: new Date('2025-06-26'),
          parentId: 1,
          subWorkOrders: [
            {
              id: 4021,
              title: 'Manufacture part 1 for Machine 2',
              status: 'open',
              priority: 'medium',
              requestedBy: 'Jun Ren',
              assignedTo: 'Mike Wilson',
              dueDate: new Date('2025-06-27'),
              startDate: new Date('2025-06-26'),
              isOverdue: false,
              isUnread: false,
              description: 'sub task for Manufacturing Machine 2',
              location: 'General',
              category: 'Electrical',
              estimatedTime: '15min',
              workType: 'inspection',
              createdAt: new Date('2025-06-20'),
              asset: 'Test',
              createdBy: 'Jun Ren',
              updatedOn: new Date('2025-06-26'),
              parentId: 102
            },
            {
              id: 4022,
              title: 'Manufacture part 2 for Machine 2',
              status: 'open',
              priority: 'medium',
              requestedBy: 'Jun Ren',
              assignedTo: 'Mike Wilson',
              dueDate: new Date('2025-06-27'),
              startDate: new Date('2025-06-26'),
              isOverdue: false,
              isUnread: false,
              description: 'sub task for Manufacturing Machine 2',
              location: 'General',
              category: 'Electrical',
              estimatedTime: '15min',
              workType: 'inspection',
              createdAt: new Date('2025-06-20'),
              asset: 'Test',
              createdBy: 'Jun Ren',
              updatedOn: new Date('2025-06-26'),
              parentId: 102
            }
          ]
        },
        {
          id: 403,
          title: 'Machine 3',
          status: 'open',
          priority: 'low',
          requestedBy: 'Jun Ren',
          assignedTo: 'Tom Anderson',
          dueDate: new Date('2025-06-28'),
          startDate: undefined,
          isOverdue: false,
          isUnread: false,
          description: 'Manufacture Machine 3',
          location: 'General',
          category: 'Quality Control',
          estimatedTime: '20min',
          workType: 'inspection',
          createdAt: new Date('2025-06-20'),
          asset: 'Test',
          createdBy: 'Jun Ren',
          updatedOn: new Date('2025-06-26'),
          parentId: 1
        }
      ]
    }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initializeWorkOrders();
    this.initializeWorkloadData();
    this.initializeSampleTimesheetEntries();
    this.initializeSampleReleases();
    this.initializeSampleECNs();

    // Ensure calendar view has proper data
    console.log('Component initialized - Timesheet entries:', this.timesheetEntries.length);
  }

  private initializeWorkOrders() {
    // Add all sub-workorders to the main array for easier searching
    this.addSubWorkOrdersToArray(this.allWorkOrders.filter(wo => !wo.parentId));
  }

  private addSubWorkOrdersToArray(workOrders: WorkOrder[]) {
    workOrders.forEach(workOrder => {
      if (workOrder.subWorkOrders && workOrder.subWorkOrders.length > 0) {
        this.allWorkOrders.push(...workOrder.subWorkOrders);
        this.addSubWorkOrdersToArray(workOrder.subWorkOrders);
      }
    });
  }

  // Sub-workorders navigation methods
  getTotalSubWorkOrdersCount(workOrder: WorkOrder): number {
    let total = workOrder.subWorkOrders ? workOrder.subWorkOrders.length : 0;
    if (workOrder.subWorkOrders) {
      workOrder.subWorkOrders.forEach(subWorkOrder => {
        total += this.getTotalSubWorkOrdersCount(subWorkOrder);
      });
    }
    return total;
  }

  // View mode methods
  toggleViewDropdown() {
    this.showViewDropdown = !this.showViewDropdown;
  }

  closeViewDropdown() {
    this.showViewDropdown = false;
  }

  selectViewMode(mode: string) {
    this.currentViewMode = mode;
    this.showViewDropdown = false;
  }

  // Search functionality
  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    console.log('Search term changed:', this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
  }



  get filteredWorkOrders(): WorkOrder[] {
    let workOrders: WorkOrder[];
    
    if (this.currentView === 'sub-workorders' && this.parentWorkOrder) {
      workOrders = this.parentWorkOrder.subWorkOrders || [];
    } else {
      // Only show top-level work orders (no parentId) in the main list
      workOrders = this.allWorkOrders.filter(workOrder => !workOrder.parentId);
    }

    // Apply search filter if search term exists
    if (this.searchTerm && this.searchTerm.trim().length > 0) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      workOrders = workOrders.filter(workOrder => {
        return (
          // Search in title (e.g., "000866 - Blue Dragon Basket Line")
          workOrder.title.toLowerCase().includes(searchLower) ||
          // Search in ID (e.g., "1" matches ID 1)
          workOrder.id.toString().includes(searchLower) ||
          // Search in description
          workOrder.description.toLowerCase().includes(searchLower) ||
          // Search in assigned person
          workOrder.assignedTo.toLowerCase().includes(searchLower) ||
          // Search in requested by
          workOrder.requestedBy.toLowerCase().includes(searchLower) ||
          // Search in location
          workOrder.location.toLowerCase().includes(searchLower) ||
          // Search in category
          workOrder.category.toLowerCase().includes(searchLower) ||
          // Search in status
          workOrder.status.toLowerCase().includes(searchLower)
        );
      });
    }

    console.log('Filtered Work Orders:', {
      searchTerm: this.searchTerm,
      originalCount: this.currentView === 'sub-workorders' ? 
        (this.parentWorkOrder?.subWorkOrders?.length || 0) : 
        this.allWorkOrders.filter(wo => !wo.parentId).length,
      filteredCount: workOrders.length,
      workOrders: workOrders.map(wo => ({ id: wo.id, title: wo.title, status: wo.status }))
    });

    return workOrders;
  }

  get selectedWorkOrder(): WorkOrder | undefined {
    return this.allWorkOrders.find(workOrder => workOrder.id === this.selectedWorkOrderId);
  }

  // Bulk operations methods
  clearBulkSelection() {
    this.selectedWorkOrderIds.clear();
    this.showBulkActions = false;
    this.bulkSelectionMode = false;
  }

  // Alias for template compatibility
  clearSelection() {
    this.clearBulkSelection();
  }

  // Utility methods
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'open': return '🔓';
      case 'in-progress': return '🔄';
      case 'on-hold': return '⏸️';
      case 'complete': return '✅';
      default: return '📋';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  getStatusBadgeClass(status: string): string {
    return `status-${status}`;
  }

  isStartDateMissing(workOrder: WorkOrder): boolean {
    return !workOrder.startDate;
  }

  validateStartDate(workOrder: WorkOrder): string | null {
    if (!workOrder.startDate && workOrder.dueDate) {
      return 'Start date should be set when due date is specified';
    }
    return null;
  }

  formatStartDate(startDate: Date): string {
    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  }

  getStartDateStatus(workOrder: WorkOrder): string {
    if (!workOrder.startDate) return '';

    const today = new Date();
    const diffTime = workOrder.startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'past';
    if (diffDays === 0) return 'today';
    return 'future';
  }

  formatDueDate(dueDate: Date): string {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays > 1) return `Due in ${diffDays} days`;
    return `Overdue by ${Math.abs(diffDays)} days`;
  }

  // Selection methods
  selectWorkOrder(id: number) {
    this.selectedWorkOrderId = id;
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  // Modal methods
  openNewWorkOrderModal() {
    this.showNewWorkOrderModal = true;
  }

  closeNewWorkOrderModal() {
    this.showNewWorkOrderModal = false;
    this.resetNewWorkOrderForm();
  }

  closeWorkOrderDialog() {
    this.showWorkOrderDialog = false;
    this.selectedWorkOrderForDialog = null;
  }

  openAddCostModal() {
    this.showAddCostModal = true;
  }

  closeAddCostModal() {
    this.showAddCostModal = false;
    this.resetNewCostForm();
  }

  openBulkStartDateModal() {
    this.showBulkStartDateModal = true;
  }

  closeBulkStartDateModal() {
    this.showBulkStartDateModal = false;
    this.bulkStartDate = null;
  }

  openCreateSubWorkOrderModal() {
    this.showCreateSubWorkOrderModal = true;
    this.resetNewSubWorkOrderForm();
  }

  openCreateSubWorkOrderModalForParent(parentWorkOrder: WorkOrder) {
    this.parentWorkOrder = parentWorkOrder;
    this.showCreateSubWorkOrderModal = true;
    this.resetNewSubWorkOrderForm();
  }

  // Form methods
  createWorkOrder() {
    // Implementation for creating new work order
    console.log('Creating work order:', this.newWorkOrder);
    this.closeNewWorkOrderModal();
  }

  addCost() {
    // Implementation for adding cost
    console.log('Adding cost:', this.newCost);
    this.closeAddCostModal();
  }

  setBulkStartDate() {
    // Implementation for setting bulk start date
    console.log('Setting bulk start date:', this.bulkStartDate);
    this.closeBulkStartDateModal();
  }



  private resetNewWorkOrderForm() {
    this.newWorkOrder = {
      title: '',
      workType: '',
      priority: '',
      description: '',
      location: '',
      asset: '',
      assignedTo: '',
      category: '',
      startDate: null,
      dueDate: null,
      estimatedTime: ''
    };
  }

  private resetNewCostForm() {
    this.newCost = {
      user: '',
      cost: 0,
      description: '',
      category: ''
    };
  }

  // Table view methods
  onWorkOrderRowClick(workOrder: WorkOrder) {
    this.selectedWorkOrderForDialog = workOrder;
    this.showWorkOrderDialog = true;
  }

  onPageChange(event: any) {
    // Handle pagination
    console.log('Page change:', event);
  }

  // Placeholder methods for template compatibility
  toggleSortDropdown() {
    this.showSortDropdown = !this.showSortDropdown;
  }

  closeSortDropdown() {
    this.showSortDropdown = false;
  }

  selectSortOption(value: string, label: string) {
    this.currentSortOption = { value, label };
    this.closeSortDropdown();
  }

  toggleUnreadFirst() {
    this.unreadFirstEnabled = !this.unreadFirstEnabled;
  }

  togglePriorityExpanded() {
    this.priorityExpanded = !this.priorityExpanded;
  }

  // Work order grouping methods
  get todoGroups(): WorkOrderGroup[] {
    const todoWorkOrders = this.filteredWorkOrders.filter(wo => wo.status !== 'complete');

    if (todoWorkOrders.length === 0) {
      return [];
    }

    // Group by status
    const groups: WorkOrderGroup[] = [];

    // Open work orders
    const openWorkOrders = todoWorkOrders.filter(wo => wo.status === 'open');
    if (openWorkOrders.length > 0) {
      groups.push({
        title: 'Open',
        count: openWorkOrders.length,
        workOrders: openWorkOrders,
        expanded: true
      });
    }

    // In-progress work orders
    const inProgressWorkOrders = todoWorkOrders.filter(wo => wo.status === 'in-progress');
    if (inProgressWorkOrders.length > 0) {
      groups.push({
        title: 'In Progress',
        count: inProgressWorkOrders.length,
        workOrders: inProgressWorkOrders,
        expanded: true
      });
    }

    // On-hold work orders
    const onHoldWorkOrders = todoWorkOrders.filter(wo => wo.status === 'on-hold');
    if (onHoldWorkOrders.length > 0) {
      groups.push({
        title: 'On Hold',
        count: onHoldWorkOrders.length,
        workOrders: onHoldWorkOrders,
        expanded: true
      });
    }

    return groups;
  }

  get doneGroups(): WorkOrderGroup[] {
    const filtered = this.filteredWorkOrders;
    const doneWorkOrders = filtered.filter(wo => wo.status === 'complete');

    // Debug logging
    console.log('Done Groups Debug:', {
      currentView: this.currentView,
      parentWorkOrder: this.parentWorkOrder?.title,
      filteredCount: filtered.length,
      doneCount: doneWorkOrders.length,
      filtered: filtered.map(wo => ({ id: wo.id, title: wo.title, status: wo.status })),
      done: doneWorkOrders.map(wo => ({ id: wo.id, title: wo.title, status: wo.status }))
    });

    if (doneWorkOrders.length === 0) {
      return [];
    }

    return [{
      title: 'Completed',
      count: doneWorkOrders.length,
      workOrders: doneWorkOrders,
      expanded: true
    }];
  }

  get hasTodoWorkOrders(): boolean {
    return this.filteredWorkOrders.some(wo => wo.status !== 'complete');
  }

  get hasDoneWorkOrders(): boolean {
    return this.filteredWorkOrders.some(wo => wo.status === 'complete');
  }

  get totalTodoWorkOrders(): number {
    return this.filteredWorkOrders.filter(wo => wo.status !== 'complete').length;
  }

  get totalDoneWorkOrders(): number {
    return this.filteredWorkOrders.filter(wo => wo.status === 'complete').length;
  }

  toggleGroupExpansion(group: WorkOrderGroup) {
    group.expanded = !group.expanded;
  }

  // Mode switching methods
  switchToCommentsMode() {
    this.isDefaultMode = false;
    this.isCommentsMode = true;
    this.isEditMode = false;
    this.isPartsMode = false;
    this.isCostsMode = false;
    this.isTimesheetMode = false;
  }

  switchToEditMode() {
    this.isDefaultMode = false;
    this.isCommentsMode = false;
    this.isEditMode = true;
    this.isPartsMode = false;
    this.isCostsMode = false;
    this.isTimesheetMode = false;
  }

  switchToPartsMode() {
    this.isDefaultMode = false;
    this.isCommentsMode = false;
    this.isEditMode = false;
    this.isPartsMode = true;
    this.isCostsMode = false;
    this.isTimesheetMode = false;
  }

  switchToCostsMode() {
    this.isDefaultMode = false;
    this.isCommentsMode = false;
    this.isEditMode = false;
    this.isPartsMode = false;
    this.isCostsMode = true;
    this.isTimesheetMode = false;
  }

  switchToTimesheetMode() {
    this.isDefaultMode = false;
    this.isCommentsMode = false;
    this.isEditMode = false;
    this.isPartsMode = false;
    this.isCostsMode = false;
    this.isTimesheetMode = true;
    this.loadTimesheetData();
  }

  goBackToDefault() {
    this.isDefaultMode = true;
    this.isCommentsMode = false;
    this.isEditMode = false;
    this.isPartsMode = false;
    this.isCostsMode = false;
    this.isTimesheetMode = false;
  }

  toggleActionsMenu() {
    this.showActionsMenu = !this.showActionsMenu;
  }

  closeActionsMenu() {
    this.showActionsMenu = false;
  }

  handleAction(action: string) {
    console.log('Handle action:', action);
    this.closeActionsMenu();
  }

  // Comments methods
  addComment() {
    if (this.newComment.trim()) {
      this.comments.push({
        id: Date.now(),
        author: 'Current User',
        avatar: 'CU',
        timestamp: new Date().toLocaleString(),
        message: this.newComment
      });
      this.newComment = '';
    }
  }

  // Form methods
  updateWorkOrder() {
    console.log('Update work order');
    this.goBackToDefault();
  }

  cancelPartsUpdate() {
    this.goBackToDefault();
  }

  updateParts() {
    console.log('Update parts');
    this.goBackToDefault();
  }

  // Filter methods
  toggleAssignedToFilter() { this.showAssignedToFilter = !this.showAssignedToFilter; }
  closeAssignedToFilter() { this.showAssignedToFilter = false; }
  toggleDueDateFilter() { this.showDueDateFilter = !this.showDueDateFilter; }
  closeDueDateFilter() { this.showDueDateFilter = false; }
  togglePriorityFilter() { this.showPriorityFilter = !this.showPriorityFilter; }
  closePriorityFilter() { this.showPriorityFilter = false; }
  toggleStartDateFilter() { this.showStartDateFilter = !this.showStartDateFilter; }
  closeStartDateFilter() { this.showStartDateFilter = false; }
  toggleAddFilterDialog() { this.showAddFilterDialog = !this.showAddFilterDialog; }
  closeAddFilterDialog() { this.showAddFilterDialog = false; }

  // Condition dropdown methods
  toggleAssignedToConditionDropdown() { this.showAssignedToConditionDropdown = !this.showAssignedToConditionDropdown; }
  toggleDueDateConditionDropdown() { this.showDueDateConditionDropdown = !this.showDueDateConditionDropdown; }
  togglePriorityConditionDropdown() { this.showPriorityConditionDropdown = !this.showPriorityConditionDropdown; }
  toggleStartDateConditionDropdown() { this.showStartDateConditionDropdown = !this.showStartDateConditionDropdown; }

  closeDueDateConditionDropdown() { this.showDueDateConditionDropdown = false; }
  closePriorityConditionDropdown() { this.showPriorityConditionDropdown = false; }
  closeStartDateConditionDropdown() { this.showStartDateConditionDropdown = false; }

  // Condition selection methods
  selectAssignedToCondition(condition: string) {
    this.assignedToCondition = condition;
    this.showAssignedToConditionDropdown = false;
  }

  selectDueDateCondition(condition: string) {
    this.dueDateCondition = condition;
    this.showDueDateConditionDropdown = false;
  }

  selectPriorityCondition(condition: string) {
    this.priorityCondition = condition;
    this.showPriorityConditionDropdown = false;
  }

  selectStartDateCondition(condition: string) {
    this.startDateCondition = condition;
    this.showStartDateConditionDropdown = false;
  }

  // Condition label methods
  getAssignedToConditionLabel(): string {
    return this.assignedToCondition === 'one-of' ? 'One of' : 'None of';
  }

  getDueDateConditionLabel(): string {
    return this.dueDateCondition === 'one-of' ? 'One of' : 'None of';
  }

  getPriorityConditionLabel(): string {
    return this.priorityCondition === 'one-of' ? 'One of' : 'None of';
  }

  getStartDateConditionLabel(): string {
    return this.startDateCondition === 'one-of' ? 'One of' : 'None of';
  }

  // Expansion methods
  toggleTeamsExpanded() { this.teamsExpanded = !this.teamsExpanded; }
  toggleUsersExpanded() { this.usersExpanded = !this.usersExpanded; }

  // Selection methods
  toggleTeamSelection(team: any) {
    team.selected = !team.selected;
  }

  toggleUserSelection(user: any) {
    user.selected = !user.selected;
  }

  togglePrioritySelection(priority: any) {
    priority.selected = !priority.selected;
  }

  togglePresetSelection(preset: any) {
    preset.selected = !preset.selected;
  }

  toggleStartDatePresetSelection(preset: any) {
    preset.selected = !preset.selected;
  }

  // Date mode switching methods
  switchToCustomDate() {
    this.dueDateMode = 'custom';
  }

  switchToPresets() {
    this.dueDateMode = 'presets';
  }

  switchToCustomStartDate() {
    this.startDateMode = 'custom';
  }

  switchToStartDatePresets() {
    this.startDateMode = 'presets';
  }

  // Date selection methods
  onDateSelect(event: any) {
    this.selectedDate = event;
  }

  onStartDateSelect(event: any) {
    this.selectedStartDate = event;
  }

  // Filter management
  addFilter(filterId: string) {
    if (!this.activeFilters.includes(filterId)) {
      this.activeFilters.push(filterId);
    }
    this.closeAddFilterDialog();
  }

  // Calendar methods (placeholder implementations)
  setCalendarViewMode(mode: string) { this.calendarViewMode = mode; }
  getCalendarTitle(): string { return 'September 2025'; }
  navigateCalendar(direction: string) { console.log('Navigate calendar:', direction); }
  getWorkOrderCalendarClass(workOrder: any): string { return 'calendar-work-order'; }
  openWorkOrderInCalendar(workOrder: any) { console.log('Open work order:', workOrder); }

  // Banner methods
  closeBanner() { this.showBanner = false; }

  // Additional placeholder methods
  reopenWorkOrder(id: number) { console.log('Reopen work order:', id); }

  // BOM Upload methods
  onBOMFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Mock BOM data for demonstration
      this.uploadedBOM = {
        bomName: file.name,
        items: [
          { id: 1, partNumber: 'PT001', partName: 'Steel Plate', quantity: 2, unitOfMeasure: 'pcs', isNewPart: false },
          { id: 2, partNumber: 'PT002', partName: 'Bolt M8x20', quantity: 8, unitOfMeasure: 'pcs', isNewPart: true },
          { id: 3, partNumber: 'PT003', partName: 'Washer 8mm', quantity: 8, unitOfMeasure: 'pcs', isNewPart: false }
        ]
      };
    }
  }

  getBOMSummary(): string {
    if (!this.uploadedBOM) return '';
    const totalItems = this.uploadedBOM.items.length;
    const newParts = this.uploadedBOM.items.filter((item: any) => item.isNewPart).length;
    return `${totalItems} items (${newParts} new parts)`;
  }

  toggleBOMPreview() {
    this.showBOMPreview = !this.showBOMPreview;
  }

  removeBOMUpload() {
    this.uploadedBOM = null;
    this.showBOMPreview = false;
  }

  // Workload calculation methods
  private initializeWorkloadData() {
    this.generateWorkloadWeekDays();
    this.generateWorkloadUsers();
    this.calculateWorkloadMetrics();
  }

  private generateWorkloadWeekDays() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

    this.workloadWeekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const isToday = this.isSameDay(date, today);

      this.workloadWeekDays.push({
        date: date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        scheduledHours: 0,
        capacityPercentage: 0,
        isToday: isToday,
        hasWork: false
      });
    }
  }

  private generateWorkloadUsers() {
    // Get unique assignees from work orders
    const uniqueAssignees = [...new Set(this.allWorkOrders.map(wo => wo.assignedTo))];

    this.workloadUsers = uniqueAssignees.map(assignee => {
      const userWorkOrders = this.allWorkOrders.filter(wo => wo.assignedTo === assignee);
      const weeklyCapacity = this.calculateUserWeeklyCapacity(assignee, userWorkOrders);

      return {
        id: assignee.toLowerCase().replace(/\s+/g, '-'),
        name: assignee,
        role: this.getUserRole(assignee),
        initials: this.getUserInitials(assignee),
        weeklyCapacity: weeklyCapacity,
        totalScheduledHours: weeklyCapacity.reduce((sum, day) => sum + day.scheduledHours, 0)
      };
    });
  }

  private calculateUserWeeklyCapacity(assignee: string, userWorkOrders: WorkOrder[]) {
    return this.workloadWeekDays.map(day => {
      // Find work orders for this user on this day
      const dayWorkOrders = userWorkOrders.filter(wo =>
        wo.startDate && this.isSameDay(wo.startDate, day.date)
      );

      const scheduledHours = dayWorkOrders.reduce((sum, wo) => {
        return sum + this.parseEstimatedTime(wo.estimatedTime);
      }, 0);

      const capacity = 8; // 8 hour work day
      const capacityPercentage = Math.min((scheduledHours / capacity) * 100, 100);

      return {
        date: day.date,
        scheduledHours: scheduledHours,
        capacity: capacity,
        capacityPercentage: capacityPercentage,
        workOrders: dayWorkOrders.map(wo => ({
          id: wo.id,
          title: wo.title,
          status: wo.status,
          estimatedTime: wo.estimatedTime,
          priority: wo.priority
        }))
      };
    });
  }

  private calculateWorkloadMetrics() {
    // Calculate total scheduled hours across all users
    this.totalScheduledHours = this.workloadUsers.reduce((sum, user) =>
      sum + user.totalScheduledHours, 0
    );

    // Calculate total capacity (8 hours per user per day for the week)
    this.totalCapacityHours = this.workloadUsers.length * 8 * 7;

    // Update weekly day totals
    this.workloadWeekDays.forEach((day, dayIndex) => {
      const dayTotal = this.workloadUsers.reduce((sum, user) =>
        sum + user.weeklyCapacity[dayIndex].scheduledHours, 0
      );
      day.scheduledHours = dayTotal;
      day.hasWork = dayTotal > 0;
      const capacity = this.workloadUsers.length * 8; // 8 hours per user
      day.capacityPercentage = capacity > 0 ? Math.min((dayTotal / capacity) * 100, 100) : 0;
    });

    // Calculate unscheduled work orders
    this.calculateUnscheduledCounts();
  }

  private calculateUnscheduledCounts() {
    const unscheduledWorkOrders = this.allWorkOrders.filter(wo =>
      wo.status !== 'complete' && (!wo.startDate || !this.isDateInCurrentWeek(wo.startDate))
    );

    const today = new Date();
    this.unscheduledCounts = {
      overdue: unscheduledWorkOrders.filter(wo =>
        wo.dueDate && wo.dueDate < today
      ).length,
      dueSoon: unscheduledWorkOrders.filter(wo => {
        if (!wo.dueDate) return false;
        const daysDiff = Math.ceil((wo.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff >= 0 && daysDiff <= 3;
      }).length,
      open: unscheduledWorkOrders.filter(wo => wo.status === 'open').length,
      onHold: unscheduledWorkOrders.filter(wo => wo.status === 'on-hold').length
    };
  }

  private parseEstimatedTime(estimatedTime: string): number {
    // Parse estimated time like "1h", "30min", "2.5h" into hours
    if (!estimatedTime) return 0;

    const time = estimatedTime.toLowerCase();
    if (time.includes('h')) {
      return parseFloat(time.replace('h', ''));
    } else if (time.includes('min')) {
      return parseFloat(time.replace('min', '')) / 60;
    }
    return 0;
  }

  private getUserRole(assignee: string): string {
    // Mock user roles - in real app this would come from user data
    const roles: {[key: string]: string} = {
      'Jun Ren': 'Maintenance Lead',
      'Sarah Johnson': 'HVAC Technician',
      'Mike Wilson': 'Electrical Technician',
      'Tom Anderson': 'Inspector'
    };
    return roles[assignee] || 'Technician';
  }

  private getUserInitials(name: string): string {
    return name.split(' ').map(part => part.charAt(0)).join('').toUpperCase();
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  private isDateInCurrentWeek(date: Date): boolean {
    return this.workloadWeekDays.some(day => this.isSameDay(date, day.date));
  }

  // Updated workload methods
  getCapacityPercentage(): number {
    if (this.totalCapacityHours === 0) return 0;
    return Math.round((this.totalScheduledHours / this.totalCapacityHours) * 100);
  }

  navigateWorkloadWeek(direction: string) {
    if (direction === 'prev') {
      this.currentWorkloadWeek.setDate(this.currentWorkloadWeek.getDate() - 7);
    } else {
      this.currentWorkloadWeek.setDate(this.currentWorkloadWeek.getDate() + 7);
    }
    this.initializeWorkloadData();
  }

  getWorkloadDateRange(): string {
    const startDate = this.workloadWeekDays[0]?.date;
    const endDate = this.workloadWeekDays[6]?.date;

    if (!startDate || !endDate) return 'Loading...';

    const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return `${startStr}-${endStr}`;
  }

  // Sub-Work Order Navigation Methods
  showSubWorkOrders(workOrder: WorkOrder) {
    console.log('showSubWorkOrders called with:', workOrder);
    console.log('Work order sub-work orders:', workOrder.subWorkOrders);

    // Prevent adding same work order multiple times to breadcrumbs
    const isAlreadyInBreadcrumbs = this.breadcrumbs.find(wo => wo.id === workOrder.id);
    if (!isAlreadyInBreadcrumbs) {
      this.breadcrumbs.push(workOrder);
      this.currentHierarchyLevel++;
    }

    this.parentWorkOrder = workOrder;
    this.currentView = 'sub-workorders';

    // If no sub-work orders exist, initialize empty array
    if (!workOrder.subWorkOrders) {
      workOrder.subWorkOrders = [];
    }

    console.log('Parent work order set:', this.parentWorkOrder);
    console.log('Current view set to:', this.currentView);
    console.log('Sub-work orders available:', this.parentWorkOrder.subWorkOrders);

    // Clear current selection and let user choose from the list
    this.selectedWorkOrderId = -1;

    // Clear bulk selection when switching views
    this.clearBulkSelection();

    // Force change detection to update the UI
    this.cdr.detectChanges();
  }

  selectSubWorkOrder(subWorkOrder: WorkOrder) {
    this.selectedWorkOrderId = subWorkOrder.id;
    // Don't change currentView - keep it as 'sub-workorders' so tabs continue to show sub-work orders
    this.clearBulkSelection();

    // Mark as read
    subWorkOrder.isUnread = false;
  }

  goBackToParent() {
    if (this.breadcrumbs.length > 0) {
      this.breadcrumbs.pop();
      this.currentHierarchyLevel--;

      if (this.breadcrumbs.length === 0) {
        // Back to main work orders view
        this.currentView = 'details';
        this.parentWorkOrder = null;
        // Restore the previously selected work order or clear selection
        if (this.allWorkOrders.length > 0) {
          this.selectWorkOrder(this.allWorkOrders[0].id);
        }
      } else {
        // Back to previous level in hierarchy
        this.parentWorkOrder = this.breadcrumbs[this.breadcrumbs.length - 1];
        this.currentView = 'sub-workorders';

        // Select the parent work order
        if (this.parentWorkOrder.subWorkOrders && this.parentWorkOrder.subWorkOrders.length > 0) {
          this.selectSubWorkOrder(this.parentWorkOrder.subWorkOrders[0]);
        }
      }
    }
  }

  navigateToWorkOrder(workOrder: WorkOrder) {
    // Navigate to a specific work order in the breadcrumb
    const index = this.breadcrumbs.findIndex(wo => wo.id === workOrder.id);
    if (index !== -1) {
      // Remove all breadcrumbs after this one
      this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
      this.currentHierarchyLevel = this.breadcrumbs.length;

      if (index === 0) {
        // Navigate to the first level
        this.parentWorkOrder = workOrder;
        this.currentView = 'sub-workorders';
      } else {
        // Navigate to intermediate level
        this.parentWorkOrder = workOrder;
        this.currentView = 'sub-workorders';
      }

      // Select first sub-work order if available
      if (workOrder.subWorkOrders && workOrder.subWorkOrders.length > 0) {
        this.selectSubWorkOrder(workOrder.subWorkOrders[0]);
      }
    }
  }

  getSubWorkOrdersCount(workOrder: WorkOrder): number {
    return workOrder.subWorkOrders ? workOrder.subWorkOrders.length : 0;
  }

  closeCreateSubWorkOrderModal() {
    this.showCreateSubWorkOrderModal = false;
    this.resetNewSubWorkOrderForm();
  }

  createSubWorkOrder() {
    if (!this.newSubWorkOrder.title.trim() || !this.parentWorkOrder) {
      return;
    }

    const newSubWorkOrder: WorkOrder = {
      id: Math.max(...this.allWorkOrders.map(wo => wo.id)) + 1,
      title: this.newSubWorkOrder.title,
      status: 'open',
      priority: this.newSubWorkOrder.priority as any || 'none',
      requestedBy: 'Current User', // This should come from auth service
      assignedTo: this.newSubWorkOrder.assignedTo || '',
      dueDate: this.newSubWorkOrder.dueDate || undefined,
      startDate: this.newSubWorkOrder.startDate || undefined,
      isOverdue: false,
      isUnread: true,
      description: this.newSubWorkOrder.description || '',
      location: this.parentWorkOrder.location, // Inherit from parent
      category: this.newSubWorkOrder.category || this.parentWorkOrder.category, // Inherit or use selected
      estimatedTime: this.newSubWorkOrder.estimatedTime || '1h',
      workType: this.newSubWorkOrder.workType as any || 'corrective',
      createdAt: new Date(),
      createdBy: 'Current User', // This should come from auth service
      updatedOn: new Date(),
      asset: this.parentWorkOrder.asset, // Inherit from parent
      parentId: this.parentWorkOrder.id,
      subWorkOrders: []
    };

    // Add to parent's sub-work orders
    if (!this.parentWorkOrder.subWorkOrders) {
      this.parentWorkOrder.subWorkOrders = [];
    }
    this.parentWorkOrder.subWorkOrders.push(newSubWorkOrder);

    // Add to main work orders list for easy access
    this.allWorkOrders.push(newSubWorkOrder);

    // Groups will be updated automatically via getter methods

    // Select the new sub-work order
    this.selectSubWorkOrder(newSubWorkOrder);

    // Close modal
    this.closeCreateSubWorkOrderModal();
  }

  private resetNewSubWorkOrderForm() {
    this.newSubWorkOrder = {
      title: '',
      workType: '',
      priority: '',
      description: '',
      assignedTo: '',
      category: '',
      startDate: null,
      dueDate: null,
      estimatedTime: ''
    };
  }

  // Helper method to find a work order by ID (including sub-work orders)
  findWorkOrderById(id: number): WorkOrder | null {
    for (const workOrder of this.allWorkOrders) {
      if (workOrder.id === id) {
        return workOrder;
      }
      if (workOrder.subWorkOrders) {
        const found = this.findInSubWorkOrders(workOrder.subWorkOrders, id);
        if (found) return found;
      }
    }
    return null;
  }

  private findInSubWorkOrders(subWorkOrders: WorkOrder[], id: number): WorkOrder | null {
    for (const subWorkOrder of subWorkOrders) {
      if (subWorkOrder.id === id) {
        return subWorkOrder;
      }
      if (subWorkOrder.subWorkOrders) {
        const found = this.findInSubWorkOrders(subWorkOrder.subWorkOrders, id);
        if (found) return found;
      }
    }
    return null;
  }

  // Enhanced method to get parent work order path
  getWorkOrderPath(workOrder: WorkOrder): WorkOrder[] {
    const path: WorkOrder[] = [];
    let current = workOrder;

    while (current.parentId) {
      const parent = this.findWorkOrderById(current.parentId);
      if (parent) {
        path.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }

    return path;
  }

  // Method to get all descendant work orders (for analytics/reporting)
  getAllDescendants(workOrder: WorkOrder): WorkOrder[] {
    const descendants: WorkOrder[] = [];

    if (workOrder.subWorkOrders) {
      for (const subWorkOrder of workOrder.subWorkOrders) {
        descendants.push(subWorkOrder);
        descendants.push(...this.getAllDescendants(subWorkOrder));
      }
    }

    return descendants;
  }

  // Get hierarchy level for styling purposes
  getHierarchyLevel(workOrder: WorkOrder): number {
    let level = 0;
    let current = workOrder;

    while (current.parentId) {
      level++;
      const parent = this.findWorkOrderById(current.parentId);
      if (parent) {
        current = parent;
      } else {
        break;
      }
    }

    return level;
  }

  // Timesheet Methods
  loadTimesheetData() {
    if (!this.selectedWorkOrder) return;

    const weekStart = this.getWeekStart(this.currentTimesheetWeek);
    this.timesheetEntries = this.getSampleTimesheetData(this.selectedWorkOrder.id, weekStart);

    console.log(`Loaded timesheet data for workOrder ${this.selectedWorkOrder.id}: ${this.timesheetEntries.length} entries`);
  }

  getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    // Adjust so Monday is day 0, Sunday is day 6
    const mondayDay = day === 0 ? 6 : day - 1;
    const diff = d.getDate() - mondayDay;
    return new Date(d.setDate(diff));
  }

  getWeekEnd(weekStart: Date): Date {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  }

  getTimesheetWeek(): TimesheetWeek {
    const weekStart = this.getWeekStart(this.currentTimesheetWeek);
    const weekEnd = this.getWeekEnd(weekStart);
    const days: TimesheetDay[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);

      const dayEntries = this.timesheetEntries.filter(entry =>
        this.isSameDay(entry.date, date)
      );

      const totalHours = dayEntries.reduce((total, entry) => total + (entry.duration / 60), 0);

      days.push({
        date: date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        entries: dayEntries,
        totalHours: totalHours,
        targetHours: this.isWeekend(date) ? 0 : 8
      });
    }

    const totalHours = days.reduce((total, day) => total + day.totalHours, 0);

    // Debug logging for calendar view
    if (this.isCalendarView) {
      console.log('Timesheet Week Debug:', {
        weekStart,
        weekEnd,
        totalEntries: this.timesheetEntries.length,
        days: days.map(day => ({
          dayName: day.dayName,
          date: day.date,
          entriesCount: day.entries.length,
          totalHours: day.totalHours
        }))
      });
    }

    return {
      weekStart,
      weekEnd,
      days,
      totalHours
    };
  }

  /**
   * Cached timesheet week data to prevent Angular change detection issues.
   * 
   * Angular's change detection can call getter methods multiple times during a single
   * detection cycle. If getSafeTimesheetWeek() returns different values on each call,
   * it triggers ExpressionChangedAfterItHasBeenCheckedError.
   * 
   * This cache ensures consistent data throughout a single change detection cycle.
   */
  private _cachedTimesheetWeek: TimesheetWeek | null = null;

  /**
   * Clears the cached timesheet week data.
   * 
   * CRITICAL: This method must be called whenever:
   * 1. The week navigation changes (navigateTimesheetWeek)
   * 2. Timesheet entries are modified (initializeSampleTimesheetEntries)
   * 3. Switching to calendar view (setTimesheetView)
   * 4. Any other operation that changes the underlying timesheet data
   * 
   * Why this is needed:
   * - Without clearing the cache, stale data would be displayed after changes
   * - The template bindings like [style.grid-column]="i + 2" depend on fresh data
   * - Prevents visual inconsistencies between the data and the UI
   */
  private clearTimesheetWeekCache(): void {
    this._cachedTimesheetWeek = null;
  }

  /**
   * Safe getter for timesheet week data with caching to prevent change detection errors.
   * 
   * This method is called multiple times by Angular during template rendering:
   * - Once for each day header: getSafeTimesheetWeek().days
   * - Once for each day column in the grid
   * - Potentially more times during change detection cycles
   * 
   * Without caching, each call could return different data (especially during initialization),
   * causing ExpressionChangedAfterItHasBeenCheckedError when template bindings like
   * [style.grid-column]="i + 2" change between detection cycles.
   * 
   * The cache ensures all calls within a single change detection cycle return identical data.
   */
  getSafeTimesheetWeek(): TimesheetWeek {
    // Return cached version if available - this prevents multiple calculations
    // during the same change detection cycle
    if (this._cachedTimesheetWeek) {
      return this._cachedTimesheetWeek;
    }

    try {
      const week = this.getTimesheetWeek();
      // Cache the result for subsequent calls in this change detection cycle
      this._cachedTimesheetWeek = week;
      return week;
    } catch (error) {
      console.error('Error getting timesheet week:', error);
      // Return empty week structure as fallback
      const today = new Date();
      const weekStart = this.getWeekStart(today);
      const weekEnd = this.getWeekEnd(weekStart);

      const emptyWeek = {
        weekStart,
        weekEnd,
        days: [], // Empty days array prevents undefined grid-column values
        totalHours: 0
      };
      
      // Cache the empty week to ensure consistency
      this._cachedTimesheetWeek = emptyWeek;
      return emptyWeek;
    }
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }



  navigateTimesheetWeek(direction: 'prev' | 'next') {
    const currentWeek = new Date(this.currentTimesheetWeek);
    if (direction === 'prev') {
      currentWeek.setDate(currentWeek.getDate() - 7);
    } else {
      currentWeek.setDate(currentWeek.getDate() + 7);
    }
    this.currentTimesheetWeek = currentWeek;
    // CRITICAL: Clear cache because the week has changed - the days array will be different
    // Without this, the old week's data would still be cached and displayed
    this.clearTimesheetWeekCache();
    this.loadTimesheetData();
  }

  openTimeEntryModal(date: Date) {
    if (!this.currentUserRole.permissions.canLogTime) return;

    this.selectedTimesheetDate = date;
    this.newTimeEntry = {
      startTime: '09:00',
      duration: 0,
      description: ''
    };
    this.showTimeEntryModal = true;
  }

  closeTimeEntryModal() {
    this.showTimeEntryModal = false;
    this.selectedTimesheetDate = null;
    this.selectedTimeSlot = null;
    this.isEditingTimeEntry = false;
    this.editingTimeEntryId = null;
  }

  openEditTimeEntryModal(entry: TimesheetEntry) {
    this.selectedTimesheetDate = entry.date;
    // Set the selected work order ID to match the entry's work order
    this.selectedWorkOrderId = entry.workOrderId;
    this.isEditingTimeEntry = true;
    this.editingTimeEntryId = entry.id;
    
    // Pre-populate the form with existing entry data
    this.newTimeEntry = {
      startTime: entry.startTime,
      duration: entry.duration,
      description: entry.description
    };
    
    this.showTimeEntryModal = true;
  }

  addTimeEntry() {
    if (!this.selectedTimesheetDate || !this.selectedWorkOrder || !this.newTimeEntry?.startTime || (this.newTimeEntry?.duration || 0) <= 0) {
      return;
    }

    const newEntry: TimesheetEntry = {
      id: 'TE' + Date.now(),
      workOrderId: this.selectedWorkOrder.id,
      userId: 'current-user',
      userName: 'Jun Ren', // This should come from auth service
      userType: this.currentUserRole.type,
      date: new Date(this.selectedTimesheetDate),
      startTime: this.newTimeEntry?.startTime || '',
      duration: this.newTimeEntry?.duration || 0,
      description: this.newTimeEntry?.description || '',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.timesheetEntries.push(newEntry);
    this.closeTimeEntryModal();
  }

  saveTimeEntry() {
    if (!this.selectedTimesheetDate || !this.selectedWorkOrder || !this.newTimeEntry?.startTime || 
        (this.newTimeEntry?.duration || 0) <= 0 || !this.editingTimeEntryId) {
      return;
    }

    // Find and update the existing entry
    const entryIndex = this.timesheetEntries.findIndex(entry => entry.id === this.editingTimeEntryId);
    if (entryIndex !== -1) {
      // Update the existing entry
      this.timesheetEntries[entryIndex] = {
        ...this.timesheetEntries[entryIndex],
        startTime: this.newTimeEntry.startTime!,
        duration: this.newTimeEntry.duration!,
        description: this.newTimeEntry.description!,
        updatedAt: new Date()
      };
      
      console.log('Updated time entry:', this.timesheetEntries[entryIndex]);
      
      // Clear the cached week data since entries have changed
      this.clearTimesheetWeekCache();
    }
    
    this.closeTimeEntryModal();
  }

  startResize(event: MouseEvent, entry: TimesheetEntry, handle: 'top' | 'bottom') {
    event.preventDefault();
    event.stopPropagation();
    
    this.isResizing = true;
    this.resizingEntry = entry;
    this.resizeHandle = handle;
    this.resizeStartY = event.clientY;
    this.resizeStartTime = this.parseTimeToMinutes(entry.startTime);
    this.resizeStartDuration = entry.duration;
    
    // Add global mouse event listeners
    document.addEventListener('mousemove', this.handleResize.bind(this));
    document.addEventListener('mouseup', this.stopResize.bind(this));
    
    // Prevent text selection during resize
    document.body.style.userSelect = 'none';
  }

  handleResize(event: MouseEvent) {
    if (!this.isResizing || !this.resizingEntry) return;
    
    const deltaY = event.clientY - this.resizeStartY;
    // Convert pixel movement to minutes (each 15-minute slot is roughly 20px)
    const minutesPerPixel = 15 / 20; // Adjust this based on your actual slot height
    const deltaMinutes = Math.round(deltaY * minutesPerPixel / 15) * 15; // Snap to 15-minute intervals
    
    if (this.resizeHandle === 'top') {
      // Resizing from top - adjust start time and duration
      const newStartTime = this.resizeStartTime + deltaMinutes;
      const newDuration = this.resizeStartDuration - deltaMinutes;
      
      // Ensure minimum duration of 15 minutes
      if (newDuration >= 15 && newStartTime >= 0 && newStartTime < 24 * 60) {
        this.resizingEntry.startTime = this.minutesToTimeString(newStartTime);
        this.resizingEntry.duration = newDuration;
      }
    } else if (this.resizeHandle === 'bottom') {
      // Resizing from bottom - adjust duration only
      const newDuration = this.resizeStartDuration + deltaMinutes;
      
      // Ensure minimum duration of 15 minutes and doesn't exceed 24 hours
      const maxEndTime = 24 * 60;
      const currentStartTime = this.parseTimeToMinutes(this.resizingEntry.startTime);
      
      if (newDuration >= 15 && (currentStartTime + newDuration) <= maxEndTime) {
        this.resizingEntry.duration = newDuration;
      }
    }
    
    // Update the entry in the array
    const entryIndex = this.timesheetEntries.findIndex(e => e.id === this.resizingEntry!.id);
    if (entryIndex !== -1) {
      this.timesheetEntries[entryIndex] = { ...this.resizingEntry, updatedAt: new Date() };
      // Clear cache to trigger re-render
      this.clearTimesheetWeekCache();
    }
  }

  stopResize(event: MouseEvent) {
    if (!this.isResizing) return;
    
    // Remove global event listeners
    document.removeEventListener('mousemove', this.handleResize.bind(this));
    document.removeEventListener('mouseup', this.stopResize.bind(this));
    
    // Restore text selection
    document.body.style.userSelect = '';
    
    // Reset resize state
    this.isResizing = false;
    this.resizingEntry = null;
    this.resizeHandle = null;
    
    console.log('Resize completed');
  }

  private minutesToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  deleteTimeEntry(entryId: string) {
    if (!confirm('Are you sure you want to delete this timesheet entry?')) {
      return;
    }

    // Show loading state
    this.isLoading = true;

    // Call API to delete the timesheet entry
    this.deleteTimesheetEntryFromAPI(entryId).then(
      () => {
        // Success: Remove from local array
        this.timesheetEntries = this.timesheetEntries.filter(entry => entry.id !== entryId);
        this.isLoading = false;
        this.showSuccessMessage('Timesheet entry deleted successfully!');
        this.refreshTimesheetData();
      },
      (error) => {
        // Error: Show error message
        this.isLoading = false;
        this.showErrorMessage('Failed to delete timesheet entry. Please try again.');
        console.error('Error deleting timesheet entry:', error);
      }
    );
  }

  private async deleteTimesheetEntryFromAPI(entryId: string): Promise<void> {
    // Simulate API call for deleting entry
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate for demo purposes
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('API Error: Failed to delete timesheet entry'));
        }
      }, 1000); // Simulate network delay
    });
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  }

  getDurationInHours(minutes: number): string {
    return (minutes / 60).toFixed(1) + 'h';
  }

  getSampleTimesheetData(workOrderId: number, weekStart: Date): TimesheetEntry[] {
    // Sample data for demonstration - works for any work order ID
    const entries: TimesheetEntry[] = [];

    // Generate sample data for any work order ID
    console.log(`Generating sample timesheet data for workOrderId: ${workOrderId}, weekStart: ${weekStart}`);

    // Monday entries
    const monday = new Date(weekStart);
    entries.push({
      id: 'TE001',
      workOrderId: workOrderId,
      userId: 'user1',
      userName: 'Jun Ren',
      userType: 'staff',
      date: monday,
      startTime: '00:30',
      duration: 60, // 1h
      description: 'Early morning maintenance',
      status: 'submitted',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    entries.push({
      id: 'TE002',
      workOrderId: workOrderId,
      userId: 'user1',
      userName: 'Jun Ren',
      userType: 'staff',
      date: monday,
      startTime: '08:00',
      duration: 90, // 1h 30m
      description: 'Documentation and report writing',
      status: 'submitted',
      createdAt: new Date(),
      updatedAt: new Date()
    });

      entries.push({
        id: 'TE002B',
        workOrderId: workOrderId,
        userId: 'user1',
        userName: 'Jun Ren',
        userType: 'staff',
        date: monday,
        startTime: '14:00',
        duration: 120, // 2h
        description: 'Afternoon system testing',
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      entries.push({
        id: 'TE002C',
        workOrderId: workOrderId,
        userId: 'user1',
        userName: 'Jun Ren',
        userType: 'staff',
        date: monday,
        startTime: '20:00',
        duration: 60, // 1h
        description: 'Evening security check',
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Tuesday entries
      const tuesday = new Date(weekStart);
      tuesday.setDate(weekStart.getDate() + 1);
      entries.push({
        id: 'TE003',
        workOrderId: workOrderId,
        userId: 'user1',
        userName: 'Jun Ren',
        userType: 'staff',
        date: tuesday,
        startTime: '02:00',
        duration: 60, // 1h
        description: 'Equipment setup and preparation',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      entries.push({
        id: 'TE004',
        workOrderId: workOrderId,
        userId: 'user1',
        userName: 'Jun Ren',
        userType: 'staff',
        date: tuesday,
        startTime: '10:30',
        duration: 150, // 2h 30m
        description: 'Main electrical work and connections',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Wednesday entries
      const wednesday = new Date(weekStart);
      wednesday.setDate(weekStart.getDate() + 2);
      entries.push({
        id: 'TE005',
        workOrderId: workOrderId,
        userId: 'user1',
        userName: 'Jun Ren',
        userType: 'staff',
        date: wednesday,
        startTime: '09:15',
        duration: 60, // 1h
        description: 'Final testing and verification',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      });

    console.log(`Generated ${entries.length} sample timesheet entries for workOrder ${workOrderId}`);
    return entries;
  }

  // Calendar View Methods
  setTimesheetView(view: 'list' | 'calendar') {
    this.isCalendarView = view === 'calendar';

    // Debug and ensure data is available when switching to calendar view
    if (this.isCalendarView) {
      console.log('Switching to Calendar View------------------');
      console.log('Timesheet Entries:', this.timesheetEntries.length);
      // CRITICAL: Clear cache before switching to calendar view
      // The template will start rendering grid columns immediately, and we need fresh data
      // to prevent ExpressionChangedAfterItHasBeenCheckedError on [style.grid-column]="i + 2"
      this.clearTimesheetWeekCache();

      // If no timesheet entries exist, initialize sample data
      if (this.timesheetEntries.length === 0) {
        console.log('No timesheet entries found, initializing sample data...');
        this.initializeSampleTimesheetEntries();
      }

      // Reload timesheet data to ensure calendar has current week data
      // this.loadTimesheetData();

      console.log('Current Week:', this.getTimesheetWeek());
      console.log('Timesheet Entries after loading:', this.timesheetEntries.length);

      // Force change detection to ensure the view updates
      this.cdr.detectChanges();
    }
  }

  getTimeSlots() {
    const slots = [];
    for (let hour = 0; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        // Only show time labels on the hour (minute === 0), hide others
        const displayTime = minute === 0 ? `${hour.toString().padStart(2, '0')}:00` : '';
        const showLabel = minute === 0; // Flag to determine if label should be shown
        slots.push({
          time: time,
          displayTime: displayTime,
          hour: hour,
          minute: minute,
          showLabel: showLabel
        });
      }
    }
    return slots;
  }

  isCurrentTime(timeSlot: string): boolean {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return timeSlot === currentTime;
  }

  openTimeEntryModalForSlot(date: Date, timeSlot: string) {
    if (!this.currentUserRole.permissions.canLogTime) return;

    this.selectedTimesheetDate = date;
    this.selectedTimeSlot = timeSlot;
    this.newTimeEntry = {
      startTime: timeSlot,
      duration: 15, // Default 15 minutes
      description: ''
    };
    this.showTimeEntryModal = true;
  }

  hasTimeEntryAtSlot(day: TimesheetDay, timeSlot: string): boolean {
    const hasEntry = day.entries.some(entry => {
      const entryStart = this.parseTimeToMinutes(entry.startTime);
      const slotStart = this.parseTimeToMinutes(timeSlot);
      const entryEnd = entryStart + entry.duration;
      const slotEnd = slotStart + 15; // 15-minute slots

      return (entryStart < slotEnd && entryEnd > slotStart);
    });

    // Debug logging
    if (this.isCalendarView && day.entries.length > 0) {
      console.log(`hasTimeEntryAtSlot Debug - Day: ${day.dayName}, TimeSlot: ${timeSlot}, Entries: ${day.entries.length}, HasEntry: ${hasEntry}`);
    }

    return hasEntry;
  }

  getTimeEntriesForSlot(day: TimesheetDay, timeSlot: string): TimesheetEntry[] {
    console.log('getTimeEntriesForSlot', day, timeSlot);
    const slotStart = this.parseTimeToMinutes(timeSlot);
    
    // CRITICAL FIX: Only return entries that START in this specific time slot
    // This prevents entries from being rendered multiple times across different slots
    const entries = day.entries.filter(entry => {
      const entryStart = this.parseTimeToMinutes(entry.startTime);
      const entryStartSlot = Math.floor(entryStart / 15) * 15; // Round down to nearest 15-minute slot
      
      return entryStartSlot === slotStart;
    });

    // Debug logging
    if (this.isCalendarView && entries.length > 0) {
      console.log(`getTimeEntriesForSlot Debug - Day: ${day.dayName}, TimeSlot: ${timeSlot}, Found ${entries.length} entries`);
    }

    return entries;
  }

  getEntryTopPosition(entry: TimesheetEntry): number {
    // Calculate position within the starting slot
    const entryStart = this.parseTimeToMinutes(entry.startTime);
    const entryStartSlot = Math.floor(entryStart / 15) * 15; // Round down to nearest 15-minute slot
    const offsetWithinSlot = entryStart - entryStartSlot; // Minutes past the slot start
    return (offsetWithinSlot / 15) * 100; // Position within the slot (0-100%)
  }

  getEntryHeight(entry: TimesheetEntry): number {
    return (entry.duration / 15) * 100; // Each slot is 15 minutes
  }

  editTimeEntry(entry: TimesheetEntry) {
    this.editingEntry = { ...entry };
  }

  viewTimeEntry(entry: TimesheetEntry) {
    // Open a view-only modal or show details in a side panel
    // For now, we'll show an alert with the entry details
    const details = `
      Date: ${entry.date.toLocaleDateString()}
      Start Time: ${entry.startTime}
      Duration: ${this.formatDuration(entry.duration)}
      Description: ${entry.description}
      Status: ${entry.status}
      User: ${entry.userName}
      Created: ${entry.createdAt.toLocaleString()}
      Updated: ${entry.updatedAt.toLocaleString()}
    `;
    alert(details);
  }

  addNewTimeEntry() {
    const today = new Date();
    this.editingEntry = {
      id: 'new-' + Date.now(),
      workOrderId: this.selectedWorkOrder?.id || 0,
      userId: 'current-user',
      userName: 'Current User',
      userType: 'staff',
      date: today,
      startTime: '09:00',
      duration: 60,
      description: '',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }


  private async updateTimesheetEntryToAPI(entry: TimesheetEntry): Promise<TimesheetEntry> {
    // Simulate API call for updating existing entry
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const updatedEntry = {
          ...entry,
          updatedAt: new Date()
        };

        // Simulate 90% success rate for demo purposes
        if (Math.random() > 0.1) {
          resolve(updatedEntry);
        } else {
          reject(new Error('API Error: Failed to update timesheet entry'));
        }
      }, 1000); // Simulate network delay
    });
  }

  cancelEdit() {
    this.editingEntry = null;
  }

  getAllTimesheetEntries(): TimesheetEntry[] {
    return this.timesheetEntries;
  }

  getTotalHours(): string {
    const totalMinutes = this.timesheetEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return this.getDurationInHours(totalMinutes);
  }

  clearAllTimesheetEntries() {
    this.timesheetEntries = [];
  }

  // Work Order Tab Management
  setActiveWorkOrderTab(tab: string) {
    this.activeWorkOrderTab = tab;
  }

  // Releases Management
  getReleasesForWorkOrder(workOrderId: number): ProjectRelease[] {
    return this.releases.filter(release => release.workOrderId === workOrderId);
  }

  openAddReleaseModal() {
    this.newRelease = {
      version: '',
      time: new Date(),
      bomPath: '',
      notes: ''
    };
    this.showAddReleaseModal = true;
  }

  closeAddReleaseModal() {
    this.showAddReleaseModal = false;
    this.newRelease = {};
  }

  isNewReleaseValid(): boolean {
    return !!(
      this.newRelease.version &&
      this.newRelease.version.trim().length > 0 &&
      this.newRelease.time
    );
  }

  saveNewRelease() {
    if (!this.isNewReleaseValid() || !this.selectedWorkOrder) {
      return;
    }

    const newRelease: ProjectRelease = {
      id: 'REL' + Date.now(),
      workOrderId: this.selectedWorkOrder.id,
      version: this.newRelease.version!,
      time: this.newRelease.time!,
      bomPath: this.newRelease.bomPath,
      notes: this.newRelease.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.releases.push(newRelease);
      this.closeAddReleaseModal();
      this.isLoading = false;
      this.showSuccessMessage('Release saved successfully!');
    }, 1000);
  }

  editRelease(release: ProjectRelease) {
    // For now, just show an alert with release details
    const details = `
      Version: ${release.version}
      Time: ${release.time.toLocaleString()}
      BOM Path: ${release.bomPath || 'Not provided'}
      Notes: ${release.notes || 'No notes'}
    `;
    alert(details);
  }

  deleteRelease(releaseId: string) {
    if (!confirm('Are you sure you want to delete this release?')) {
      return;
    }

    this.releases = this.releases.filter(release => release.id !== releaseId);
    this.showSuccessMessage('Release deleted successfully!');
  }

  getFileNameFromPath(path: string): string {
    return path.split('/').pop() || path;
  }

  getStatusIconClass(status: string): string {
    switch (status) {
      case 'open': return 'pi pi-unlock';
      case 'in-progress': return 'pi pi-spin pi-spinner';
      case 'completed': return 'pi pi-check-circle';
      case 'on-hold': return 'pi pi-pause-circle';
      default: return 'pi pi-circle';
    }
  }

  // ECN Management Methods
  setActiveECNTab(tab: string) {
    this.activeECNTab = tab;
  }

  setECNStatusFilter(status: string) {
    this.ecnStatusFilter = status;
  }

  getAllECNs(): ECN[] {
    return this.ecns;
  }

  getECNsByStatus(status: string): ECN[] {
    if (status === 'all') return this.ecns;
    return this.ecns.filter(ecn => ecn.status === status);
  }

  getFilteredECNs(): ECN[] {
    return this.getECNsByStatus(this.ecnStatusFilter);
  }

  getECNStatusIcon(status: string): string {
    switch (status) {
      case 'draft': return 'pi pi-file-edit';
      case 'under_review': return 'pi pi-eye';
      case 'approved': return 'pi pi-check-circle';
      case 'released': return 'pi pi-send';
      case 'closed': return 'pi pi-lock';
      default: return 'pi pi-circle';
    }
  }

  getECNProgress(ecn: ECN): number {
    const approvals = this.ecnApprovals.filter(approval => approval.ecnId === ecn.id);
    if (approvals.length === 0) return 0;
    const approved = approvals.filter(approval => approval.status === 'approved').length;
    return Math.round((approved / approvals.length) * 100);
  }

  canEditECN(ecn: ECN): boolean {
    return ecn.status === 'draft' && ecn.createdBy === 'current-user';
  }

  canApproveECN(ecn: ECN): boolean {
    return ecn.status === 'under_review' && this.currentUserRole.type === 'manager';
  }

  viewECNDetails(ecn: ECN) {
    this.selectedECN = ecn;
    this.setActiveECNTab('attachments');
  }

  editECN(ecn: ECN) {
    this.newECN = { ...ecn };
    this.setActiveECNTab('create');
  }

  approveECN(ecn: ECN) {
    if (confirm(`Approve ECN ${ecn.number}?`)) {
      ecn.status = 'approved';
      ecn.approvedAt = new Date();
      this.showSuccessMessage(`ECN ${ecn.number} has been approved!`);
    }
  }

  openCreateECNModal() {
    this.newECN = {
      title: '',
      description: '',
      reason: '',
      urgency: 'medium',
      status: 'draft'
    };
    this.setActiveECNTab('create');
  }

  isECNValid(): boolean {
    return !!(
      this.newECN.title &&
      this.newECN.title.trim().length > 0 &&
      this.newECN.description &&
      this.newECN.description.trim().length > 0 &&
      this.newECN.reason &&
      this.newECN.reason.trim().length > 0
    );
  }

  saveECNDraft() {
    if (!this.isECNValid() || !this.selectedWorkOrder) return;

    const newECN: ECN = {
      id: 'ECN' + Date.now(),
      number: this.generateECNNumber(),
      title: this.newECN.title!,
      description: this.newECN.description!,
      reason: this.newECN.reason!,
      urgency: this.newECN.urgency || 'medium',
      status: 'draft',
      workOrderId: this.selectedWorkOrder.id,
      createdBy: 'current-user',
      createdAt: new Date(),
      targetDate: this.newECN.targetDate
    };

    this.ecns.push(newECN);
    this.newECN = {};
    this.setActiveECNTab('dashboard');
    this.showSuccessMessage('ECN saved as draft successfully!');
  }

  submitECNForReview() {
    if (!this.isECNValid() || !this.selectedWorkOrder) return;

    const newECN: ECN = {
      id: 'ECN' + Date.now(),
      number: this.generateECNNumber(),
      title: this.newECN.title!,
      description: this.newECN.description!,
      reason: this.newECN.reason!,
      urgency: this.newECN.urgency || 'medium',
      status: 'under_review',
      workOrderId: this.selectedWorkOrder.id,
      createdBy: 'current-user',
      createdAt: new Date(),
      targetDate: this.newECN.targetDate
    };

    this.ecns.push(newECN);
    this.createApprovalWorkflow(newECN.id);
    this.newECN = {};
    this.setActiveECNTab('dashboard');
    this.showSuccessMessage('ECN submitted for review successfully!');
  }

  cancelECNCreation() {
    this.newECN = {};
    this.setActiveECNTab('dashboard');
  }

  generateECNNumber(): string {
    const year = new Date().getFullYear();
    const count = this.ecns.length + 1;
    return `ECN-${year}-${count.toString().padStart(4, '0')}`;
  }

  createApprovalWorkflow(ecnId: string) {
    const approvals: ECNApproval[] = [
      {
        id: 'APP' + Date.now() + '1',
        ecnId: ecnId,
        role: 'engineering',
        approverId: 'eng-manager',
        approverName: 'Engineering Manager',
        status: 'pending'
      },
      {
        id: 'APP' + Date.now() + '2',
        ecnId: ecnId,
        role: 'qa',
        approverId: 'qa-manager',
        approverName: 'QA Manager',
        status: 'pending'
      },
      {
        id: 'APP' + Date.now() + '3',
        ecnId: ecnId,
        role: 'procurement',
        approverId: 'proc-manager',
        approverName: 'Procurement Manager',
        status: 'pending'
      }
    ];

    this.ecnApprovals.push(...approvals);
  }

  getECNApprovals(): ECNApproval[] {
    return this.ecnApprovals;
  }

  canApproveStep(approval: ECNApproval): boolean {
    return approval.status === 'pending' && this.currentUserRole.type === 'manager';
  }

  approveStep(approval: ECNApproval) {
    approval.status = 'approved';
    approval.decision = 'approve';
    approval.approvedAt = new Date();
    this.showSuccessMessage(`${approval.role} approval completed!`);
  }

  rejectStep(approval: ECNApproval) {
    const comments = prompt('Please provide rejection comments:');
    if (comments) {
      approval.status = 'rejected';
      approval.decision = 'reject';
      approval.comments = comments;
      approval.approvedAt = new Date();
      this.showSuccessMessage(`${approval.role} approval rejected.`);
    }
  }

  // BOM Impact Analysis
  getCurrentBOMItems(): BOMItem[] {
    return this.currentBOMItems;
  }

  getProposedBOMItems(): BOMItem[] {
    return this.proposedBOMItems;
  }

  getBOMItemChangeType(item: BOMItem): string {
    return item.changeType || 'unchanged';
  }

  runBOMImpactAnalysis() {
    // Simulate BOM analysis
    this.currentBOMItems = [
      { id: '1', partNumber: 'P001', quantity: 2, revision: 'A', description: 'Main Component' },
      { id: '2', partNumber: 'P002', quantity: 1, revision: 'B', description: 'Sub Component' },
      { id: '3', partNumber: 'P003', quantity: 4, revision: 'A', description: 'Fastener' }
    ];

    this.proposedBOMItems = [
      { id: '1', partNumber: 'P001', quantity: 2, revision: 'B', description: 'Main Component', changeType: 'spec_change' },
      { id: '2', partNumber: 'P002', quantity: 1, revision: 'B', description: 'Sub Component', changeType: 'unchanged' },
      { id: '4', partNumber: 'P004', quantity: 2, revision: 'A', description: 'New Component', changeType: 'add' }
    ];

    this.showSuccessMessage('BOM impact analysis completed!');
  }

  getCostImpact(): CostImpact {
    return {
      material: 1250.00,
      labor: 450.00,
      total: 1700.00
    };
  }

  getCostChangeClass(value: number): string {
    if (value > 0) return 'cost-increase';
    if (value < 0) return 'cost-decrease';
    return 'cost-neutral';
  }

  getProductionImpact(): ProductionImpact {
    return {
      leadTime: 5,
      wipUnits: 12,
      resourceHours: 24
    };
  }

  // Attachments
  getECNAttachments(): ECNAttachment[] {
    if (!this.selectedECN) {
      return [];
    }
    return this.ecnAttachments.filter(attachment => attachment.ecnId === this.selectedECN!.id);
  }

  getSelectedECN(): ECN | null {
    return this.selectedECN;
  }

  selectECNForAttachments(ecn: ECN) {
    this.selectedECN = ecn;
  }

  clearSelectedECN() {
    this.selectedECN = null;
  }

  onECNSelectionChange() {
    // This method is called when the ECN dropdown selection changes
    // The selectedECN is already updated by ngModel binding
  }

  getFileIcon(fileType: string): string {
    switch (fileType.toLowerCase()) {
      case 'pdf': return 'pi pi-file-pdf';
      case 'doc':
      case 'docx': return 'pi pi-file-word';
      case 'xls':
      case 'xlsx': return 'pi pi-file-excel';
      case 'dwg':
      case 'dxf': return 'pi pi-image';
      default: return 'pi pi-file';
    }
  }

  openAttachmentUpload() {
    if (!this.selectedECN) {
      alert('Please select an ECN first to upload attachments.');
      return;
    }
    alert(`File upload functionality for ECN ${this.selectedECN.number} would be implemented here`);
  }

  downloadAttachment(attachment: ECNAttachment) {
    alert(`Downloading ${attachment.fileName}`);
  }

  deleteAttachment(attachmentId: string) {
    if (confirm('Delete this attachment?')) {
      this.ecnAttachments = this.ecnAttachments.filter(att => att.id !== attachmentId);
      this.showSuccessMessage('Attachment deleted successfully!');
    }
  }

  getApprovalStepIcon(status: string): string {
    switch (status) {
      case 'pending': return 'pi pi-clock';
      case 'approved': return 'pi pi-check-circle';
      case 'rejected': return 'pi pi-times-circle';
      default: return 'pi pi-circle';
    }
  }

  private initializeSampleECNs() {
    const sampleECNs: ECN[] = [
      {
        id: 'ECN001',
        number: 'ECN-2024-0001',
        title: 'Update Main Component Revision',
        description: 'Update main component from revision A to revision B to improve durability and reduce maintenance costs.',
        reason: 'design_improvement',
        status: 'under_review',
        urgency: 'medium',
        workOrderId: 1,
        createdBy: 'John Engineer',
        createdAt: new Date('2024-01-15'),
        targetDate: new Date('2024-02-15')
      },
      {
        id: 'ECN002',
        number: 'ECN-2024-0002',
        title: 'Cost Reduction Initiative',
        description: 'Replace expensive component with cost-effective alternative while maintaining quality standards.',
        reason: 'cost_reduction',
        status: 'approved',
        urgency: 'high',
        workOrderId: 1,
        createdBy: 'Jane Manager',
        createdAt: new Date('2024-01-20'),
        approvedAt: new Date('2024-01-25'),
        targetDate: new Date('2024-03-01')
      },
      {
        id: 'ECN003',
        number: 'ECN-2024-0003',
        title: 'Quality Issue Resolution',
        description: 'Address quality issues reported by customer by updating component specifications.',
        reason: 'quality_issue',
        status: 'draft',
        urgency: 'critical',
        workOrderId: 6,
        createdBy: 'Mike Quality',
        createdAt: new Date('2024-01-28'),
        targetDate: new Date('2024-02-10')
      }
    ];

    this.ecns = sampleECNs;

    // Initialize sample approvals
    const sampleApprovals: ECNApproval[] = [
      {
        id: 'APP001',
        ecnId: 'ECN001',
        role: 'engineering',
        approverId: 'eng-manager',
        approverName: 'Engineering Manager',
        status: 'approved',
        approvedAt: new Date('2024-01-16'),
        decision: 'approve',
        comments: 'Approved with minor modifications'
      },
      {
        id: 'APP002',
        ecnId: 'ECN001',
        role: 'qa',
        approverId: 'qa-manager',
        approverName: 'QA Manager',
        status: 'pending'
      },
      {
        id: 'APP003',
        ecnId: 'ECN001',
        role: 'procurement',
        approverId: 'proc-manager',
        approverName: 'Procurement Manager',
        status: 'pending'
      }
    ];

    this.ecnApprovals = sampleApprovals;

    // Initialize sample attachments
    const sampleAttachments: ECNAttachment[] = [
      // ECN001 Attachments
      {
        id: 'ATT001',
        ecnId: 'ECN001',
        fileName: 'Component_Specification_RevB.pdf',
        filePath: '/attachments/ECN001/Component_Specification_RevB.pdf',
        fileType: 'pdf',
        fileSize: '2.3 MB',
        uploadedBy: 'John Engineer',
        uploadedAt: new Date('2024-01-15')
      },
      {
        id: 'ATT002',
        ecnId: 'ECN001',
        fileName: 'Cost_Analysis.xlsx',
        filePath: '/attachments/ECN001/Cost_Analysis.xlsx',
        fileType: 'xlsx',
        fileSize: '156 KB',
        uploadedBy: 'Jane Manager',
        uploadedAt: new Date('2024-01-16')
      },
      {
        id: 'ATT003',
        ecnId: 'ECN001',
        fileName: 'Assembly_Drawing_RevB.dwg',
        filePath: '/attachments/ECN001/Assembly_Drawing_RevB.dwg',
        fileType: 'dwg',
        fileSize: '4.7 MB',
        uploadedBy: 'Mike Designer',
        uploadedAt: new Date('2024-01-17')
      },
      // ECN002 Attachments
      {
        id: 'ATT004',
        ecnId: 'ECN002',
        fileName: 'Cost_Reduction_Proposal.pdf',
        filePath: '/attachments/ECN002/Cost_Reduction_Proposal.pdf',
        fileType: 'pdf',
        fileSize: '1.8 MB',
        uploadedBy: 'Jane Manager',
        uploadedAt: new Date('2024-01-20')
      },
      {
        id: 'ATT005',
        ecnId: 'ECN002',
        fileName: 'Supplier_Quote_Comparison.xlsx',
        filePath: '/attachments/ECN002/Supplier_Quote_Comparison.xlsx',
        fileType: 'xlsx',
        fileSize: '89 KB',
        uploadedBy: 'Sarah Procurement',
        uploadedAt: new Date('2024-01-21')
      },
      // ECN003 Attachments
      {
        id: 'ATT006',
        ecnId: 'ECN003',
        fileName: 'Quality_Issue_Report.pdf',
        filePath: '/attachments/ECN003/Quality_Issue_Report.pdf',
        fileType: 'pdf',
        fileSize: '3.2 MB',
        uploadedBy: 'Mike Quality',
        uploadedAt: new Date('2024-01-28')
      },
      {
        id: 'ATT007',
        ecnId: 'ECN003',
        fileName: 'Customer_Feedback.docx',
        filePath: '/attachments/ECN003/Customer_Feedback.docx',
        fileType: 'docx',
        fileSize: '245 KB',
        uploadedBy: 'Lisa Customer Service',
        uploadedAt: new Date('2024-01-29')
      }
    ];

    this.ecnAttachments = sampleAttachments;
  }

  openAddEntryDialog() {
    // Initialize new entry with default values
    const today = new Date();
    this.newTimeEntry = {
      date: today,
      startTime: '09:00',
      duration: 60,
      description: '',
      status: 'draft'
    };
    this.showAddEntryModal = true;
  }

  closeAddEntryDialog() {
    console.log('Closing add entry dialog...');
    this.showAddEntryModal = false;
    this.newTimeEntry = {};
    this.isLoading = false; // Reset loading state
    console.log('Dialog should be closed now');
  }

  isNewEntryValid(): boolean {
    return !!(
      this.newTimeEntry.date &&
      this.newTimeEntry.startTime &&
      this.newTimeEntry.duration &&
      this.newTimeEntry.duration > 0 &&
      this.newTimeEntry.description &&
      this.newTimeEntry.description.trim().length > 0
    );
  }

  saveNewTimeEntry() {
    if (!this.isNewEntryValid()) {
      return;
    }

    const newEntry: TimesheetEntry = {
      id: 'TE' + Date.now(),
      workOrderId: this.selectedWorkOrder?.id || 0,
      userId: 'current-user',
      userName: 'Current User',
      userType: 'staff',
      date: this.newTimeEntry.date!,
      startTime: this.newTimeEntry.startTime!,
      duration: this.newTimeEntry.duration!,
      description: this.newTimeEntry.description!,
      status: this.newTimeEntry.status || 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Show loading state
    this.isLoading = true;

    // Call API to save the timesheet entry
    console.log('Starting API call to save timesheet entry...');
    this.saveTimesheetEntryToAPI(newEntry).then(
      (savedEntry) => {
        console.log('API call successful, saving entry...');
        // Success: Add to local array and close dialog
        this.timesheetEntries.push(savedEntry);
        console.log('Entry added to array, closing dialog...');
        this.closeAddEntryDialog();
        this.isLoading = false;

        // Show success message
        this.showSuccessMessage('Timesheet entry saved successfully!');

        // Refresh the timesheet data to ensure consistency
        this.refreshTimesheetData();
      },
      (error) => {
        console.log('API call failed:', error);
        // Error: Show error message
        this.isLoading = false;
        this.showErrorMessage('Failed to save timesheet entry. Please try again.');
        console.error('Error saving timesheet entry:', error);
      }
    );
  }

  private async saveTimesheetEntryToAPI(entry: TimesheetEntry): Promise<TimesheetEntry> {
    // Simulate API call - replace with actual API endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful API response
        const savedEntry = {
          ...entry,
          id: 'TE' + Date.now(), // Server-generated ID
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Simulate 90% success rate for demo purposes
        if (Math.random() > 0.1) {
          resolve(savedEntry);
        } else {
          reject(new Error('API Error: Failed to save timesheet entry'));
        }
      }, 1000); // Simulate network delay
    });
  }

  private refreshTimesheetData() {
    // Refresh timesheet data from API
    // This ensures the UI is in sync with the server
    this.loadTimesheetData();
  }

  private showSuccessMessage(message: string) {
    // You can replace this with a proper toast notification
    alert(message);
  }

  private showErrorMessage(message: string) {
    // You can replace this with a proper error notification
    alert(message);
  }

  initializeSampleTimesheetEntries() {

    // Clear existing entries
    this.timesheetEntries = [];
    
    // CRITICAL: Clear the cached week data since timesheet entries are changing
    // The getTimesheetWeek() method depends on this.timesheetEntries to calculate daily totals
    // Without clearing cache, the week would show old entry data in the days array
    this.clearTimesheetWeekCache();

    // Get current week dates
    const today = new Date();
    const currentWeek = this.getTimesheetWeek();

    console.log('Initializing Sample Timesheet Entries for week:', currentWeek);

    // Sample entries for the current week
    const sampleEntries: TimesheetEntry[] = [
      // Monday entries
      {
        id: 'TE001',
        workOrderId: 1,
        userId: 'user1',
        userName: 'John Smith',
        userType: 'staff',
        date: currentWeek.days[0].date,
        startTime: '08:00',
        duration: 120, // 2 hours
        description: 'Equipment maintenance and inspection',
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // {
      //   id: 'TE002',
      //   workOrderId: 1,
      //   userId: 'user1',
      //   userName: 'John Smith',
      //   userType: 'staff',
      //   date: currentWeek.days[0].date,
      //   startTime: '10:30',
      //   duration: 90, // 1.5 hours
      //   description: 'Documentation and report writing',
      //   status: 'approved',
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      // {
      //   id: 'TE003',
      //   workOrderId: 1,
      //   userId: 'user1',
      //   userName: 'John Smith',
      //   userType: 'staff',
      //   date: currentWeek.days[0].date,
      //   startTime: '14:00',
      //   duration: 180, // 3 hours
      //   description: 'System testing and validation',
      //   status: 'submitted',
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },

      // Tuesday entries
      {
        id: 'TE004',
        workOrderId: 1,
        userId: 'user1',
        userName: 'John Smith',
        userType: 'staff',
        date: currentWeek.days[1].date,
        startTime: '09:00',
        duration: 240, // 4 hours
        description: 'Software installation and configuration',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'TE005',
        workOrderId: 1,
        userId: 'user1',
        userName: 'John Smith',
        userType: 'staff',
        date: currentWeek.days[1].date,
        startTime: '14:00',
        duration: 120, // 2 hours
        description: 'User training and support',
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Wednesday entries
      {
        id: 'TE006',
        workOrderId: 1,
        userId: 'user1',
        userName: 'John Smith',
        userType: 'staff',
        date: currentWeek.days[2].date,
        startTime: '08:30',
        duration: 150, // 2.5 hours
        description: 'Network troubleshooting',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'TE007',
        workOrderId: 1,
        userId: 'user1',
        userName: 'John Smith',
        userType: 'staff',
        date: currentWeek.days[2].date,
        startTime: '11:30',
        duration: 90, // 1.5 hours
        description: 'Security audit and review',
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Thursday entries
      {
        id: 'TE008',
        workOrderId: 1,
        userId: 'user1',
        userName: 'John Smith',
        userType: 'staff',
        date: currentWeek.days[3].date,
        startTime: '09:15',
        duration: 180, // 3 hours
        description: 'Database optimization',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Friday entries
      {
        id: 'TE009',
        workOrderId: 1,
        userId: 'user1',
        userName: 'John Smith',
        userType: 'staff',
        date: currentWeek.days[4].date,
        startTime: '08:00',
        duration: 120, // 2 hours
        description: 'Weekly maintenance tasks',
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'TE010',
        workOrderId: 1,
        userId: 'user1',
        userName: 'John Smith',
        userType: 'staff',
        date: currentWeek.days[4].date,
        startTime: '10:30',
        duration: 60, // 1 hour
        description: 'Team meeting and planning',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Add sample entries to the timesheet
    this.timesheetEntries = sampleEntries;

    console.log('Sample timesheet entries initialized:', this.timesheetEntries.length, 'entries');
    console.log('Sample entries:', this.timesheetEntries);
  }

  private initializeSampleReleases() {
    // Sample releases for Project 000866 (work order ID 1)
    const sampleReleases: ProjectRelease[] = [
      {
        id: 'REL001',
        workOrderId: 1,
        version: 'v1.0.0',
        time: new Date('2024-01-15T10:30:00'),
        bomPath: 'https://example.com/bom/project-000866-v1.0.0.xlsx',
        notes: 'Initial release with core functionality',
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-15T10:30:00')
      },
      {
        id: 'REL002',
        workOrderId: 1,
        version: 'v1.1.0',
        time: new Date('2024-02-20T14:15:00'),
        bomPath: 'https://example.com/bom/project-000866-v1.1.0.xlsx',
        notes: 'Added new features and bug fixes',
        createdAt: new Date('2024-02-20T14:15:00'),
        updatedAt: new Date('2024-02-20T14:15:00')
      },
      {
        id: 'REL003',
        workOrderId: 1,
        version: 'v1.2.0',
        time: new Date('2024-03-10T09:45:00'),
        bomPath: 'https://example.com/bom/project-000866-v1.2.0.xlsx',
        notes: 'Performance improvements and UI updates',
        createdAt: new Date('2024-03-10T09:45:00'),
        updatedAt: new Date('2024-03-10T09:45:00')
      },
      {
        id: 'REL004',
        workOrderId: 6, // Project 000652
        version: 'v2.0.0',
        time: new Date('2024-03-25T16:20:00'),
        bomPath: 'https://example.com/bom/project-000652-v2.0.0.xlsx',
        notes: 'Major version update with new architecture',
        createdAt: new Date('2024-03-25T16:20:00'),
        updatedAt: new Date('2024-03-25T16:20:00')
      }
    ];

    this.releases = sampleReleases;
  }

  private parseTimeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Debug method to log week structure
  debugWeekStructure() {
    const week = this.getTimesheetWeek();
    console.log('Week Structure Debug:', {
      weekStart: week.weekStart,
      weekEnd: week.weekEnd,
      days: week.days.map((day, index) => ({
        index: index,
        dayName: day.dayName,
        date: day.date,
        isWeekend: this.isWeekend(day.date)
      }))
    });
  }
}
