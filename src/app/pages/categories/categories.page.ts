import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  createdBy?: string;
  createdAt?: Date;
  workOrderHistory?: WorkOrderHistoryData[];
  openWorkOrders?: OpenWorkOrder[];
}

interface WorkOrderHistoryData {
  date: Date;
  count: number;
}

interface OpenWorkOrder {
  id: number;
  title: string;
  status: 'open' | 'in-progress' | 'on-hold' | 'complete';
  priority: 'high' | 'medium' | 'low' | 'none';
  requestedBy: string;
  assignedTo: string;
  dueDate?: Date;
  isOverdue: boolean;
  isUnread: boolean;
  description: string;
  location: string;
  category: string;
  estimatedTime: string;
  workType: 'preventive' | 'corrective' | 'inspection';
  createdAt: Date;
  completedAt?: Date;
  asset: string;
  createdBy: string;
  updatedOn: Date;
}

interface PeriodConfig {
  type: 'between' | 'last';
  value: number;
  unit: 'days' | 'weeks' | 'months' | 'years';
  startDate?: Date;
  endDate?: Date;
  groupBy: 'day' | 'week' | 'month';
  rollingDates: boolean;
}

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    CommonModule,
    NavMenuComponent,
    ButtonModule,
    InputTextModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    RadioButtonModule,
    CheckboxModule
  ],
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss']
})
export class CategoriesPageComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  showNewCategoryForm = false;
  newCategoryName = '';
  newCategoryDescription = '';
  selectedIconIndex = 0;
  selectedCategoryId: string | null = 'cat_001'; // Default selection

  // Chart and configuration properties
  chart: Chart | null = null;
  showConfigDialog = false;
  periodConfig: PeriodConfig = {
    type: 'last',
    value: 70,
    unit: 'days',
    groupBy: 'week',
    rollingDates: false
  };

  // Work Order Dialog properties
  showWorkOrderDialog = false;
  selectedWorkOrderForDialog: OpenWorkOrder | null = null;

  // Dropdown options
  timeUnits = [
    { label: 'Days', value: 'days' },
    { label: 'Weeks', value: 'weeks' },
    { label: 'Months', value: 'months' },
    { label: 'Years', value: 'years' }
  ];

  groupByOptions = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];

  categories: Category[] = [
    {
      id: 'cat_001',
      name: 'Damage',
      icon: '&#9888;',
      color: '#ffb4a2',
      description: 'Issues related to asset damage and repairs',
      createdBy: 'Jun Ren',
      createdAt: new Date('2023-09-05'),
      workOrderHistory: this.generateWorkOrderHistory(30),
      openWorkOrders: this.generateOpenWorkOrders('Damage', 3)
    },
    {
      id: 'cat_002',
      name: 'Electrical',
      icon: '&#9889;',
      color: '#ffd166',
      description: 'Electrical maintenance and issues',
      createdBy: 'John Smith',
      createdAt: new Date('2023-08-15'),
      workOrderHistory: this.generateWorkOrderHistory(45),
      openWorkOrders: this.generateOpenWorkOrders('Electrical', 5)
    },
    {
      id: 'cat_003',
      name: 'Inspection',
      icon: '&#128209;',
      color: '#b388ff',
      description: 'Regular inspections and compliance checks',
      createdBy: 'Sarah Johnson',
      createdAt: new Date('2023-07-20'),
      workOrderHistory: this.generateWorkOrderHistory(25),
      openWorkOrders: this.generateOpenWorkOrders('Inspection', 2)
    },
    {
      id: 'cat_004',
      name: 'Mechanical',
      icon: '&#128295;',
      color: '#a0c4ff',
      description: 'Mechanical repairs and maintenance',
      createdBy: 'Mike Wilson',
      createdAt: new Date('2023-06-10'),
      workOrderHistory: this.generateWorkOrderHistory(60),
      openWorkOrders: this.generateOpenWorkOrders('Mechanical', 4)
    },
    {
      id: 'cat_005',
      name: 'Preventive',
      icon: '&#127793;',
      color: '#b7e4c7',
      description: 'Preventive maintenance activities',
      createdBy: 'Lisa Chen',
      createdAt: new Date('2023-05-25'),
      workOrderHistory: this.generateWorkOrderHistory(80),
      openWorkOrders: this.generateOpenWorkOrders('Preventive', 6)
    },
    {
      id: 'cat_006',
      name: 'Project',
      icon: '&#128736;',
      color: '#ffb4a2',
      description: 'Project-related work orders and tasks',
      createdBy: 'Jun Ren',
      createdAt: new Date('2023-09-05'),
      workOrderHistory: this.generateWorkOrderHistory(20),
      openWorkOrders: this.generateOpenWorkOrders('Project', 1)
    },
    {
      id: 'cat_007',
      name: 'Refrigeration',
      icon: '&#10052;',
      color: '#a0e7e5',
      description: 'Refrigeration and cooling system maintenance',
      createdBy: 'Tom Rodriguez',
      createdAt: new Date('2023-04-15'),
      workOrderHistory: this.generateWorkOrderHistory(35),
      openWorkOrders: this.generateOpenWorkOrders('Refrigeration', 3)
    },
    {
      id: 'cat_008',
      name: 'Safety',
      icon: '&#128737;',
      color: '#b7e4c7',
      description: 'Safety-related inspections and repairs',
      createdBy: 'Alex Turner',
      createdAt: new Date('2023-03-30'),
      workOrderHistory: this.generateWorkOrderHistory(40),
      openWorkOrders: this.generateOpenWorkOrders('Safety', 2)
    },
    {
      id: 'cat_009',
      name: 'Standard Operating Procedure',
      icon: '&#128196;',
      color: '#ffb4a2',
      description: 'SOP compliance and documentation',
      createdBy: 'Maria Garcia',
      createdAt: new Date('2023-02-20'),
      workOrderHistory: this.generateWorkOrderHistory(15),
      openWorkOrders: this.generateOpenWorkOrders('Standard Operating Procedure', 1)
    }
  ];

  categoryIcons = [
    { html: '&#9888;', bg: '#ffe5e0' },
    { html: '&#9889;', bg: '#fff6d6' },
    { html: '&#128209;', bg: '#ede6ff' },
    { html: '&#128295;', bg: '#e0f0ff' },
    { html: '&#127793;', bg: '#e6fff2' },
    { html: '&#128736;', bg: '#ffe5e0' },
    { html: '&#10052;', bg: '#e0faff' },
    { html: '&#128737;', bg: '#e6fff2' },
    { html: '&#128196;', bg: '#ffe5e0' }
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Check if we have a category ID in the route
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      // Find the category and select it
      const category = this.categories.find(cat => cat.id === categoryId);
      if (category) {
        this.selectedCategoryId = categoryId;
      } else {
        // If category not found, redirect to categories page
        this.router.navigate(['/categories']);
      }
    }

    // Subscribe to route changes
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && this.categories.find(cat => cat.id === id)) {
        this.selectedCategoryId = id;
      }
    });
  }

  ngAfterViewInit() {
    // Initialize chart after view is ready
    setTimeout(() => {
      this.initializeChart();
    }, 0);
  }

  private generateWorkOrderHistory(maxCount: number): WorkOrderHistoryData[] {
    const history: WorkOrderHistoryData[] = [];
    const today = new Date();

    for (let i = 70; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Generate random work order count with some realistic patterns
      let count = Math.floor(Math.random() * maxCount * 0.2);

      // Add some patterns (more work orders on weekdays, less on weekends)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
        count = Math.floor(count * 0.3);
      }

      // Add some random spikes
      if (Math.random() < 0.1) {
        count = Math.floor(count * 2);
      }

      history.push({
        date: new Date(date),
        count: count
      });
    }

    return history;
  }

  private generateOpenWorkOrders(category: string, count: number): OpenWorkOrder[] {
    const workOrders: OpenWorkOrder[] = [];
    const assets = ['HVAC Unit A1', 'Elevator #1', 'Emergency Generator', 'Boiler #2', 'Conveyor Belt System', 'Compressor Unit', 'Test Equipment'];
    const locations = ['Building A', 'Main Building', 'Basement', 'Mechanical Room', 'Production Floor', 'Workshop', 'General'];
    const assignees = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Lisa Chen', 'Tom Rodriguez', 'Alex Turner', 'Maria Garcia'];
    const requesters = ['Jun Ren', 'Operations Team', 'Maintenance Lead', 'Safety Manager', 'Production Manager'];
    const workTypes: ('preventive' | 'corrective' | 'inspection')[] = ['preventive', 'corrective', 'inspection'];
    const priorities: ('high' | 'medium' | 'low' | 'none')[] = ['high', 'medium', 'low', 'none'];
    const statuses: ('open' | 'in-progress')[] = ['open', 'in-progress'];

    for (let i = 0; i < count; i++) {
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 1);

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const isOverdue = dueDate < new Date();

      workOrders.push({
        id: 1000 + i + Math.floor(Math.random() * 100),
        title: this.generateWorkOrderTitle(category),
        status: status,
        priority: priority,
        requestedBy: requesters[Math.floor(Math.random() * requesters.length)],
        assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
        dueDate: dueDate,
        isOverdue: isOverdue,
        isUnread: Math.random() < 0.3,
        description: this.generateWorkOrderDescription(category),
        location: locations[Math.floor(Math.random() * locations.length)],
        category: category,
        estimatedTime: `${Math.floor(Math.random() * 8) + 1}h`,
        workType: workTypes[Math.floor(Math.random() * workTypes.length)],
        createdAt: createdDate,
        asset: assets[Math.floor(Math.random() * assets.length)],
        createdBy: requesters[Math.floor(Math.random() * requesters.length)],
        updatedOn: new Date()
      });
    }

    return workOrders;
  }

  private generateWorkOrderTitle(category: string): string {
    const titles: { [key: string]: string[] } = {
      'Damage': ['Repair damaged equipment panel', 'Fix broken conveyor belt', 'Replace cracked window'],
      'Electrical': ['Replace faulty circuit breaker', 'Repair electrical outlet', 'Install new lighting fixture', 'Check electrical connections'],
      'Inspection': ['Monthly safety inspection', 'Equipment compliance check', 'Quarterly facility review'],
      'Mechanical': ['Replace worn bearings', 'Lubricate machinery', 'Adjust belt tension', 'Service hydraulic system'],
      'Preventive': ['Scheduled filter replacement', 'Annual equipment servicing', 'Preventive oil change'],
      'Project': ['Equipment installation project', 'Facility upgrade project'],
      'Refrigeration': ['Service cooling unit', 'Replace refrigerant', 'Clean condenser coils'],
      'Safety': ['Project 000652', 'Emergency exit maintenance', 'Fire system check'],
      'Standard Operating Procedure': ['Update SOP documentation', 'SOP compliance review']
    };

    const categoryTitles = titles[category] || ['General maintenance task'];
    return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
  }

  private generateWorkOrderDescription(category: string): string {
    const descriptions: { [key: string]: string[] } = {
      'Damage': ['Equipment panel shows signs of physical damage and needs repair', 'Conveyor belt has torn section requiring immediate attention'],
      'Electrical': ['Circuit breaker trips frequently and needs replacement', 'Electrical outlet not providing power to connected devices'],
      'Inspection': ['Routine safety inspection as per compliance requirements', 'Regular equipment check to ensure operational efficiency'],
      'Mechanical': ['Bearings show excessive wear and require replacement', 'Machinery requires lubrication as per maintenance schedule'],
      'Preventive': ['Scheduled maintenance to prevent equipment failure', 'Regular servicing to maintain optimal performance'],
      'Project': ['Major equipment installation requiring coordination', 'Facility improvement project implementation'],
      'Refrigeration': ['Cooling unit not maintaining proper temperature', 'Refrigeration system requires servicing and cleaning'],
      'Safety': ['Safety equipment requires inspection and testing', 'Emergency systems need verification and maintenance'],
      'Standard Operating Procedure': ['Documentation needs updating to reflect current processes', 'SOP compliance verification required']
    };

    const categoryDescriptions = descriptions[category] || ['General maintenance work required'];
    return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
  }

  get selectedCategory(): Category | undefined {
    return this.categories.find(cat => cat.id === this.selectedCategoryId);
  }

  selectCategory(categoryId: string) {
    this.selectedCategoryId = categoryId;
    // Navigate to the category detail URL
    this.router.navigate(['/category/tags', categoryId]);

    // Update chart with new category data
    setTimeout(() => {
      this.updateChart();
    }, 100);
  }

  initializeChart() {
    if (!this.chartCanvas || !this.selectedCategory) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, this.getChartConfig());
  }

  updateChart() {
    if (!this.chart || !this.selectedCategory) return;

    const chartData = this.getChartData();
    this.chart.data = chartData;
    this.chart.update();
  }

  private getChartConfig(): ChartConfiguration {
    return {
      type: 'line',
      data: this.getChartData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: '#f0f0f0'
            },
            ticks: {
              maxTicksLimit: 10
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: '#f0f0f0'
            },
            ticks: {
              stepSize: 2
            }
          }
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 6
          },
          line: {
            tension: 0.3
          }
        }
      }
    };
  }

  private getChartData(): ChartData {
    if (!this.selectedCategory?.workOrderHistory) {
      return { labels: [], datasets: [] };
    }

    const history = this.selectedCategory.workOrderHistory;
    const labels = history.map(item => {
      return item.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    });

    const data = history.map(item => item.count);

    return {
      labels: labels,
      datasets: [{
        label: 'Work Orders',
        data: data,
        borderColor: '#1a6cff',
        backgroundColor: 'rgba(26, 108, 255, 0.1)',
        fill: true,
        pointBackgroundColor: '#1a6cff',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }]
    };
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
      const file = target.files[0];
      // Handle file selection
      console.log('Selected file:', file);
    }
  }

  createCategory() {
    if (!this.newCategoryName) return;

    const newCategory: Category = {
      id: 'cat_' + Date.now().toString(), // Generate simple ID
      name: this.newCategoryName,
      icon: this.categoryIcons[this.selectedIconIndex].html,
      color: this.categoryIcons[this.selectedIconIndex].bg,
      description: this.newCategoryDescription || undefined,
      createdBy: 'Current User',
      createdAt: new Date()
    };

    this.categories.push(newCategory);
    this.selectCategory(newCategory.id);

    // Reset form
    this.showNewCategoryForm = false;
    this.newCategoryName = '';
    this.newCategoryDescription = '';
    this.selectedIconIndex = 0;
  }

  // Chart configuration methods
  openConfigDialog() {
    this.showConfigDialog = true;
  }

  closeConfigDialog() {
    this.showConfigDialog = false;
  }

  applyConfig() {
    // Here you would typically regenerate the chart data based on the new configuration
    this.updateChart();
    this.closeConfigDialog();
  }

  getDateRangeText(): string {
    if (this.periodConfig.type === 'last') {
      return `Last ${this.periodConfig.value} ${this.periodConfig.unit}`;
    } else {
      const start = this.periodConfig.startDate ?
        this.periodConfig.startDate.toLocaleDateString() : 'Start';
      const end = this.periodConfig.endDate ?
        this.periodConfig.endDate.toLocaleDateString() : 'End';
      return `${start} - ${end}`;
    }
  }

  // Work Order Dialog methods
  openWorkOrderDialog(workOrder: OpenWorkOrder) {
    this.selectedWorkOrderForDialog = workOrder;
    this.showWorkOrderDialog = true;
  }

  closeWorkOrderDialog() {
    this.showWorkOrderDialog = false;
    this.selectedWorkOrderForDialog = null;
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
      case 'in-progress': return 'status-in-progress';
      case 'on-hold': return 'status-on-hold';
      case 'complete': return 'status-complete';
      default: return 'status-default';
    }
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

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-none';
    }
  }
}
