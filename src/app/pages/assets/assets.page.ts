import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

interface HistoryRecord {
  id: number;
  date: Date;
  action: string;
  details: string;
  updatedBy: string;
  updatedByAvatar: string;
  type: string;
  title?: string;
  description?: string;
  user?: { name: string; avatar: string };
}

interface WorkOrder {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: { name: string; avatar: string } | string;
  assignedToAvatar: string;
  createdAt: Date;
  dueDate: Date;
  completedAt?: Date;
  workType: string;
  estimatedHours: number;
  actualHours?: number;
}

interface ViewMode {
  value: string;
  label: string;
  icon: string;
}

interface Asset {
  id: number;
  name: string;
  description: string;
  status: 'online' | 'offline' | 'maintenance' | 'needs-attention';
  criticality: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  manufacturer?: { name: string; logo: string; description: string } | string;
  model?: string;
  serialNumber?: string;
  year?: number;
  assetType: string;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  createdAt: Date;
  createdBy: { name: string; avatar: string; role: string };
  createdByAvatar: string;
  qrCode: string;
  workOrderHistory: number;
  parts: string[];
  meters: { name: string; value: string; unit: string }[];
  history: HistoryRecord[];
  workOrders: WorkOrder[];
  parentAssetId?: number;
  subAssets?: Asset[];
  attachedImages?: { id: number; url: string; name: string; thumbnailUrl: string }[];
  imageUrl?: string;
  category?: string;
  automations?: { id: number; name: string; type: string; enabled: boolean; description: string; trigger: string; isActive: boolean }[];
  healthScore?: number;
  meterReadings?: { name: string; value: string; unit: string; timestamp: Date }[];
  purchaseDate?: Date;
  warrantyUntil?: Date;
  costCenter?: string;
}

@Component({
  selector: 'app-assets-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavMenuComponent,
    ButtonModule,
    TableModule,
    DialogModule,
    DropdownModule,
    InputTextModule
  ],
  templateUrl: './assets.page.html',
  styleUrls: ['./assets.page.scss']
})
export class AssetsPageComponent implements OnInit {
  viewModes: ViewMode[] = [
    { value: 'panel', label: 'Panel View', icon: '📋' },
    { value: 'table', label: 'Table View', icon: '📊' }
  ];

  currentViewMode: string = 'panel';
  showViewDropdown = false;
  searchTerm = '';

  // Panel view state
  selectedAssetId: number = 1;
  selectedTab: string = 'details';

  // Sub-assets navigation state
  currentView: 'details' | 'sub-assets' | 'assets' | 'maintenance' | 'work-orders' | 'inventory' = 'details';
  parentAsset: Asset | null = null;
  breadcrumbs: Asset[] = [];
  currentHierarchyLevel: number = 0;

  // Bulk operations state
  selectedSubAssets: Set<number> = new Set();
  bulkSelectionMode: boolean = false;
  showBulkActionsMenu: boolean = false;

  // Create sub-asset modal state
  newSubAsset = {
    name: '',
    description: '',
    assetType: 'Component',
    location: '',
    criticality: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    status: 'online' as 'online' | 'offline' | 'maintenance' | 'needs-attention',
    manufacturer: '',
    model: '',
    serialNumber: '',
    inheritFromParent: true
  };

  // Asset type options for dropdown
  assetTypeOptions = [
    { label: 'Component', value: 'Component' },
    { label: 'Equipment', value: 'Equipment' },
    { label: 'System', value: 'System' },
    { label: 'Tool', value: 'Tool' },
    { label: 'Sensor', value: 'Sensor' },
    { label: 'Motor', value: 'Motor' },
    { label: 'Pump', value: 'Pump' },
    { label: 'Valve', value: 'Valve' }
  ];

  // Criticality options
  criticalityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' }
  ];

  // Status options
  statusOptions = [
    { label: 'Online', value: 'online' },
    { label: 'Offline', value: 'offline' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Needs Attention', value: 'needs-attention' }
  ];

  // Dialog states
  showAssetDialog = false;
  selectedAssetForDialog: Asset | null = null;
  showNewAssetModal = false;
  showCreateSubAssetModal = false;

  // Info bar state
  showInfoBar = true;

  // Image viewing state
  selectedImage: any = null;

  // Loading state
  loading = false;
  imageModalVisible = false;

  // Additional missing properties
  openWorkOrders: WorkOrder[] = [];
  activeTab: string = 'details';
  historyFilter: string = 'all';
  historyStartDate: string = '';
  historyEndDate: string = '';
  filteredHistory: HistoryRecord[] = [];
  workOrderStatusFilter: string = 'all';
  filteredWorkOrders: WorkOrder[] = [];
  assetDialogVisible: boolean = false;
  editingAsset: Asset | null = null;
  subAssetDialogVisible: boolean = false;
  imagePreview: string | null = null;

  // Navigation and UI properties
  userProfile: { name: string; avatar: string } = { name: 'Current User', avatar: '/assets/default-avatar.png' };
  searchQuery: string = '';
  viewMode: string = 'panel';
  selectedCategory: string = 'all';

  // Chart data
  chartGridLines: any[] = [];
  workOrderChartPath: string = '';
  workOrderChartPoints: any[] = [];
  workOrderChartGridLines: any[] = [];
  workOrderChartXLabels: any[] = [];
  workOrderChartYLabels: any[] = [];
  chartTooltip: { visible: boolean; x: number; y: number; date: string; count: number } = {
    visible: false, x: 0, y: 0, date: '', count: 0
  };

  // Form data
  assetFormData = {
    name: '',
    assetType: '',
    location: '',
    status: 'online' as 'online' | 'offline' | 'maintenance' | 'needs-attention',
    serialNumber: '',
    model: '',
    purchaseDate: '',
    costCenter: '',
    description: ''
  };

  // Categories and sub-asset categories
  categories: string[] = ['Equipment', 'Component', 'System', 'Tool', 'Sensor', 'Motor', 'Pump', 'Valve'];
  subAssetCategories: string[] = ['Component', 'Equipment', 'System', 'Tool', 'Sensor', 'Motor', 'Pump', 'Valve'];

  // Mock data for assets
  allAssets: Asset[] = [];

  constructor() {
    // Remove initializeMockData from constructor
  }

  ngOnInit() {
    this.initializeMockData();
    this.initializeDefaultSelection();
    this.initializeFilters();
    this.initializeWorkOrderChart();
  }

  private initializeMockData() {
    // Create deeply nested sub-assets for testing recursive hierarchy (up to 5 levels)
    const level5SubAssets: Asset[] = [
      {
        id: 205,
        name: 'test11111',
        description: 'Level 5 sub-asset (deepest level for testing)',
        status: 'online',
        criticality: 'low',
        location: 'General - Section A1-1-1-1',
        assetType: 'Micro-Sensor',
        createdAt: new Date('2025-04-09'),
        createdBy: { name: 'MaintainX', avatar: '🧩', role: 'System' },
        createdByAvatar: '🧩',
        qrCode: 'TEST001-1-1-1-1',
        workOrderHistory: 0,
        parts: [],
        meters: [{ name: 'Micro-Voltage', value: '3.3', unit: 'V' }],
        history: [
          {
            id: 205,
            date: new Date('2025-04-09'),
            action: 'Created level 5 sub-asset',
            details: 'Created as deepest sub-asset for testing recursive hierarchy.',
            updatedBy: 'MaintainX',
            updatedByAvatar: '🧩',
            type: 'created'
          }
        ],
        workOrders: [],
        parentAssetId: 204
      }
    ];

    const level4SubAssets: Asset[] = [
      {
        id: 204,
        name: 'test1111',
        description: 'Level 4 sub-asset of test111',
        status: 'online',
        criticality: 'low',
        location: 'General - Section A1-1-1',
        assetType: 'Mini-Sensor',
        createdAt: new Date('2025-04-08'),
        createdBy: { name: 'MaintainX', avatar: '🧩', role: 'System' },
        createdByAvatar: '🧩',
        qrCode: 'TEST001-1-1-1',
        workOrderHistory: 0,
        parts: [],
        meters: [{ name: 'Mini-Voltage', value: '5', unit: 'V' }],
        history: [
          {
            id: 204,
            date: new Date('2025-04-08'),
            action: 'Created level 4 sub-asset',
            details: 'Created as level 4 sub-asset of test111.',
            updatedBy: 'MaintainX',
            updatedByAvatar: '🧩',
            type: 'created'
          }
        ],
        workOrders: [],
        parentAssetId: 203,
        subAssets: level5SubAssets
      }
    ];

    const level3SubAssets: Asset[] = [
      {
        id: 203,
        name: 'test111',
        description: 'Level 3 sub-asset of test11',
        status: 'online',
        criticality: 'low',
        location: 'General - Section A1-1',
        assetType: 'Sub-Sensor',
        createdAt: new Date('2025-04-07'),
        createdBy: { name: 'MaintainX', avatar: '🧩', role: 'System' },
        createdByAvatar: '🧩',
        qrCode: 'TEST001-1-1-1',
        workOrderHistory: 0,
        parts: [],
        meters: [{ name: 'Sub-Voltage', value: '9', unit: 'V' }],
        history: [
          {
            id: 203,
            date: new Date('2025-04-07'),
            action: 'Created level 3 sub-asset',
            details: 'Created as level 3 sub-asset of test11.',
            updatedBy: 'MaintainX',
            updatedByAvatar: '🧩',
            type: 'created'
          }
        ],
        workOrders: [],
        parentAssetId: 201,
        subAssets: level4SubAssets
      }
    ];

    // Level 2 nested sub-assets (third level from top)
    const nestedSubAssets: Asset[] = [
      {
        id: 201,
        name: 'test11',
        description: 'Nested sub-asset of test1',
        status: 'online',
        criticality: 'low',
        location: 'General - Section A1',
        assetType: 'Sensor',
        createdAt: new Date('2025-04-05'),
        createdBy: { name: 'MaintainX', avatar: '🧩', role: 'System' },
        createdByAvatar: '🧩',
        qrCode: 'TEST001-1-1',
        workOrderHistory: 1,
        parts: [],
        meters: [{ name: 'Voltage', value: '12', unit: 'V' }],
        history: [
          {
            id: 201,
            date: new Date('2025-04-05'),
            action: 'Created nested sub-asset',
            details: 'Created as nested sub-asset of test1.',
            updatedBy: 'MaintainX',
            updatedByAvatar: '🧩',
            type: 'created'
          }
        ],
        workOrders: [],
        parentAssetId: 101,
        subAssets: level3SubAssets
      }
    ];

    // Create sub-assets first
    const subAssets1: Asset[] = [
      {
        id: 101,
        name: 'test1',
        description: 'Sub-asset 1 of Test equipment',
        status: 'online',
        criticality: 'medium',
        location: 'General - Section A',
        assetType: 'Component',
        createdAt: new Date('2025-04-01'),
        createdBy: { name: 'MaintainX', avatar: '🧩', role: 'System' },
        createdByAvatar: '🧩',
        qrCode: 'TEST001-1',
        workOrderHistory: 2,
        parts: [],
        meters: [{ name: 'Temperature', value: '25', unit: '°C' }],
        history: [
          {
            id: 101,
            date: new Date('2025-04-01'),
            action: 'Created sub-asset',
            details: 'Created as sub-asset of Test.',
            updatedBy: 'MaintainX',
            updatedByAvatar: '🧩',
            type: 'created'
          }
        ],
        workOrders: [
          {
            id: 1046,
            title: 'Repair damaged equipment panel',
            description: 'Fix control panel damage affecting operation',
            status: 'in-progress',
            priority: 'low',
            assignedTo: 'Mike Wilson',
            assignedToAvatar: 'MW',
            createdAt: new Date('2025-07-15'),
            dueDate: new Date('2025-07-18'),
            workType: 'repair',
            estimatedHours: 5
          }
        ],
        parentAssetId: 1,
        subAssets: nestedSubAssets
      },
      {
        id: 102,
        name: 'test2',
        description: 'Sub-asset 2 of Test equipment',
        status: 'online',
        criticality: 'low',
        location: 'General - Section B',
        assetType: 'Component',
        createdAt: new Date('2025-04-02'),
        createdBy: { name: 'MaintainX', avatar: '🧩', role: 'System' },
        createdByAvatar: '🧩',
        qrCode: 'TEST001-2',
        workOrderHistory: 1,
        parts: [],
        meters: [{ name: 'Pressure', value: '100', unit: 'PSI' }],
        history: [
          {
            id: 102,
            date: new Date('2025-04-02'),
            action: 'Created sub-asset',
            details: 'Created as sub-asset of Test.',
            updatedBy: 'MaintainX',
            updatedByAvatar: '🧩',
            type: 'created'
          }
        ],
        workOrders: [
          {
            id: 1084,
            title: 'Replace cracked window',
            description: 'Emergency window replacement due to crack',
            status: 'open',
            priority: 'high',
            assignedTo: 'Sarah Johnson',
            assignedToAvatar: 'SJ',
            createdAt: new Date('2025-07-20'),
            dueDate: new Date('2025-07-26'),
            workType: 'repair',
            estimatedHours: 6
          }
        ],
        parentAssetId: 1
      },
      {
        id: 103,
        name: 'test3',
        description: 'Sub-asset 3 of Test equipment',
        status: 'online',
        criticality: 'high',
        location: 'General - Section C',
        assetType: 'Component',
        createdAt: new Date('2025-04-03'),
        createdBy: { name: 'MaintainX', avatar: '🧩', role: 'System' },
        createdByAvatar: '🧩',
        qrCode: 'TEST001-3',
        workOrderHistory: 3,
        parts: [],
        meters: [{ name: 'Voltage', value: '220', unit: 'V' }],
        history: [
          {
            id: 103,
            date: new Date('2025-04-03'),
            action: 'Created sub-asset',
            details: 'Created as sub-asset of Test.',
            updatedBy: 'MaintainX',
            updatedByAvatar: '🧩',
            type: 'created'
          }
        ],
        workOrders: [
          {
            id: 1039,
            title: 'Fix broken conveyor belt',
            description: 'Conveyor belt maintenance and repair',
            status: 'open',
            priority: 'low',
            assignedTo: 'Tom Anderson',
            assignedToAvatar: 'TA',
            createdAt: new Date('2025-07-12'),
            dueDate: new Date('2025-07-25'),
            workType: 'maintenance',
            estimatedHours: 8
          }
        ],
        parentAssetId: 1
      }
    ];

    this.allAssets = [
      {
        id: 1,
        name: 'Test',
        description: 'Legacy testing equipment',
        status: 'online',
        criticality: 'critical',
        location: 'General',
        assetType: 'Testing Equipment',
        createdAt: new Date('2025-05-17'),
        createdBy: { name: 'MaintainX', avatar: '🧩', role: 'System' },
        createdByAvatar: '🧩',
        qrCode: 'TEST001',
        workOrderHistory: 5,
        parts: [],
        meters: [{ name: 'deposit', value: 'No readings yet', unit: '' }],
        healthScore: 85,
        meterReadings: [
          { name: 'Temperature', value: '25', unit: '°C', timestamp: new Date() },
          { name: 'Pressure', value: '100', unit: 'PSI', timestamp: new Date() }
        ],
        purchaseDate: new Date('2020-01-01'),
        warrantyUntil: new Date('2025-01-01'),
        costCenter: 'MAINT001',
        attachedImages: [
          { id: 1, url: '/assets/test-image.jpg', name: 'Test Image', thumbnailUrl: '/assets/test-thumb.jpg' }
        ],
        automations: [
          { id: 1, name: 'Auto Alert', type: 'monitoring', enabled: true, description: 'Automatic alert system', trigger: 'status_change', isActive: true }
        ],
        history: [
          {
            id: 1,
            date: new Date('2025-07-12'),
            action: 'Status updated',
            details: 'Changed status from Offline to Online after routine maintenance.',
            updatedBy: 'John Smith',
            updatedByAvatar: 'JS',
            type: 'status-change'
          },
          {
            id: 2,
            date: new Date('2025-07-10'),
            action: 'Maintenance completed',
            details: 'Routine calibration and performance testing completed successfully.',
            updatedBy: 'Mike Wilson',
            updatedByAvatar: 'MW',
            type: 'maintenance'
          },
          {
            id: 3,
            date: new Date('2025-06-15'),
            action: 'Firmware upgraded',
            details: 'Upgraded firmware from v2.1.3 to v2.2.0 with enhanced security features.',
            updatedBy: 'Sarah Johnson',
            updatedByAvatar: 'SJ',
            type: 'upgrade'
          },
          {
            id: 4,
            date: new Date('2025-05-20'),
            action: 'Location changed',
            details: 'Asset relocated from Storage Area to General location.',
            updatedBy: 'Tom Anderson',
            updatedByAvatar: 'TA',
            type: 'location-change'
          },
          {
            id: 5,
            date: new Date('2025-04-08'),
            action: 'Hardware upgraded',
            details: 'Upgraded memory module from 8GB to 16GB for improved performance.',
            updatedBy: 'Emily Davis',
            updatedByAvatar: 'ED',
            type: 'upgrade'
          },
          {
            id: 6,
            date: new Date('2025-03-25'),
            action: 'Safety inspection',
            details: 'Annual safety inspection completed. All safety protocols verified.',
            updatedBy: 'Safety Team',
            updatedByAvatar: 'ST',
            type: 'inspection'
          },
          {
            id: 7,
            date: new Date('2025-02-14'),
            action: 'Configuration updated',
            details: 'Updated operational parameters for improved efficiency.',
            updatedBy: 'Alex Turner',
            updatedByAvatar: 'AT',
            type: 'configuration'
          },
          {
            id: 8,
            date: new Date('2025-01-30'),
            action: 'Warranty extended',
            details: 'Warranty period extended to January 2026 under maintenance contract.',
            updatedBy: 'Admin System',
            updatedByAvatar: 'AS',
            type: 'warranty'
          },
          {
            id: 9,
            date: new Date('2024-12-10'),
            action: 'Preventive maintenance',
            details: 'Scheduled preventive maintenance including cleaning and lubrication.',
            updatedBy: 'Maintenance Team',
            updatedByAvatar: 'MT',
            type: 'maintenance'
          },
          {
            id: 10,
            date: new Date('2024-11-05'),
            action: 'Performance upgrade',
            details: 'Installed performance enhancement kit to increase processing speed by 25%.',
            updatedBy: 'Technical Team',
            updatedByAvatar: 'TT',
            type: 'upgrade'
          },
          {
            id: 11,
            date: new Date('2024-09-18'),
            action: 'Calibration completed',
            details: 'Precision calibration performed to maintain accuracy standards.',
            updatedBy: 'Calibration Specialist',
            updatedByAvatar: 'CS',
            type: 'calibration'
          },
          {
            id: 12,
            date: new Date('2024-08-12'),
            action: 'Documentation updated',
            details: 'Technical documentation and operation manual updated to latest revision.',
            updatedBy: 'Documentation Team',
            updatedByAvatar: 'DT',
            type: 'documentation'
          },
          {
            id: 13,
            date: new Date('2024-06-20'),
            action: 'Compliance check',
            details: 'Regulatory compliance verification completed successfully.',
            updatedBy: 'Compliance Officer',
            updatedByAvatar: 'CO',
            type: 'compliance'
          },
          {
            id: 14,
            date: new Date('2024-04-15'),
            action: 'Training completed',
            details: 'Operator training session completed for new procedures.',
            updatedBy: 'Training Coordinator',
            updatedByAvatar: 'TC',
            type: 'training'
          },
          {
            id: 15,
            date: new Date('2024-02-28'),
            action: 'Software updated',
            details: 'Control software updated to version 3.1.2 with bug fixes.',
            updatedBy: 'IT Support',
            updatedByAvatar: 'IT',
            type: 'software-update'
          },
          {
            id: 16,
            date: new Date('2020-01-15'),
            action: 'Asset commissioned',
            details: 'Asset successfully commissioned and put into service.',
            updatedBy: 'Project Manager',
            updatedByAvatar: 'PM',
            type: 'commissioned'
          },
          {
            id: 17,
            date: new Date('2020-01-10'),
            action: 'Installation completed',
            details: 'Asset installation and setup completed at General location.',
            updatedBy: 'Installation Team',
            updatedByAvatar: 'IN',
            type: 'installation'
          },
          {
            id: 18,
            date: new Date('2020-01-01'),
            action: 'Manufactured',
            details: 'Asset manufactured by testing equipment division. Serial: TEST-2020-001.',
            updatedBy: 'Manufacturing',
            updatedByAvatar: 'MF',
            type: 'manufactured'
          }
        ],
        workOrders: [
          {
            id: 1001,
            title: 'Routine calibration check',
            description: 'Perform routine calibration and accuracy testing',
            status: 'completed',
            priority: 'medium',
            assignedTo: 'Mike Wilson',
            assignedToAvatar: 'MW',
            createdAt: new Date('2025-05-10'),
            dueDate: new Date('2025-05-15'),
            completedAt: new Date('2025-05-14'),
            workType: 'preventive',
            estimatedHours: 2,
            actualHours: 1.5
          },
          {
            id: 1002,
            title: 'Equipment inspection',
            description: 'Monthly safety and functionality inspection',
            status: 'open',
            priority: 'low',
            assignedTo: 'Sarah Johnson',
            assignedToAvatar: 'SJ',
            createdAt: new Date('2025-05-18'),
            dueDate: new Date('2025-05-25'),
            workType: 'inspection',
            estimatedHours: 1
          }
        ],
        subAssets: subAssets1
      },
      {
        id: 2,
        name: 'Pump A',
        description: 'Main water pump',
        status: 'maintenance',
        criticality: 'high',
        location: 'Plant 1',
        assetType: 'Pump',
        manufacturer: { name: 'PumpCo', logo: '/assets/pumpco-logo.png', description: 'Leading pump manufacturer' },
        model: 'P-1000',
        serialNumber: 'SN123456',
        year: 2020,
        lastMaintenance: new Date('2025-04-10'),
        nextMaintenance: new Date('2025-10-10'),
        createdAt: new Date('2020-01-15'),
        createdBy: { name: 'Alice', avatar: 'A', role: 'Technician' },
        createdByAvatar: 'A',
        qrCode: 'PUMP-A-001',
        workOrderHistory: 8,
        parts: ['Seal', 'Impeller'],
        meters: [{ name: 'Flow', value: '1200', unit: 'L/h' }],
        history: [
          {
            id: 3,
            date: new Date('2025-07-10'),
            action: 'Emergency repair',
            details: 'Replaced damaged impeller and performed system flush.',
            updatedBy: 'Emergency Team',
            updatedByAvatar: 'ET',
            type: 'maintenance'
          },
          {
            id: 19,
            date: new Date('2025-06-20'),
            action: 'Performance monitoring',
            details: 'Installed IoT sensors for real-time performance monitoring.',
            updatedBy: 'Tech Team',
            updatedByAvatar: 'TT',
            type: 'upgrade'
          },
          {
            id: 20,
            date: new Date('2025-05-15'),
            action: 'Seal replacement',
            details: 'Replaced worn seal rings during scheduled maintenance.',
            updatedBy: 'Bob Mitchell',
            updatedByAvatar: 'BM',
            type: 'maintenance'
          },
          {
            id: 21,
            date: new Date('2025-04-10'),
            action: 'Status updated',
            details: 'Changed status from Online to Maintenance for scheduled service.',
            updatedBy: 'Operations',
            updatedByAvatar: 'OP',
            type: 'status-change'
          },
          {
            id: 22,
            date: new Date('2025-03-05'),
            action: 'Efficiency upgrade',
            details: 'Installed new energy-efficient motor reducing power consumption by 15%.',
            updatedBy: 'Energy Team',
            updatedByAvatar: 'EN',
            type: 'upgrade'
          },
          {
            id: 23,
            date: new Date('2025-01-20'),
            action: 'Annual inspection',
            details: 'Comprehensive annual inspection completed. All systems operational.',
            updatedBy: 'Inspector',
            updatedByAvatar: 'IN',
            type: 'inspection'
          },
          {
            id: 24,
            date: new Date('2020-01-15'),
            action: 'Commissioned',
            details: 'Pump A successfully commissioned and integrated into Plant 1 systems.',
            updatedBy: 'Project Team',
            updatedByAvatar: 'PT',
            type: 'commissioned'
          },
          {
            id: 25,
            date: new Date('2019-12-20'),
            action: 'Manufactured',
            details: 'Manufactured by PumpCo. Model P-1000, Serial: SN123456.',
            updatedBy: 'PumpCo',
            updatedByAvatar: 'PC',
            type: 'manufactured'
          }
        ],
        workOrders: [
          {
            id: 2001,
            title: 'Replace seal',
            description: 'Replace worn seal on pump',
            status: 'open',
            priority: 'high',
            assignedTo: { name: 'Charlie', avatar: 'C' },
            assignedToAvatar: 'C',
            createdAt: new Date('2025-05-01'),
            dueDate: new Date('2025-05-05'),
            workType: 'repair',
            estimatedHours: 3
          }
        ]
      },
      {
        id: 3,
        name: 'Compressor B',
        description: 'Air compressor for pneumatic tools',
        status: 'offline',
        criticality: 'medium',
        location: 'Workshop',
        assetType: 'Compressor',
        manufacturer: { name: 'CompressIt', logo: '/assets/compressit-logo.png', description: 'Industrial compressor solutions' },
        model: 'C-200',
        serialNumber: 'SN654321',
        year: 2018,
        lastMaintenance: new Date('2025-03-20'),
        nextMaintenance: new Date('2025-09-20'),
        createdAt: new Date('2018-06-10'),
        createdBy: { name: 'Derek', avatar: 'D', role: 'Engineer' },
        createdByAvatar: 'D',
        qrCode: 'COMP-B-002',
        workOrderHistory: 12,
        parts: ['Filter', 'Belt'],
        meters: [{ name: 'Pressure', value: '0', unit: 'PSI' }],
        history: [
          {
            id: 4,
            date: new Date('2025-07-08'),
            action: 'System shutdown',
            details: 'Compressor shut down due to overheating. Cooling system repair required.',
            updatedBy: 'Safety System',
            updatedByAvatar: 'SS',
            type: 'status-change'
          },
          {
            id: 26,
            date: new Date('2025-06-12'),
            action: 'Belt replacement',
            details: 'Replaced worn drive belt and adjusted tension settings.',
            updatedBy: 'Maintenance',
            updatedByAvatar: 'MT',
            type: 'maintenance'
          },
          {
            id: 27,
            date: new Date('2025-05-18'),
            action: 'Pressure calibration',
            details: 'Recalibrated pressure sensors for accurate readings.',
            updatedBy: 'Calibration Tech',
            updatedByAvatar: 'CT',
            type: 'calibration'
          },
          {
            id: 28,
            date: new Date('2025-03-20'),
            action: 'Filter replaced',
            details: 'Replaced air intake filter and cleaned housing.',
            updatedBy: 'Eve Johnson',
            updatedByAvatar: 'EJ',
            type: 'maintenance'
          },
          {
            id: 29,
            date: new Date('2025-02-14'),
            action: 'Control upgrade',
            details: 'Upgraded control panel with digital pressure display.',
            updatedBy: 'Control Systems',
            updatedByAvatar: 'CS',
            type: 'upgrade'
          },
          {
            id: 30,
            date: new Date('2024-12-10'),
            action: 'Winter preparation',
            details: 'Winterization service completed including antifreeze addition.',
            updatedBy: 'Seasonal Team',
            updatedByAvatar: 'ST',
            type: 'maintenance'
          },
          {
            id: 31,
            date: new Date('2024-09-05'),
            action: 'Vibration analysis',
            details: 'Vibration analysis performed. Minor bearing wear detected.',
            updatedBy: 'Diagnostics',
            updatedByAvatar: 'DG',
            type: 'inspection'
          },
          {
            id: 32,
            date: new Date('2018-06-15'),
            action: 'Installation completed',
            details: 'Compressor B installed in Workshop location with full piping.',
            updatedBy: 'Install Team',
            updatedByAvatar: 'IT',
            type: 'installation'
          },
          {
            id: 33,
            date: new Date('2018-05-20'),
            action: 'Manufactured',
            details: 'Manufactured by CompressIt. Model C-200, Serial: SN654321.',
            updatedBy: 'CompressIt',
            updatedByAvatar: 'CI',
            type: 'manufactured'
          }
        ],
        workOrders: [
          {
            id: 3001,
            title: 'Restart compressor',
            description: 'Investigate and restart compressor',
            status: 'open',
            priority: 'medium',
            assignedTo: { name: 'Frank', avatar: 'F' },
            assignedToAvatar: 'F',
            createdAt: new Date('2025-05-12'),
            dueDate: new Date('2025-05-13'),
            workType: 'repair',
            estimatedHours: 2
          }
        ]
      },
      {
        id: 3,
        name: 'Compressor B',
        description: 'Air compressor for pneumatic tools',
        status: 'offline',
        criticality: 'medium',
        location: 'Workshop',
        assetType: 'Compressor',
        manufacturer: { name: 'CompressIt', logo: '/assets/compressit-logo.png', description: 'Industrial compressor solutions' },
        model: 'C-200',
        serialNumber: 'SN654321',
        year: 2018,
        lastMaintenance: new Date('2025-03-20'),
        nextMaintenance: new Date('2025-09-20'),
        createdAt: new Date('2018-06-10'),
        createdBy: { name: 'Derek', avatar: 'D', role: 'Engineer' },
        createdByAvatar: 'D',
        qrCode: 'COMP-B-002',
        workOrderHistory: 12,
        parts: ['Filter', 'Belt'],
        meters: [{ name: 'Pressure', value: '0', unit: 'PSI' }],
        history: [],
        workOrders: []
      },

      {
        id: 3,
        name: 'Compressor B',
        description: 'Air compressor for pneumatic tools',
        status: 'offline',
        criticality: 'medium',
        location: 'Workshop',
        assetType: 'Compressor',
        manufacturer: { name: 'CompressIt', logo: '/assets/compressit-logo.png', description: 'Industrial compressor solutions' },
        model: 'C-200',
        serialNumber: 'SN654321',
        year: 2018,
        lastMaintenance: new Date('2025-03-20'),
        nextMaintenance: new Date('2025-09-20'),
        createdAt: new Date('2018-06-10'),
        createdBy: { name: 'Derek', avatar: 'D', role: 'Engineer' },
        createdByAvatar: 'D',
        qrCode: 'COMP-B-002',
        workOrderHistory: 12,
        parts: ['Filter', 'Belt'],
        meters: [{ name: 'Pressure', value: '0', unit: 'PSI' }],
        history: [],
        workOrders: []
      },

      {
        id: 3,
        name: 'Compressor B',
        description: 'Air compressor for pneumatic tools',
        status: 'offline',
        criticality: 'medium',
        location: 'Workshop',
        assetType: 'Compressor',
        manufacturer: { name: 'CompressIt', logo: '/assets/compressit-logo.png', description: 'Industrial compressor solutions' },
        model: 'C-200',
        serialNumber: 'SN654321',
        year: 2018,
        lastMaintenance: new Date('2025-03-20'),
        nextMaintenance: new Date('2025-09-20'),
        createdAt: new Date('2018-06-10'),
        createdBy: { name: 'Derek', avatar: 'D', role: 'Engineer' },
        createdByAvatar: 'D',
        qrCode: 'COMP-B-002',
        workOrderHistory: 12,
        parts: ['Filter', 'Belt'],
        meters: [{ name: 'Pressure', value: '0', unit: 'PSI' }],
        history: [],
        workOrders: []
      },

      {
        id: 3,
        name: 'Compressor B',
        description: 'Air compressor for pneumatic tools',
        status: 'offline',
        criticality: 'medium',
        location: 'Workshop',
        assetType: 'Compressor',
        manufacturer: { name: 'CompressIt', logo: '/assets/compressit-logo.png', description: 'Industrial compressor solutions' },
        model: 'C-200',
        serialNumber: 'SN654321',
        year: 2018,
        lastMaintenance: new Date('2025-03-20'),
        nextMaintenance: new Date('2025-09-20'),
        createdAt: new Date('2018-06-10'),
        createdBy: { name: 'Derek', avatar: 'D', role: 'Engineer' },
        createdByAvatar: 'D',
        qrCode: 'COMP-B-002',
        workOrderHistory: 12,
        parts: ['Filter', 'Belt'],
        meters: [{ name: 'Pressure', value: '0', unit: 'PSI' }],
        history: [],
        workOrders: []
      }
    ];

    // Add all sub-assets to the main assets array for search functionality
    this.addSubAssetsToArray(subAssets1);
  }

  private addSubAssetsToArray(subAssets: Asset[]) {
    subAssets.forEach(subAsset => {
      this.allAssets.push(subAsset);
      if (subAsset.subAssets && subAsset.subAssets.length > 0) {
        this.addSubAssetsToArray(subAsset.subAssets);
      }
    });
  }

  private initializeDefaultSelection() {
    if (this.allAssets.length > 0) {
      const topLevelAssets = this.allAssets.filter(asset => !asset.parentAssetId);
      this.selectedAssetId = topLevelAssets.length > 0 ? topLevelAssets[0].id : this.allAssets[0].id;
    } else {
      this.selectedAssetId = 0; // Reset to invalid ID
    }
  }

  private initializeFilters() {
    // Initialize filtered arrays
    if (this.selectedAsset) {
      this.filteredHistory = [...this.selectedAsset.history].sort((a, b) => b.date.getTime() - a.date.getTime());
      this.filteredWorkOrders = this.selectedAsset.workOrders;
    }

    // Initialize open work orders from all assets
    this.openWorkOrders = [];
    this.allAssets.forEach(asset => {
      if (asset.workOrders) {
        const openOrders = asset.workOrders.filter(wo => wo.status === 'open');
        this.openWorkOrders.push(...openOrders);
      }
    });
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

  get currentViewModeLabel(): string {
    const mode = this.viewModes.find(vm => vm.value === this.currentViewMode);
    return mode ? `${mode.icon} ${mode.label}` : '📋 Panel View';
  }

  get filteredAssets(): Asset[] {
    if (!this.searchTerm) {
      // Only show top-level assets (no parentAssetId) in the main list
      return this.allAssets.filter(asset => !asset.parentAssetId);
    }

    const term = this.searchTerm.toLowerCase();
    return this.allAssets.filter(asset =>
      !asset.parentAssetId && (
        asset.name.toLowerCase().includes(term) ||
        asset.description.toLowerCase().includes(term) ||
        asset.location.toLowerCase().includes(term) ||
        asset.assetType.toLowerCase().includes(term) ||
        (asset.manufacturer && typeof asset.manufacturer === 'string' && asset.manufacturer.toLowerCase().includes(term)) ||
        (asset.manufacturer && typeof asset.manufacturer === 'object' && asset.manufacturer.name.toLowerCase().includes(term)) ||
        (asset.model && asset.model.toLowerCase().includes(term))
      )
    );
  }

  get selectedAsset(): Asset | undefined {
    if (this.allAssets.length === 0) {
      return undefined;
    }
    const asset = this.allAssets.find(asset => asset.id === this.selectedAssetId);
    if (!asset) {
      // Fallback to first asset if selected asset not found
      return this.allAssets[0];
    }
    return asset;
  }

  get assetsWithoutManufacturer(): number {
    return this.allAssets.filter(asset => !asset.manufacturer || !asset.model).length;
  }

  // Asset selection methods
  selectAsset(id: number) {
    this.selectedAssetId = id;
    this.selectedTab = 'details'; // Reset to details tab when selecting new asset
    this.currentView = 'details'; // Reset to details view
    this.parentAsset = null;
    this.breadcrumbs = [];

    // Reset and refresh filters for the new asset
    this.historyFilter = 'all';
    this.onHistoryFilter();
    this.onWorkOrderFilter();
  }

  // Sub-assets navigation methods
  showSubAssets(asset: Asset) {
    if (asset.subAssets && asset.subAssets.length > 0) {
      this.currentView = 'sub-assets';
      this.parentAsset = asset;
      this.breadcrumbs.push(asset);
      this.currentHierarchyLevel++;
      this.clearBulkSelection();
    }
  }

  selectSubAsset(subAsset: Asset) {
    this.selectedAssetId = subAsset.id;
    this.currentView = 'details';
    this.clearBulkSelection();
    // Keep breadcrumbs for navigation
  }

  goBackToParent() {
    if (this.breadcrumbs.length > 1) {
      // Go back one level in the hierarchy
      this.breadcrumbs.pop(); // Remove current level
      const previousParent = this.breadcrumbs[this.breadcrumbs.length - 1];
      this.parentAsset = previousParent;
      this.selectedAssetId = previousParent.id;
      this.currentView = 'sub-assets';
      this.currentHierarchyLevel--;
    } else if (this.breadcrumbs.length === 1) {
      // Go back to top level
      const topLevelAsset = this.breadcrumbs[0];
      this.selectedAssetId = topLevelAsset.id;
      this.currentView = 'details';
      this.parentAsset = null;
      this.breadcrumbs = [];
      this.currentHierarchyLevel = 0;
    }
    this.clearBulkSelection();
  }

  navigateToAsset(asset: Asset) {
    // Navigate directly to an asset in the breadcrumb
    const assetIndex = this.breadcrumbs.findIndex(a => a.id === asset.id);
    if (assetIndex !== -1) {
      // Remove all breadcrumbs after this asset
      this.breadcrumbs = this.breadcrumbs.slice(0, assetIndex + 1);
      this.selectedAssetId = asset.id;
      this.currentView = 'details';
      this.parentAsset = null;
      this.currentHierarchyLevel = assetIndex;
      this.clearBulkSelection();
    }
  }

  getSubAssetsCount(asset: Asset): number {
    return asset.subAssets ? asset.subAssets.length : 0;
  }

  getTotalSubAssetsCount(asset: Asset): number {
    let total = asset.subAssets ? asset.subAssets.length : 0;
    if (asset.subAssets) {
      asset.subAssets.forEach(subAsset => {
        total += this.getTotalSubAssetsCount(subAsset);
      });
    }
    return total;
  }

  // Asset dialog methods (for table view)
  openAssetDialog(asset: Asset) {
    this.selectedAssetForDialog = asset;
    this.showAssetDialog = true;
  }

  closeAssetDialog() {
    this.showAssetDialog = false;
    this.selectedAssetForDialog = null;
  }

  // Tab methods
  switchTab(tab: string) {
    this.selectedTab = tab;
  }

  // Info bar methods
  closeInfoBar() {
    this.showInfoBar = false;
  }

  // Bulk operations methods
  toggleBulkSelectionMode() {
    this.bulkSelectionMode = !this.bulkSelectionMode;
    if (!this.bulkSelectionMode) {
      this.clearBulkSelection();
    }
  }

  toggleSubAssetSelection(assetId: number) {
    if (this.selectedSubAssets.has(assetId)) {
      this.selectedSubAssets.delete(assetId);
    } else {
      this.selectedSubAssets.add(assetId);
    }
  }

  isSubAssetSelected(assetId: number): boolean {
    return this.selectedSubAssets.has(assetId);
  }

  selectAllSubAssets() {
    if (this.parentAsset?.subAssets) {
      this.parentAsset.subAssets.forEach(asset => {
        this.selectedSubAssets.add(asset.id);
      });
    }
  }

  clearBulkSelection() {
    this.selectedSubAssets.clear();
    this.showBulkActionsMenu = false;
  }

  getSelectedSubAssetsCount(): number {
    return this.selectedSubAssets.size;
  }

  toggleBulkActionsMenu() {
    this.showBulkActionsMenu = !this.showBulkActionsMenu;
  }

  bulkUpdateStatus(newStatus: 'online' | 'offline' | 'maintenance' | 'needs-attention') {
    this.selectedSubAssets.forEach(assetId => {
      const asset = this.allAssets.find(a => a.id === assetId);
      if (asset) {
        asset.status = newStatus;
        this.addHistoryRecord(asset, `Status changed to ${newStatus}`, 'status-change');
      }
    });
    this.clearBulkSelection();
  }

  bulkDelete() {
    if (confirm(`Are you sure you want to delete ${this.getSelectedSubAssetsCount()} sub-assets?`)) {
      this.selectedSubAssets.forEach(assetId => {
        // Remove from parent's subAssets array
        if (this.parentAsset?.subAssets) {
          this.parentAsset.subAssets = this.parentAsset.subAssets.filter(a => a.id !== assetId);
        }
        // Remove from main assets array
        this.allAssets = this.allAssets.filter(a => a.id !== assetId);
      });
      this.clearBulkSelection();
    }
  }

  // Create sub-asset modal methods
  openCreateSubAssetModal() {
    this.resetNewSubAssetForm();
    if (this.parentAsset && this.newSubAsset.inheritFromParent) {
      this.applyInheritance();
    }
    this.showCreateSubAssetModal = true;
  }

  openCreateSubAssetModalForParent(asset: Asset) {
    // Set the selected asset as the new parent for the sub-asset
    this.parentAsset = asset;
    this.resetNewSubAssetForm();
    if (this.newSubAsset.inheritFromParent) {
      this.applyInheritance();
    }
    this.showCreateSubAssetModal = true;
  }

  closeCreateSubAssetModal() {
    this.showCreateSubAssetModal = false;
    this.resetNewSubAssetForm();
  }

  resetNewSubAssetForm() {
    this.newSubAsset = {
      name: '',
      description: '',
      assetType: 'Component',
      location: '',
      criticality: 'medium' as 'low' | 'medium' | 'high' | 'critical',
      status: 'online' as 'online' | 'offline' | 'maintenance' | 'needs-attention',
      manufacturer: '',
      model: '',
      serialNumber: '',
      inheritFromParent: true
    };
  }

  onInheritanceToggle() {
    if (this.newSubAsset.inheritFromParent && this.parentAsset) {
      this.applyInheritance();
    } else {
      // Reset to default values when inheritance is disabled
      this.newSubAsset.location = '';
      this.newSubAsset.criticality = 'medium';
      this.newSubAsset.manufacturer = '';
    }
  }

  applyInheritance() {
    if (this.parentAsset) {
      // Inherit location (with sub-section)
      this.newSubAsset.location = this.parentAsset.location;

      // Inherit criticality (but allow override)
      this.newSubAsset.criticality = this.parentAsset.criticality;

      // Inherit manufacturer if available
      if (this.parentAsset.manufacturer) {
        if (typeof this.parentAsset.manufacturer === 'string') {
          this.newSubAsset.manufacturer = this.parentAsset.manufacturer;
        } else {
          this.newSubAsset.manufacturer = this.parentAsset.manufacturer.name;
        }
      }
    }
  }

  validateSubAssetForm(): boolean {
    return this.newSubAsset.name.trim() !== '' &&
           this.newSubAsset.description.trim() !== '' &&
           this.newSubAsset.assetType.trim() !== '';
  }

  createSubAsset() {
    if (!this.validateSubAssetForm()) {
      alert('Please fill in all required fields (Name, Description, Asset Type)');
      return;
    }

    if (!this.parentAsset) {
      alert('No parent asset selected');
      return;
    }

    // Generate new ID
    const newId = Math.max(...this.allAssets.map(a => a.id)) + 1;

    // Create new sub-asset
    const newSubAsset: Asset = {
      id: newId,
      name: this.newSubAsset.name,
      description: this.newSubAsset.description,
      status: this.newSubAsset.status,
      criticality: this.newSubAsset.criticality,
      location: this.newSubAsset.location || this.parentAsset.location,
      manufacturer: this.newSubAsset.manufacturer,
      model: this.newSubAsset.model,
      serialNumber: this.newSubAsset.serialNumber,
      year: new Date().getFullYear(),
      assetType: this.newSubAsset.assetType,
      createdAt: new Date(),
      createdBy: { name: 'Current User', avatar: 'CU', role: 'User' },
      createdByAvatar: 'CU',
      qrCode: `${this.parentAsset.qrCode}-${(this.parentAsset.subAssets?.length || 0) + 1}`,
      workOrderHistory: 0,
      parts: [],
      meters: [],
      history: [
        {
          id: newId * 1000,
          date: new Date(),
          action: 'Created sub-asset',
          details: `Created as sub-asset of ${this.parentAsset.name}.`,
          updatedBy: 'Current User',
          updatedByAvatar: 'CU',
          type: 'created'
        }
      ],
      workOrders: [],
      parentAssetId: this.parentAsset.id,
      subAssets: []
    };

    // Add to parent's sub-assets
    if (!this.parentAsset.subAssets) {
      this.parentAsset.subAssets = [];
    }
    this.parentAsset.subAssets.push(newSubAsset);

    // Add to main assets array
    this.allAssets.push(newSubAsset);

    // Add history record to parent
    this.addHistoryRecord(this.parentAsset, `Sub-asset "${newSubAsset.name}" created`, 'updated');

    console.log('Created new sub-asset:', newSubAsset);
    this.closeCreateSubAssetModal();
  }

  addHistoryRecord(asset: Asset, action: string, type: string) {
    const newHistoryId = Math.max(...asset.history.map(h => h.id), 0) + 1;
    asset.history.unshift({
      id: newHistoryId,
      date: new Date(),
      action: action,
      details: action,
      updatedBy: 'Current User',
      updatedByAvatar: 'CU',
      type: type
    });
  }

  // Utility methods
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'online': return 'status-online';
      case 'offline': return 'status-offline';
      case 'maintenance': return 'status-maintenance';
      case 'needs-attention': return 'status-needs-attention';
      default: return 'status-default';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'maintenance': return 'Maintenance';
      case 'needs-attention': return 'Needs Attention';
      default: return status;
    }
  }

  // Image modal methods
  closeImageModal() {
    this.imageModalVisible = false;
    this.selectedImage = null;
  }

  // Sub-asset dialog method
  closeSubAssetDialog() {
    // This method can be used for closing sub-asset dialogs
    // Implementation can be added as needed
  }

  openImageModal(image: any) {
    this.selectedImage = image;
    this.imageModalVisible = true;
  }

  addImage() {
    // Implementation for adding images
    console.log('Add image functionality');
  }

  editSubAsset(subAsset: Asset) {
    // Implementation for editing sub-assets
    console.log('Edit sub-asset:', subAsset);
  }

  onHistoryFilter() {
    // Filter history based on current filters
    if (!this.selectedAsset) return;

    let filtered = this.selectedAsset.history.filter(event => {
      if (this.historyFilter !== 'all' && event.type !== this.historyFilter) {
        return false;
      }

      // Add date filtering logic if dates are provided
      if (this.historyStartDate) {
        const startDate = new Date(this.historyStartDate);
        if (event.date < startDate) return false;
      }

      if (this.historyEndDate) {
        const endDate = new Date(this.historyEndDate);
        if (event.date > endDate) return false;
      }

      return true;
    });

    // Sort by date (newest first)
    this.filteredHistory = filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  trackByEventId(index: number, event: HistoryRecord): number {
    return event.id;
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'created': return '➕';
      case 'updated': return '✏️';
      case 'maintenance': return '🔧';
      case 'status-change': return '🔄';
      case 'upgrade': return '⬆️';
      case 'location-change': return '📍';
      case 'inspection': return '🔍';
      case 'configuration': return '⚙️';
      case 'warranty': return '📋';
      case 'calibration': return '🎯';
      case 'documentation': return '📄';
      case 'compliance': return '✅';
      case 'training': return '🎓';
      case 'software-update': return '💾';
      case 'commissioned': return '🚀';
      case 'installation': return '🔨';
      case 'manufactured': return '🏭';
      default: return 'ℹ️';
    }
  }

  onWorkOrderFilter() {
    // Filter work orders based on status
    if (!this.selectedAsset) return;

    this.filteredWorkOrders = this.selectedAsset.workOrders.filter(wo => {
      return this.workOrderStatusFilter === 'all' || wo.status === this.workOrderStatusFilter;
    });
  }

  trackByWorkOrderId(index: number, workOrder: WorkOrder): number {
    return workOrder.id;
  }

  openWorkOrder(workOrder: WorkOrder) {
    // Implementation for opening work order details
    console.log('Open work order:', workOrder);
  }

  createWorkOrder() {
    // Implementation for creating new work order
    console.log('Create new work order');
  }

  saveAsset() {
    // Implementation for saving asset
    console.log('Save asset:', this.assetFormData);
    this.assetDialogVisible = false;
  }

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
  }

  saveSubAsset() {
    // Implementation for saving sub-asset
    console.log('Save sub-asset:', this.newSubAsset);
    this.subAssetDialogVisible = false;
  }

  showChartTooltip(point: any, event: any) {
    this.chartTooltip = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      date: point.date,
      count: point.count
    };
  }

  hideChartTooltip() {
    this.chartTooltip.visible = false;
  }

  // Helper methods for union types
  getAssignedToName(assignedTo: string | { name: string; avatar: string }): string {
    if (typeof assignedTo === 'string') {
      return assignedTo;
    }
    return assignedTo.name || 'Unassigned';
  }

  getManufacturerName(manufacturer: string | { name: string; logo: string; description: string } | undefined): string {
    if (!manufacturer) return '';
    if (typeof manufacturer === 'string') {
      return manufacturer;
    }
    return manufacturer.name;
  }

  getManufacturerLogo(manufacturer: string | { name: string; logo: string; description: string } | undefined): string {
    if (!manufacturer) return '';
    if (typeof manufacturer === 'string') {
      return '/assets/default-manufacturer-logo.png';
    }
    return manufacturer.logo;
  }

  getManufacturerDescription(manufacturer: string | { name: string; logo: string; description: string } | undefined): string {
    if (!manufacturer) return '';
    if (typeof manufacturer === 'string') {
      return manufacturer;
    }
    return manufacturer.description;
  }

  // Navigation and view methods
  setView(view: string) {
    // Implementation for setting view
    console.log('Set view:', view);
  }

  onSearchChange() {
    // Implementation for search functionality
    console.log('Search query:', this.searchQuery);
  }

  setViewMode(mode: string) {
    this.viewMode = mode;
  }

  trackByAssetId(index: number, asset: Asset): number {
    return asset.id;
  }

  editAsset(asset: Asset) {
    this.editingAsset = asset;
    this.assetDialogVisible = true;
    // Copy asset data to form
    Object.assign(this.assetFormData, asset);
  }

  deleteAsset(asset: Asset) {
    if (confirm('Are you sure you want to delete this asset?')) {
      this.allAssets = this.allAssets.filter(a => a.id !== asset.id);
    }
  }

  onCategoryFilter() {
    // Implementation for category filtering
    console.log('Filter by category:', this.selectedCategory);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  contactManufacturer() {
    // Implementation for contacting manufacturer
    console.log('Contact manufacturer');
  }

  // Override selectAsset to accept Asset object
  selectAssetObject(asset: Asset) {
    this.selectAsset(asset.id);
  }

  // Override openAssetDialog to not require parameters
  openAssetDialogNew() {
    this.editingAsset = null;
    this.assetDialogVisible = true;
    // Reset form data
    this.assetFormData = {
      name: '',
      assetType: '',
      location: '',
      status: 'online',
      serialNumber: '',
      model: '',
      purchaseDate: '',
      costCenter: '',
      description: ''
    };
  }

  // Work Order Chart Methods
  private initializeWorkOrderChart() {
    // Generate work order chart data for last 70 days
    const chartData = this.generateWorkOrderChartData();
    this.createWorkOrderChartElements(chartData);
  }

  private generateWorkOrderChartData() {
    const data = [];
    const today = new Date();

    // Generate data for last 70 days
    for (let i = 69; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Simulate work order counts (0-6 work orders per day)
      const count = Math.floor(Math.random() * 7);

      data.push({
        date: date,
        count: count,
        dateString: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }

    return data;
  }

  private createWorkOrderChartElements(data: any[]) {
    const chartWidth = 800;
    const chartHeight = 200;
    const padding = { top: 20, right: 50, bottom: 40, left: 50 };
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;

    const maxCount = Math.max(...data.map(d => d.count), 6);

    // Create grid lines
    this.workOrderChartGridLines = [];
    for (let i = 0; i <= maxCount; i++) {
      const y = padding.top + (plotHeight * (maxCount - i) / maxCount);
      this.workOrderChartGridLines.push({
        x1: padding.left,
        x2: chartWidth - padding.right,
        y: y
      });
    }

    // Create chart points and path
    this.workOrderChartPoints = [];
    let pathData = '';

    data.forEach((item, index) => {
      const x = padding.left + (plotWidth * index / (data.length - 1));
      const y = padding.top + (plotHeight * (maxCount - item.count) / maxCount);

      this.workOrderChartPoints.push({
        x: x,
        y: y,
        date: item.dateString,
        count: item.count
      });

      if (index === 0) {
        pathData = `M${x},${plotHeight + padding.top} L${x},${y}`;
      } else {
        pathData += ` L${x},${y}`;
      }
    });

    // Close the path for fill
    pathData += ` L${chartWidth - padding.right},${plotHeight + padding.top} Z`;
    this.workOrderChartPath = pathData;

    // Create X-axis labels (show every 10th day)
    this.workOrderChartXLabels = [];
    data.forEach((item, index) => {
      if (index % 10 === 0 || index === data.length - 1) {
        const x = padding.left + (plotWidth * index / (data.length - 1));
        this.workOrderChartXLabels.push({
          x: x,
          text: item.dateString
        });
      }
    });

    // Create Y-axis labels
    this.workOrderChartYLabels = [];
    for (let i = 0; i <= maxCount; i++) {
      const y = padding.top + (plotHeight * (maxCount - i) / maxCount) + 5;
      this.workOrderChartYLabels.push({
        y: y,
        text: i.toString()
      });
    }
  }

  // Work Order List Methods
  getAssetWorkOrders(): WorkOrder[] {
    if (!this.selectedAsset) return [];

    // Get work orders for the selected asset and all its sub-assets
    let allWorkOrders: WorkOrder[] = [];

    // Add work orders from selected asset
    if (this.selectedAsset.workOrders) {
      allWorkOrders = [...this.selectedAsset.workOrders];
    }

    // Add work orders from sub-assets recursively
    const getSubAssetWorkOrders = (asset: Asset) => {
      if (asset.subAssets) {
        asset.subAssets.forEach(subAsset => {
          if (subAsset.workOrders) {
            allWorkOrders = [...allWorkOrders, ...subAsset.workOrders];
          }
          getSubAssetWorkOrders(subAsset);
        });
      }
    };

    getSubAssetWorkOrders(this.selectedAsset);

    // Filter for open work orders only
    return allWorkOrders.filter(wo => wo.status === 'open' || wo.status === 'in-progress');
  }

  getWorkOrderAssetName(workOrder: WorkOrder): string {
    // Find which asset this work order belongs to
    const findAssetForWorkOrder = (asset: Asset): Asset | null => {
      if (asset.workOrders?.some(wo => wo.id === workOrder.id)) {
        return asset;
      }

      if (asset.subAssets) {
        for (const subAsset of asset.subAssets) {
          const found = findAssetForWorkOrder(subAsset);
          if (found) return found;
        }
      }

      return null;
    };

    if (this.selectedAsset) {
      const asset = findAssetForWorkOrder(this.selectedAsset);
      return asset?.name || 'Unknown Asset';
    }

    return 'Unknown Asset';
  }

  getWorkOrderLocation(workOrder: WorkOrder): string {
    // Find which asset this work order belongs to and return its location
    const findAssetForWorkOrder = (asset: Asset): Asset | null => {
      if (asset.workOrders?.some(wo => wo.id === workOrder.id)) {
        return asset;
      }

      if (asset.subAssets) {
        for (const subAsset of asset.subAssets) {
          const found = findAssetForWorkOrder(subAsset);
          if (found) return found;
        }
      }

      return null;
    };

    if (this.selectedAsset) {
      const asset = findAssetForWorkOrder(this.selectedAsset);
      return asset?.location || 'Unknown Location';
    }

    return 'Unknown Location';
  }

  openChartConfig() {
    // Implementation for chart configuration dialog
    console.log('Open chart configuration');
  }
}
