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
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';

interface Sale {
  id: number;
  customerName: string;
  product: string;
  amount: number;
  status: 'lead' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  salesRep: string;
  date: Date;
  probability: number;
  nextAction: string;
  sharepointLink: string;
}

interface SalesMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

@Component({
  selector: 'app-sales-page',
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
    CalendarModule,
    ChartModule,
    ProgressBarModule,
    CardModule
  ],
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss']
})
export class SalesPageComponent implements OnInit {
  // Sales data
  salesData: Sale[] = [
    {
      id: 1,
      customerName: 'TechCorp Industries',
      product: 'Enterprise Package',
      amount: 125000,
      status: 'proposal',
      salesRep: 'John Smith',
      date: new Date('2025-01-15'),
      probability: 75,
      nextAction: 'Follow up on proposal',
      sharepointLink: 'https://facteonglobal.sharepoint.com/sites/000651'
    },
    {
      id: 2,
      customerName: 'Manufacturing Plus',
      product: 'Standard Package',
      amount: 45000,
      status: 'negotiation',
      salesRep: 'Sarah Johnson',
      date: new Date('2025-01-10'),
      probability: 60,
      nextAction: 'Price negotiation meeting',
      sharepointLink: 'https://facteonglobal.sharepoint.com/sites/000652'
    },
    {
      id: 3,
      customerName: 'Global Solutions Ltd',
      product: 'Premium Package',
      amount: 89000,
      status: 'closed-won',
      salesRep: 'Mike Wilson',
      date: new Date('2025-01-08'),
      probability: 100,
      nextAction: 'Implementation kickoff',
      sharepointLink: 'https://facteonglobal.sharepoint.com/sites/000653'
    },
    {
      id: 4,
      customerName: 'Innovation Labs',
      product: 'Starter Package',
      amount: 25000,
      status: 'lead',
      salesRep: 'Tom Anderson',
      date: new Date('2025-01-12'),
      probability: 25,
      nextAction: 'Schedule demo call',
      sharepointLink: 'https://facteonglobal.sharepoint.com/sites/000654'
    },
    {
      id: 5,
      customerName: 'Metro Manufacturing',
      product: 'Enterprise Package',
      amount: 150000,
      status: 'proposal',
      salesRep: 'John Smith',
      date: new Date('2025-01-18'),
      probability: 80,
      nextAction: 'Technical requirements review',
      sharepointLink: 'https://facteonglobal.sharepoint.com/sites/000655'
    },
        {
      id: 6,
      customerName: 'Metro Manufacturing',
      product: 'Enterprise Package',
      amount: 150000,
      status: 'proposal',
      salesRep: 'John Smith',
      date: new Date('2025-01-18'),
      probability: 80,
      nextAction: 'Technical requirements review',
      sharepointLink: 'https://facteonglobal.sharepoint.com/sites/000655'
    },
        {
      id: 7,
      customerName: 'Metro Manufacturing',
      product: 'Enterprise Package',
      amount: 150000,
      status: 'proposal',
      salesRep: 'John Smith',
      date: new Date('2025-01-18'),
      probability: 80,
      nextAction: 'Technical requirements review',
      sharepointLink: 'https://facteonglobal.sharepoint.com/sites/000655'
    },
        {
      id: 8,
      customerName: 'Metro Manufacturing',
      product: 'Enterprise Package',
      amount: 150000,
      status: 'proposal',
      salesRep: 'John Smith',
      date: new Date('2025-01-18'),
      probability: 80,
      nextAction: 'Technical requirements review',
      sharepointLink: 'https://facteonglobal.sharepoint.com/sites/000655'
    },
        {
      id: 9,
      customerName: 'Metro Manufacturing',
      product: 'Enterprise Package',
      amount: 150000,
      status: 'proposal',
      salesRep: 'John Smith',
      date: new Date('2025-01-18'),
      probability: 80,
      nextAction: 'Technical requirements review',
      sharepointLink: 'https://facteonglobal.sharepoint.com/sites/000655'
    }

  ];

  // Metrics data
  salesMetrics: SalesMetric[] = [
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+12.5%',
      trend: 'up',
      icon: '💰'
    },
    {
      title: 'Monthly Target',
      value: '$500K',
      change: '78% achieved',
      trend: 'up',
      icon: '🎯'
    },
    {
      title: 'Active Deals',
      value: '24',
      change: '+3 this week',
      trend: 'up',
      icon: '🤝'
    },
    {
      title: 'Conversion Rate',
      value: '32%',
      change: '+2.1%',
      trend: 'up',
      icon: '📊'
    }
  ];

  // Chart data
  chartData: any;
  chartOptions: any;

  // UI state
  showNewSaleDialog = false;
  showEditSaleDialog = false;
  showViewSaleDialog = false;
  selectedSale: Sale | null = null;
  newSale = {
    customerName: '',
    product: '',
    amount: 0,
    status: 'lead',
    salesRep: '',
    probability: 25,
    nextAction: '',
    sharepointLink: ''
  };

  editSale = {
    id: 0,
    customerName: '',
    product: '',
    amount: 0,
    status: 'lead',
    salesRep: '',
    probability: 25,
    nextAction: '',
    sharepointLink: ''
  };

  // Dropdown options
  statusOptions = [
    { label: 'Lead', value: 'lead' },
    { label: 'Proposal', value: 'proposal' },
    { label: 'Negotiation', value: 'negotiation' },
    { label: 'Closed Won', value: 'closed-won' },
    { label: 'Closed Lost', value: 'closed-lost' }
  ];

  productOptions = [
    { label: 'Starter Package', value: 'Starter Package' },
    { label: 'Standard Package', value: 'Standard Package' },
    { label: 'Premium Package', value: 'Premium Package' },
    { label: 'Enterprise Package', value: 'Enterprise Package' }
  ];

  salesRepOptions = [
    { label: 'John Smith', value: 'John Smith' },
    { label: 'Sarah Johnson', value: 'Sarah Johnson' },
    { label: 'Mike Wilson', value: 'Mike Wilson' },
    { label: 'Tom Anderson', value: 'Tom Anderson' }
  ];

  ngOnInit() {
    this.initializeChartData();
  }

  initializeChartData() {
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          data: [400000, 350000, 450000, 500000, 420000, 380000],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Target',
          data: [500000, 500000, 500000, 500000, 500000, 500000],
          borderColor: '#ef4444',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value: any) {
              return '$' + (value / 1000) + 'K';
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
            }
          }
        }
      }
    };
  }

  openNewSaleDialog() {
    this.showNewSaleDialog = true;
  }

  closeNewSaleDialog() {
    this.showNewSaleDialog = false;
    this.resetNewSaleForm();
  }

  openEditSaleDialog(sale: Sale) {
    this.selectedSale = sale;
    this.editSale = {
      id: sale.id,
      customerName: sale.customerName,
      product: sale.product,
      amount: sale.amount,
      status: sale.status,
      salesRep: sale.salesRep,
      probability: sale.probability,
      nextAction: sale.nextAction,
      sharepointLink: sale.sharepointLink
    };
    this.showEditSaleDialog = true;
  }

  closeEditSaleDialog() {
    this.showEditSaleDialog = false;
    this.selectedSale = null;
    this.resetEditSaleForm();
  }

  openViewSaleDialog(sale: Sale) {
    this.selectedSale = sale;
    this.showViewSaleDialog = true;
  }

  closeViewSaleDialog() {
    this.showViewSaleDialog = false;
    this.selectedSale = null;
  }

  createSale() {
    const newSale: Sale = {
      id: Math.max(...this.salesData.map(s => s.id)) + 1,
      customerName: this.newSale.customerName,
      product: this.newSale.product,
      amount: this.newSale.amount,
      status: this.newSale.status as any,
      salesRep: this.newSale.salesRep,
      date: new Date(),
      probability: this.newSale.probability,
      nextAction: this.newSale.nextAction,
      sharepointLink: this.newSale.sharepointLink
    };

    this.salesData.push(newSale);
    this.closeNewSaleDialog();
  }

  updateSale() {
    if (this.selectedSale) {
      const index = this.salesData.findIndex(s => s.id === this.selectedSale!.id);
      if (index !== -1) {
        this.salesData[index] = {
          ...this.salesData[index],
          customerName: this.editSale.customerName,
          product: this.editSale.product,
          amount: this.editSale.amount,
          status: this.editSale.status as any,
          salesRep: this.editSale.salesRep,
          probability: this.editSale.probability,
          nextAction: this.editSale.nextAction,
          sharepointLink: this.editSale.sharepointLink
        };
      }
    }
    this.closeEditSaleDialog();
  }

  private resetNewSaleForm() {
    this.newSale = {
      customerName: '',
      product: '',
      amount: 0,
      status: 'lead',
      salesRep: '',
      probability: 25,
      nextAction: '',
      sharepointLink: ''
    };
  }

  private resetEditSaleForm() {
    this.editSale = {
      id: 0,
      customerName: '',
      product: '',
      amount: 0,
      status: 'lead',
      salesRep: '',
      probability: 25,
      nextAction: '',
      sharepointLink: ''
    };
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'lead': 'status-lead',
      'proposal': 'status-proposal',
      'negotiation': 'status-negotiation',
      'closed-won': 'status-won',
      'closed-lost': 'status-lost'
    };
    return statusClasses[status] || 'status-default';
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'lead': 'Lead',
      'proposal': 'Proposal',
      'negotiation': 'Negotiation',
      'closed-won': 'Closed Won',
      'closed-lost': 'Closed Lost'
    };
    return statusLabels[status] || status;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  get pipelineValue(): number {
    return this.salesData
      .filter(sale => !['closed-won', 'closed-lost'].includes(sale.status))
      .reduce((sum, sale) => sum + (sale.amount * sale.probability / 100), 0);
  }

  get closedWonValue(): number {
    return this.salesData
      .filter(sale => sale.status === 'closed-won')
      .reduce((sum, sale) => sum + sale.amount, 0);
  }

  get activeDealsByStatus() {
    const statusCounts: { [key: string]: number } = {};
    this.salesData
      .filter(sale => !['closed-won', 'closed-lost'].includes(sale.status))
      .forEach(sale => {
        statusCounts[sale.status] = (statusCounts[sale.status] || 0) + 1;
      });
    return statusCounts;
  }

  get activeStatusKeys() {
    return Object.keys(this.activeDealsByStatus);
  }

  getSalesRepInitials(name: string): string {
    return name.split(' ').map(n => n.charAt(0)).join('');
  }
}
