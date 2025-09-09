import { Component, OnInit } from '@angular/core';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Part {
  id: number;
  name: string;
  partNumber: string;
  description: string;
  category: string;
  vendor: string;
  location: string;
  stockLevel: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  totalValue: number;
  unit: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
  lastRestocked: Date;
  createdAt: Date;
  updatedAt: Date;
  barcode?: string;
  notes?: string;
}

interface ViewMode {
  value: string;
  label: string;
  icon: string;
}

interface RestockRequest {
  quantity: number;
  vendor: string;
  unitCost: number;
  notes: string;
  urgency: 'low' | 'medium' | 'high';
  requestedBy: string;
  deliveryDate?: Date;
}

type RightPanelMode = 'default' | 'edit';

@Component({
  selector: 'app-parts-page',
  standalone: true,
  imports: [
    CommonModule,
    NavMenuComponent,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    TableModule,
    PaginatorModule,
    FormsModule
  ],
  templateUrl: './parts.page.html',
  styleUrls: ['./parts.page.scss']
})
export class PartsPageComponent implements OnInit {
  // View modes
  viewModes: ViewMode[] = [
    { value: 'panel', label: 'Panel View', icon: '🏷️' },
    { value: 'table', label: 'Table View', icon: '📊' }
  ];

  currentViewMode: string = 'panel';
  showViewDropdown = false;

  // Search and filtering
  searchTerm = '';

  // Parts data
  allParts: Part[] = [];
  filteredParts: Part[] = [];

  // Right panel state
  rightPanelMode: RightPanelMode = 'default';

  // Details panel tabs
  activeDetailsTab: 'details' | 'history' = 'details';

  // Edit form state
  editForm = {
    name: '',
    partNumber: '',
    description: '',
    category: '',
    vendor: '',
    location: '',
    unitCost: 0,
    stockLevel: 0,
    minStock: 0,
    maxStock: 0,
    unit: '',
    barcode: '',
    notes: ''
  };

  // Part details dialog
  showPartDialog = false;
  selectedPartForDialog: Part | null = null;

  // Restock dialog
  showRestockDialog = false;
  selectedPartForRestock: Part | null = null;
  restockRequest: RestockRequest = {
    quantity: 0,
    vendor: '',
    unitCost: 0,
    notes: '',
    urgency: 'medium',
    requestedBy: 'Jun Ren',
    deliveryDate: undefined
  };

  // Dropdown options
  vendorOptions = [
    { label: 'ACME Parts Supply', value: 'acme-parts' },
    { label: 'Industrial Components Inc.', value: 'industrial-components' },
    { label: 'Precision Tools Ltd.', value: 'precision-tools' },
    { label: 'Quality Hardware Co.', value: 'quality-hardware' },
    { label: 'Reliable Parts Direct', value: 'reliable-parts' }
  ];

  urgencyOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
  ];

  // Edit form dropdown options
  categoryOptions = [
    { label: 'Hydraulic Components', value: 'Hydraulic Components' },
    { label: 'Bearings', value: 'Bearings' },
    { label: 'HVAC Components', value: 'HVAC Components' },
    { label: 'Fasteners', value: 'Fasteners' },
    { label: 'Motors', value: 'Motors' },
    { label: 'Conveyor Components', value: 'Conveyor Components' },
    { label: 'Safety Components', value: 'Safety Components' },
    { label: 'Lubricants', value: 'Lubricants' }
  ];

  locationOptions = [
    { label: 'Warehouse A - Section 1', value: 'Warehouse A - Section 1' },
    { label: 'Warehouse B - Section 3', value: 'Warehouse B - Section 3' },
    { label: 'Main Storage - Rack 7', value: 'Main Storage - Rack 7' },
    { label: 'Hardware Cabinet - Drawer 12', value: 'Hardware Cabinet - Drawer 12' },
    { label: 'Equipment Storage - Bay 2', value: 'Equipment Storage - Bay 2' },
    { label: 'Large Items - Zone C', value: 'Large Items - Zone C' },
    { label: 'Critical Parts - Secured Cabinet', value: 'Critical Parts - Secured Cabinet' },
    { label: 'Chemical Storage - Rack 4', value: 'Chemical Storage - Rack 4' }
  ];

  unitOptions = [
    { label: 'each', value: 'each' },
    { label: 'set', value: 'set' },
    { label: 'pack of 10', value: 'pack of 10' },
    { label: 'linear feet', value: 'linear feet' },
    { label: 'gallon', value: 'gallon' },
    { label: 'box', value: 'box' },
    { label: 'roll', value: 'roll' }
  ];

  ngOnInit() {
    this.initializePartsData();
    this.filterParts();
    // Auto-select first part in panel view
    if (this.currentViewMode === 'panel' && this.allParts.length > 0) {
      this.selectedPartForDialog = this.allParts[0];
    }
  }

  private initializePartsData() {
    this.allParts = [
      {
        id: 1,
        name: 'Hydraulic Pump Seal',
        partNumber: 'HPS-2024-001',
        description: 'High-pressure hydraulic pump seal for industrial applications',
        category: 'Hydraulic Components',
        vendor: 'ACME Parts Supply',
        location: 'Warehouse A - Section 1',
        stockLevel: 15,
        minStock: 10,
        maxStock: 50,
        unitCost: 125.99,
        totalValue: 1889.85,
        unit: 'each',
        status: 'in-stock',
        lastRestocked: new Date('2024-11-15'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-12-01'),
        barcode: '123456789012',
        notes: 'Compatible with Model X2000 pumps'
      },
      {
        id: 2,
        name: 'Ball Bearing Set',
        partNumber: 'BB-SKF-6205',
        description: 'SKF deep groove ball bearing set for motor applications',
        category: 'Bearings',
        vendor: 'Industrial Components Inc.',
        location: 'Warehouse B - Section 3',
        stockLevel: 5,
        minStock: 8,
        maxStock: 40,
        unitCost: 45.50,
        totalValue: 227.50,
        unit: 'set',
        status: 'low-stock',
        lastRestocked: new Date('2024-10-20'),
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-11-28'),
        barcode: '234567890123'
      },
      {
        id: 3,
        name: 'HVAC Filter Element',
        partNumber: 'HVAC-FLT-001',
        description: 'High-efficiency particulate air filter for HVAC systems',
        category: 'HVAC Components',
        vendor: 'Quality Hardware Co.',
        location: 'Main Storage - Rack 7',
        stockLevel: 0,
        minStock: 6,
        maxStock: 30,
        unitCost: 85.75,
        totalValue: 0,
        unit: 'each',
        status: 'out-of-stock',
        lastRestocked: new Date('2024-09-05'),
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-12-02'),
        barcode: '345678901234',
        notes: 'Order urgently - critical for HVAC maintenance'
      },
      {
        id: 4,
        name: 'Stainless Steel Bolts',
        partNumber: 'SSB-M8-50',
        description: 'M8 x 50mm stainless steel hex bolts with nuts and washers',
        category: 'Fasteners',
        vendor: 'Reliable Parts Direct',
        location: 'Hardware Cabinet - Drawer 12',
        stockLevel: 145,
        minStock: 50,
        maxStock: 200,
        unitCost: 2.25,
        totalValue: 326.25,
        unit: 'pack of 10',
        status: 'in-stock',
        lastRestocked: new Date('2024-11-25'),
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-11-30'),
        barcode: '456789012345'
      },
      {
        id: 5,
        name: 'Electric Motor 5HP',
        partNumber: 'EM-5HP-3P-460V',
        description: '5 HP three-phase electric motor, 460V, 1800 RPM',
        category: 'Motors',
        vendor: 'Industrial Components Inc.',
        location: 'Equipment Storage - Bay 2',
        stockLevel: 3,
        minStock: 2,
        maxStock: 8,
        unitCost: 1250.00,
        totalValue: 3750.00,
        unit: 'each',
        status: 'in-stock',
        lastRestocked: new Date('2024-10-10'),
        createdAt: new Date('2024-02-28'),
        updatedAt: new Date('2024-11-15'),
        barcode: '567890123456',
        notes: 'High-value item - restricted access'
      },
      {
        id: 6,
        name: 'Conveyor Belt',
        partNumber: 'CB-RUB-48-PLY2',
        description: '48" wide rubber conveyor belt, 2-ply construction',
        category: 'Conveyor Components',
        vendor: 'ACME Parts Supply',
        location: 'Large Items - Zone C',
        stockLevel: 2,
        minStock: 3,
        maxStock: 10,
        unitCost: 580.00,
        totalValue: 1160.00,
        unit: 'linear feet',
        status: 'low-stock',
        lastRestocked: new Date('2024-08-15'),
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-12-01'),
        barcode: '678901234567'
      },
      {
        id: 7,
        name: 'Safety Valve',
        partNumber: 'SV-PRV-150PSI',
        description: 'Pressure relief valve, 150 PSI setting, brass construction',
        category: 'Safety Components',
        vendor: 'Precision Tools Ltd.',
        location: 'Critical Parts - Secured Cabinet',
        stockLevel: 8,
        minStock: 5,
        maxStock: 20,
        unitCost: 195.00,
        totalValue: 1560.00,
        unit: 'each',
        status: 'in-stock',
        lastRestocked: new Date('2024-11-05'),
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-11-20'),
        barcode: '789012345678',
        notes: 'Requires certification documentation'
      },
      {
        id: 8,
        name: 'Lubrication Oil',
        partNumber: 'LUB-SAE30-5GAL',
        description: 'SAE 30 industrial lubrication oil, 5-gallon container',
        category: 'Lubricants',
        vendor: 'Quality Hardware Co.',
        location: 'Chemical Storage - Rack 4',
        stockLevel: 12,
        minStock: 8,
        maxStock: 25,
        unitCost: 45.99,
        totalValue: 551.88,
        unit: 'gallon',
        status: 'in-stock',
        lastRestocked: new Date('2024-11-18'),
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-11-25'),
        barcode: '890123456789'
      }
    ];
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
    return mode ? `${mode.icon} ${mode.label}` : '🏷️ Panel View';
  }

  get isEditMode(): boolean {
    return this.rightPanelMode === 'edit';
  }

  get isDefaultMode(): boolean {
    return this.rightPanelMode === 'default';
  }

  // Search and filtering
  onSearchChange() {
    this.filterParts();
  }

  private filterParts() {
    if (!this.searchTerm.trim()) {
      this.filteredParts = [...this.allParts];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredParts = this.allParts.filter(part =>
        part.name.toLowerCase().includes(term) ||
        part.partNumber.toLowerCase().includes(term) ||
        part.description.toLowerCase().includes(term) ||
        part.category.toLowerCase().includes(term) ||
        part.vendor.toLowerCase().includes(term)
      );
    }
  }

  // Part selection methods
  selectPart(part: Part) {
    this.selectedPartForDialog = part;
    // Reset to default mode when selecting a new part
    this.rightPanelMode = 'default';
    // Reset details tab when switching parts
    this.activeDetailsTab = 'details';
  }

  // Part dialog methods (for table view)
  openPartDialog(part: Part) {
    this.selectedPartForDialog = part;
    this.showPartDialog = true;
  }

  closePartDialog() {
    this.showPartDialog = false;
    this.selectedPartForDialog = null;
  }

  // Edit mode methods
  switchToEditMode() {
    if (this.selectedPartForDialog) {
      this.populateEditForm(this.selectedPartForDialog);
      this.rightPanelMode = 'edit';
    }
  }

  goBackToDefault() {
    this.rightPanelMode = 'default';
  }

  private populateEditForm(part: Part) {
    this.editForm = {
      name: part.name,
      partNumber: part.partNumber,
      description: part.description,
      category: part.category,
      vendor: part.vendor,
      location: part.location,
      unitCost: part.unitCost,
      stockLevel: part.stockLevel,
      minStock: part.minStock,
      maxStock: part.maxStock,
      unit: part.unit,
      barcode: part.barcode || '',
      notes: part.notes || ''
    };
  }

  updatePart() {
    if (this.selectedPartForDialog) {
      // Update the selected part with form data
      this.selectedPartForDialog.name = this.editForm.name;
      this.selectedPartForDialog.partNumber = this.editForm.partNumber;
      this.selectedPartForDialog.description = this.editForm.description;
      this.selectedPartForDialog.category = this.editForm.category;
      this.selectedPartForDialog.vendor = this.editForm.vendor;
      this.selectedPartForDialog.location = this.editForm.location;
      this.selectedPartForDialog.unitCost = this.editForm.unitCost;
      this.selectedPartForDialog.stockLevel = this.editForm.stockLevel;
      this.selectedPartForDialog.minStock = this.editForm.minStock;
      this.selectedPartForDialog.maxStock = this.editForm.maxStock;
      this.selectedPartForDialog.unit = this.editForm.unit;
      this.selectedPartForDialog.barcode = this.editForm.barcode;
      this.selectedPartForDialog.notes = this.editForm.notes;
      this.selectedPartForDialog.updatedAt = new Date();

      // Update total value
      this.selectedPartForDialog.totalValue = this.selectedPartForDialog.stockLevel * this.selectedPartForDialog.unitCost;

      // Update status based on stock level
      if (this.selectedPartForDialog.stockLevel === 0) {
        this.selectedPartForDialog.status = 'out-of-stock';
      } else if (this.selectedPartForDialog.stockLevel <= this.selectedPartForDialog.minStock) {
        this.selectedPartForDialog.status = 'low-stock';
      } else {
        this.selectedPartForDialog.status = 'in-stock';
      }

      console.log('Part updated:', this.selectedPartForDialog);
      this.goBackToDefault();
    }
  }

  // Restock dialog methods
  openRestockDialog(part: Part) {
    this.selectedPartForRestock = part;
    const suggestedQuantity = part.maxStock - part.stockLevel;
    this.restockRequest = {
      quantity: suggestedQuantity > 0 ? suggestedQuantity : 0,
      vendor: part.vendor,
      unitCost: part.unitCost,
      notes: '',
      urgency: part.status === 'out-of-stock' ? 'high' : 'medium',
      requestedBy: 'Jun Ren',
      deliveryDate: undefined
    };
    this.showRestockDialog = true;
  }

  closeRestockDialog() {
    this.showRestockDialog = false;
    this.selectedPartForRestock = null;
    this.restockRequest = {
      quantity: 0,
      vendor: '',
      unitCost: 0,
      notes: '',
      urgency: 'medium',
      requestedBy: 'Jun Ren',
      deliveryDate: undefined
    };
  }

  submitRestockRequest() {
    if (this.selectedPartForRestock && this.restockRequest.quantity > 0) {
      console.log('Restock request submitted:', {
        part: this.selectedPartForRestock,
        request: this.restockRequest
      });
      // Here you would typically call an API to submit the restock request
      this.closeRestockDialog();
    }
  }

  // Utility methods
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'in-stock': return 'status-in-stock';
      case 'low-stock': return 'status-low-stock';
      case 'out-of-stock': return 'status-out-of-stock';
      case 'discontinued': return 'status-discontinued';
      default: return 'status-default';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'in-stock': return '✅';
      case 'low-stock': return '⚠️';
      case 'out-of-stock': return '❌';
      case 'discontinued': return '🚫';
      default: return '❓';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  getStockLevelClass(part: Part): string {
    if (part.stockLevel === 0) return 'stock-out';
    if (part.stockLevel <= part.minStock) return 'stock-low';
    return 'stock-normal';
  }

  getTotalInventoryValue(): number {
    return this.allParts.reduce((total, part) => total + part.totalValue, 0);
  }

  getLowStockCount(): number {
    return this.allParts.filter(part => part.status === 'low-stock' || part.status === 'out-of-stock').length;
  }

  getAverageUsage(part: Part): number {
    return Math.ceil((part.maxStock - part.stockLevel) / 2) || 0;
  }

  // Restock quantity helpers
  decreaseQuantity() {
    if (this.restockRequest.quantity > 0) {
      this.restockRequest.quantity = this.restockRequest.quantity - 1;
    }
  }

  increaseQuantity() {
    this.restockRequest.quantity = this.restockRequest.quantity + 1;
  }

  // Details tab methods
  setActiveDetailsTab(tab: 'details' | 'history') {
    this.activeDetailsTab = tab;
  }
}
