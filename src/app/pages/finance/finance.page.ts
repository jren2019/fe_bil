import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';

interface Invoice {
  id: string;
  number: string;
  customerName: string;
  date: Date;
  dueDate: Date;
  amount: number;
  balance: number;
  daysOutstanding: number;
  status: 'open' | 'overdue' | 'paid' | 'partial';
  isOverdue: boolean;
}

interface VendorBill {
  id: string;
  vendorName: string;
  billNumber: string;
  date: Date;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
}

interface ThreeWayMatchItem {
  id: string;
  poNumber: string;
  receiptNumber: string;
  invoiceNumber: string;
  poAmount: number;
  receiptAmount: number;
  invoiceAmount: number;
  matchStatus: 'pending' | 'matched' | 'variance';
}

interface BankAccount {
  id: string;
  name: string;
  number: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  reconciled: boolean;
  lastReconciled: Date;
}

interface BankTransaction {
  id: string;
  date: Date;
  accountName: string;
  description: string;
  reference: string;
  debit?: number;
  credit?: number;
  runningBalance: number;
  status: 'pending' | 'cleared' | 'reconciled';
  type: 'deposit' | 'withdrawal' | 'transfer';
}

interface InventoryVariance {
  id: string;
  itemCode: string;
  description: string;
  standardCost: number;
  actualCost: number;
  variance: number;
  variancePercent: number;
  quantity: number;
  totalVariance: number;
}

interface TaxReturn {
  id: string;
  type: string;
  period: string;
  dueDate: Date;
  amount: number;
  status: 'draft' | 'filed' | 'overdue';
  isOverdue: boolean;
}

@Component({
  selector: 'app-finance-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavMenuComponent
  ],
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss']
})
export class FinancePageComponent implements OnInit {
  selectedView: string = 'dashboard';

  // AR/AP filtering
  arSearchTerm: string = '';
  arStatusFilter: string = '';
  selectedInvoices: string[] = [];

  // Tax & Compliance
  statementType: 'customer' | 'vendor' = 'customer';
  statementDate: string = new Date().toISOString().split('T')[0];

  // Sample data
  invoices: Invoice[] = [
    {
      id: '1',
      number: 'INV-2024-0001',
      customerName: 'Acme Corp',
      date: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      amount: 15000,
      balance: 15000,
      daysOutstanding: 45,
      status: 'overdue',
      isOverdue: true
    },
    {
      id: '2',
      number: 'INV-2024-0002',
      customerName: 'Tech Solutions Inc',
      date: new Date('2024-02-01'),
      dueDate: new Date('2024-03-01'),
      amount: 8500,
      balance: 8500,
      daysOutstanding: 15,
      status: 'open',
      isOverdue: false
    },
    {
      id: '3',
      number: 'INV-2024-0003',
      customerName: 'Global Manufacturing',
      date: new Date('2024-02-10'),
      dueDate: new Date('2024-03-10'),
      amount: 25000,
      balance: 12500,
      daysOutstanding: 8,
      status: 'partial',
      isOverdue: false
    },
    {
      id: '4',
      number: 'INV-2024-0004',
      customerName: 'StartUp Ventures',
      date: new Date('2024-02-20'),
      dueDate: new Date('2024-03-20'),
      amount: 5500,
      balance: 5500,
      daysOutstanding: 2,
      status: 'open',
      isOverdue: false
    }
  ];

  vendorBills: VendorBill[] = [
    {
      id: '1',
      vendorName: 'Office Supplies Co',
      billNumber: 'BILL-001',
      date: new Date('2024-02-15'),
      amount: 1250,
      status: 'pending'
    },
    {
      id: '2',
      vendorName: 'Tech Equipment Ltd',
      billNumber: 'BILL-002',
      date: new Date('2024-02-18'),
      amount: 8500,
      status: 'pending'
    },
    {
      id: '3',
      vendorName: 'Marketing Agency',
      billNumber: 'BILL-003',
      date: new Date('2024-02-20'),
      amount: 3200,
      status: 'approved'
    }
  ];

  threeWayMatchItems: ThreeWayMatchItem[] = [
    {
      id: '1',
      poNumber: 'PO-2024-001',
      receiptNumber: 'RCP-001',
      invoiceNumber: 'INV-VND-001',
      poAmount: 5000,
      receiptAmount: 4950,
      invoiceAmount: 5000,
      matchStatus: 'variance'
    },
    {
      id: '2',
      poNumber: 'PO-2024-002',
      receiptNumber: 'RCP-002',
      invoiceNumber: 'INV-VND-002',
      poAmount: 2500,
      receiptAmount: 2500,
      invoiceAmount: 2500,
      matchStatus: 'matched'
    }
  ];

  bankAccounts: BankAccount[] = [
    {
      id: '1',
      name: 'Wells Fargo Checking',
      number: '1234567890',
      type: 'checking',
      balance: 1250000,
      reconciled: true,
      lastReconciled: new Date('2024-02-28')
    },
    {
      id: '2',
      name: 'Chase Business Savings',
      number: '0987654321',
      type: 'savings',
      balance: 850000,
      reconciled: false,
      lastReconciled: new Date('2024-02-25')
    },
    {
      id: '3',
      name: 'Capital One Credit',
      number: '5432109876',
      type: 'credit',
      balance: -15000,
      reconciled: true,
      lastReconciled: new Date('2024-02-28')
    }
  ];

  bankTransactions: BankTransaction[] = [
    {
      id: '1',
      date: new Date('2024-03-01'),
      accountName: 'Wells Fargo Checking',
      description: 'Customer Payment - Invoice 001',
      reference: 'CHK-001',
      credit: 15000,
      runningBalance: 1265000,
      status: 'cleared',
      type: 'deposit'
    },
    {
      id: '2',
      date: new Date('2024-02-28'),
      accountName: 'Wells Fargo Checking',
      description: 'Vendor Payment - Office Supplies',
      reference: 'ACH-002',
      debit: 1250,
      runningBalance: 1250000,
      status: 'reconciled',
      type: 'withdrawal'
    },
    {
      id: '3',
      date: new Date('2024-02-27'),
      accountName: 'Chase Business Savings',
      description: 'Interest Payment',
      reference: 'INT-001',
      credit: 425,
      runningBalance: 850425,
      status: 'cleared',
      type: 'deposit'
    }
  ];

  inventoryVariances: InventoryVariance[] = [
    {
      id: '1',
      itemCode: 'ITEM-001',
      description: 'Premium Widget A',
      standardCost: 125.00,
      actualCost: 138.50,
      variance: 13.50,
      variancePercent: 10.8,
      quantity: 500,
      totalVariance: 6750
    },
    {
      id: '2',
      itemCode: 'ITEM-002',
      description: 'Standard Component B',
      standardCost: 85.00,
      actualCost: 78.25,
      variance: -6.75,
      variancePercent: -7.9,
      quantity: 1200,
      totalVariance: -8100
    },
    {
      id: '3',
      itemCode: 'ITEM-003',
      description: 'Deluxe Assembly C',
      standardCost: 250.00,
      actualCost: 280.00,
      variance: 30.00,
      variancePercent: 12.0,
      quantity: 300,
      totalVariance: 9000
    }
  ];

  taxReturns: TaxReturn[] = [
    {
      id: '1',
      type: 'Sales Tax',
      period: 'February 2024',
      dueDate: new Date('2024-03-20'),
      amount: 8500,
      status: 'draft',
      isOverdue: false
    },
    {
      id: '2',
      type: 'Income Tax',
      period: 'Q4 2023',
      dueDate: new Date('2024-01-31'),
      amount: 45000,
      status: 'overdue',
      isOverdue: true
    },
    {
      id: '3',
      type: 'Payroll Tax',
      period: 'February 2024',
      dueDate: new Date('2024-03-15'),
      amount: 12500,
      status: 'filed',
      isOverdue: false
    }
  ];

  ngOnInit() {
    console.log('Finance Operations component initialized');
  }

  setView(view: string) {
    this.selectedView = view;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Header Actions
  exportFinanceReport() {
    console.log('Exporting finance report...');
    // Implementation for report export
  }

  openQuickEntryDialog() {
    console.log('Opening quick entry dialog...');
    // Implementation for quick entry
  }

  // Quick Actions
  quickAction(action: string) {
    console.log('Quick action:', action);
    switch (action) {
      case 'create-invoice':
        this.createInvoice();
        break;
      case 'record-payment':
        console.log('Record payment dialog');
        break;
      case 'vendor-bill':
        this.enterVendorBill();
        break;
      case 'bank-transfer':
        console.log('Bank transfer dialog');
        break;
      case 'expense-entry':
        console.log('Expense entry dialog');
        break;
      case 'journal-entry':
        console.log('Journal entry dialog');
        break;
    }
  }

  // Accounts Receivable
  createInvoice() {
    console.log('Creating new invoice...');
    // Implementation for invoice creation
  }

  runAgingReport() {
    console.log('Running AR aging report...');
    // Implementation for aging report
  }

  sendDunningLetters() {
    console.log('Sending dunning letters...');
    // Implementation for dunning letters
  }

  getFilteredInvoices(): Invoice[] {
    let filtered = this.invoices;

    if (this.arSearchTerm) {
      const term = this.arSearchTerm.toLowerCase();
      filtered = filtered.filter(invoice =>
        invoice.number.toLowerCase().includes(term) ||
        invoice.customerName.toLowerCase().includes(term)
      );
    }

    if (this.arStatusFilter) {
      filtered = filtered.filter(invoice => invoice.status === this.arStatusFilter);
    }

    return filtered;
  }

  toggleAllInvoices(event: any) {
    if (event.target.checked) {
      this.selectedInvoices = this.getFilteredInvoices().map(inv => inv.id);
    } else {
      this.selectedInvoices = [];
    }
  }

  toggleInvoice(invoiceId: string, event: any) {
    if (event.target.checked) {
      this.selectedInvoices.push(invoiceId);
    } else {
      this.selectedInvoices = this.selectedInvoices.filter(id => id !== invoiceId);
    }
  }

  viewInvoice(invoice: Invoice) {
    console.log('Viewing invoice:', invoice);
  }

  editInvoice(invoice: Invoice) {
    console.log('Editing invoice:', invoice);
  }

  recordPayment(invoice: Invoice) {
    console.log('Recording payment for:', invoice);
  }

  sendInvoice(invoice: Invoice) {
    console.log('Sending invoice:', invoice);
  }

  // Accounts Payable
  enterVendorBill() {
    console.log('Entering vendor bill...');
  }

  run3WayMatch() {
    console.log('Running 3-way match...');
  }

  runPaymentRun() {
    console.log('Running payment run...');
  }

  getBillsAwaitingApproval(): VendorBill[] {
    return this.vendorBills.filter(bill => bill.status === 'pending');
  }

  get3WayMatchItems(): ThreeWayMatchItem[] {
    return this.threeWayMatchItems;
  }

  approveBill(bill: VendorBill) {
    console.log('Approving bill:', bill);
    bill.status = 'approved';
  }

  reviewBill(bill: VendorBill) {
    console.log('Reviewing bill:', bill);
  }

  performMatch(item: ThreeWayMatchItem) {
    console.log('Performing 3-way match:', item);
  }

  // Cash & Bank
  importBankStatement() {
    console.log('Importing bank statement...');
  }

  runBankReconciliation() {
    console.log('Running bank reconciliation...');
  }

  createBankEntry() {
    console.log('Creating bank entry...');
  }

  getBankAccounts(): BankAccount[] {
    return this.bankAccounts;
  }

  getRecentBankTransactions(): BankTransaction[] {
    return this.bankTransactions.slice(0, 10);
  }

  matchTransaction(transaction: BankTransaction) {
    console.log('Matching transaction:', transaction);
  }

  editTransaction(transaction: BankTransaction) {
    console.log('Editing transaction:', transaction);
  }

  // Fixed Assets
  runDepreciation() {
    console.log('Running depreciation...');
  }

  generateAssetReport() {
    console.log('Generating asset report...');
  }

  addAsset() {
    console.log('Adding new asset...');
  }

  getTotalAssets(): number {
    return 248; // Sample value
  }

  getTotalAssetValue(): number {
    return 2450000; // Sample value
  }

  getMonthlyDepreciation(): number {
    return 35000; // Sample value
  }

  getAssetsToDepreciate(): number {
    return 156; // Sample value
  }

  runMonthlyDepreciation() {
    console.log('Running monthly depreciation...');
  }

  // Inventory
  viewCostVariances() {
    console.log('Viewing cost variances...');
  }

  runLandedCostAllocation() {
    console.log('Running landed cost allocation...');
  }

  getInventoryVariances(): InventoryVariance[] {
    return this.inventoryVariances;
  }

  // Tax & Compliance
  prepareTaxReturn() {
    console.log('Preparing tax return...');
  }

  generateStatements() {
    console.log('Generating customer/vendor statements...');
  }

  fileTaxReturn() {
    console.log('Filing tax return...');
  }

  getTaxReturns(): TaxReturn[] {
    return this.taxReturns;
  }

  workOnReturn(taxReturn: TaxReturn) {
    console.log('Working on tax return:', taxReturn);
  }

  previewStatements() {
    console.log('Previewing statements for:', this.statementType);
  }

  generateAndSendStatements() {
    console.log('Generating and sending statements for:', this.statementType);
  }
}
