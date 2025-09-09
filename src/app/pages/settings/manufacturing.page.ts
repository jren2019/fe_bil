import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { AssetsService, ManufacturingAsset } from '../../services/assets.service';

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  standardRate: number; // units per hour
  unitType: string; // 'pcs', 'kg', 'boxes', etc.
  setupTime: number; // minutes
  standardRunTime: number; // minutes
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MachineSpec {
  id: number;
  assetId: number;
  asset: ManufacturingAsset;
  productId: number;
  product: Product;
  productionRate: number; // units per hour for this specific machine-product combination
  setupTime: number; // minutes for this machine to setup for this product
  runTime: number; // optimal run time for this machine-product combination
  efficiency: number; // expected efficiency percentage
  quality: number; // expected quality percentage
  notes: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-manufacturing-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    TabViewModule
  ],
  templateUrl: './manufacturing.page.html',
  styleUrls: ['./manufacturing.page.scss']
})
export class ManufacturingSettingsPageComponent implements OnInit {
  // Tab management
  activeTabIndex: number = 0;

  // Products data
  products: Product[] = [];
  selectedProduct: Product | null = null;
  showProductDialog: boolean = false;
  editingProduct: boolean = false;

  // Machine specs data
  machineSpecs: MachineSpec[] = [];
  selectedMachineSpec: MachineSpec | null = null;
  showMachineSpecDialog: boolean = false;
  editingMachineSpec: boolean = false;

  // Assets data
  assets: ManufacturingAsset[] = [];
  allAssetsFlat: ManufacturingAsset[] = [];

  // Form data
  newProduct: any = {
    name: '',
    sku: '',
    description: '',
    standardRate: 0,
    unitType: 'pcs',
    setupTime: 30,
    standardRunTime: 240,
    category: 'General',
    isActive: true
  };

  newMachineSpec: any = {
    assetId: null,
    productId: null,
    productionRate: 0,
    setupTime: 30,
    runTime: 240,
    efficiency: 85,
    quality: 95,
    notes: '',
    isActive: true
  };

  // Dropdown options
  unitTypes = [
    { label: 'Pieces', value: 'pcs' },
    { label: 'Kilograms', value: 'kg' },
    { label: 'Boxes', value: 'boxes' },
    { label: 'Bottles', value: 'bottles' },
    { label: 'Containers', value: 'containers' },
    { label: 'Packages', value: 'packages' }
  ];

  categories = [
    { label: 'General', value: 'General' },
    { label: 'Food & Beverage', value: 'Food & Beverage' },
    { label: 'Pharmaceuticals', value: 'Pharmaceuticals' },
    { label: 'Chemicals', value: 'Chemicals' },
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Automotive', value: 'Automotive' }
  ];

  constructor(private assetsService: AssetsService) {}

  ngOnInit(): void {
    this.loadAssets();
    this.generateSampleData();
  }

  loadAssets(): void {
    this.assets = this.assetsService.getManufacturingAssets();
    this.allAssetsFlat = this.getAllAssetsFlat();
    console.log(`📋 Loaded ${this.allAssetsFlat.length} assets for machine specs`);
  }

  getAllAssetsFlat(): ManufacturingAsset[] {
    const result: ManufacturingAsset[] = [];

    const addAssetAndSubAssets = (asset: ManufacturingAsset) => {
      result.push(asset);
      if (asset.subAssets && asset.subAssets.length > 0) {
        asset.subAssets.forEach(subAsset => {
          addAssetAndSubAssets(subAsset);
        });
      }
    };

    this.assets.forEach(asset => {
      addAssetAndSubAssets(asset);
    });

    return result;
  }

  generateSampleData(): void {
    // Sample products
    this.products = [
      {
        id: 1,
        name: 'Chocolate Bar 100g',
        sku: 'CHB-100',
        description: 'Premium dark chocolate bar 100g',
        standardRate: 1200,
        unitType: 'pcs',
        setupTime: 30,
        standardRunTime: 240,
        category: 'Food & Beverage',
        isActive: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      },
      {
        id: 2,
        name: 'Protein Bar 50g',
        sku: 'PRB-050',
        description: 'High protein energy bar 50g',
        standardRate: 800,
        unitType: 'pcs',
        setupTime: 20,
        standardRunTime: 180,
        category: 'Food & Beverage',
        isActive: true,
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date('2025-01-02')
      },
      {
        id: 3,
        name: 'Granola Mix 500g',
        sku: 'GRM-500',
        description: 'Organic granola mix 500g package',
        standardRate: 600,
        unitType: 'packages',
        setupTime: 45,
        standardRunTime: 300,
        category: 'Food & Beverage',
        isActive: true,
        createdAt: new Date('2025-01-03'),
        updatedAt: new Date('2025-01-03')
      },
      {
        id: 4,
        name: 'Energy Drink 250ml',
        sku: 'END-250',
        description: 'Natural energy drink 250ml bottle',
        standardRate: 1000,
        unitType: 'bottles',
        setupTime: 25,
        standardRunTime: 200,
        category: 'Food & Beverage',
        isActive: true,
        createdAt: new Date('2025-01-04'),
        updatedAt: new Date('2025-01-04')
      },
      {
        id: 5,
        name: 'Protein Powder 1kg',
        sku: 'PPW-1000',
        description: 'Whey protein powder 1kg container',
        standardRate: 400,
        unitType: 'containers',
        setupTime: 60,
        standardRunTime: 360,
        category: 'Food & Beverage',
        isActive: true,
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date('2025-01-05')
      }
    ];

    // Sample machine specifications
    this.machineSpecs = [
      {
        id: 1,
        assetId: 1, // Test
        asset: this.allAssetsFlat.find(a => a.id === 1)!,
        productId: 1, // Chocolate Bar
        product: this.products.find(p => p.id === 1)!,
        productionRate: 800,
        setupTime: 35,
        runTime: 240,
        efficiency: 90,
        quality: 98,
        notes: 'Main production line for chocolate bars',
        isActive: true,
        createdAt: new Date('2025-01-10'),
        updatedAt: new Date('2025-01-10')
      },
      {
        id: 2,
        assetId: 101, // test1 (sub-asset of Test)
        asset: this.allAssetsFlat.find(a => a.id === 101)!,
        productId: 1, // Chocolate Bar
        product: this.products.find(p => p.id === 1)!,
        productionRate: 750,
        setupTime: 40,
        runTime: 240,
        efficiency: 85,
        quality: 96,
        notes: 'Secondary line for chocolate bars - slightly lower capacity',
        isActive: true,
        createdAt: new Date('2025-01-11'),
        updatedAt: new Date('2025-01-11')
      },
      {
        id: 3,
        assetId: 2, // Pump A
        asset: this.allAssetsFlat.find(a => a.id === 2)!,
        productId: 4, // Energy Drink
        product: this.products.find(p => p.id === 4)!,
        productionRate: 1100,
        setupTime: 20,
        runTime: 180,
        efficiency: 92,
        quality: 97,
        notes: 'Optimized for liquid production',
        isActive: true,
        createdAt: new Date('2025-01-12'),
        updatedAt: new Date('2025-01-12')
      },
      {
        id: 4,
        assetId: 3, // Compressor B
        asset: this.allAssetsFlat.find(a => a.id === 3)!,
        productId: 5, // Protein Powder
        product: this.products.find(p => p.id === 5)!,
        productionRate: 350,
        setupTime: 50,
        runTime: 300,
        efficiency: 88,
        quality: 94,
        notes: 'Powder processing with compressed air systems',
        isActive: true,
        createdAt: new Date('2025-01-13'),
        updatedAt: new Date('2025-01-13')
      }
    ];

    console.log(`✅ Generated ${this.products.length} products and ${this.machineSpecs.length} machine specifications`);
  }

  // Product Management Methods
  openCreateProductDialog(): void {
    this.editingProduct = false;
    this.newProduct = {
      name: '',
      sku: '',
      description: '',
      standardRate: 0,
      unitType: 'pcs',
      setupTime: 30,
      standardRunTime: 240,
      category: 'General',
      isActive: true
    };
    this.showProductDialog = true;
  }

  editProduct(product: Product): void {
    this.editingProduct = true;
    this.newProduct = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      description: product.description,
      standardRate: product.standardRate,
      unitType: product.unitType,
      setupTime: product.setupTime,
      standardRunTime: product.standardRunTime,
      category: product.category,
      isActive: product.isActive
    };
    this.showProductDialog = true;
  }

  saveProduct(): void {
    if (this.editingProduct) {
      // Update existing product
      const index = this.products.findIndex(p => p.id === this.newProduct.id);
      if (index !== -1) {
        this.products[index] = {
          ...this.products[index],
          ...this.newProduct,
          updatedAt: new Date()
        };
        console.log('✅ Updated product:', this.products[index].name);
      }
    } else {
      // Create new product
      const newProduct: Product = {
        id: Date.now(),
        ...this.newProduct,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.products.push(newProduct);
      console.log('✅ Created new product:', newProduct.name);
    }

    this.showProductDialog = false;
  }

  deleteProduct(product: Product): void {
    const confirmed = confirm(`Are you sure you want to delete "${product.name}"?`);
    if (confirmed) {
      const index = this.products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        this.products.splice(index, 1);
        console.log('🗑️ Deleted product:', product.name);

        // Also remove any machine specs for this product
        this.machineSpecs = this.machineSpecs.filter(spec => spec.productId !== product.id);
      }
    }
  }

  toggleProductStatus(product: Product): void {
    product.isActive = !product.isActive;
    product.updatedAt = new Date();
    console.log(`🔄 Toggled product status: ${product.name} is now ${product.isActive ? 'active' : 'inactive'}`);
  }

  // Machine Spec Management Methods
  openCreateMachineSpecDialog(): void {
    this.editingMachineSpec = false;
    this.newMachineSpec = {
      assetId: null,
      productId: null,
      productionRate: 0,
      setupTime: 30,
      runTime: 240,
      efficiency: 85,
      quality: 95,
      notes: '',
      isActive: true
    };
    this.showMachineSpecDialog = true;
  }

  editMachineSpec(spec: MachineSpec): void {
    this.editingMachineSpec = true;
    this.newMachineSpec = {
      id: spec.id,
      assetId: spec.assetId,
      productId: spec.productId,
      productionRate: spec.productionRate,
      setupTime: spec.setupTime,
      runTime: spec.runTime,
      efficiency: spec.efficiency,
      quality: spec.quality,
      notes: spec.notes,
      isActive: spec.isActive
    };
    this.showMachineSpecDialog = true;
  }

  saveMachineSpec(): void {
    const selectedAsset = this.allAssetsFlat.find(a => a.id === this.newMachineSpec.assetId);
    const selectedProduct = this.products.find(p => p.id === this.newMachineSpec.productId);

    if (!selectedAsset || !selectedProduct) {
      alert('Please select both an asset and a product.');
      return;
    }

    if (this.editingMachineSpec) {
      // Update existing machine spec
      const index = this.machineSpecs.findIndex(spec => spec.id === this.newMachineSpec.id);
      if (index !== -1) {
        this.machineSpecs[index] = {
          ...this.machineSpecs[index],
          ...this.newMachineSpec,
          asset: selectedAsset,
          product: selectedProduct,
          updatedAt: new Date()
        };
        console.log('✅ Updated machine spec:', this.machineSpecs[index]);
      }
    } else {
      // Check for duplicate asset-product combination
      const duplicate = this.machineSpecs.find(spec =>
        spec.assetId === this.newMachineSpec.assetId &&
        spec.productId === this.newMachineSpec.productId
      );

      if (duplicate) {
        alert(`Machine spec already exists for ${selectedAsset.name} producing ${selectedProduct.name}. Please edit the existing specification.`);
        return;
      }

      // Create new machine spec
      const newSpec: MachineSpec = {
        id: Date.now(),
        ...this.newMachineSpec,
        asset: selectedAsset,
        product: selectedProduct,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.machineSpecs.push(newSpec);
      console.log('✅ Created new machine spec:', newSpec);
    }

    this.showMachineSpecDialog = false;
  }

  deleteMachineSpec(spec: MachineSpec): void {
    const confirmed = confirm(`Are you sure you want to delete the specification for "${spec.asset.name}" producing "${spec.product.name}"?`);
    if (confirmed) {
      const index = this.machineSpecs.findIndex(s => s.id === spec.id);
      if (index !== -1) {
        this.machineSpecs.splice(index, 1);
        console.log('🗑️ Deleted machine spec:', spec);
      }
    }
  }

  toggleMachineSpecStatus(spec: MachineSpec): void {
    spec.isActive = !spec.isActive;
    spec.updatedAt = new Date();
    console.log(`🔄 Toggled machine spec status: ${spec.asset.name} - ${spec.product.name} is now ${spec.isActive ? 'active' : 'inactive'}`);
  }

  // Auto-fill production rate based on selected product
  onProductChange(): void {
    const selectedProduct = this.products.find(p => p.id === this.newMachineSpec.productId);
    if (selectedProduct) {
      // Set production rate to 90% of standard rate as starting point
      this.newMachineSpec.productionRate = Math.floor(selectedProduct.standardRate * 0.9);
      this.newMachineSpec.setupTime = selectedProduct.setupTime;
      this.newMachineSpec.runTime = selectedProduct.standardRunTime;
    }
  }

  // Utility methods
  getAssetOptions() {
    return this.allAssetsFlat.map(asset => ({
      label: `${asset.name} (${asset.location})`,
      value: asset.id
    }));
  }

  getProductOptions() {
    return this.products.filter(p => p.isActive).map(product => ({
      label: `${product.name} - ${product.sku}`,
      value: product.id
    }));
  }

  getFilteredMachineSpecs(): MachineSpec[] {
    return this.machineSpecs.sort((a, b) => {
      // Sort by asset name, then by product name
      if (a.asset.name !== b.asset.name) {
        return a.asset.name.localeCompare(b.asset.name);
      }
      return a.product.name.localeCompare(b.product.name);
    });
  }

  getMachineSpecsForAsset(assetId: number): MachineSpec[] {
    return this.machineSpecs.filter(spec => spec.assetId === assetId);
  }

  closeProductDialog(): void {
    this.showProductDialog = false;
  }

  closeMachineSpecDialog(): void {
    this.showMachineSpecDialog = false;
  }
}
