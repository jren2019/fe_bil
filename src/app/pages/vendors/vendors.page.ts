import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { DialogModule } from 'primeng/dialog';

// Vendor Management Interfaces
interface Vendor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website?: string;
  vendorType: VendorType;
  status: 'active' | 'inactive' | 'pending';
  paymentTerms: string;
  taxId?: string;
  rating: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  createdAt: Date;
  contacts: VendorContact[];
  tags: string[];
  notes: string;
  color: string;
}

interface VendorContact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

interface VendorType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface NewVendorForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website: string;
  vendorTypeId: string;
  paymentTerms: string;
  taxId: string;
  notes: string;
  color: string;
}

@Component({
  selector: 'app-vendors-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavMenuComponent,
    DialogModule
  ],
  templateUrl: './vendors.page.html',
  styleUrls: ['./vendors.page.scss']
})
export class VendorsPageComponent implements OnInit {
  selectedVendor: Vendor | null = null;
  selectedVendorId: string | null = null;
  searchTerm: string = '';
  statusFilter: string = '';
  typeFilter: string = '';
  showNewVendorModal: boolean = false;
  isEditMode: boolean = false;
  editingVendorId: string | null = null;
  currentView: 'list' | 'details' = 'list';
  activeVendorTab: 'contact' | 'contacts' | 'payment' | 'notes' = 'contact';

  // New vendor form
  newVendorForm: NewVendorForm = {
    name: '',
    company: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    website: '',
    vendorTypeId: '',
    paymentTerms: 'Net 30',
    taxId: '',
    notes: '',
    color: '#007bff'
  };

  // Sample vendor types
  vendorTypes: VendorType[] = [
    {
      id: 'parts',
      name: 'Parts Supplier',
      description: 'Suppliers of equipment parts and components',
      icon: '🔧'
    },
    {
      id: 'maintenance',
      name: 'Maintenance Service',
      description: 'Maintenance and repair service providers',
      icon: '🛠️'
    },
    {
      id: 'equipment',
      name: 'Equipment Supplier',
      description: 'Suppliers of machinery and equipment',
      icon: '⚙️'
    },
    {
      id: 'office',
      name: 'Office Supplies',
      description: 'Office and administrative supplies',
      icon: '📎'
    },
    {
      id: 'utilities',
      name: 'Utilities',
      description: 'Utility service providers',
      icon: '⚡'
    },
    {
      id: 'software',
      name: 'Software & IT',
      description: 'Software and IT service providers',
      icon: '💻'
    }
  ];

  // Sample vendors data
  vendors: Vendor[] = [
    {
      id: 'V001',
      name: 'John Smith',
      company: 'Industrial Parts Co.',
      email: 'john@industrialparts.com',
      phone: '+1 (555) 123-4567',
      address: {
        street: '123 Industrial Ave',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'United States'
      },
      website: 'https://industrialparts.com',
      vendorType: this.vendorTypes.find(t => t.id === 'parts')!,
      status: 'active',
      paymentTerms: 'Net 30',
      taxId: '12-3456789',
      rating: 4.5,
      totalOrders: 47,
      totalSpent: 125000,
      lastOrderDate: new Date('2024-02-28'),
      createdAt: new Date('2023-01-15'),
      contacts: [
        {
          id: 'C001',
          name: 'John Smith',
          title: 'Sales Manager',
          email: 'john@industrialparts.com',
          phone: '+1 (555) 123-4567',
          isPrimary: true
        },
        {
          id: 'C002',
          name: 'Sarah Johnson',
          title: 'Account Representative',
          email: 'sarah@industrialparts.com',
          phone: '+1 (555) 123-4568',
          isPrimary: false
        }
      ],
      tags: ['parts', 'machinery', 'reliable'],
      notes: 'Excellent supplier for industrial parts. Fast delivery and competitive pricing.',
      color: '#007bff'
    },
    {
      id: 'V002',
      name: 'Mike Rodriguez',
      company: 'ProMaint Services',
      email: 'mike@promaint.com',
      phone: '+1 (555) 234-5678',
      address: {
        street: '456 Service Blvd',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'United States'
      },
      website: 'https://promaint.com',
      vendorType: this.vendorTypes.find(t => t.id === 'maintenance')!,
      status: 'active',
      paymentTerms: 'Net 15',
      taxId: '23-4567890',
      rating: 4.8,
      totalOrders: 23,
      totalSpent: 85000,
      lastOrderDate: new Date('2024-03-05'),
      createdAt: new Date('2023-06-20'),
      contacts: [
        {
          id: 'C003',
          name: 'Mike Rodriguez',
          title: 'Owner',
          email: 'mike@promaint.com',
          phone: '+1 (555) 234-5678',
          isPrimary: true
        }
      ],
      tags: ['maintenance', 'emergency', 'certified'],
      notes: 'Trusted maintenance partner. Available for emergency calls 24/7.',
      color: '#28a745'
    },
    {
      id: 'V003',
      name: 'Lisa Chen',
      company: 'TechFlow Solutions',
      email: 'lisa@techflow.com',
      phone: '+1 (555) 345-6789',
      address: {
        street: '789 Tech Park Dr',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'United States'
      },
      website: 'https://techflow.com',
      vendorType: this.vendorTypes.find(t => t.id === 'software')!,
      status: 'active',
      paymentTerms: 'Net 45',
      rating: 4.2,
      totalOrders: 8,
      totalSpent: 45000,
      lastOrderDate: new Date('2024-01-15'),
      createdAt: new Date('2023-11-10'),
      contacts: [
        {
          id: 'C004',
          name: 'Lisa Chen',
          title: 'Business Development',
          email: 'lisa@techflow.com',
          phone: '+1 (555) 345-6789',
          isPrimary: true
        },
        {
          id: 'C005',
          name: 'David Park',
          title: 'Technical Support',
          email: 'david@techflow.com',
          phone: '+1 (555) 345-6790',
          isPrimary: false
        }
      ],
      tags: ['software', 'automation', 'integration'],
      notes: 'Provides excellent automation software solutions. Great technical support team.',
      color: '#6f42c1'
    },
    {
      id: 'V004',
      name: 'Robert Wilson',
      company: 'Wilson Office Supply',
      email: 'robert@wilsonoffice.com',
      phone: '+1 (555) 456-7890',
      address: {
        street: '321 Business Plaza',
        city: 'Atlanta',
        state: 'GA',
        zipCode: '30309',
        country: 'United States'
      },
      vendorType: this.vendorTypes.find(t => t.id === 'office')!,
      status: 'active',
      paymentTerms: 'Net 30',
      rating: 3.9,
      totalOrders: 156,
      totalSpent: 32000,
      lastOrderDate: new Date('2024-02-20'),
      createdAt: new Date('2022-08-05'),
      contacts: [
        {
          id: 'C006',
          name: 'Robert Wilson',
          title: 'Manager',
          email: 'robert@wilsonoffice.com',
          phone: '+1 (555) 456-7890',
          isPrimary: true
        }
      ],
      tags: ['office-supplies', 'bulk-orders', 'local'],
      notes: 'Local office supply vendor. Good for bulk orders and regular supplies.',
      color: '#fd7e14'
    },
    {
      id: 'V005',
      name: 'Amanda Torres',
      company: 'PowerGrid Utilities',
      email: 'amanda@powergrid.com',
      phone: '+1 (555) 567-8901',
      address: {
        street: '654 Energy Way',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201',
        country: 'United States'
      },
      website: 'https://powergrid.com',
      vendorType: this.vendorTypes.find(t => t.id === 'utilities')!,
      status: 'active',
      paymentTerms: 'Net 30',
      rating: 4.0,
      totalOrders: 12,
      totalSpent: 180000,
      lastOrderDate: new Date('2024-03-01'),
      createdAt: new Date('2023-03-12'),
      contacts: [
        {
          id: 'C007',
          name: 'Amanda Torres',
          title: 'Account Manager',
          email: 'amanda@powergrid.com',
          phone: '+1 (555) 567-8901',
          isPrimary: true
        }
      ],
      tags: ['utilities', 'energy', 'contract'],
      notes: 'Primary electricity and energy provider. Long-term contract in place.',
      color: '#ffc107'
    }
  ];

  // Payment terms options
  paymentTermsOptions = [
    'Net 15',
    'Net 30',
    'Net 45',
    'Net 60',
    'COD',
    '2/10 Net 30',
    'Due on Receipt'
  ];

  // Color options for vendors
  colorOptions = [
    '#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1',
    '#fd7e14', '#20c997', '#6c757d', '#e83e8c', '#17a2b8'
  ];

  ngOnInit() {
    console.log('Vendors component initialized');
    // Add more mock vendors so the list is scrollable
    this.seedAdditionalVendors(20);
  }

  // Vendor selection and navigation
  selectVendor(vendorId: string) {
    this.selectedVendorId = vendorId;
    this.selectedVendor = this.vendors.find(v => v.id === vendorId) || null;
    this.currentView = 'details';
    this.activeVendorTab = 'contact';
  }

  goBackToList() {
    this.currentView = 'list';
    this.selectedVendor = null;
    this.selectedVendorId = null;
  }

  setVendorTab(tab: 'contact' | 'contacts' | 'payment' | 'notes') {
    this.activeVendorTab = tab;
  }

  // Filtering
  getFilteredVendors(): Vendor[] {
    let filtered = this.vendors;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(term) ||
        vendor.company.toLowerCase().includes(term) ||
        vendor.email.toLowerCase().includes(term) ||
        vendor.vendorType.name.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter) {
      filtered = filtered.filter(vendor => vendor.status === this.statusFilter);
    }

    if (this.typeFilter) {
      filtered = filtered.filter(vendor => vendor.vendorType.id === this.typeFilter);
    }

    return filtered;
  }

  // New vendor management
  openNewVendorModal() {
    this.isEditMode = false;
    this.editingVendorId = null;
    this.showNewVendorModal = true;
    this.resetNewVendorForm();
  }

  closeNewVendorModal() {
    this.showNewVendorModal = false;
    this.resetNewVendorForm();
  }

  openEditVendorModal(vendor: Vendor) {
    this.isEditMode = true;
    this.editingVendorId = vendor.id;
    this.showNewVendorModal = true;
    this.newVendorForm = {
      name: vendor.name,
      company: vendor.company,
      email: vendor.email,
      phone: vendor.phone,
      address: { ...vendor.address },
      website: vendor.website || '',
      vendorTypeId: vendor.vendorType.id,
      paymentTerms: vendor.paymentTerms,
      taxId: vendor.taxId || '',
      notes: vendor.notes,
      color: vendor.color
    };
  }

  resetNewVendorForm() {
    this.newVendorForm = {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      },
      website: '',
      vendorTypeId: '',
      paymentTerms: 'Net 30',
      taxId: '',
      notes: '',
      color: '#007bff'
    };
  }

  createVendor() {
    const vendorType = this.vendorTypes.find(t => t.id === this.newVendorForm.vendorTypeId);
    if (!vendorType) {
      console.error('Vendor type not found');
      return;
    }

    const newVendor: Vendor = {
      id: 'V' + String(this.vendors.length + 1).padStart(3, '0'),
      name: this.newVendorForm.name,
      company: this.newVendorForm.company,
      email: this.newVendorForm.email,
      phone: this.newVendorForm.phone,
      address: { ...this.newVendorForm.address },
      website: this.newVendorForm.website,
      vendorType: vendorType,
      status: 'active',
      paymentTerms: this.newVendorForm.paymentTerms,
      taxId: this.newVendorForm.taxId,
      rating: 0,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date(),
      contacts: [
        {
          id: 'C' + String(Date.now()),
          name: this.newVendorForm.name,
          title: 'Primary Contact',
          email: this.newVendorForm.email,
          phone: this.newVendorForm.phone,
          isPrimary: true
        }
      ],
      tags: [vendorType.name.toLowerCase().replace(' ', '-')],
      notes: this.newVendorForm.notes,
      color: this.newVendorForm.color
    };

    this.vendors.push(newVendor);
    this.closeNewVendorModal();
    this.selectVendor(newVendor.id);

    // Show success message (you can replace this with a proper toast notification)
    alert(`Vendor "${newVendor.company}" has been created successfully!`);
    console.log('New vendor created:', newVendor);
  }

  async updateVendor() {
    if (!this.isEditMode || !this.editingVendorId) return;
    const vendorType = this.vendorTypes.find(t => t.id === this.newVendorForm.vendorTypeId);
    if (!vendorType) {
      console.error('Vendor type not found');
      return;
    }

    const payload: Partial<Vendor> = {
      name: this.newVendorForm.name,
      company: this.newVendorForm.company,
      email: this.newVendorForm.email,
      phone: this.newVendorForm.phone,
      address: { ...this.newVendorForm.address },
      website: this.newVendorForm.website,
      vendorType: vendorType,
      paymentTerms: this.newVendorForm.paymentTerms,
      taxId: this.newVendorForm.taxId,
      notes: this.newVendorForm.notes,
      color: this.newVendorForm.color
    } as any;

    try {
      await fetch(`/api/vendors/${this.editingVendorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('Update API call failed (using local update):', e);
    }

    const index = this.vendors.findIndex(v => v.id === this.editingVendorId);
    if (index > -1) {
      const existing = this.vendors[index];
      this.vendors[index] = { ...existing, ...payload, vendorType } as Vendor;
    }

    this.closeNewVendorModal();
    this.selectVendor(this.editingVendorId);
  }

  // Vendor actions
  editVendor(vendor: Vendor) {
    this.openEditVendorModal(vendor);
  }

  deleteVendor(vendor: Vendor) {
    const index = this.vendors.findIndex(v => v.id === vendor.id);
    if (index > -1) {
      this.vendors.splice(index, 1);
      if (this.selectedVendorId === vendor.id) {
        this.goBackToList();
      }
      console.log('Vendor deleted:', vendor);
    }
  }

  toggleVendorStatus(vendor: Vendor) {
    vendor.status = vendor.status === 'active' ? 'inactive' : 'active';
    console.log('Vendor status toggled:', vendor);
  }

  addVendorContact(vendor: Vendor) {
    console.log('Adding contact for vendor:', vendor);
    // Implement add contact functionality
  }

  // Utility functions
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getVendorTypeById(typeId: string): VendorType | undefined {
    return this.vendorTypes.find(t => t.id === typeId);
  }

  getStarRating(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }

    if (hasHalfStar) {
      stars.push('☆');
    }

    while (stars.length < 5) {
      stars.push('☆');
    }

    return stars;
  }

  // --- Mock data helpers to extend vendor list ---
  private seedAdditionalVendors(count: number) {
    const baseIndex = this.vendors.length;
    for (let i = 0; i < count; i++) {
      const vendor = this.generateMockVendor(baseIndex + i + 1);
      this.vendors.push(vendor);
    }
  }

  private generateMockVendor(index: number): Vendor {
    const names = [
      'Olivia Brown', 'Ethan Davis', 'Sophia Miller', 'Liam Wilson', 'Ava Anderson',
      'Noah Thomas', 'Isabella Moore', 'Mason Taylor', 'Mia Jackson', 'Lucas Martin',
      'Amelia Lee', 'Elijah Perez', 'Harper Thompson', 'James White', 'Charlotte Harris',
      'Benjamin Clark', 'Evelyn Lewis', 'Henry Walker', 'Abigail Hall', 'Alexander Young'
    ];
    const companies = [
      'NorthStar Industrial', 'Evergreen Supplies', 'BluePeak Systems', 'Vertex Equipment',
      'Cascade Components', 'Horizon Services', 'Summit Tools', 'PrimeTech Solutions',
      'Metro Office Depot', 'GreenLine Utilities'
    ];
    const cities = [
      { city: 'Seattle', state: 'WA' }, { city: 'Denver', state: 'CO' }, { city: 'Austin', state: 'TX' },
      { city: 'Boston', state: 'MA' }, { city: 'Miami', state: 'FL' }, { city: 'Phoenix', state: 'AZ' },
      { city: 'Portland', state: 'OR' }, { city: 'Minneapolis', state: 'MN' }, { city: 'Raleigh', state: 'NC' },
      { city: 'Nashville', state: 'TN' }
    ];

    const name = names[(index - 1) % names.length];
    const company = companies[(index - 1) % companies.length];
    const cityState = cities[(index - 1) % cities.length];
    const type = this.vendorTypes[(index - 1) % this.vendorTypes.length];

    const statusOptions: Array<'active' | 'inactive' | 'pending'> = ['active', 'inactive', 'pending'];
    const status = statusOptions[index % statusOptions.length];

    const rating = 3 + ((index % 20) / 20) * 2; // ~3.0 - 5.0
    const totalOrders = 5 + (index * 7) % 180;
    const totalSpent = 10000 + ((index * 137) % 250) * 1000;
    const colorPalette = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14', '#20c997', '#6c757d', '#e83e8c', '#17a2b8'];
    const color = colorPalette[index % colorPalette.length];

    const id = 'V' + String(index + 5).padStart(3, '0');
    const emailLocal = name.toLowerCase().replace(/\s+/g, '.');
    const domain = company.toLowerCase().replace(/[^a-z]+/g, '') + '.com';

    const created = new Date();
    created.setMonth(created.getMonth() - (index % 18));
    const lastOrder = new Date();
    lastOrder.setDate(lastOrder.getDate() - (index * 3) % 120);

    const vendor: Vendor = {
      id,
      name,
      company,
      email: `${emailLocal}@${domain}`,
      phone: `+1 (555) ${String(1000 + (index * 37) % 9000)}-${String(1000 + (index * 53) % 9000)}`,
      address: {
        street: `${100 + (index * 3) % 900} Market St`,
        city: cityState.city,
        state: cityState.state,
        zipCode: String(10000 + (index * 97) % 89999),
        country: 'United States'
      },
      website: `https://www.${domain}`,
      vendorType: type,
      status: status,
      paymentTerms: ['Net 15', 'Net 30', 'Net 45', 'Net 60'][index % 4],
      taxId: `${String(10 + (index % 80))}-${String(1000000 + (index * 12345) % 8999999)}`,
      rating: Math.round(rating * 10) / 10,
      totalOrders,
      totalSpent,
      lastOrderDate: lastOrder,
      createdAt: created,
      contacts: [
        {
          id: 'C' + String(Date.now() + index),
          name,
          title: 'Account Manager',
          email: `${emailLocal}@${domain}`,
          phone: `+1 (555) ${String(2000 + (index * 19) % 7000)}-${String(1000 + (index * 23) % 9000)}`,
          isPrimary: true
        }
      ],
      tags: [type.name.toLowerCase().replace(/\s+/g, '-')],
      notes: `${company} provides ${type.name.toLowerCase()} services and has been reliable partner #${index}.`,
      color
    };

    return vendor;
  }
}
