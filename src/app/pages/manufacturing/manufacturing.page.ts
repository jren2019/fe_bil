import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { AssetsService, ManufacturingAsset } from '../../services/assets.service';

// Using ManufacturingAsset from the shared service with extensions for sub-asset display
type Asset = ManufacturingAsset & {
  isSubAsset?: boolean;
  nestingLevel?: number; // 0 = top-level, 1 = first sub-asset, 2 = nested, etc.
  parentAssetId?: number;
};

interface Product {
  id: number;
  name: string;
  sku: string;
  standardRate: number; // units per hour
  unitType: string; // 'pcs', 'kg', 'boxes', etc.
  setupTime: number; // minutes
  standardRunTime: number; // minutes
}

interface ProductionEvent {
  id: number;
  productId: number;
  product: Product;
  assetId: number;
  asset: Asset;
  plannedQuantity: number;
  actualQuantity?: number;
  plannedRate: number; // units per hour
  actualRate?: number;
  startUpTime: number; // minutes
  productionTime: number; // minutes
  shutDownTime: number; // minutes
  setupTime: number; // minutes
  wrapUpTime: number; // minutes
  plannedStart: Date;
  plannedEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
  efficiency?: number; // percentage
  quality?: number; // percentage
  notes?: string;
  // Inheritance properties
  parentEventId?: number; // Reference to parent event if this is inherited
  isInherited?: boolean; // True if this event was inherited from parent asset
  inheritanceLevel?: number; // 0 = parent, 1 = direct sub-asset, 2 = nested sub-asset, etc.
}

interface Shift {
  id: number;
  name: string;
  startTime: string; // "06:00"
  endTime: string; // "14:00"
  date: Date;
  assetId: number;
  asset: Asset;
  events: ProductionEvent[];
  maintenanceEvents: MaintenanceEvent[];
  status: 'planned' | 'active' | 'completed';
  totalPlannedProduction: number;
  actualProduction?: number;
  efficiency?: number;
}

interface MaintenanceEvent {
  id: number;
  type: 'preventive' | 'corrective' | 'inspection';
  description: string;
  assetId: number;
  plannedStart: Date;
  plannedEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status: 'planned' | 'in-progress' | 'completed';
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: 'production' | 'maintenance' | 'setup';
  data: ProductionEvent | MaintenanceEvent;
  color: string;
  assetId: number;
}

interface ViewMode {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-manufacturing-page',
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
    CalendarModule
  ],
  templateUrl: './manufacturing.page.html',
  styleUrls: ['./manufacturing.page.scss']
})
export class ManufacturingPageComponent implements OnInit {
  viewModes: ViewMode[] = [
    { value: 'calendar', label: 'Calendar View', icon: '📅' },
    { value: 'timeline', label: 'Timeline View', icon: '⏱️' },
    { value: 'list', label: 'List View', icon: '📋' }
  ];

  assets: Asset[] = [];
  products: Product[] = [];
  shifts: Shift[] = [];
  productionEvents: ProductionEvent[] = [];
  calendarEvents: CalendarEvent[] = [];

  selectedAssetId: number | null = null;
  selectedAsset: Asset | null = null;
  selectedAssetIds: Set<number> = new Set();
  multiSelectMode: boolean = false;
  selectedDate: Date = new Date();
  currentViewMode: string = 'calendar';
  currentViewModeLabel: string = 'Calendar View';
  showViewDropdown: boolean = false;

  // Calendar settings
  calendarView: 'day' | 'week' | 'month' = 'week';
  timeSlots: string[] = [];

  // Timeline settings
  timelineZoom: 'hour' | 'day' | 'week' | 'shift' = 'day';
  timelineStartDate: Date = new Date();
  timelineEndDate: Date = new Date();
  timelineAssetFilter: number | null = null;
  timelineEventHeight: number = 40;
  timePointWidth: number = 80;

  // Shift-specific timeline settings
  selectedShiftId: number | null = null;
  selectedShift: Shift | null = null;
  availableShifts: Shift[] = [];

  // Dialog controls
  showCreateShiftDialog: boolean = false;
  showCreateEventDialog: boolean = false;
  showAssetDetailsDialog: boolean = false;
  editingProductionEvent: boolean = false;

  // Form data
  newShift: any = {
    name: '',
    startTime: '06:00',
    endTime: '14:00',
    date: new Date(),
    assetId: null
  };

  newProductionEvent: any = {
    productId: null,
    assetId: null,
    plannedQuantity: 0,
    plannedRate: 0,
    startUpTime: 30,
    shutDownTime: 30,
    setupTime: 15,
    wrapUpTime: 15,
    shiftId: null,
    plannedStart: new Date(),
    notes: ''
  };

  // Filters
  selectedAssetFilter: number | null = null;
  selectedDateRange: Date[] = [new Date(), new Date()];
  statusFilter: string = 'all';

  // Sub-assets state
  expandedAssets: Set<number> = new Set();

  // Interactive event handling
  isDragging: boolean = false;
  dragMode: 'resize-start' | 'resize-end' | 'move' | null = null;
  dragEventId: number | null = null;
  dragStartX: number = 0;
  dragStartY: number = 0;
  dragOriginalEvent: CalendarEvent | null = null;
  editingEventId: number | null = null;
  clickTimeout: any = null;
  dragThreshold: number = 5; // Minimum pixels to move before considering it a drag
  mouseDownStarted: boolean = false;

  constructor(private assetsService: AssetsService) {
    this.generateTimeSlots();
    this.generateDummyData();
    this.initializeTimeline();
  }

  ngOnInit(): void {
    this.generateCalendarEvents();

    // Auto-select the first asset to show events by default
    if (this.assets.length > 0) {
      this.selectAsset(this.assets[0].id);
      console.log(`🎯 Auto-selected first asset: ${this.assets[0].name} (ID: ${this.assets[0].id})`);
      console.log(`📊 Total calendar events: ${this.calendarEvents.length}`);
      console.log(`🔍 Selected asset IDs: ${Array.from(this.selectedAssetIds)}`);
    }

    this.updateAvailableShifts();

    // Force calendar update after asset selection
    setTimeout(() => {
      this.generateCalendarEvents();
      console.log(`📅 Calendar events after initialization: ${this.calendarEvents.length}`);
    }, 100);
  }

  initializeTimeline(): void {
    // Initialize timeline to show current week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week
    startOfWeek.setHours(0, 0, 0, 0);

    this.timelineStartDate = startOfWeek;
    this.updateTimelineEndDate();
  }

  generateTimeSlots(): void {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        this.timeSlots.push(timeString);
      }
    }
  }

  generateDummyData(): void {
    // Load assets from the shared service - including all assets and sub-assets
    this.loadAssetsFromService();
    console.log('Loaded assets from service:', this.assets);

    // Generate products with consistent data
    const productData = [
      { name: 'Chocolate Bar 100g', sku: 'CHB-100', rate: 1200, unit: 'pcs', setup: 30 },
      { name: 'Protein Bar 50g', sku: 'PRB-050', rate: 800, unit: 'pcs', setup: 20 },
      { name: 'Granola Mix 500g', sku: 'GRM-500', rate: 600, unit: 'packages', setup: 45 },
      { name: 'Energy Drink 250ml', sku: 'END-250', rate: 1000, unit: 'bottles', setup: 25 },
      { name: 'Protein Powder 1kg', sku: 'PPW-1000', rate: 400, unit: 'containers', setup: 60 }
    ];

    for (let i = 0; i < productData.length; i++) {
      const data = productData[i];
      this.products.push({
        id: i + 1,
        name: data.name,
        sku: data.sku,
        standardRate: data.rate,
        unitType: data.unit,
        setupTime: data.setup,
        standardRunTime: 240 // 4 hours standard run
      });
    }

    // Clear existing shifts and production events since we have new assets
    this.shifts = [];
    this.productionEvents = [];

    // Get ALL assets (including sub-assets) for comprehensive event generation
    const allAssetsFlat = this.getAllAssetsFlat();
    console.log(`🎯 Creating events for ALL ${allAssetsFlat.length} assets (including sub-assets)`);

    // Generate events for the current week and next week (easier to test)
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week

    // Generate comprehensive events for each asset
    this.generateComprehensiveEvents(allAssetsFlat, startOfWeek);

    // Generate summary statistics
    const completedEvents = this.productionEvents.filter(e => e.status === 'completed').length;
    const activeEvents = this.productionEvents.filter(e => e.status === 'in-progress').length;
    const plannedEvents = this.productionEvents.filter(e => e.status === 'planned').length;
    const delayedEvents = this.productionEvents.filter(e => e.status === 'delayed').length;

    console.log(`✅ Generated events for ${allAssetsFlat.length} assets, ${this.products.length} products, ${this.shifts.length} shifts, ${this.productionEvents.length} production events`);
    console.log(`📊 Event Status: ${completedEvents} completed, ${activeEvents} in-progress, ${plannedEvents} planned, ${delayedEvents} delayed`);
  }

  getAllAssetsFlat(): Asset[] {
    const result: Asset[] = [];

    const addAssetAndSubAssets = (asset: Asset) => {
      result.push(asset);
      if (asset.subAssets && asset.subAssets.length > 0) {
        asset.subAssets.forEach(subAsset => {
          addAssetAndSubAssets(subAsset);
        });
      }
    };

    // Add all top-level assets and their sub-assets recursively
    this.assets.forEach(asset => {
      addAssetAndSubAssets(asset);
    });

    return result;
  }

  generateComprehensiveEvents(allAssets: Asset[], startOfWeek: Date): void {
    console.log(`🎯 Generating comprehensive events for current and next week starting ${startOfWeek.toDateString()}`);

    // Only generate events for TOP-LEVEL assets
    const topLevelAssets = allAssets.filter(asset => asset.isTopLevel);
    console.log(`📋 Creating events for ${topLevelAssets.length} top-level assets only:`, topLevelAssets.map(a => a.name));

    // Generate events for current week and next week (14 days total)
    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const eventDate = new Date(startOfWeek);
      eventDate.setDate(startOfWeek.getDate() + dayOffset);

      // Skip weekends for some assets for variety
      const isWeekend = dayOffset % 7 === 0 || dayOffset % 7 === 6; // Sunday or Saturday

      topLevelAssets.forEach((asset, assetIndex) => {
        // Define schedule based on asset type and name
        const schedule = this.getAssetSchedule(asset, isWeekend);

        if (!schedule.shouldWork) {
          return; // Skip this asset on this day
        }

        schedule.timeSlots.forEach((slot, slotIndex) => {
          // Add some variation - not every time slot is used
          if (Math.random() > 0.75) return; // 25% chance to skip a slot

          // Select a random product for this event
          const product = this.products[Math.floor(Math.random() * this.products.length)];
          if (!product) return;

          // Create event start time
          const eventStart = new Date(eventDate);
          eventStart.setHours(slot.start, Math.floor(Math.random() * 60), 0, 0); // Add random minutes

          // Calculate event duration (with some variation)
          const baseDuration = slot.duration;
          const variationMinutes = Math.floor(Math.random() * 60) - 30; // ±30 minutes
          const totalMinutes = (baseDuration * 60) + variationMinutes;
          const eventEnd = new Date(eventStart.getTime() + (totalMinutes * 60 * 1000));

          // Determine event status based on time
          const now = new Date();
          let eventStatus: 'planned' | 'in-progress' | 'completed' | 'delayed';

          if (eventEnd < now) {
            eventStatus = Math.random() > 0.15 ? 'completed' : 'delayed'; // 15% chance of delay for past events
          } else if (eventStart <= now && eventEnd > now) {
            eventStatus = 'in-progress';
          } else {
            eventStatus = 'planned';
          }

          // Create unique event ID
          const eventId = Date.now() + assetIndex * 10000 + dayOffset * 1000 + slotIndex * 100 + Math.floor(Math.random() * 100);

          // Calculate quantity based on asset type and size
          const baseQuantity = this.getAssetBaseQuantity(asset);
          const plannedQuantity = Math.floor(baseQuantity * (0.5 + Math.random() * 1.5)); // ±50% variation

          const productionEvent: ProductionEvent = {
            id: eventId,
            productId: product.id,
            product: product,
            assetId: asset.id,
            asset: asset,
            plannedQuantity: plannedQuantity,
            plannedRate: this.getAssetProductionRate(asset, product),
            startUpTime: this.getAssetStartupTime(asset),
            productionTime: Math.max(15, totalMinutes - 60), // Subtract setup times, minimum 15 min
            shutDownTime: this.getAssetShutdownTime(asset),
            setupTime: product.setupTime,
            wrapUpTime: 15,
            plannedStart: eventStart,
            plannedEnd: eventEnd,
            status: eventStatus,
            notes: `${eventStatus === 'planned' ? 'Scheduled' : 'Production run'} for ${asset.name}`
          };

          // Add actual data for completed events
          if (eventStatus === 'completed') {
            const efficiency = Math.floor(Math.random() * 25) + 75; // 75-100%
            productionEvent.efficiency = efficiency;
            productionEvent.quality = Math.floor(Math.random() * 15) + 85; // 85-100%
            productionEvent.actualQuantity = Math.floor(plannedQuantity * (efficiency / 100));
            productionEvent.actualStart = new Date(eventStart);
            productionEvent.actualEnd = new Date(eventEnd.getTime() + (Math.random() * 60 - 30) * 60 * 1000); // ±30 min variance
          }

          this.productionEvents.push(productionEvent);

          // Create a shift for this event if it doesn't exist
          this.createShiftForEvent(productionEvent, asset, eventDate);

          console.log(`📅 Created ${eventStatus} event for ${asset.name}: ${product.name} on ${eventDate.toDateString()} ${eventStart.getHours()}:${eventStart.getMinutes().toString().padStart(2, '0')}`);
        });
      });
    }

    // After generating all parent events, create inherited events for all sub-assets
    console.log(`🔄 Creating inherited events for all sub-assets...`);
    this.generateInheritedEventsForAllParents();
  }

  private generateInheritedEventsForAllParents(): void {
    // Get all parent events (events that belong to top-level assets)
    const parentEvents = this.productionEvents.filter(event => {
      const asset = this.getAllAssetsFlat().find(a => a.id === event.assetId);
      return asset && asset.isTopLevel;
    });

    console.log(`📋 Found ${parentEvents.length} parent events to inherit from assets:`,
      parentEvents.map(e => e.asset.name));

    // For each parent event, create inherited events for all its sub-assets
    parentEvents.forEach(parentEvent => {
      console.log(`🔄 Processing inheritance for event: ${parentEvent.product.name} on ${parentEvent.asset.name}`);
      this.createInheritedEvents(parentEvent);
    });

    console.log(`✅ Finished creating inherited events. Total events: ${this.productionEvents.length}`);
  }

  private getAssetSchedule(asset: Asset, isWeekend: boolean): { shouldWork: boolean; timeSlots: { start: number; duration: number }[] } {
    // Different assets have different working patterns
    switch (asset.assetType) {
      case 'Testing Equipment':
        return {
          shouldWork: !isWeekend, // Weekdays only
          timeSlots: [
            { start: 8, duration: 4 },   // Morning: 8-12
            { start: 13, duration: 3 }   // Afternoon: 13-16
          ]
        };

      case 'Pump':
        return {
          shouldWork: true, // Every day
          timeSlots: [
            { start: 6, duration: 6 },   // Early: 6-12
            { start: 14, duration: 4 }   // Afternoon: 14-18
          ]
        };

      case 'Compressor':
        return {
          shouldWork: true, // Every day
          timeSlots: [
            { start: 10, duration: 4 },  // Mid-morning: 10-14
            { start: 18, duration: 4 }   // Evening: 18-22
          ]
        };

      case 'Component':
        return {
          shouldWork: Math.random() > 0.3, // 70% chance to work
          timeSlots: [
            { start: 9, duration: 3 },   // Morning: 9-12
            { start: 15, duration: 2 }   // Afternoon: 15-17
          ]
        };

      case 'Sensor':
      case 'Mini-Sensor':
      case 'Sub-Sensor':
      case 'Micro-Sensor':
        return {
          shouldWork: Math.random() > 0.5, // 50% chance to work (lighter workload)
          timeSlots: [
            { start: 10, duration: 2 },  // Short morning session: 10-12
            { start: 16, duration: 1 }   // Brief afternoon: 16-17
          ]
        };

      default:
        return {
          shouldWork: Math.random() > 0.4, // 60% chance to work
          timeSlots: [
            { start: 9, duration: 3 },   // Morning: 9-12
            { start: 14, duration: 3 }   // Afternoon: 14-17
          ]
        };
    }
  }

  private getAssetBaseQuantity(asset: Asset): number {
    // Base quantity depends on asset type and hierarchy level
    switch (asset.assetType) {
      case 'Testing Equipment': return 1500;
      case 'Pump': return 2000;
      case 'Compressor': return 1200;
      case 'Component': return 800;
      case 'Sensor': return 400;
      case 'Mini-Sensor': return 200;
      case 'Sub-Sensor': return 300;
      case 'Micro-Sensor': return 100;
      default: return 600;
    }
  }

  private getAssetProductionRate(asset: Asset, product: Product): number {
    // Production rate varies by asset capability
    const baseRate = product.standardRate;
    switch (asset.assetType) {
      case 'Testing Equipment': return Math.floor(baseRate * 0.9);
      case 'Pump': return Math.floor(baseRate * 1.1);
      case 'Compressor': return Math.floor(baseRate * 0.8);
      case 'Component': return Math.floor(baseRate * 0.6);
      case 'Sensor': return Math.floor(baseRate * 0.3);
      case 'Mini-Sensor': return Math.floor(baseRate * 0.2);
      case 'Sub-Sensor': return Math.floor(baseRate * 0.25);
      case 'Micro-Sensor': return Math.floor(baseRate * 0.15);
      default: return Math.floor(baseRate * 0.7);
    }
  }

  private getAssetStartupTime(asset: Asset): number {
    // Startup time varies by asset complexity
    switch (asset.assetType) {
      case 'Testing Equipment': return 45;
      case 'Pump': return 20;
      case 'Compressor': return 35;
      case 'Component': return 15;
      case 'Sensor': return 5;
      case 'Mini-Sensor': return 3;
      case 'Sub-Sensor': return 4;
      case 'Micro-Sensor': return 2;
      default: return 25;
    }
  }

  private getAssetShutdownTime(asset: Asset): number {
    // Shutdown time is typically shorter than startup
    return Math.floor(this.getAssetStartupTime(asset) * 0.6);
  }

  createShiftForEvent(event: ProductionEvent, asset: Asset, date: Date): void {
    const eventHour = event.plannedStart.getHours();

    // Determine shift type based on event time
    let shiftName: string;
    let shiftStart: string;
    let shiftEnd: string;

    if (eventHour >= 6 && eventHour < 14) {
      shiftName = 'Day Shift';
      shiftStart = '06:00';
      shiftEnd = '14:00';
    } else if (eventHour >= 14 && eventHour < 22) {
      shiftName = 'Evening Shift';
      shiftStart = '14:00';
      shiftEnd = '22:00';
    } else {
      shiftName = 'Night Shift';
      shiftStart = '22:00';
      shiftEnd = '06:00';
    }

    // Check if shift already exists
    const existingShift = this.shifts.find(s =>
      s.assetId === asset.id &&
      s.date.toDateString() === date.toDateString() &&
      s.name === shiftName
    );

    if (existingShift) {
      // Add event to existing shift
      existingShift.events.push(event);
      existingShift.totalPlannedProduction += event.plannedQuantity;
    } else {
      // Create new shift
      const shift: Shift = {
        id: Date.now() + Math.random(),
        name: shiftName,
        startTime: shiftStart,
        endTime: shiftEnd,
        date: new Date(date),
        assetId: asset.id,
        asset: asset,
        events: [event],
        maintenanceEvents: [],
        status: event.status === 'completed' ? 'completed' : event.status === 'in-progress' ? 'active' : 'planned',
        totalPlannedProduction: event.plannedQuantity
      };

      this.shifts.push(shift);
    }
  }

  refreshData(): void {
    console.log('🔄 Refreshing manufacturing data...');

    // Clear existing data
    this.productionEvents = [];
    this.calendarEvents = [];
    this.shifts = [];

    // Reset expanded assets to default (collapsed) state
    this.expandedAssets.clear();

    // Regenerate all data
    this.generateDummyData();
    this.generateCalendarEvents();
    this.updateAvailableShifts();

    console.log(`✅ Refreshed data: ${this.productionEvents.length} production events, ${this.calendarEvents.length} calendar events`);

    // Reset selections to first asset to ensure events are visible
    if (this.assets.length > 0) {
      this.selectAsset(this.assets[0].id);
      console.log(`🎯 Auto-selected first asset after refresh: ${this.assets[0].name}`);
    }

    // Update shift selection if in shift view
    if (this.timelineZoom === 'shift') {
      if (this.availableShifts.length > 0) {
        // Find the best shift to select after refresh
        const shiftsWithEvents = this.availableShifts.filter(s => s.events && s.events.length > 0);
        const shiftToSelect = shiftsWithEvents.length > 0 ? shiftsWithEvents[0] : this.availableShifts[0];
        console.log(`🎯 Selecting shift after refresh: ${shiftToSelect.name} - ${shiftToSelect.asset.name}`);
        this.selectShift(shiftToSelect.id);
      } else {
        console.log('⚠️ No shifts available after refresh');
        this.selectedShiftId = null;
        this.selectedShift = null;
      }
    }

    // Force calendar update
    setTimeout(() => {
      this.generateCalendarEvents();
      console.log(`📅 Final calendar events count: ${this.calendarEvents.length}`);
    }, 200);
  }

  loadAssetsFromService(): void {
    // Load manufacturing assets from the shared service
    // This ensures consistency between /assets and /manufacturing pages
    this.assets = this.assetsService.getManufacturingAssets();

    console.log('Asset hierarchy loaded:');
    this.logAssetHierarchy(this.assets, 0);
  }

  private logAssetHierarchy(assets: Asset[], level: number): void {
    const indent = '  '.repeat(level);
    const prefix = level === 0 ? '- ' : '└─ ';

    assets.forEach(asset => {
      console.log(`${indent}${prefix}${asset.name} (ID: ${asset.id}) - Level ${level}${level === 0 ? ' (Top Level)' : ''}`);
      if (asset.subAssets && asset.subAssets.length > 0) {
        this.logAssetHierarchy(asset.subAssets, level + 1);
      }
    });
  }

  generateCalendarEvents(): void {
    this.calendarEvents = [];

    this.productionEvents.forEach(event => {
      // Create title with inheritance indicator
      let title = `${event.product.name} - ${event.plannedQuantity} ${event.product.unitType}`;
      if (event.isInherited) {
        title = `↳ ${title}`; // Add inheritance arrow for inherited events
      }

      this.calendarEvents.push({
        id: event.id,
        title: title,
        start: event.plannedStart,
        end: event.plannedEnd,
        type: 'production',
        data: event,
        color: this.getEventColorByAsset(event.asset.name, event.status, event),
        assetId: event.assetId
      });
    });
  }

  getEventColorByAsset(assetName: string, status: string, event?: ProductionEvent): string {
    // Define distinct colors for each asset with status variations
    let baseColor: string;

    // For inherited events, use a different color scheme based on inheritance level
    if (event?.isInherited) {
      // Use purple/violet gradient for inherited events
      switch (event.inheritanceLevel) {
        case 1:
          baseColor = '#8b5cf6'; // Violet for level 1 sub-assets
          break;
        case 2:
          baseColor = '#a855f7'; // Purple for level 2 sub-assets
          break;
        case 3:
          baseColor = '#c084fc'; // Light purple for level 3 sub-assets
          break;
        case 4:
          baseColor = '#d8b4fe'; // Lighter purple for level 4 sub-assets
          break;
        default:
          baseColor = '#e9d5ff'; // Very light purple for deeper levels
      }
    } else {
      // Original colors for parent assets
      switch (assetName) {
        case 'Test':
          baseColor = '#3b82f6'; // Blue
          break;
        case 'Pump A':
          baseColor = '#10b981'; // Green
          break;
        case 'Compressor B':
          baseColor = '#f59e0b'; // Orange
          break;
        default:
          baseColor = '#6b7280'; // Gray for unknown assets
      }
    }

    // Modify opacity/saturation based on status
    switch (status) {
      case 'completed':
        return baseColor; // Full color
      case 'in-progress':
        return baseColor + 'CC'; // 80% opacity
      case 'planned':
        return baseColor + '99'; // 60% opacity
      case 'delayed':
        return '#ef4444'; // Red for delays
      case 'cancelled':
        return '#6b7280'; // Gray for cancelled
      default:
        return baseColor;
    }
  }

  getEventColor(status: string): string {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'planned': return '#3b82f6';
      case 'delayed': return '#ef4444';
      case 'cancelled': return '#6b7280';
      default: return '#3b82f6';
    }
  }

  // UI Methods
  toggleViewDropdown(): void {
    this.showViewDropdown = !this.showViewDropdown;
  }

  closeViewDropdown(): void {
    this.showViewDropdown = false;
  }

  selectViewMode(mode: string): void {
    this.currentViewMode = mode;
    this.currentViewModeLabel = this.viewModes.find(vm => vm.value === mode)?.label || 'Calendar View';
    this.closeViewDropdown();
  }

  selectAsset(assetId: number | null): void {
    if (this.multiSelectMode && assetId !== null) {
      // Multi-select mode: toggle asset selection
      if (this.selectedAssetIds.has(assetId)) {
        this.selectedAssetIds.delete(assetId);
      } else {
        this.selectedAssetIds.add(assetId);
      }

      // Update single selection to the last selected asset for UI consistency
      if (this.selectedAssetIds.size > 0) {
        const lastSelectedId = Array.from(this.selectedAssetIds).pop()!;
        this.selectedAssetId = lastSelectedId;
        this.selectedAsset = this.assets.find(a => a.id === lastSelectedId) || null;
      } else {
        this.selectedAssetId = null;
        this.selectedAsset = null;
      }
    } else {
      // Single select mode: replace selection
      this.selectedAssetId = assetId;
      this.selectedAsset = this.assets.find(a => a.id === assetId) || null;

      // Update multi-select to match single selection
      this.selectedAssetIds.clear();
      if (assetId !== null) {
        this.selectedAssetIds.add(assetId);
      }
    }

    // Clear timeline filter when selecting from assets panel to avoid conflicts
    if (this.selectedAssetIds.size > 0) {
      this.timelineAssetFilter = null;
      console.log(`🔄 Cleared timeline filter - using asset panel selection (${this.selectedAssetIds.size} assets)`);
    }
  }

  toggleMultiSelectMode(): void {
    this.multiSelectMode = !this.multiSelectMode;
    if (!this.multiSelectMode) {
      // When exiting multi-select, keep only the primary selected asset
      this.selectedAssetIds.clear();
      if (this.selectedAssetId !== null) {
        this.selectedAssetIds.add(this.selectedAssetId);
      }
    }
  }

  isAssetSelected(assetId: number): boolean {
    return this.selectedAssetIds.has(assetId);
  }

  clearAssetSelection(): void {
    this.selectedAssetId = null;
    this.selectedAsset = null;
    this.selectedAssetIds.clear();
    console.log(`🧹 Cleared asset panel selection`);
  }

  onTimelineAssetFilterChange(): void {
    // When timeline filter is used, clear asset panel selection to avoid conflicts
    if (this.timelineAssetFilter !== null) {
      this.selectedAssetId = null;
      this.selectedAsset = null;
      this.selectedAssetIds.clear();
      console.log(`🔄 Timeline filter selected - cleared asset panel selection`);
    }
  }

  setCalendarView(view: 'day' | 'week' | 'month'): void {
    this.calendarView = view;
  }

  // Dialog Methods
  openCreateShiftDialog(): void {
    this.newShift = {
      name: '',
      startTime: '06:00',
      endTime: '14:00',
      date: new Date(this.selectedDate),
      assetId: this.selectedAssetId
    };
    this.showCreateShiftDialog = true;
  }

  createShift(): void {
    const shift: Shift = {
      id: Date.now(),
      name: this.newShift.name || `Shift ${this.shifts.length + 1}`,
      startTime: this.newShift.startTime,
      endTime: this.newShift.endTime,
      date: new Date(this.newShift.date),
      assetId: this.newShift.assetId,
      asset: this.assets.find(a => a.id === this.newShift.assetId)!,
      events: [],
      maintenanceEvents: [],
      status: 'planned',
      totalPlannedProduction: 0
    };

    this.shifts.push(shift);
    this.showCreateShiftDialog = false;
  }

  openCreateEventDialog(): void {
    this.editingProductionEvent = false;
    this.newProductionEvent = {
      productId: null,
      assetId: this.selectedAssetId,
      plannedQuantity: 0,
      plannedRate: 0,
      startUpTime: 30,
      shutDownTime: 30,
      setupTime: 15,
      wrapUpTime: 15,
      shiftId: null,
      plannedStart: new Date(),
      notes: ''
    };
    this.showCreateEventDialog = true;
  }

  createProductionEvent(): void {
    console.log('Creating production event:', this.newProductionEvent);
    console.log('Available products:', this.products.map(p => ({ id: p.id, name: p.name })));
    console.log('Available assets:', this.assets.map(a => ({ id: a.id, name: a.name })));

    // Convert to numbers if they're strings
    const productId = typeof this.newProductionEvent.productId === 'string'
      ? parseInt(this.newProductionEvent.productId)
      : this.newProductionEvent.productId;
    const assetId = typeof this.newProductionEvent.assetId === 'string'
      ? parseInt(this.newProductionEvent.assetId)
      : this.newProductionEvent.assetId;

    const product = this.products.find(p => p.id === productId);
    const asset = this.assets.find(a => a.id === assetId);

    console.log('Looking for productId:', productId, 'assetId:', assetId);
    console.log('Found product:', product);
    console.log('Found asset:', asset);

    if (!product || !asset) {
      console.error('Product or asset not found', {
        productId: productId,
        assetId: assetId,
        formValues: this.newProductionEvent
      });
      alert(`Please select both a product and equipment.\nProduct: ${product ? '✓' : '✗'}\nEquipment: ${asset ? '✓' : '✗'}`);
      return;
    }

    if (!this.newProductionEvent.plannedQuantity || !this.newProductionEvent.plannedRate) {
      alert('Please enter quantity and production rate.');
      return;
    }

    const totalTime = this.newProductionEvent.startUpTime +
                     this.newProductionEvent.setupTime +
                     this.newProductionEvent.wrapUpTime +
                     this.newProductionEvent.shutDownTime;

    const productionTime = Math.ceil(this.newProductionEvent.plannedQuantity / this.newProductionEvent.plannedRate * 60);
    const plannedStart = new Date(this.newProductionEvent.plannedStart);
    const plannedEnd = new Date(plannedStart.getTime() + ((totalTime + productionTime) * 60 * 1000));

    // Check for overlapping events on the same asset
    const overlappingEvent = this.findOverlappingEvent(asset.id, plannedStart, plannedEnd);
    if (overlappingEvent) {
      alert(`Event conflicts with existing event: "${overlappingEvent.product.name}" from ${overlappingEvent.plannedStart.toLocaleString()} to ${overlappingEvent.plannedEnd.toLocaleString()}. Please choose a different time slot.`);
      return;
    }

    const event: ProductionEvent = {
      id: Date.now(),
      productId: product.id,
      product: product,
      assetId: asset.id,
      asset: asset,
      plannedQuantity: this.newProductionEvent.plannedQuantity,
      plannedRate: this.newProductionEvent.plannedRate,
      startUpTime: this.newProductionEvent.startUpTime,
      productionTime: productionTime,
      shutDownTime: this.newProductionEvent.shutDownTime,
      setupTime: this.newProductionEvent.setupTime,
      wrapUpTime: this.newProductionEvent.wrapUpTime,
      plannedStart: plannedStart,
      plannedEnd: plannedEnd,
      status: 'planned',
      notes: this.newProductionEvent.notes
    };

    console.log('Adding new event:', event);

    // Add to production events
    this.productionEvents.push(event);

    // Find or create a shift for this event
    this.assignEventToShift(event);

    // Regenerate calendar events
    this.generateCalendarEvents();

    console.log('Total production events:', this.productionEvents.length);
    console.log('Total calendar events:', this.calendarEvents.length);

    this.showCreateEventDialog = false;

    // Create inherited events for sub-assets
    this.createInheritedEvents(event);

    // Show success message with inheritance info
    const inheritedCount = this.getSubAssetsRecursively(asset).length;
    const inheritedText = inheritedCount > 0 ? `\n\n${inheritedCount} sub-asset events also created automatically with the SAME schedule timing but different specifications.` : '';
    alert(`Production event created successfully!\n\nProduct: ${product.name}\nQuantity: ${event.plannedQuantity} ${product.unitType}\nScheduled: ${event.plannedStart.toLocaleString()} - ${event.plannedEnd.toLocaleString()}${inheritedText}`);
  }

  createInheritedEvents(parentEvent: ProductionEvent): void {
    console.log(`🔄 Creating synchronized inherited events for parent event: ${parentEvent.product.name} on ${parentEvent.asset.name}`);

    // Find the parent asset in the assets hierarchy
    const parentAsset = this.getAllAssetsFlat().find(a => a.id === parentEvent.assetId);
    if (!parentAsset) {
      console.log(`❌ Parent asset not found for ID: ${parentEvent.assetId}`);
      return;
    }

    // Find the same asset in the main assets array to get the subAssets
    const parentAssetWithSubAssets = this.assets.find(a => a.id === parentEvent.assetId);
    if (!parentAssetWithSubAssets || !parentAssetWithSubAssets.subAssets || parentAssetWithSubAssets.subAssets.length === 0) {
      console.log(`❌ No sub-assets found for parent asset: ${parentAsset.name}`);
      return;
    }

    const subAssets = this.getSubAssetsRecursively(parentAssetWithSubAssets);
    console.log(`📋 Found ${subAssets.length} sub-assets to inherit event with SAME timing but different specs:`, subAssets.map(sa => sa.name));

    subAssets.forEach((subAsset, index) => {
      const inheritedEvent = this.createInheritedEvent(parentEvent, subAsset, index);
      if (inheritedEvent) {
        // Add to production events
        this.productionEvents.push(inheritedEvent);

        // Assign to appropriate shift
        this.assignEventToShift(inheritedEvent);

        console.log(`✅ Created synchronized inherited event for ${subAsset.name} (Level ${inheritedEvent.inheritanceLevel}) - Same timing as parent`);
      }
    });

    // Regenerate calendar events to include inherited events
    this.generateCalendarEvents();
  }

  getSubAssetsRecursively(asset: Asset, level: number = 0): Array<Asset & { inheritanceLevel: number }> {
    const result: Array<Asset & { inheritanceLevel: number }> = [];

    if (asset.subAssets && asset.subAssets.length > 0) {
      asset.subAssets.forEach(subAsset => {
        // Add this sub-asset
        result.push({ ...subAsset, inheritanceLevel: level + 1 });

        // Recursively add its sub-assets
        const nestedSubAssets = this.getSubAssetsRecursively(subAsset, level + 1);
        result.push(...nestedSubAssets);
      });
    }

    return result;
  }

  createInheritedEvent(parentEvent: ProductionEvent, subAsset: Asset & { inheritanceLevel: number }, index: number): ProductionEvent | null {
    // Calculate sub-asset specific parameters based on asset type and inheritance level
    const config = this.getSubAssetConfiguration(subAsset, parentEvent);

    // Use EXACT same timing as parent - no staggering, no time offsets
    const inheritedStartTime = new Date(parentEvent.plannedStart);
    const inheritedEndTime = new Date(parentEvent.plannedEnd);

    // Check for overlaps with existing events (using parent's exact timing)
    const overlap = this.findOverlappingEvent(subAsset.id, inheritedStartTime, inheritedEndTime);
    if (overlap) {
      console.warn(`⚠️ Skipping inherited event for ${subAsset.name} due to overlap with existing event`);
      return null;
    }

    // Calculate production time based on the inherited duration and sub-asset specs
    const totalDuration = inheritedEndTime.getTime() - inheritedStartTime.getTime();
    const totalMinutes = totalDuration / (60 * 1000);
    const nonProductionTime = config.startUpTime + config.setupTime + config.wrapUpTime + config.shutDownTime;
    const productionTime = Math.max(15, totalMinutes - nonProductionTime);

    const inheritedEvent: ProductionEvent = {
      id: Date.now() + Math.random() * 1000 + index, // Unique ID
      productId: parentEvent.productId,
      product: parentEvent.product,
      assetId: subAsset.id,
      asset: subAsset,
      plannedQuantity: config.plannedQuantity,
      plannedRate: config.plannedRate,
      startUpTime: config.startUpTime,
      productionTime: productionTime,
      shutDownTime: config.shutDownTime,
      setupTime: config.setupTime,
      wrapUpTime: config.wrapUpTime,
      plannedStart: inheritedStartTime, // Exact same start time as parent
      plannedEnd: inheritedEndTime,     // Exact same end time as parent
      status: 'planned',
      notes: `Inherited from ${parentEvent.asset.name} - ${parentEvent.product.name}`,
      // Inheritance properties
      parentEventId: parentEvent.id,
      isInherited: true,
      inheritanceLevel: subAsset.inheritanceLevel
    };

    return inheritedEvent;
  }

  getSubAssetConfiguration(subAsset: Asset & { inheritanceLevel: number }, parentEvent: ProductionEvent): {
    plannedQuantity: number;
    plannedRate: number;
    startUpTime: number;
    setupTime: number;
    shutDownTime: number;
    wrapUpTime: number;
  } {
    // Base configuration from parent
    let plannedQuantity = parentEvent.plannedQuantity;
    let plannedRate = parentEvent.plannedRate;
    let startUpTime = parentEvent.startUpTime;
    let setupTime = parentEvent.setupTime;
    let shutDownTime = parentEvent.shutDownTime;
    let wrapUpTime = parentEvent.wrapUpTime;

    // Adjust parameters based on asset type and inheritance level
    switch (subAsset.assetType) {
      case 'Sensor':
        // Sensors work faster but produce less quantity
        plannedRate = Math.round(plannedRate * 0.3); // 30% of parent rate
        plannedQuantity = Math.round(plannedQuantity * 0.2); // 20% of parent quantity
        startUpTime = Math.round(startUpTime * 0.5); // Half the startup time
        setupTime = Math.round(setupTime * 0.3); // Faster setup
        break;

      case 'Component':
        // Components work at moderate rates
        plannedRate = Math.round(plannedRate * 0.6); // 60% of parent rate
        plannedQuantity = Math.round(plannedQuantity * 0.4); // 40% of parent quantity
        startUpTime = Math.round(startUpTime * 0.7); // Moderate startup
        setupTime = Math.round(setupTime * 0.6); // Moderate setup
        break;

      case 'Equipment':
        // Equipment works at similar rates but different quantities
        plannedRate = Math.round(plannedRate * 0.8); // 80% of parent rate
        plannedQuantity = Math.round(plannedQuantity * 0.7); // 70% of parent quantity
        startUpTime = Math.round(startUpTime * 0.9); // Similar startup
        setupTime = Math.round(setupTime * 0.8); // Similar setup
        break;

      default:
        // Generic sub-asset
        plannedRate = Math.round(plannedRate * 0.5); // 50% of parent rate
        plannedQuantity = Math.round(plannedQuantity * 0.3); // 30% of parent quantity
        startUpTime = Math.round(startUpTime * 0.6); // Moderate startup
        setupTime = Math.round(setupTime * 0.5); // Moderate setup
    }

    // Further adjust based on inheritance level (deeper assets are smaller/faster)
    const levelMultiplier = Math.pow(0.8, subAsset.inheritanceLevel - 1); // 20% reduction per level
    plannedQuantity = Math.max(1, Math.round(plannedQuantity * levelMultiplier));
    plannedRate = Math.max(1, Math.round(plannedRate * levelMultiplier));

    // Ensure minimum values
    startUpTime = Math.max(5, startUpTime);
    setupTime = Math.max(5, setupTime);
    shutDownTime = Math.max(5, shutDownTime);
    wrapUpTime = Math.max(5, wrapUpTime);

    return {
      plannedQuantity,
      plannedRate,
      startUpTime,
      setupTime,
      shutDownTime,
      wrapUpTime
    };
  }

  updateInheritedEvents(parentEvent: ProductionEvent): void {
    // First, delete existing inherited events for this parent
    this.deleteInheritedEvents(parentEvent.id);

    // Then create new inherited events with updated parameters
    this.createInheritedEvents(parentEvent);
  }

  deleteInheritedEvents(parentEventId: number): void {
    // Find and remove all inherited events that have this parent
    const inheritedEvents = this.productionEvents.filter(event => event.parentEventId === parentEventId);

    console.log(`🗑️ Found ${inheritedEvents.length} inherited events to delete for parent event ${parentEventId}`);

    inheritedEvents.forEach(inheritedEvent => {
      // Remove from production events
      const eventIndex = this.productionEvents.findIndex(e => e.id === inheritedEvent.id);
      if (eventIndex !== -1) {
        this.productionEvents.splice(eventIndex, 1);
        console.log(`✅ Deleted inherited event ${inheritedEvent.id} for ${inheritedEvent.asset.name}`);
      }
    });
  }

  findOverlappingEvent(assetId: number, startTime: Date, endTime: Date): ProductionEvent | null {
    return this.productionEvents.find(event => {
      if (event.assetId !== assetId) return false;

      // Check if times overlap
      const eventStart = new Date(event.plannedStart);
      const eventEnd = new Date(event.plannedEnd);

      return (startTime < eventEnd && endTime > eventStart);
    }) || null;
  }

  assignEventToShift(event: ProductionEvent): void {
    const eventDate = new Date(event.plannedStart);
    eventDate.setHours(0, 0, 0, 0);

    // Find appropriate shift for this event based on time
    const eventHour = event.plannedStart.getHours();
    let shiftName = 'Day Shift';
    let shiftStart = '06:00';
    let shiftEnd = '14:00';

    if (eventHour >= 14 && eventHour < 22) {
      shiftName = 'Evening Shift';
      shiftStart = '14:00';
      shiftEnd = '22:00';
    } else if (eventHour >= 22 || eventHour < 6) {
      shiftName = 'Night Shift';
      shiftStart = '22:00';
      shiftEnd = '06:00';
    }

    // Find existing shift or create new one
    let shift = this.shifts.find(s =>
      s.assetId === event.assetId &&
      s.date.toDateString() === eventDate.toDateString() &&
      s.name === shiftName
    );

    if (!shift) {
      shift = {
        id: Date.now() + Math.random(),
        name: shiftName,
        startTime: shiftStart,
        endTime: shiftEnd,
        date: eventDate,
        assetId: event.assetId,
        asset: event.asset,
        events: [],
        maintenanceEvents: [],
        status: 'planned',
        totalPlannedProduction: 0
      };
      this.shifts.push(shift);
    }

    // Add event to shift
    shift.events.push(event);
    shift.totalPlannedProduction = shift.events.reduce((sum, e) => sum + e.plannedQuantity, 0);
  }

  openAssetDetails(asset: Asset): void {
    this.selectedAsset = asset;
    this.showAssetDetailsDialog = true;
  }

  // Utility Methods
  getAssetShifts(assetId: number, date: Date): Shift[] {
    return this.shifts.filter(shift =>
      shift.assetId === assetId &&
      shift.date.toDateString() === date.toDateString()
    );
  }

  getShiftEvents(shiftId: number): ProductionEvent[] {
    return this.productionEvents.filter(event => {
      const shift = this.shifts.find(s => s.id === shiftId);
      if (!shift) return false;

      return event.assetId === shift.assetId &&
             event.plannedStart >= this.getShiftStartDateTime(shift) &&
             event.plannedEnd <= this.getShiftEndDateTime(shift);
    });
  }

  getShiftStartDateTime(shift: Shift): Date {
    const [hours, minutes] = shift.startTime.split(':').map(Number);
    const date = new Date(shift.date);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  getShiftEndDateTime(shift: Shift): Date {
    const [hours, minutes] = shift.endTime.split(':').map(Number);
    const date = new Date(shift.date);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  calculateEfficiency(planned: number, actual: number): number {
    return Math.round((actual / planned) * 100);
  }

  onProductChange(): void {
    const selectedProduct = this.products.find(p => p.id === this.newProductionEvent.productId);
    if (selectedProduct) {
      this.newProductionEvent.plannedRate = selectedProduct.standardRate;
      this.newProductionEvent.setupTime = selectedProduct.setupTime;
    }
  }

  getPlannedEndTime(): Date | null {
    if (!this.newProductionEvent.plannedStart ||
        !this.newProductionEvent.plannedQuantity ||
        !this.newProductionEvent.plannedRate) {
      return null;
    }

    const totalTime = this.newProductionEvent.startUpTime +
                     this.newProductionEvent.setupTime +
                     this.newProductionEvent.wrapUpTime +
                     this.newProductionEvent.shutDownTime;

    const productionTime = Math.ceil(this.newProductionEvent.plannedQuantity / this.newProductionEvent.plannedRate * 60);
    const startTime = new Date(this.newProductionEvent.plannedStart);

    return new Date(startTime.getTime() + ((totalTime + productionTime) * 60 * 1000));
  }

  getFilteredAssets(): Asset[] {
    const result: Asset[] = [];

    const addAssetWithSubAssets = (asset: Asset, nestingLevel: number = 0, parentId?: number) => {
      // Add the current asset with proper nesting properties
      result.push({
        ...asset,
        isSubAsset: nestingLevel > 0,
        nestingLevel: nestingLevel,
        parentAssetId: parentId
      } as Asset);

      // If this asset is expanded and has sub-assets, recursively add them
      if (this.expandedAssets.has(asset.id) && asset.subAssets && asset.subAssets.length > 0) {
        for (const subAsset of asset.subAssets) {
          // Recursively process sub-assets with incremented nesting level
          addAssetWithSubAssets(subAsset, nestingLevel + 1, asset.id);
        }
      }
    };

    // Start with top-level assets (nestingLevel = 0)
    for (const asset of this.assets) {
      addAssetWithSubAssets(asset, 0);
    }

    return result;
  }

  toggleAssetExpansion(asset: Asset, event: Event): void {
    event.stopPropagation();

    if (this.expandedAssets.has(asset.id)) {
      this.expandedAssets.delete(asset.id);
      console.log(`🔽 Collapsed asset: ${asset.name}`);
    } else {
      this.expandedAssets.add(asset.id);
      console.log(`🔼 Expanded asset: ${asset.name} (${asset.subAssets?.length || 0} sub-assets)`);
    }
  }

  isAssetExpanded(assetId: number): boolean {
    return this.expandedAssets.has(assetId);
  }

  getFilteredShifts(): Shift[] {
    let filtered = this.shifts;

    if (this.selectedAssetFilter) {
      filtered = filtered.filter(shift => shift.assetId === this.selectedAssetFilter);
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(shift => shift.status === this.statusFilter);
    }

    return filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  navigateDate(direction: 'prev' | 'next'): void {
    const days = this.calendarView === 'day' ? 1 : this.calendarView === 'week' ? 7 : 30;
    const multiplier = direction === 'next' ? 1 : -1;

    this.selectedDate = new Date(this.selectedDate.getTime() + (days * 24 * 60 * 60 * 1000 * multiplier));
  }

  getCalendarDays(): Date[] {
    const days: Date[] = [];
    const startDate = new Date(this.selectedDate);

    if (this.calendarView === 'week') {
      // Get start of week
      const dayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - dayOfWeek);

      for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(day.getDate() + i);
        days.push(day);
      }
    } else if (this.calendarView === 'day') {
      days.push(new Date(startDate));
    }

    return days;
  }

  getEventsForDay(date: Date): CalendarEvent[] {
    const filteredEvents = this.calendarEvents.filter(event => {
      const eventDate = new Date(event.start);
      const sameDay = eventDate.toDateString() === date.toDateString();

      // Asset filtering logic - only show events that directly belong to selected assets
      let matchesAsset = false;
      if (this.selectedAssetIds.size > 0) {
        // Direct match: event's asset is selected (no inheritance matching)
        matchesAsset = this.selectedAssetIds.has(event.assetId);
      } else {
        // If no assets selected, show all events
        matchesAsset = true;
      }

      return sameDay && matchesAsset;
    });

    // Debug logging
    if (this.selectedAssetIds.size > 0) {
      console.log(`📅 Events for ${date.toDateString()}: ${filteredEvents.length} events`);
      console.log(`🔍 Selected assets: ${Array.from(this.selectedAssetIds)}`);
      if (filteredEvents.length > 0) {
        console.log(`📋 Event assets:`, filteredEvents.map(e => ({ id: e.assetId, title: e.title })));
      }
    }

    return filteredEvents;
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  getEventPosition(event: CalendarEvent): { top: number; height: number } {
    const startTime = new Date(event.start);
    const endTime = new Date(event.end);

    // Calculate position based on 30-minute slots (2 slots per hour)
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();

    const startSlot = (startHour * 2) + (startMinute >= 30 ? 1 : 0);
    const endSlot = (endHour * 2) + (endMinute >= 30 ? 1 : 0);

    const slotHeight = 30; // Each 30-minute slot is 30px high

    return {
      top: startSlot * slotHeight,
      height: (endSlot - startSlot) * slotHeight
    };
  }

  // Enhanced interactive event handling methods
  onEventMouseDown(event: CalendarEvent, mouseEvent: MouseEvent, mode: 'resize-start' | 'resize-end' | 'move'): void {
    // Don't prevent default immediately - let clicks through
    mouseEvent.stopPropagation();

    // Clear any existing editing state
    this.editingEventId = null;

    // Record initial state but don't start dragging yet
    this.mouseDownStarted = true;
    this.isDragging = false; // Will be set to true only if movement exceeds threshold
    this.dragMode = mode;
    this.dragEventId = event.id;
    this.dragStartX = mouseEvent.clientX;
    this.dragStartY = mouseEvent.clientY;
    this.dragOriginalEvent = { ...event };

    // Add global mouse listeners
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    document.addEventListener('mouseup', this.onDocumentMouseUp.bind(this));
  }

  onDocumentMouseMove(mouseEvent: MouseEvent): void {
    if (!this.mouseDownStarted || !this.dragOriginalEvent) return;

    const deltaX = Math.abs(mouseEvent.clientX - this.dragStartX);
    const deltaY = Math.abs(mouseEvent.clientY - this.dragStartY);
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Check if movement exceeds threshold to start dragging
    if (!this.isDragging && totalMovement > this.dragThreshold) {
      console.log('🎯 Starting drag operation after threshold exceeded');
      this.isDragging = true;

      // Now prevent default to avoid text selection during drag
      mouseEvent.preventDefault();

      // Add appropriate cursor classes
      document.body.classList.add('dragging-event');
      if (this.dragMode === 'resize-start' || this.dragMode === 'resize-end') {
        document.body.classList.add('resizing-event');
      } else {
        document.body.classList.add('moving-event');
      }
    }

    // Only perform drag operations if we've started dragging
    if (!this.isDragging) return;

    const deltaYFromStart = mouseEvent.clientY - this.dragStartY;
    const minutesChanged = Math.round(deltaYFromStart / 2); // 2px = 1 minute

    const eventIndex = this.calendarEvents.findIndex(e => e.id === this.dragEventId);
    if (eventIndex === -1) return;

    const originalStart = new Date(this.dragOriginalEvent.start);
    const originalEnd = new Date(this.dragOriginalEvent.end);
    let newStart = new Date(originalStart);
    let newEnd = new Date(originalEnd);

    switch (this.dragMode) {
      case 'resize-start':
        newStart = new Date(originalStart.getTime() + (minutesChanged * 60 * 1000));
        // Ensure start is before end and minimum 15 minutes duration
        const minStartTime = new Date(originalEnd.getTime() - (15 * 60 * 1000));
        if (newStart >= originalEnd) {
          newStart = minStartTime;
        }

        // Don't allow start time before 00:00
        const resizeStartDayStart = new Date(originalStart);
        resizeStartDayStart.setHours(0, 0, 0, 0);
        if (newStart < resizeStartDayStart) {
          newStart = resizeStartDayStart;
        }
        break;

      case 'resize-end':
        newEnd = new Date(originalEnd.getTime() + (minutesChanged * 60 * 1000));
        // Ensure end is after start and minimum 15 minutes duration
        const minEndTime = new Date(originalStart.getTime() + (15 * 60 * 1000));
        if (newEnd <= originalStart) {
          newEnd = minEndTime;
        }

        // Don't allow end time after 23:59
        const resizeEndDayEnd = new Date(originalEnd);
        resizeEndDayEnd.setHours(23, 59, 59, 999);
        if (newEnd > resizeEndDayEnd) {
          newEnd = resizeEndDayEnd;
        }
        break;

      case 'move':
        const duration = originalEnd.getTime() - originalStart.getTime();
        newStart = new Date(originalStart.getTime() + (minutesChanged * 60 * 1000));
        newEnd = new Date(newStart.getTime() + duration);

        // Ensure event stays within the day
        const moveDayStart = new Date(originalStart);
        moveDayStart.setHours(0, 0, 0, 0);
        const moveDayEnd = new Date(originalStart);
        moveDayEnd.setHours(23, 59, 59, 999);

        if (newStart < moveDayStart) {
          newStart = moveDayStart;
          newEnd = new Date(newStart.getTime() + duration);
        }
        if (newEnd > moveDayEnd) {
          newEnd = moveDayEnd;
          newStart = new Date(newEnd.getTime() - duration);
        }
        break;
    }

    // Update the calendar event
    this.calendarEvents[eventIndex] = {
      ...this.calendarEvents[eventIndex],
      start: newStart,
      end: newEnd
    };

    // Update the underlying production event
    const productionEventIndex = this.productionEvents.findIndex(e => e.id === this.dragEventId);
    if (productionEventIndex !== -1) {
      this.productionEvents[productionEventIndex] = {
        ...this.productionEvents[productionEventIndex],
        plannedStart: newStart,
        plannedEnd: newEnd
      };

      // Recalculate production time based on new duration
      const durationMinutes = (newEnd.getTime() - newStart.getTime()) / (60 * 1000);
      const nonProductionTime = this.productionEvents[productionEventIndex].startUpTime +
                               this.productionEvents[productionEventIndex].setupTime +
                               this.productionEvents[productionEventIndex].wrapUpTime +
                               this.productionEvents[productionEventIndex].shutDownTime;
      this.productionEvents[productionEventIndex].productionTime = Math.max(15, durationMinutes - nonProductionTime);
    }
  }

  onDocumentMouseUp(): void {
    // Check if this was a click (no dragging started)
    if (this.mouseDownStarted && !this.isDragging && this.dragOriginalEvent) {
      console.log('🖱️ Mouse up detected as click - opening edit dialog');
      // This was a click, not a drag - open the edit dialog
      this.editProductionEvent(this.dragOriginalEvent);
    }

    // Clean up drag state
    if (this.isDragging) {
      this.isDragging = false;
      // Remove all dragging classes
      document.body.classList.remove('dragging-event', 'resizing-event', 'moving-event');
    }

    // Reset all mouse interaction state
    this.mouseDownStarted = false;
    this.dragMode = null;
    this.dragEventId = null;
    this.dragOriginalEvent = null;

    // Remove global listeners
    document.removeEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onDocumentMouseUp.bind(this));
  }

  onEventClick(event: CalendarEvent, mouseEvent: MouseEvent): void {
    // Click handling is now done in onDocumentMouseUp to avoid conflicts with drag detection
    // This method is kept for compatibility but the actual click logic happens in mouseup
    console.log('🖱️ Calendar event click event fired for:', event.title);
  }

  editProductionEvent(calendarEvent: CalendarEvent): void {
    console.log('📝 editProductionEvent called for event ID:', calendarEvent.id);
    const productionEvent = this.productionEvents.find(e => e.id === calendarEvent.id);

    if (!productionEvent) {
      console.error('❌ Production event not found for ID:', calendarEvent.id);
      console.log('Available production events:', this.productionEvents.map(e => ({ id: e.id, title: e.product.name })));
      return;
    }

    console.log('✅ Found production event:', productionEvent.product.name);
    this.editingProductionEvent = true;
    this.newProductionEvent = {
      id: productionEvent.id,
      productId: productionEvent.productId,
      assetId: productionEvent.assetId,
      plannedQuantity: productionEvent.plannedQuantity,
      plannedRate: productionEvent.plannedRate,
      startUpTime: productionEvent.startUpTime,
      shutDownTime: productionEvent.shutDownTime,
      setupTime: productionEvent.setupTime,
      wrapUpTime: productionEvent.wrapUpTime,
      plannedStart: new Date(productionEvent.plannedStart),
      notes: productionEvent.notes || ''
    };

    console.log('🎭 Opening event dialog, showCreateEventDialog =', true);
    this.showCreateEventDialog = true;
  }

  updateProductionEvent(): void {
    const eventIndex = this.productionEvents.findIndex(e => e.id === this.newProductionEvent.id);
    if (eventIndex === -1) return;

    const product = this.products.find(p => p.id === this.newProductionEvent.productId);
    const asset = this.assets.find(a => a.id === this.newProductionEvent.assetId);

    if (!product || !asset) return;

    const totalTime = this.newProductionEvent.startUpTime +
                     this.newProductionEvent.setupTime +
                     this.newProductionEvent.wrapUpTime +
                     this.newProductionEvent.shutDownTime;

    const productionTime = Math.ceil(this.newProductionEvent.plannedQuantity / this.newProductionEvent.plannedRate * 60);

    const originalEvent = this.productionEvents[eventIndex];

    // Update production event
    this.productionEvents[eventIndex] = {
      ...this.productionEvents[eventIndex],
      productId: product.id,
      product: product,
      assetId: asset.id,
      asset: asset,
      plannedQuantity: this.newProductionEvent.plannedQuantity,
      plannedRate: this.newProductionEvent.plannedRate,
      startUpTime: this.newProductionEvent.startUpTime,
      productionTime: productionTime,
      shutDownTime: this.newProductionEvent.shutDownTime,
      setupTime: this.newProductionEvent.setupTime,
      wrapUpTime: this.newProductionEvent.wrapUpTime,
      plannedStart: new Date(this.newProductionEvent.plannedStart),
      plannedEnd: new Date(this.newProductionEvent.plannedStart.getTime() + ((totalTime + productionTime) * 60 * 1000)),
      notes: this.newProductionEvent.notes
    };

    // If this is not an inherited event, update or recreate inherited events
    if (!originalEvent.isInherited) {
      console.log('🔄 Updating inherited events for modified parent event');
      this.updateInheritedEvents(this.productionEvents[eventIndex]);
    }

    this.generateCalendarEvents();
    this.showCreateEventDialog = false;
    this.editingProductionEvent = false;
  }

  saveProductionEvent(): void {
    if (this.editingProductionEvent) {
      this.updateProductionEvent();
    } else {
      this.createProductionEvent();
    }
  }

  closeEventDialog(): void {
    this.showCreateEventDialog = false;
    this.editingProductionEvent = false;
    this.editingEventId = null;

    // Clear any pending click timeout
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
  }

  deleteProductionEvent(): void {
    if (!this.editingProductionEvent || !this.newProductionEvent.id) return;

    const eventToDelete = this.productionEvents.find(e => e.id === this.newProductionEvent.id);
    if (!eventToDelete) return;

    // If this is not an inherited event, also delete all inherited events
    if (!eventToDelete.isInherited) {
      console.log('🗑️ Deleting inherited events for parent event');
      this.deleteInheritedEvents(eventToDelete.id);
    }

    // Remove from production events
    const eventIndex = this.productionEvents.findIndex(e => e.id === this.newProductionEvent.id);
    if (eventIndex !== -1) {
      this.productionEvents.splice(eventIndex, 1);
    }

    // Remove from calendar events
    const calendarIndex = this.calendarEvents.findIndex(e => e.id === this.newProductionEvent.id);
    if (calendarIndex !== -1) {
      this.calendarEvents.splice(calendarIndex, 1);
    }

    // Regenerate calendar events
    this.generateCalendarEvents();

    this.showCreateEventDialog = false;
    this.editingProductionEvent = false;
  }

  getDeleteButtonText(): string {
    if (!this.newProductionEvent.id) return 'Delete Event';

    const event = this.productionEvents.find(e => e.id === this.newProductionEvent.id);
    if (!event) return 'Delete Event';

    if (event.isInherited) {
      return 'Delete Event';
    } else {
      // Count inherited events for this parent
      const inheritedCount = this.productionEvents.filter(e => e.parentEventId === event.id).length;
      if (inheritedCount > 0) {
        return `Delete Event + ${inheritedCount} Inherited`;
      } else {
        return 'Delete Event';
      }
    }
  }

  getEventStyle(event: CalendarEvent): any {
    const position = this.getEventPosition(event);
    return {
      'background-color': event.color,
      'top.px': position.top,
      'height.px': position.height
    };
  }

  // New utility methods for enhanced interaction
  getEventDuration(event: CalendarEvent): number {
    return (event.end.getTime() - event.start.getTime()) / (60 * 1000); // Duration in minutes
  }

  formatEventDuration(event: CalendarEvent): string {
    const duration = this.getEventDuration(event);
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }

  snapToTimeSlot(minutes: number): number {
    // Snap to 15-minute intervals
    return Math.round(minutes / 15) * 15;
  }

  getTimeFromPosition(y: number): Date {
    const slotHeight = 30; // Each 30-minute slot is 30px high
    const padding = { top: 20 };

    // Calculate which time slot this Y position corresponds to
    const slotIndex = Math.floor((y - padding.top) / slotHeight);
    const timeInMinutes = slotIndex * 30; // Each slot is 30 minutes

    const date = new Date(this.selectedDate);
    date.setHours(0, 0, 0, 0);
    date.setMinutes(timeInMinutes);

    return date;
  }

  // Timeline view methods
  navigateTimelineDate(direction: 'prev' | 'next'): void {
    if (this.timelineZoom === 'shift') {
      this.navigateShift(direction);
      return;
    }

    let increment: number;

    switch (this.timelineZoom) {
      case 'hour':
        increment = 12 * 60 * 60 * 1000; // 12 hours
        break;
      case 'day':
        increment = 7 * 24 * 60 * 60 * 1000; // 7 days
        break;
      case 'week':
        increment = 4 * 7 * 24 * 60 * 60 * 1000; // 4 weeks
        break;
    }

    const multiplier = direction === 'next' ? 1 : -1;
    this.timelineStartDate = new Date(this.timelineStartDate.getTime() + (increment * multiplier));
    this.updateTimelineEndDate();
  }

  setTimelineZoom(zoom: 'hour' | 'day' | 'week' | 'shift'): void {
    console.log(`🔧 Setting timeline zoom to: ${zoom}`);
    this.timelineZoom = zoom;

    if (zoom === 'shift') {
      this.updateAvailableShifts();

      console.log(`🔍 Available shifts after update: ${this.availableShifts.length}`);

      // Always select a shift when switching to shift view
      if (this.availableShifts.length > 0) {
        let shiftToSelect: Shift | null = null;

        // First, try to keep the current selection if it's still valid
        if (this.selectedShiftId) {
          shiftToSelect = this.availableShifts.find(s => s.id === this.selectedShiftId) || null;
          if (shiftToSelect) {
            console.log(`✅ Keeping current shift selection: ${shiftToSelect.name} - ${shiftToSelect.asset.name}`);
          }
        }

        // If no valid current selection, pick the best available shift
        if (!shiftToSelect) {
          // Prefer shifts with events
          const shiftsWithEvents = this.availableShifts.filter(s => s.events && s.events.length > 0);

          if (shiftsWithEvents.length > 0) {
            // Find a shift that's currently active or recently completed
            const now = new Date();
            const activeShift = shiftsWithEvents.find(s => {
              const shiftStart = this.getShiftStartDateTime(s);
              const shiftEnd = this.getShiftEndDateTime(s);
              return now >= shiftStart && now <= shiftEnd;
            });

            shiftToSelect = activeShift || shiftsWithEvents[0];
            console.log(`📍 Selected shift with events: ${shiftToSelect.name} - ${shiftToSelect.asset.name} (${shiftToSelect.events.length} events)`);
          } else {
            // Fallback to any available shift
            shiftToSelect = this.availableShifts[0];
            console.log(`📍 Selected first available shift: ${shiftToSelect.name} - ${shiftToSelect.asset.name}`);
          }
        }

        if (shiftToSelect) {
          this.selectShift(shiftToSelect.id);
        }
      } else {
        console.log('⚠️ No available shifts found for shift view');
      }
    } else {
      this.updateTimelineEndDate();
    }

    // Adjust timeline event height based on zoom level
    switch (zoom) {
      case 'hour':
        this.timelineEventHeight = 30;
        this.timePointWidth = 120;
        break;
      case 'day':
        this.timelineEventHeight = 40;
        this.timePointWidth = 80;
        break;
      case 'week':
        this.timelineEventHeight = 50;
        this.timePointWidth = 60;
        break;
      case 'shift':
        this.timelineEventHeight = 60;
        this.timePointWidth = 100;
        break;
    }
  }

  updateTimelineEndDate(): void {
    switch (this.timelineZoom) {
      case 'hour':
        this.timelineEndDate = new Date(this.timelineStartDate.getTime() + (24 * 60 * 60 * 1000)); // 1 day
        break;
      case 'day':
        this.timelineEndDate = new Date(this.timelineStartDate.getTime() + (14 * 24 * 60 * 60 * 1000)); // 2 weeks
        break;
      case 'week':
        this.timelineEndDate = new Date(this.timelineStartDate.getTime() + (12 * 7 * 24 * 60 * 60 * 1000)); // 12 weeks
        break;
      case 'shift':
        // For shift view, timeline boundaries are set by the selected shift
        if (this.selectedShift) {
          this.timelineStartDate = this.getShiftStartDateTime(this.selectedShift);
          this.timelineEndDate = this.getShiftEndDateTime(this.selectedShift);
        }
        break;
    }
  }

  // Shift navigation methods
  updateAvailableShifts(): void {
    // Get shifts for the generated range (past 1 week + future 1 week)
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 7); // 1 week before
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 7); // 1 week after

    this.availableShifts = this.shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= startDate && shiftDate <= endDate;
    }).sort((a, b) => {
      const aDateTime = this.getShiftStartDateTime(a);
      const bDateTime = this.getShiftStartDateTime(b);
      return aDateTime.getTime() - bDateTime.getTime();
    });

    console.log(`📊 Updated available shifts: ${this.availableShifts.length} shifts found (${startDate.toDateString()} to ${endDate.toDateString()})`);
    console.log(`📋 Available shifts by date:`);
    this.availableShifts.forEach((shift, index) => {
      console.log(`  ${index}: ${shift.name} - ${shift.asset.name} (${shift.date.toDateString()}) - ${shift.events.length} events`);
    });
  }

  selectShift(shiftId: number): void {
    console.log(`🎯 Selecting shift with ID: ${shiftId}`);
    this.selectedShiftId = shiftId;
    this.selectedShift = this.availableShifts.find(s => s.id === shiftId) || null;

    if (this.selectedShift) {
      console.log(`✅ Selected shift: ${this.selectedShift.name} - ${this.selectedShift.asset.name} (${this.selectedShift.date.toDateString()}) with ${this.selectedShift.events.length} events`);

      if (this.timelineZoom === 'shift') {
        this.updateTimelineEndDate();
      }
    } else {
      console.log(`⚠️ Could not find shift with ID: ${shiftId}`);
    }
  }

  navigateShift(direction: 'prev' | 'next'): void {
    console.log(`🔄 Navigating shift: ${direction}, current selectedShiftId: ${this.selectedShiftId}`);
    console.log(`📊 Available shifts count: ${this.availableShifts.length}`);

    // Ensure we have available shifts
    if (this.availableShifts.length === 0) {
      console.log('⚠️ No available shifts to navigate');
      return;
    }

    // If no shift selected, select the first available shift
    if (!this.selectedShiftId) {
      console.log('📍 No shift selected, selecting first available shift');
      this.selectShift(this.availableShifts[0].id);
      return;
    }

    const currentIndex = this.availableShifts.findIndex(s => s.id === this.selectedShiftId);
    console.log(`📍 Current shift index: ${currentIndex}`);

    if (currentIndex === -1) {
      console.log('⚠️ Current shift not found in available shifts, selecting first shift');
      this.selectShift(this.availableShifts[0].id);
      return;
    }

    let newIndex: number;
    if (direction === 'next') {
      newIndex = currentIndex + 1;
      // If we've reached the end, wrap around to the beginning
      if (newIndex >= this.availableShifts.length) {
        console.log('📍 Reached end of shifts, wrapping to first shift');
        newIndex = 0;
      }
    } else {
      newIndex = currentIndex - 1;
      // If we've reached the beginning, wrap around to the end
      if (newIndex < 0) {
        console.log('📍 Reached beginning of shifts, wrapping to last shift');
        newIndex = this.availableShifts.length - 1;
      }
    }

    if (newIndex >= 0 && newIndex < this.availableShifts.length) {
      const nextShift = this.availableShifts[newIndex];
      console.log(`✅ Selecting shift at index ${newIndex}: ${nextShift.name} - ${nextShift.asset.name} (${nextShift.date.toDateString()})`);
      this.selectShift(nextShift.id);
    } else {
      console.log('⚠️ Invalid shift index calculated:', newIndex);
    }
  }



  getShiftTimelineTitle(): string {
    if (!this.selectedShift) return 'No Shift Selected';

    const shiftDate = this.selectedShift.date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return `${this.selectedShift.name} - ${this.selectedShift.asset.name} (${shiftDate})`;
  }

  getTimelinePoints(): Array<{timestamp: number, date: Date}> {
    const points: Array<{timestamp: number, date: Date}> = [];
    const start = new Date(this.timelineStartDate);
    const end = new Date(this.timelineEndDate);

    let increment: number;
    switch (this.timelineZoom) {
      case 'hour':
        increment = 2 * 60 * 60 * 1000; // Every 2 hours
        break;
      case 'day':
        increment = 24 * 60 * 60 * 1000; // Every day
        break;
      case 'week':
        increment = 7 * 24 * 60 * 60 * 1000; // Every week
        break;
      case 'shift':
        increment = 30 * 60 * 1000; // Every 30 minutes for detailed shift view
        break;
    }

    let current = new Date(start);
    while (current <= end) {
      points.push({
        timestamp: current.getTime(),
        date: new Date(current)
      });
      current = new Date(current.getTime() + increment);
    }

    return points;
  }

  formatTimelineLabel(timePoint: {timestamp: number, date: Date}): string {
    switch (this.timelineZoom) {
      case 'hour':
        return timePoint.date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      case 'day':
        return timePoint.date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      case 'week':
        const weekStart = new Date(timePoint.date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        return `Week of ${weekStart.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })}`;
      case 'shift':
        return timePoint.date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      default:
        return '';
    }
  }

  getTimePointWidth(): number {
    return this.timePointWidth;
  }

  getTimePointPosition(timePoint: {timestamp: number, date: Date}): number {
    const totalDuration = this.timelineEndDate.getTime() - this.timelineStartDate.getTime();
    const pointDuration = timePoint.timestamp - this.timelineStartDate.getTime();
    const timelineWidth = this.getTimelinePoints().length * this.timePointWidth;

    return (pointDuration / totalDuration) * timelineWidth;
  }

  getFilteredTimelineAssets(): Asset[] {
    // First priority: Use selected assets from the assets panel (multi-selection)
    if (this.selectedAssetIds.size > 0) {
      const selectedAssets = this.assets.filter(asset => this.selectedAssetIds.has(asset.id));
      console.log(`📋 Timeline showing ${selectedAssets.length} selected assets:`, selectedAssets.map(a => a.name));
      return selectedAssets;
    }

    // Second priority: Use timeline dropdown filter
    if (this.timelineAssetFilter) {
      const filteredAssets = this.assets.filter(asset => asset.id === this.timelineAssetFilter);
      console.log(`📋 Timeline showing filtered asset:`, filteredAssets.map(a => a.name));
      return filteredAssets;
    }

    // Default: Show all assets
    console.log(`📋 Timeline showing all ${this.assets.length} assets`);
    return this.assets;
  }

  getTimelineEventsForAsset(assetId: number): CalendarEvent[] {
    if (this.timelineZoom === 'shift' && this.selectedShift) {
      // For shift view, only show events from the selected shift
      const shiftEvents = this.calendarEvents.filter(event => {
        const eventInShiftTimeRange = event.start <= this.timelineEndDate && event.end >= this.timelineStartDate;
        const eventForSelectedAsset = event.assetId === this.selectedShift!.assetId;
        return event.assetId === assetId && eventInShiftTimeRange && eventForSelectedAsset;
      });

      if (assetId === this.selectedShift!.assetId) {
        console.log(`📅 Shift timeline showing ${shiftEvents.length} events for ${this.selectedShift!.asset.name}`);
      }

      return shiftEvents;
    }

    // Regular timeline view - respect asset filtering
    const timelineEvents = this.calendarEvents.filter(event => {
      const eventInTimeRange = event.start <= this.timelineEndDate && event.end >= this.timelineStartDate;
      return event.assetId === assetId && eventInTimeRange;
    });

    // Log filtering info for debugging
    if (timelineEvents.length > 0) {
      const asset = this.assets.find(a => a.id === assetId);
      console.log(`📅 Timeline showing ${timelineEvents.length} events for ${asset?.name || 'Unknown Asset'}`);
    }

    return timelineEvents;
  }

  getTimelineEventPosition(event: CalendarEvent): {left: number, width: number} {
    const totalDuration = this.timelineEndDate.getTime() - this.timelineStartDate.getTime();
    const timelineWidth = this.getTimelinePoints().length * this.timePointWidth;

    // Calculate start position
    const eventStart = Math.max(event.start.getTime(), this.timelineStartDate.getTime());
    const startOffset = eventStart - this.timelineStartDate.getTime();
    const left = (startOffset / totalDuration) * timelineWidth;

    // Calculate width
    const eventEnd = Math.min(event.end.getTime(), this.timelineEndDate.getTime());
    const eventDuration = eventEnd - eventStart;
    const width = Math.max((eventDuration / totalDuration) * timelineWidth, 20); // Minimum width of 20px

    return { left, width };
  }

  onTimelineEventClick(event: CalendarEvent, mouseEvent: MouseEvent): void {
    // Click handling is now done in onDocumentMouseUp to avoid conflicts with drag detection
    // This method is kept for compatibility but the actual click logic happens in mouseup
    console.log('🖱️ Timeline event click event fired for:', event.title);
  }

  onTimelineEventMouseDown(event: CalendarEvent, mouseEvent: MouseEvent, mode: 'resize-start' | 'resize-end' | 'move'): void {
    // Don't prevent default immediately - let clicks through
    mouseEvent.stopPropagation();

    // Clear any existing editing state
    this.editingEventId = null;

    // Record initial state but don't start dragging yet
    this.mouseDownStarted = true;
    this.isDragging = false; // Will be set to true only if movement exceeds threshold
    this.dragMode = mode;
    this.dragEventId = event.id;
    this.dragStartX = mouseEvent.clientX; // Use clientX for horizontal movement in timeline
    this.dragStartY = mouseEvent.clientY;
    this.dragOriginalEvent = { ...event };

    // Add global mouse listeners
    document.addEventListener('mousemove', this.onTimelineDocumentMouseMove.bind(this));
    document.addEventListener('mouseup', this.onDocumentMouseUp.bind(this));
  }

  onTimelineDocumentMouseMove(mouseEvent: MouseEvent): void {
    if (!this.mouseDownStarted || !this.dragOriginalEvent) return;

    const deltaX = Math.abs(mouseEvent.clientX - this.dragStartX);
    const deltaY = Math.abs(mouseEvent.clientY - this.dragStartY);
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Check if movement exceeds threshold to start dragging
    if (!this.isDragging && totalMovement > this.dragThreshold) {
      console.log('🎯 Starting timeline drag operation after threshold exceeded');
      this.isDragging = true;

      // Now prevent default to avoid text selection during drag
      mouseEvent.preventDefault();

      // Add appropriate cursor classes
      document.body.classList.add('dragging-event');
      if (this.dragMode === 'resize-start' || this.dragMode === 'resize-end') {
        document.body.classList.add('resizing-event');
      } else {
        document.body.classList.add('moving-event');
      }
    }

    // Only perform drag operations if we've started dragging
    if (!this.isDragging) return;

    const deltaXFromStart = mouseEvent.clientX - this.dragStartX;
    const timelineWidth = this.getTimelinePoints().length * this.timePointWidth;
    const totalDuration = this.timelineEndDate.getTime() - this.timelineStartDate.getTime();

    // Convert pixel movement to time
    const timeChange = (deltaXFromStart / timelineWidth) * totalDuration;
    const minutesChanged = this.snapToTimeSlot(timeChange / (60 * 1000)); // Convert to minutes and snap

    const eventIndex = this.calendarEvents.findIndex(e => e.id === this.dragEventId);
    if (eventIndex === -1) return;

    const originalStart = new Date(this.dragOriginalEvent.start);
    const originalEnd = new Date(this.dragOriginalEvent.end);

    let newStart = new Date(originalStart);
    let newEnd = new Date(originalEnd);

    switch (this.dragMode) {
      case 'resize-start':
        newStart = new Date(originalStart.getTime() + (minutesChanged * 60 * 1000));
        // Ensure start is before end and minimum 15 minutes duration
        const minStartTime = new Date(originalEnd.getTime() - (15 * 60 * 1000));
        if (newStart >= originalEnd) {
          newStart = minStartTime;
        }
        break;

      case 'resize-end':
        newEnd = new Date(originalEnd.getTime() + (minutesChanged * 60 * 1000));
        // Ensure end is after start and minimum 15 minutes duration
        const minEndTime = new Date(originalStart.getTime() + (15 * 60 * 1000));
        if (newEnd <= originalStart) {
          newEnd = minEndTime;
        }
        break;

      case 'move':
        const duration = originalEnd.getTime() - originalStart.getTime();
        newStart = new Date(originalStart.getTime() + (minutesChanged * 60 * 1000));
        newEnd = new Date(newStart.getTime() + duration);
        break;
    }

    // Update the calendar event
    this.calendarEvents[eventIndex] = {
      ...this.calendarEvents[eventIndex],
      start: newStart,
      end: newEnd
    };

    // Update the underlying production event
    const productionEventIndex = this.productionEvents.findIndex(e => e.id === this.dragEventId);
    if (productionEventIndex !== -1) {
      this.productionEvents[productionEventIndex] = {
        ...this.productionEvents[productionEventIndex],
        plannedStart: newStart,
        plannedEnd: newEnd
      };

      // Recalculate production time based on new duration
      const durationMinutes = (newEnd.getTime() - newStart.getTime()) / (60 * 1000);
      const nonProductionTime = this.productionEvents[productionEventIndex].startUpTime +
                               this.productionEvents[productionEventIndex].setupTime +
                               this.productionEvents[productionEventIndex].wrapUpTime +
                               this.productionEvents[productionEventIndex].shutDownTime;
      this.productionEvents[productionEventIndex].productionTime = Math.max(15, durationMinutes - nonProductionTime);
    }
  }

  isCurrentTimeInView(): boolean {
    const now = new Date();
    return now >= this.timelineStartDate && now <= this.timelineEndDate;
  }

  getCurrentTimePosition(): number {
    if (!this.isCurrentTimeInView()) return 0;

    const now = new Date();
    const totalDuration = this.timelineEndDate.getTime() - this.timelineStartDate.getTime();
    const currentOffset = now.getTime() - this.timelineStartDate.getTime();
    const timelineWidth = this.getTimelinePoints().length * this.timePointWidth;

    return (currentOffset / totalDuration) * timelineWidth;
  }

  getShiftDetailsForTimeline(): any {
    if (!this.selectedShift) return null;

    const shiftEvents = this.getShiftEvents(this.selectedShift.id);
    const totalEvents = shiftEvents.length;
    const completedEvents = shiftEvents.filter(e => e.status === 'completed').length;
    const inProgressEvents = shiftEvents.filter(e => e.status === 'in-progress').length;
    const plannedEvents = shiftEvents.filter(e => e.status === 'planned').length;

    return {
      shift: this.selectedShift,
      events: shiftEvents,
      summary: {
        total: totalEvents,
        completed: completedEvents,
        inProgress: inProgressEvents,
        planned: plannedEvents,
        completionRate: totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0
      }
    };
  }
}
