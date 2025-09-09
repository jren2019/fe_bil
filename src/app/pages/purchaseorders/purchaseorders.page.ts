import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PurchaseOrder {
  id: number;
  title: string;
  status: 'pending' | 'partially-fulfilled' | 'completed' | 'cancelled';
  vendor: string;
  vendorAvatar: string;
  totalCost: number;
  createdBy: string;
  assignedTo: string;
  createdAt: Date;
  updatedOn: Date;
  orderDate: Date;
  dueDate: Date;
  invoiceDate?: Date;
  invoiceId?: string;
  arrivalDate?: Date;
  shippingAddress: string;
  parts: PurchaseOrderItem[];
  isUnread?: boolean;
}

interface PurchaseOrderItem {
  id: number;
  itemName: string;
  partNumber: string;
  unitsOrdered: number;
  unitsReceived: number;
  unitCost: number;
  totalCost: number;
}

interface ViewMode {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-purchaseorders-page',
  standalone: true,
  imports: [NavMenuComponent, ButtonModule, InputTextModule, DialogModule, TextareaModule, DropdownModule, FileUploadModule, CheckboxModule, CalendarModule, TableModule, PaginatorModule, CommonModule, FormsModule],
  templateUrl: './purchaseorders.page.html',
  styleUrls: ['./purchaseorders.page.scss']
})
export class PurchaseordersPageComponent implements AfterViewInit {
  @ViewChild('bottomPaginator') bottomPaginator!: ElementRef;
  @ViewChild('paginatorContainer') paginatorContainer!: ElementRef;

  // View modes
  viewModes: ViewMode[] = [
    { value: 'panel', label: 'Panel View', icon: '📋' },
    { value: 'table', label: 'Table View', icon: '📊' }
  ];

  currentViewMode: string = 'panel';
  showViewDropdown = false;

  // Purchase order data
  allPurchaseOrders: PurchaseOrder[] = [];
  selectedPurchaseOrderId: number = 1;

  // Dialog states
  showPurchaseOrderDialog = false;
  selectedPurchaseOrderForDialog: PurchaseOrder | null = null;
  showNewPurchaseOrderModal = false;

  // Edit mode state
  isEditMode = false;
  editForm: any = {};

  // Tab state
  activeTab = 'details';
  activeDialogTab = 'details';

  // New purchase order form state
  newPurchaseOrderForm = {
    vendor: '',
    items: [] as any[],
    taxable: false,
    shippingAddress: ''
  };

  // Paginator properties
  paginatorRows = 10;

  // Mock data for purchase orders
  mockPurchaseOrders: PurchaseOrder[] = [
    {
      id: 1,
      title: 'Purchase Order #1',
      status: 'completed',
      vendor: 'test vendor',
      vendorAvatar: 'TV',
      totalCost: 530.00,
      createdBy: 'Jun Ren',
      assignedTo: 'Jun Ren',
      createdAt: new Date('2025-05-18'),
      updatedOn: new Date('2025-05-18'),
      orderDate: new Date('2025-05-15'),
      dueDate: new Date('2025-05-25'),
      invoiceDate: new Date('2025-05-20'),
      invoiceId: 'INV-2025-001',
      arrivalDate: new Date('2025-05-22'),
      shippingAddress: '123 Main St, Anytown, ST 12345',
      isUnread: false,
      parts: [
        {
          id: 1,
          itemName: 'test part',
          partNumber: '#5655',
          unitsOrdered: 3,
          unitsReceived: 3,
          unitCost: 34.00,
          totalCost: 102.00
        },
        {
          id: 2,
          itemName: 'hydraulic pump',
          partNumber: '#7892',
          unitsOrdered: 2,
          unitsReceived: 2,
          unitCost: 214.00,
          totalCost: 428.00
        }
      ]
    },
    {
      id: 2,
      title: 'Purchase Order #2',
      status: 'partially-fulfilled',
      vendor: 'test vendor',
      vendorAvatar: 'TV',
      totalCost: 102.00,
      createdBy: 'Jun Ren',
      assignedTo: 'Jun Ren',
      createdAt: new Date('2025-05-29'),
      updatedOn: new Date('2025-05-29'),
      orderDate: new Date('2025-05-25'),
      dueDate: new Date('2025-06-05'),
      invoiceDate: new Date('2025-05-30'),
      invoiceId: 'INV-2025-002',
      arrivalDate: undefined,
      shippingAddress: '456 Oak Ave, Downtown, ST 67890',
      isUnread: true,
      parts: [
        {
          id: 3,
          itemName: 'test part',
          partNumber: '#5655',
          unitsOrdered: 3,
          unitsReceived: 3,
          unitCost: 34.00,
          totalCost: 102.00
        }
      ]
    },
    {
      id: 3,
      title: 'Purchase Order #3',
      status: 'pending',
      vendor: 'ABC Supply Co',
      vendorAvatar: 'AS',
      totalCost: 750.00,
      createdBy: 'Sarah Chen',
      assignedTo: 'Mike Torres',
      createdAt: new Date('2025-06-15'),
      updatedOn: new Date('2025-06-15'),
      orderDate: new Date('2025-06-12'),
      dueDate: new Date('2025-06-22'),
      invoiceDate: undefined,
      invoiceId: undefined,
      arrivalDate: undefined,
      shippingAddress: '789 Industrial Blvd, Business Park, ST 54321',
      isUnread: true,
      parts: [
        {
          id: 4,
          itemName: 'steel bearing',
          partNumber: '#3421',
          unitsOrdered: 5,
          unitsReceived: 0,
          unitCost: 75.00,
          totalCost: 375.00
        },
        {
          id: 5,
          itemName: 'motor assembly',
          partNumber: '#9876',
          unitsOrdered: 1,
          unitsReceived: 0,
          unitCost: 375.00,
          totalCost: 375.00
        }
      ]
    },
    {
      id: 4,
      title: 'Purchase Order #4',
      status: 'cancelled',
      vendor: 'XYZ Parts Ltd',
      vendorAvatar: 'XP',
      totalCost: 245.00,
      createdBy: 'Alex Johnson',
      assignedTo: 'Jun Ren',
      createdAt: new Date('2025-06-10'),
      updatedOn: new Date('2025-06-12'),
      orderDate: new Date('2025-06-08'),
      dueDate: new Date('2025-06-18'),
      invoiceDate: undefined,
      invoiceId: undefined,
      arrivalDate: undefined,
      shippingAddress: '321 Commerce Dr, Trading Post, ST 98765',
      isUnread: false,
      parts: [
        {
          id: 6,
          itemName: 'filter cartridge',
          partNumber: '#1234',
          unitsOrdered: 10,
          unitsReceived: 0,
          unitCost: 24.50,
          totalCost: 245.00
        }
      ]
    },
    {
      id: 5,
      title: 'Purchase Order #4',
      status: 'cancelled',
      vendor: 'XYZ Parts Ltd',
      vendorAvatar: 'XP',
      totalCost: 245.00,
      createdBy: 'Alex Johnson',
      assignedTo: 'Jun Ren',
      createdAt: new Date('2025-06-10'),
      updatedOn: new Date('2025-06-12'),
      orderDate: new Date('2025-06-08'),
      dueDate: new Date('2025-06-18'),
      invoiceDate: undefined,
      invoiceId: undefined,
      arrivalDate: undefined,
      shippingAddress: '321 Commerce Dr, Trading Post, ST 98765',
      isUnread: false,
      parts: [
        {
          id: 6,
          itemName: 'filter cartridge',
          partNumber: '#1234',
          unitsOrdered: 10,
          unitsReceived: 0,
          unitCost: 24.50,
          totalCost: 245.00
        }
      ]
    },
    {
      id: 6,
      title: 'Purchase Order #4',
      status: 'cancelled',
      vendor: 'XYZ Parts Ltd',
      vendorAvatar: 'XP',
      totalCost: 245.00,
      createdBy: 'Alex Johnson',
      assignedTo: 'Jun Ren',
      createdAt: new Date('2025-06-10'),
      updatedOn: new Date('2025-06-12'),
      orderDate: new Date('2025-06-08'),
      dueDate: new Date('2025-06-18'),
      invoiceDate: undefined,
      invoiceId: undefined,
      arrivalDate: undefined,
      shippingAddress: '321 Commerce Dr, Trading Post, ST 98765',
      isUnread: false,
      parts: [
        {
          id: 6,
          itemName: 'filter cartridge',
          partNumber: '#1234',
          unitsOrdered: 10,
          unitsReceived: 0,
          unitCost: 24.50,
          totalCost: 245.00
        }
      ]
    },
    {
      id: 7,
      title: 'Purchase Order #4',
      status: 'cancelled',
      vendor: 'XYZ Parts Ltd',
      vendorAvatar: 'XP',
      totalCost: 245.00,
      createdBy: 'Alex Johnson',
      assignedTo: 'Jun Ren',
      createdAt: new Date('2025-06-10'),
      updatedOn: new Date('2025-06-12'),
      orderDate: new Date('2025-06-08'),
      dueDate: new Date('2025-06-18'),
      invoiceDate: undefined,
      invoiceId: undefined,
      arrivalDate: undefined,
      shippingAddress: '321 Commerce Dr, Trading Post, ST 98765',
      isUnread: false,
      parts: [
        {
          id: 6,
          itemName: 'filter cartridge',
          partNumber: '#1234',
          unitsOrdered: 10,
          unitsReceived: 0,
          unitCost: 24.50,
          totalCost: 245.00
        }
      ]
    },

    {
      id: 8,
      title: 'Purchase Order #4',
      status: 'cancelled',
      vendor: 'XYZ Parts Ltd',
      vendorAvatar: 'XP',
      totalCost: 245.00,
      createdBy: 'Alex Johnson',
      assignedTo: 'Jun Ren',
      createdAt: new Date('2025-06-10'),
      updatedOn: new Date('2025-06-12'),
      orderDate: new Date('2025-06-08'),
      dueDate: new Date('2025-06-18'),
      invoiceDate: undefined,
      invoiceId: undefined,
      arrivalDate: undefined,
      shippingAddress: '321 Commerce Dr, Trading Post, ST 98765',
      isUnread: false,
      parts: [
        {
          id: 6,
          itemName: 'filter cartridge',
          partNumber: '#1234',
          unitsOrdered: 10,
          unitsReceived: 0,
          unitCost: 24.50,
          totalCost: 245.00
        }
      ]
    }
    
  ];

  // Computed properties
  get currentViewModeLabel(): string {
    const mode = this.viewModes.find(vm => vm.value === this.currentViewMode);
    return mode ? `${mode.icon} ${mode.label}` : '📋 Panel View';
  }

  get selectedPurchaseOrder(): PurchaseOrder | undefined {
    return this.allPurchaseOrders.find(po => po.id === this.selectedPurchaseOrderId);
  }

  constructor(private renderer: Renderer2) {
    this.initializePurchaseOrderData();
    this.initializeDefaultSelection();
  }

  ngAfterViewInit() {
    this.setupPaginatorDropdownFix();
  }

  private initializePurchaseOrderData() {
    this.allPurchaseOrders = [...this.mockPurchaseOrders];
  }

  private initializeDefaultSelection() {
    if (this.allPurchaseOrders.length > 0) {
      this.selectedPurchaseOrderId = this.allPurchaseOrders[0].id;
    }
  }

  private setupPaginatorDropdownFix() {
    this.renderer.listen('document', 'click', (event) => {
      if (this.currentViewMode === 'table') {
        setTimeout(() => {
          this.fixDropdownPosition();
        }, 100);
      }
    });
  }

  private fixDropdownPosition() {
    const dropdownPanels = document.querySelectorAll('.p-dropdown-panel');
    dropdownPanels.forEach((panel: Element) => {
      const panelElement = panel as HTMLElement;
      const rect = panelElement.getBoundingClientRect();

      if (rect.bottom > window.innerHeight - 150) {
        this.renderer.setStyle(panelElement, 'top', 'auto');
        this.renderer.setStyle(panelElement, 'bottom', '100%');
        this.renderer.setStyle(panelElement, 'transform', 'translateY(-0.25rem)');
        this.renderer.setStyle(panelElement, 'box-shadow', '0 -4px 12px rgba(0, 0, 0, 0.15)');
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

  // Table view methods
  onPurchaseOrderRowClick(purchaseOrder: PurchaseOrder) {
    this.selectedPurchaseOrderForDialog = purchaseOrder;
    this.activeDialogTab = 'details'; // Reset to details tab
    this.showPurchaseOrderDialog = true;
  }

  closePurchaseOrderDialog() {
    this.showPurchaseOrderDialog = false;
    this.selectedPurchaseOrderForDialog = null;
  }

  // Panel view methods
  selectPurchaseOrder(id: number) {
    this.selectedPurchaseOrderId = id;
    this.activeTab = 'details'; // Reset to details tab
    this.isEditMode = false; // Exit edit mode when switching
  }



  // Paginator methods
  onPageChange(event: any) {
    this.paginatorRows = event.rows;
  }

  // Utility methods
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'partially-fulfilled': return 'status-partially-fulfilled';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return '⏳';
      case 'partially-fulfilled': return '📦';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'partially-fulfilled': return 'Partially Fulfilled';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }

  calculateSubtotal(items: PurchaseOrderItem[]): number {
    return items.reduce((total, item) => total + item.totalCost, 0);
  }

  calculateTotal(items: PurchaseOrderItem[]): number {
    return this.calculateSubtotal(items); // For now, same as subtotal
  }

  // Status workflow methods
  getStatusWorkflow() {
    return [
      { value: 'pending', label: 'Pending', icon: '⏳' },
      { value: 'partially-fulfilled', label: 'Partially Fulfilled', icon: '📦' },
      { value: 'completed', label: 'Complete', icon: '✅' },
      { value: 'cancelled', label: 'Cancelled', icon: '❌' }
    ];
  }

  isStatusActive(status: string): boolean {
    return this.selectedPurchaseOrder?.status === status;
  }

  // Tab management methods
  switchTab(tab: string) {
    this.activeTab = tab;
  }

  switchDialogTab(tab: string) {
    this.activeDialogTab = tab;
  }

  // Edit mode methods
  enterEditMode() {
    if (!this.selectedPurchaseOrder) return;

    this.isEditMode = true;
    // Initialize edit form with current values
    this.editForm = {
      title: this.selectedPurchaseOrder.title,
      vendor: this.selectedPurchaseOrder.vendor,
      status: this.selectedPurchaseOrder.status,
      shippingAddress: this.selectedPurchaseOrder.shippingAddress,
      assignedTo: this.selectedPurchaseOrder.assignedTo,
      orderDate: this.selectedPurchaseOrder.orderDate,
      dueDate: this.selectedPurchaseOrder.dueDate,
      invoiceDate: this.selectedPurchaseOrder.invoiceDate,
      invoiceId: this.selectedPurchaseOrder.invoiceId,
      arrivalDate: this.selectedPurchaseOrder.arrivalDate,
      parts: [...this.selectedPurchaseOrder.parts.map(part => ({
        id: part.id,
        itemName: part.itemName,
        partNumber: part.partNumber,
        unitsOrdered: part.unitsOrdered,
        unitsReceived: part.unitsReceived,
        unitCost: part.unitCost,
        totalCost: part.totalCost
      }))]
    };
  }

  saveChanges() {
    if (!this.selectedPurchaseOrder || !this.editForm) return;

    // Update the selected purchase order with edited values
    const purchaseOrderIndex = this.allPurchaseOrders.findIndex(po => po.id === this.selectedPurchaseOrderId);
    if (purchaseOrderIndex !== -1) {
      this.allPurchaseOrders[purchaseOrderIndex] = {
        ...this.allPurchaseOrders[purchaseOrderIndex],
        title: this.editForm.title,
        vendor: this.editForm.vendor,
        status: this.editForm.status,
        shippingAddress: this.editForm.shippingAddress,
        assignedTo: this.editForm.assignedTo,
        orderDate: this.editForm.orderDate,
        dueDate: this.editForm.dueDate,
        invoiceDate: this.editForm.invoiceDate,
        invoiceId: this.editForm.invoiceId,
        arrivalDate: this.editForm.arrivalDate,
        parts: this.editForm.parts,
        updatedOn: new Date()
      };

      // Recalculate total cost
      this.allPurchaseOrders[purchaseOrderIndex].totalCost = this.calculateTotal(this.editForm.parts);
    }

    this.exitEditMode();
    console.log('Purchase order updated successfully');
  }

  cancelEdit() {
    this.exitEditMode();
  }

  exitEditMode() {
    this.isEditMode = false;
    this.editForm = {};
    this.activeTab = 'details'; // Return to details tab
  }

  // Methods for editing parts
  addNewPart() {
    if (!this.editForm.parts) this.editForm.parts = [];

    const newPart = {
      id: Date.now(), // Simple ID generation
      itemName: '',
      partNumber: '',
      unitsOrdered: 1,
      unitsReceived: 0,
      unitCost: 0,
      totalCost: 0
    };

    this.editForm.parts.push(newPart);
  }

  removePart(index: number) {
    if (this.editForm.parts && index >= 0 && index < this.editForm.parts.length) {
      this.editForm.parts.splice(index, 1);
    }
  }

  updatePartTotal(index: number) {
    if (this.editForm.parts && this.editForm.parts[index]) {
      const part = this.editForm.parts[index];
      part.totalCost = part.unitsOrdered * part.unitCost;
    }
  }

  // Dropdown options for edit form
  getStatusOptions() {
    return [
      { label: 'Pending', value: 'pending' },
      { label: 'Partially Fulfilled', value: 'partially-fulfilled' },
      { label: 'Completed', value: 'completed' },
      { label: 'Cancelled', value: 'cancelled' }
    ];
  }

  getVendorOptions() {
    return [
      { label: 'test vendor', value: 'test vendor' },
      { label: 'ABC Supply Co', value: 'ABC Supply Co' },
      { label: 'XYZ Parts Ltd', value: 'XYZ Parts Ltd' },
      { label: 'Industrial Parts Inc', value: 'Industrial Parts Inc' }
    ];
  }

  getAssignedToOptions() {
    return [
      { label: 'Jun Ren', value: 'Jun Ren' },
      { label: 'Sarah Chen', value: 'Sarah Chen' },
      { label: 'Mike Torres', value: 'Mike Torres' },
      { label: 'Alex Johnson', value: 'Alex Johnson' }
    ];
  }

  // New purchase order form methods
  initializeNewPurchaseOrderForm() {
    this.newPurchaseOrderForm = {
      vendor: '',
      items: [this.createEmptyOrderItem()],
      taxable: false,
      shippingAddress: ''
    };
  }

  createEmptyOrderItem() {
    return {
      tempId: Date.now() + Math.random(), // Temporary ID for tracking
      itemName: '',
      partNumber: '',
      unitsOrdered: 1,
      unitCost: 0,
      totalCost: 0
    };
  }

  addOrderItem() {
    this.newPurchaseOrderForm.items.push(this.createEmptyOrderItem());
  }

  removeOrderItem(index: number) {
    if (this.newPurchaseOrderForm.items.length > 1) {
      this.newPurchaseOrderForm.items.splice(index, 1);
    }
  }

  calculateItemTotal(index: number) {
    const item = this.newPurchaseOrderForm.items[index];
    if (item) {
      item.totalCost = (item.unitsOrdered || 0) * (item.unitCost || 0);
    }
  }

  calculateSubtotalNew(): number {
    return this.newPurchaseOrderForm.items.reduce((total, item) => {
      return total + (item.totalCost || 0);
    }, 0);
  }

  calculateTotalNew(): number {
    const subtotal = this.calculateSubtotalNew();
    // For now, just return subtotal. Taxes can be added later
    return subtotal;
  }

  getItemNameOptions() {
    return [
      { label: 'Steel Bearing', value: 'Steel Bearing' },
      { label: 'Motor Assembly', value: 'Motor Assembly' },
      { label: 'Hydraulic Pump', value: 'Hydraulic Pump' },
      { label: 'Filter Cartridge', value: 'Filter Cartridge' },
      { label: 'Test Part', value: 'Test Part' },
      { label: 'Custom Part', value: 'Custom Part' }
    ];
  }

  isFormValid(): boolean {
    return this.newPurchaseOrderForm.vendor !== '' &&
           this.newPurchaseOrderForm.items.some(item => item.itemName !== '' || item.partNumber !== '');
  }

  createPurchaseOrder() {
    if (!this.isFormValid()) {
      alert('Please fill in the required fields: Vendor and at least one item.');
      return;
    }

    // Generate new ID
    const newId = Math.max(...this.allPurchaseOrders.map(po => po.id), 0) + 1;

    // Create purchase order items
    const validItems = this.newPurchaseOrderForm.items
      .filter(item => item.itemName !== '' || item.partNumber !== '')
      .map((item, index) => ({
        id: index + 1,
        itemName: item.itemName || 'Unnamed Item',
        partNumber: item.partNumber || `AUTO-${newId}-${index + 1}`,
        unitsOrdered: item.unitsOrdered || 1,
        unitsReceived: 0,
        unitCost: item.unitCost || 0,
        totalCost: item.totalCost || 0
      }));

    // Create new purchase order
    const newPurchaseOrder: PurchaseOrder = {
      id: newId,
      title: `Purchase Order #${newId}`,
      status: 'pending',
      vendor: this.newPurchaseOrderForm.vendor,
      vendorAvatar: this.newPurchaseOrderForm.vendor.substring(0, 2).toUpperCase(),
      totalCost: this.calculateTotalNew(),
      createdBy: 'Jun Ren',
      assignedTo: 'Jun Ren',
      createdAt: new Date(),
      updatedOn: new Date(),
      orderDate: new Date(),
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      invoiceDate: undefined,
      invoiceId: undefined,
      arrivalDate: undefined,
      shippingAddress: this.newPurchaseOrderForm.shippingAddress || '123 Default St, City, ST 12345',
      parts: validItems,
      isUnread: true
    };

    // Add to the list
    this.allPurchaseOrders.unshift(newPurchaseOrder);

    // Select the new purchase order
    this.selectedPurchaseOrderId = newId;

    // Close modal and reset form
    this.closeNewPurchaseOrderModal();

    console.log('✅ Purchase order created successfully:', newPurchaseOrder);
    alert(`Purchase order "${newPurchaseOrder.title}" created successfully!`);
  }

  openNewPurchaseOrderModal() {
    this.initializeNewPurchaseOrderForm();
    this.showNewPurchaseOrderModal = true;
  }

  closeNewPurchaseOrderModal() {
    this.showNewPurchaseOrderModal = false;
    this.initializeNewPurchaseOrderForm();
  }
}
