import { Injectable } from '@angular/core';

export interface BaseAsset {
  id: number;
  name: string;
  description: string;
  status: 'online' | 'offline' | 'maintenance' | 'needs-attention';
  criticality: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  assetType: string;
  manufacturer?: { name: string; logo: string; description: string } | string;
  model?: string;
  serialNumber?: string;
  year?: number;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  createdAt: Date;
  createdBy: { name: string; avatar: string; role: string };
  createdByAvatar: string;
  qrCode: string;
  workOrderHistory: number;
  parts: string[];
  meters: { name: string; value: string; unit: string }[];
  history: any[];
  workOrders: any[];
  parentAssetId?: number;
  subAssets?: BaseAsset[];
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

export interface ManufacturingAsset {
  id: number;
  name: string;
  location: string;
  theoryProductionRate: number;
  targetProductionRate: number;
  theoryAvailability: number;
  theoryQuality: number;
  currentStatus: 'available' | 'maintenance' | 'production' | 'setup';
  productionLines: string[];
  assetType: string;
  isTopLevel: boolean;
  parentId?: number;
  subAssets?: ManufacturingAsset[];
}

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  private allAssets: BaseAsset[] = [];

  constructor() {
    this.initializeAssetsData();
  }

  private initializeAssetsData(): void {
    // Create deeply nested sub-assets for testing recursive hierarchy (up to 5 levels)
    const level5SubAssets: BaseAsset[] = [
      {
        id: 205,
        name: 'Line 4-1-1-1-1',
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

    const level4SubAssets: BaseAsset[] = [
      {
        id: 204,
        name: 'Line 4-1-1-1',
        description: 'Level 4 sub-asset of Line 4-1-1',
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
            details: 'Created as level 4 sub-asset of Line 4-1-1.',
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

    const level3SubAssets: BaseAsset[] = [
      {
        id: 203,
        name: 'Line 4-1-1',
        description: 'Level 3 sub-asset of Line 4-1',
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
            details: 'Created as level 3 sub-asset of Line 4-1.',
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
    const nestedSubAssets: BaseAsset[] = [
      {
        id: 201,
        name: 'Line 4-1',
        description: 'Nested sub-asset of Moulder',
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
            details: 'Created as nested sub-asset of Moulder.',
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
    const subAssets1: BaseAsset[] = [
      {
        id: 101,
        name: 'Moulder',
        description: 'Sub-asset 1 of Line 4 equipment',
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
            details: 'Created as sub-asset of Line 4.',
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
        name: 'Buffer',
        description: 'Sub-asset 2 of Line 4 equipment',
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
            details: 'Created as sub-asset of Line 4.',
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
        name: 'Wrapper',
        description: 'Sub-asset 3 of Line 4 equipment',
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
            details: 'Created as sub-asset of Line 4.',
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

    // Main assets data
    this.allAssets = [
      {
        id: 1,
        name: 'Line 4',
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
        parts: ['Circuit Board', 'Display', 'Sensor'],
        meters: [
          { name: 'Temperature', value: '22', unit: '°C' },
          { name: 'Humidity', value: '45', unit: '%' }
        ],
        history: [
          {
            id: 1,
            date: new Date('2025-07-20'),
            action: 'Status updated',
            details: 'Equipment status changed from Maintenance to Online after successful repair.',
            updatedBy: 'Tech Support',
            updatedByAvatar: 'TS',
            type: 'status-change'
          },
          {
            id: 2,
            date: new Date('2025-07-15'),
            action: 'Repair completed',
            details: 'Circuit board replacement and system calibration completed successfully.',
            updatedBy: 'John Smith',
            updatedByAvatar: 'JS',
            type: 'maintenance'
          }
        ],
        workOrders: [
          {
            id: 1001,
            title: 'Replace circuit board',
            description: 'Main circuit board needs replacement',
            status: 'completed',
            priority: 'high',
            assignedTo: { name: 'John', avatar: 'J' },
            assignedToAvatar: 'J',
            createdAt: new Date('2025-05-15'),
            dueDate: new Date('2025-05-25'),
            completedAt: new Date('2025-05-20'),
            workType: 'repair',
            estimatedHours: 4,
            actualHours: 3
          },
          {
            id: 1002,
            title: 'Annual calibration',
            description: 'Perform annual equipment calibration',
            status: 'open',
            priority: 'medium',
            assignedTo: { name: 'Sarah', avatar: 'S' },
            assignedToAvatar: 'S',
            createdAt: new Date('2025-05-20'),
            dueDate: new Date('2025-05-25'),
            workType: 'inspection',
            estimatedHours: 1
          }
        ],
        subAssets: subAssets1
      },
      {
        id: 2,
        name: 'Line 5',
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
        name: 'Line 6',
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
      }
    ];

    // Add all sub-assets to the main array for search functionality
    this.addSubAssetsToArray(subAssets1);
  }

  private addSubAssetsToArray(subAssets: BaseAsset[]): void {
    subAssets.forEach(subAsset => {
      this.allAssets.push(subAsset);
      if (subAsset.subAssets && subAsset.subAssets.length > 0) {
        this.addSubAssetsToArray(subAsset.subAssets);
      }
    });
  }

  getAllAssets(): BaseAsset[] {
    return [...this.allAssets];
  }

  getTopLevelAssets(): BaseAsset[] {
    return this.allAssets.filter(asset => !asset.parentAssetId);
  }

  getAssetById(id: number): BaseAsset | undefined {
    return this.allAssets.find(asset => asset.id === id);
  }

  getSubAssets(parentId: number): BaseAsset[] {
    return this.allAssets.filter(asset => asset.parentAssetId === parentId);
  }

  getAllSubAssetsFlat(parentId: number): BaseAsset[] {
    const result: BaseAsset[] = [];
    const directSubAssets = this.getSubAssets(parentId);

    for (const subAsset of directSubAssets) {
      result.push(subAsset);
      // Recursively get sub-assets of sub-assets
      result.push(...this.getAllSubAssetsFlat(subAsset.id));
    }

    return result;
  }

  getManufacturingAssets(): ManufacturingAsset[] {
    const topLevelAssets = this.getTopLevelAssets();

    return topLevelAssets.map(asset => this.mapToManufacturingAsset(asset, true));
  }

  private mapToManufacturingAsset(asset: BaseAsset, isTopLevel: boolean = false): ManufacturingAsset {
    // Calculate production rates based on asset type
    let theoryRate = 1000;
    let targetRate = 900;
    let availability = 90;
    let quality = 95;

    switch (asset.assetType) {
      case 'Testing Equipment':
        theoryRate = 800; targetRate = 720; availability = 93; quality = 98;
        break;
      case 'Pump':
        theoryRate = 1200; targetRate = 1080; availability = 88; quality = 96;
        break;
      case 'Compressor':
        theoryRate = 900; targetRate = 810; availability = 85; quality = 94;
        break;
      case 'Component':
        theoryRate = 600; targetRate = 540; availability = 92; quality = 95;
        break;
      case 'Sensor':
        theoryRate = 300; targetRate = 270; availability = 95; quality = 99;
        break;
    }

    // Map status from assets page to manufacturing status
    let currentStatus: 'available' | 'maintenance' | 'production' | 'setup' = 'available';
    switch (asset.status) {
      case 'online':
        currentStatus = isTopLevel && Math.random() > 0.7 ? 'production' : 'available';
        break;
      case 'maintenance':
        currentStatus = 'maintenance';
        break;
      case 'offline':
        currentStatus = 'maintenance';
        break;
      case 'needs-attention':
        currentStatus = 'setup';
        break;
      default:
        currentStatus = 'available';
    }

    const manufacturingAsset: ManufacturingAsset = {
      id: asset.id,
      name: asset.name,
      location: asset.location,
      theoryProductionRate: theoryRate,
      targetProductionRate: targetRate,
      theoryAvailability: availability,
      theoryQuality: quality,
      currentStatus: currentStatus,
      productionLines: [`${asset.name} Line 1`, `${asset.name} Line 2`],
      assetType: asset.assetType,
      isTopLevel: isTopLevel,
      parentId: asset.parentAssetId
    };

    // Add sub-assets recursively for ALL assets that have them (not just top-level)
    if (asset.subAssets && asset.subAssets.length > 0) {
      manufacturingAsset.subAssets = asset.subAssets.map(subAsset =>
        this.mapToManufacturingAsset(subAsset, false)
      );
    }

    return manufacturingAsset;
  }

  getAssetHierarchy(assetId: number): { asset: BaseAsset, parents: BaseAsset[], children: BaseAsset[] } {
    const asset = this.getAssetById(assetId);
    if (!asset) {
      throw new Error(`Asset with id ${assetId} not found`);
    }

    const parents: BaseAsset[] = [];
    let currentAsset = asset;

    // Build parent chain
    while (currentAsset.parentAssetId) {
      const parent = this.getAssetById(currentAsset.parentAssetId);
      if (parent) {
        parents.unshift(parent); // Add to beginning to maintain order
        currentAsset = parent;
      } else {
        break;
      }
    }

    // Get all children (recursive)
    const children = this.getAllSubAssetsFlat(assetId);

    return { asset, parents, children };
  }
}
