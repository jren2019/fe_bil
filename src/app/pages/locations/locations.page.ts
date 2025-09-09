import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';

interface Meter {
  id: number;
  name: string;
  unit: string;
  value?: string;
  status?: 'overdue' | 'normal' | 'warning';
  link?: string;
}

interface WorkOrderHistoryItem {
  id: number;
  title: string;
  requestedBy: string;
  status: 'open' | 'closed' | 'overdue';
  category: string;
  categoryColor: string;
  number: string;
}

interface Location {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  subLocations?: Location[];
  teamsInCharge?: string[];
  assets?: string[];
  procedures?: string[];
  meters?: Meter[];
  workOrderHistory?: WorkOrderHistoryItem[];
}

interface LocationFilter {
  teamsInCharge: boolean;
  asset: boolean;
  procedure: boolean;
}

@Component({
  selector: 'app-locations-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavMenuComponent,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    TextareaModule,
    CheckboxModule,
    ChartModule
  ],
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss']
})
export class LocationsPageComponent implements OnInit {
  // View state
  panelView: string = 'Panel View';
  searchTerm: string = '';
  sortBy: string = 'Name: Ascending Order';
  selectedLocationId: number | null = 1; // Default to "General"
  showSubLocations: boolean = false;
  selectedParentLocation: Location | null = null;

  // Modal states
  showNewLocationModal: boolean = false;
  showEditLocationModal: boolean = false;
  showDeleteConfirmModal: boolean = false;

  // Filters
  activeFilters: LocationFilter = {
    teamsInCharge: false,
    asset: false,
    procedure: false
  };

  // Form data
  newLocation = {
    name: '',
    description: '',
    parentId: null as number | null,
    isActive: true,
    qr: ''
  };

  editLocation = {
    id: 0,
    name: '',
    description: '',
    parentId: null as number | null,
    isActive: true
  };

  // Sample data
  workOrderChartData: any = {
    labels: ['3/30/2025', '4/7/2025', '4/14/2025', '4/21/2025', '4/28/2025', '5/5/2025', '5/12/2025', '5/19/2025'],
    datasets: [
      {
        label: 'Work Orders',
        data: [0, 0, 0, 0, 0, 2, 4, 1],
        fill: false,
        borderColor: '#1a6cff',
        tension: 0.4,
        pointBackgroundColor: '#1a6cff',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
        backgroundColor: 'rgba(26,108,255,0.1)'
      }
    ]
  };

  workOrderChartOptions: any = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { min: 0, max: 10, ticks: { stepSize: 2 }, grid: { color: '#e5eaf2' } }
    }
  };

  mockWorkOrders = [
    { title: 'test', requestedBy: 'luss', type: 'Electrical', status: 'Open' },
    { title: 'Project 000866', requestedBy: 'Jun Ren', type: 'Electrical', status: 'Overdue' }
  ];
  allLocations: Location[] = [
    {
      id: 1,
      name: 'General',
      description: 'Main facility area',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      teamsInCharge: ['Maintenance Team', 'Security'],
      assets: ['HVAC System', 'Main Electrical Panel'],
      procedures: ['Daily Safety Check', 'Emergency Evacuation'],
      meters: [
        { id: 1, name: 'line 5 - Moulder', unit: 'Inches', value: '12', status: 'normal' },
        { id: 2, name: 'line 5 deposits', unit: 'Volts', value: '220', status: 'overdue' },
        { id: 3, name: 'line 5 shippers', unit: 'Feet', value: '450', status: 'normal', link: '#' },
        { id: 6, name: 'Air Pressure', unit: 'PSI', value: '80', status: 'normal' }
      ],
      workOrderHistory: [
        {
          id: 1,
          title: 'Test work order',
          requestedBy: 'Jun Ren',
          status: 'overdue',
          category: 'Electrical',
          categoryColor: '#667eea',
          number: '#1'
        },
        {
          id: 4,
          title: 'Replace filter on HVAC',
          requestedBy: 'Maintenance Team',
          status: 'open',
          category: 'Maintenance',
          categoryColor: '#22c55e',
          number: '#4'
        }
      ],
      subLocations: [
        {
          id: 11,
          name: 'General Office',
          description: 'Administrative office space',
          parentId: 1,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          teamsInCharge: ['Admin Team'],
          assets: ['Office Computers', 'Printer Network'],
          procedures: ['Daily Cleanup', 'IT Security Check']
        }
      ]
    },
    {
      id: 2,
      name: 'General Storage',
      description: 'Main storage facility',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      teamsInCharge: ['Warehouse Team'],
      assets: ['Storage Racks', 'Forklift'],
      procedures: ['Inventory Count', 'Safety Inspection'],
      meters: [
        { id: 4, name: 'Temperature Monitor', unit: 'Celsius', value: '22', status: 'normal' },
        { id: 5, name: 'Humidity Sensor', unit: 'Percentage', value: '45', status: 'normal' },
        { id: 7, name: 'Door Counter', unit: 'Openings', value: '135', status: 'normal' }
      ],
      workOrderHistory: [
        {
          id: 2,
          title: 'Storage rack maintenance',
          requestedBy: 'Warehouse Manager',
          status: 'open',
          category: 'Maintenance',
          categoryColor: '#10b981',
          number: '#2'
        },
        {
          id: 5,
          title: 'Forklift battery check',
          requestedBy: 'Warehouse Team',
          status: 'closed',
          category: 'Inspection',
          categoryColor: '#f59e0b',
          number: '#5'
        }
      ],
      subLocations: [
        {
          id: 21,
          name: 'Cold Storage',
          description: 'Temperature controlled storage',
          parentId: 2,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          teamsInCharge: ['Cold Storage Team'],
          assets: ['Refrigeration Units', 'Temperature Monitors'],
          procedures: ['Temperature Check', 'Equipment Maintenance']
        },
        {
          id: 22,
          name: 'Dry Storage',
          description: 'Ambient temperature storage',
          parentId: 2,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          teamsInCharge: ['Warehouse Team'],
          assets: ['Shelving Units', 'Barcode Scanners'],
          procedures: ['Weekly Inventory', 'Pest Control Check']
        }
      ]
    },
    {
      id: 3,
      name: 'Manufacturing Floor',
      description: 'Production area',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      teamsInCharge: ['Production Team', 'Quality Control'],
      assets: ['Production Line A', 'Production Line B'],
      procedures: ['Daily Startup Check', 'Quality Inspection'],
      meters: [
        { id: 8, name: 'Power Consumption', unit: 'kWh', value: '1200', status: 'normal' },
        { id: 9, name: 'Water Usage', unit: 'gal', value: '300', status: 'normal' }
      ],
      workOrderHistory: [
        {
          id: 6,
          title: 'Calibrate sensors on Line A',
          requestedBy: 'Quality Control',
          status: 'open',
          category: 'Calibration',
          categoryColor: '#3b82f6',
          number: '#6'
        }
      ],
      subLocations: [
        {
          id: 31,
          name: 'Assembly Line 1',
          description: 'Primary assembly line',
          parentId: 3,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          teamsInCharge: ['Assembly Team A'],
          assets: ['Conveyor Belt', 'Assembly Stations'],
          procedures: ['Pre-shift Inspection', 'End-of-shift Cleanup'],
          meters: [
            { id: 10, name: 'Line Speed', unit: 'units/hr', value: '240', status: 'normal' }
          ],
          workOrderHistory: [
            {
              id: 7,
              title: 'Replace conveyor belt',
              requestedBy: 'Assembly Lead',
              status: 'open',
              category: 'Mechanical',
              categoryColor: '#ef4444',
              number: '#7'
            }
          ]
        },
        {
          id: 32,
          name: 'Assembly Line 2',
          description: 'Secondary assembly line',
          parentId: 3,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          teamsInCharge: ['Assembly Team B'],
          assets: ['Conveyor Belt', 'Assembly Stations'],
          procedures: ['Pre-shift Inspection', 'End-of-shift Cleanup'],
          workOrderHistory: [
            {
              id: 8,
              title: 'Lubricate bearings',
              requestedBy: 'Maintenance',
              status: 'closed',
              category: 'Maintenance',
              categoryColor: '#10b981',
              number: '#8'
            }
          ]
        },
        {
          id: 33,
          name: 'Quality Control Station',
          description: 'Quality testing area',
          parentId: 3,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          teamsInCharge: ['Quality Control'],
          assets: ['Testing Equipment', 'Measurement Tools'],
          procedures: ['Sample Testing', 'Equipment Calibration'],
          meters: [
            { id: 11, name: 'Test Throughput', unit: 'tests/hr', value: '35', status: 'normal' }
          ]
        }
      ]
    }
  ];

  // Dropdown options
  panelViewOptions = [
    { label: 'Panel View', value: 'Panel View' },
    { label: 'List View', value: 'List View' },
    { label: 'Grid View', value: 'Grid View' }
  ];

  sortOptions = [
    { label: 'Name: Ascending Order', value: 'name_asc' },
    { label: 'Name: Descending Order', value: 'name_desc' },
    { label: 'Created: Newest First', value: 'created_desc' },
    { label: 'Created: Oldest First', value: 'created_asc' }
  ];

  ngOnInit() {
    this.populateSubLocations();
  }

  // Populate sub-locations within parent locations
  private populateSubLocations() {
    this.allLocations.forEach(location => {
      if (!location.subLocations) {
        location.subLocations = [];
      }
    });
  }

  // Get filtered and sorted locations (only parent locations)
  get filteredLocations(): Location[] {
    return this.allLocations
      .filter(location => !location.parentId) // Only parent locations
      .filter(location => location.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .sort((a, b) => {
        switch (this.sortBy) {
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          case 'created_desc':
            return b.createdAt.getTime() - a.createdAt.getTime();
          case 'created_asc':
            return a.createdAt.getTime() - b.createdAt.getTime();
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }

  // Get selected location
  get selectedLocation(): Location | null {
    if (this.showSubLocations && this.selectedParentLocation) {
      return this.selectedParentLocation;
    }
    return this.allLocations.find(loc => loc.id === this.selectedLocationId) || null;
  }

  // Get sub-locations for display
  get currentSubLocations(): Location[] {
    if (this.showSubLocations && this.selectedParentLocation) {
      return this.selectedParentLocation.subLocations || [];
    }
    return [];
  }

  // Get sub-location count for a location
  getSubLocationCount(location: Location): number {
    return location.subLocations ? location.subLocations.length : 0;
  }

  // Select a location
  selectLocation(locationId: number) {
    this.selectedLocationId = locationId;
    this.showSubLocations = false;
    this.selectedParentLocation = null;
  }

  // Show sub-locations
  showLocationSubLocations(location: Location) {
    this.selectedParentLocation = location;
    this.showSubLocations = true;
    this.selectedLocationId = null;
  }

  // Go back to main locations view
  goBackToLocations() {
    this.showSubLocations = false;
    const parentId = this.selectedParentLocation?.id;
    this.selectedParentLocation = null;
    this.selectedLocationId = parentId || 1;
  }

  // Modal methods
  openNewLocationModal() {
    this.newLocation = {
      name: '',
      description: '',
      parentId: null,
      isActive: true,
      qr: ''
    };
    this.showNewLocationModal = true;
  }

  closeNewLocationModal() {
    this.showNewLocationModal = false;
  }

  openEditLocationModal(location: Location) {
    this.editLocation = {
      id: location.id,
      name: location.name,
      description: location.description || '',
      parentId: location.parentId ?? null,
      isActive: location.isActive
    };
    this.showEditLocationModal = true;
  }

  closeEditLocationModal() {
    this.showEditLocationModal = false;
  }

  // CRUD operations
  createLocation() {
    const newLoc: Location = {
      id: Math.max(...this.allLocations.map(l => l.id)) + 1,
      name: this.newLocation.name,
      description: this.newLocation.description,
      parentId: this.newLocation.parentId || undefined,
      isActive: this.newLocation.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
      subLocations: [],
      teamsInCharge: [],
      assets: [],
      procedures: []
    };

    if (this.newLocation.parentId) {
      // Add as sub-location
      const parentLocation = this.allLocations.find(l => l.id === this.newLocation.parentId);
      if (parentLocation) {
        if (!parentLocation.subLocations) {
          parentLocation.subLocations = [];
        }
        parentLocation.subLocations.push(newLoc);
      }
      // Also add to allLocations for easier searching
      this.allLocations.push(newLoc);
    } else {
      // Add as main location
      this.allLocations.push(newLoc);
    }

    this.closeNewLocationModal();
  }


  updateLocation() {
    const locationToUpdate = this.allLocations.find(l => l.id === this.editLocation.id);
    if (locationToUpdate) {
      locationToUpdate.name = this.editLocation.name;
      locationToUpdate.description = this.editLocation.description;
      locationToUpdate.isActive = this.editLocation.isActive;
      locationToUpdate.updatedAt = new Date();
    }
    this.closeEditLocationModal();
  }

  deleteLocation(locationId: number) {
    // Remove from main locations
    this.allLocations = this.allLocations.filter(l => l.id !== locationId);

    // Remove from sub-locations
    this.allLocations.forEach(location => {
      if (location.subLocations) {
        location.subLocations = location.subLocations.filter(sub => sub.id !== locationId);
      }
    });

    // Reset selection if deleted location was selected
    if (this.selectedLocationId === locationId) {
      this.selectedLocationId = this.allLocations.length > 0 ? this.allLocations[0].id : null;
    }
  }

  // Filter methods
  toggleFilter(filterType: keyof LocationFilter) {
    this.activeFilters[filterType] = !this.activeFilters[filterType];
  }

  // Copy link method
  copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      // You could add a toast notification here
      console.log('Link copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  }

  // Get available parent locations for dropdown
  get availableParentLocations() {
    return this.allLocations
      .filter(location => !location.parentId)
      .map(location => ({
        label: location.name,
        value: location.id
      }));
  }

  // Generate QR/Code helper (for template legacy binding)
  generateCode(event: Event) {
    event.preventDefault();
    this.newLocation.qr = Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}
