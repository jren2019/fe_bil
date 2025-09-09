import { Injectable } from '@angular/core';

export interface FinancialTransaction {
  id: number;
  date: Date;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'pending' | 'approved' | 'rejected';
  reference: string;
  vendor?: string;
  account: string;
  tags: string[];
}

export interface BudgetItem {
  id: number;
  category: string;
  budgetedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
  period: string;
  status: 'on-track' | 'over-budget' | 'under-budget';
}

export interface FinancialMetric {
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private transactions: FinancialTransaction[] = [];
  private budgets: BudgetItem[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample transactions
    this.transactions = [
      {
        id: 1,
        date: new Date('2024-01-15'),
        description: 'Office Supplies Purchase',
        category: 'office-supplies',
        amount: 250.00,
        type: 'expense',
        status: 'approved',
        reference: 'INV-001',
        vendor: 'Office Depot',
        account: 'checking',
        tags: ['office', 'supplies']
      },
      {
        id: 2,
        date: new Date('2024-01-16'),
        description: 'Software License Renewal',
        category: 'software',
        amount: 1200.00,
        type: 'expense',
        status: 'approved',
        reference: 'INV-002',
        vendor: 'Microsoft',
        account: 'credit-card',
        tags: ['software', 'license']
      },
      {
        id: 3,
        date: new Date('2024-01-17'),
        description: 'Client Payment - Project Alpha',
        category: 'revenue',
        amount: 5000.00,
        type: 'income',
        status: 'approved',
        reference: 'PAY-001',
        account: 'checking',
        tags: ['client', 'project']
      },
      {
        id: 4,
        date: new Date('2024-01-18'),
        description: 'Equipment Maintenance',
        category: 'maintenance',
        amount: 450.00,
        type: 'expense',
        status: 'pending',
        reference: 'INV-003',
        vendor: 'Tech Services Inc',
        account: 'checking',
        tags: ['equipment', 'maintenance']
      },
      {
        id: 5,
        date: new Date('2024-01-19'),
        description: 'Training Course - Team Development',
        category: 'training',
        amount: 800.00,
        type: 'expense',
        status: 'approved',
        reference: 'INV-004',
        vendor: 'Learning Solutions',
        account: 'credit-card',
        tags: ['training', 'development']
      },
      {
        id: 6,
        date: new Date('2024-01-20'),
        description: 'Utilities Payment',
        category: 'utilities',
        amount: 320.00,
        type: 'expense',
        status: 'approved',
        reference: 'INV-005',
        vendor: 'City Utilities',
        account: 'checking',
        tags: ['utilities', 'monthly']
      },
      {
        id: 7,
        date: new Date('2024-01-21'),
        description: 'Marketing Campaign - Q1',
        category: 'marketing',
        amount: 1500.00,
        type: 'expense',
        status: 'pending',
        reference: 'INV-006',
        vendor: 'Digital Marketing Co',
        account: 'credit-card',
        tags: ['marketing', 'campaign']
      },
      {
        id: 8,
        date: new Date('2024-01-22'),
        description: 'Client Payment - Project Beta',
        category: 'revenue',
        amount: 7500.00,
        type: 'income',
        status: 'approved',
        reference: 'PAY-002',
        account: 'checking',
        tags: ['client', 'project']
      },
      {
        id: 9,
        date: new Date('2024-01-23'),
        description: 'Travel Expenses - Conference',
        category: 'travel',
        amount: 1200.00,
        type: 'expense',
        status: 'approved',
        reference: 'INV-007',
        vendor: 'Various',
        account: 'credit-card',
        tags: ['travel', 'conference']
      },
      {
        id: 10,
        date: new Date('2024-01-24'),
        description: 'Equipment Purchase - Laptops',
        category: 'equipment',
        amount: 3000.00,
        type: 'expense',
        status: 'pending',
        reference: 'INV-008',
        vendor: 'Tech Store',
        account: 'checking',
        tags: ['equipment', 'laptops']
      }
    ];

    // Sample budgets
    this.budgets = [
      {
        id: 1,
        category: 'office-supplies',
        budgetedAmount: 500.00,
        spentAmount: 250.00,
        remainingAmount: 250.00,
        percentage: 50,
        period: 'monthly',
        status: 'on-track'
      },
      {
        id: 2,
        category: 'software',
        budgetedAmount: 2000.00,
        spentAmount: 1200.00,
        remainingAmount: 800.00,
        percentage: 60,
        period: 'quarterly',
        status: 'on-track'
      },
      {
        id: 3,
        category: 'maintenance',
        budgetedAmount: 300.00,
        spentAmount: 450.00,
        remainingAmount: -150.00,
        percentage: 150,
        period: 'monthly',
        status: 'over-budget'
      },
      {
        id: 4,
        category: 'training',
        budgetedAmount: 1000.00,
        spentAmount: 800.00,
        remainingAmount: 200.00,
        percentage: 80,
        period: 'quarterly',
        status: 'on-track'
      },
      {
        id: 5,
        category: 'utilities',
        budgetedAmount: 400.00,
        spentAmount: 320.00,
        remainingAmount: 80.00,
        percentage: 80,
        period: 'monthly',
        status: 'on-track'
      },
      {
        id: 6,
        category: 'marketing',
        budgetedAmount: 2000.00,
        spentAmount: 1500.00,
        remainingAmount: 500.00,
        percentage: 75,
        period: 'quarterly',
        status: 'on-track'
      },
      {
        id: 7,
        category: 'travel',
        budgetedAmount: 1500.00,
        spentAmount: 1200.00,
        remainingAmount: 300.00,
        percentage: 80,
        period: 'quarterly',
        status: 'on-track'
      },
      {
        id: 8,
        category: 'equipment',
        budgetedAmount: 5000.00,
        spentAmount: 3000.00,
        remainingAmount: 2000.00,
        percentage: 60,
        period: 'yearly',
        status: 'on-track'
      }
    ];
  }

  getTransactions(): FinancialTransaction[] {
    return [...this.transactions];
  }

  getBudgets(): BudgetItem[] {
    return [...this.budgets];
  }

  getMetrics(): FinancialMetric[] {
    const totalIncome = this.transactions
      .filter(t => t.type === 'income' && t.status === 'approved')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = this.transactions
      .filter(t => t.type === 'expense' && t.status === 'approved')
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = totalIncome - totalExpenses;
    const pendingTransactions = this.transactions.filter(t => t.status === 'pending').length;

    return [
      {
        label: 'Total Income',
        value: totalIncome,
        change: 12.5,
        changeType: 'increase',
        icon: '💰',
        color: '#28a745'
      },
      {
        label: 'Total Expenses',
        value: totalExpenses,
        change: 8.3,
        changeType: 'increase',
        icon: '💸',
        color: '#dc3545'
      },
      {
        label: 'Net Income',
        value: netIncome,
        change: 15.2,
        changeType: netIncome > 0 ? 'increase' : 'decrease',
        icon: '📈',
        color: netIncome > 0 ? '#28a745' : '#dc3545'
      },
      {
        label: 'Pending Transactions',
        value: pendingTransactions,
        change: -5.0,
        changeType: 'decrease',
        icon: '⏳',
        color: '#ffc107'
      }
    ];
  }

  addTransaction(transaction: Omit<FinancialTransaction, 'id'>): FinancialTransaction {
    const newId = Math.max(...this.transactions.map(t => t.id), 0) + 1;
    const newTransaction: FinancialTransaction = {
      id: newId,
      ...transaction
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  updateTransaction(id: number, updates: Partial<FinancialTransaction>): boolean {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions[index] = { ...this.transactions[index], ...updates };
      return true;
    }
    return false;
  }

  deleteTransaction(id: number): boolean {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions.splice(index, 1);
      return true;
    }
    return false;
  }

  addBudget(budget: Omit<BudgetItem, 'id' | 'spentAmount' | 'remainingAmount' | 'percentage' | 'status'>): BudgetItem {
    const newId = Math.max(...this.budgets.map(b => b.id), 0) + 1;
    const newBudget: BudgetItem = {
      id: newId,
      ...budget,
      spentAmount: 0,
      remainingAmount: budget.budgetedAmount,
      percentage: 0,
      status: 'on-track'
    };
    this.budgets.push(newBudget);
    return newBudget;
  }

  updateBudget(id: number, updates: Partial<BudgetItem>): boolean {
    const index = this.budgets.findIndex(b => b.id === id);
    if (index !== -1) {
      this.budgets[index] = { ...this.budgets[index], ...updates };
      this.updateBudgetCalculations(this.budgets[index]);
      return true;
    }
    return false;
  }

  deleteBudget(id: number): boolean {
    const index = this.budgets.findIndex(b => b.id === id);
    if (index !== -1) {
      this.budgets.splice(index, 1);
      return true;
    }
    return false;
  }

  private updateBudgetCalculations(budget: BudgetItem) {
    // Calculate spent amount from transactions
    const categoryTransactions = this.transactions.filter(
      t => t.category === budget.category && t.type === 'expense' && t.status === 'approved'
    );
    
    budget.spentAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    budget.remainingAmount = budget.budgetedAmount - budget.spentAmount;
    budget.percentage = budget.budgetedAmount > 0 ? (budget.spentAmount / budget.budgetedAmount) * 100 : 0;
    
    // Determine status
    if (budget.percentage > 100) {
      budget.status = 'over-budget';
    } else if (budget.percentage < 50) {
      budget.status = 'under-budget';
    } else {
      budget.status = 'on-track';
    }
  }

  getTransactionsByCategory(category: string): FinancialTransaction[] {
    return this.transactions.filter(t => t.category === category);
  }

  getTransactionsByDateRange(startDate: Date, endDate: Date): FinancialTransaction[] {
    return this.transactions.filter(t => t.date >= startDate && t.date <= endDate);
  }

  getTransactionsByStatus(status: string): FinancialTransaction[] {
    return this.transactions.filter(t => t.status === status);
  }

  getBudgetByCategory(category: string): BudgetItem | undefined {
    return this.budgets.find(b => b.category === category);
  }

  getTotalIncome(): number {
    return this.transactions
      .filter(t => t.type === 'income' && t.status === 'approved')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpenses(): number {
    return this.transactions
      .filter(t => t.type === 'expense' && t.status === 'approved')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getNetIncome(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  getPendingTransactionsCount(): number {
    return this.transactions.filter(t => t.status === 'pending').length;
  }

  // Export functionality
  exportTransactionsToCSV(): string {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Status', 'Reference', 'Account'];
    const rows = this.transactions.map(t => [
      t.date.toISOString().split('T')[0],
      t.description,
      t.category,
      t.type,
      t.amount.toString(),
      t.status,
      t.reference,
      t.account
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
  }

  // Analytics methods
  getMonthlyIncome(): { month: string; amount: number }[] {
    const monthlyData: { [key: string]: number } = {};
    
    this.transactions
      .filter(t => t.type === 'income' && t.status === 'approved')
      .forEach(t => {
        const month = t.date.toISOString().substring(0, 7); // YYYY-MM
        monthlyData[month] = (monthlyData[month] || 0) + t.amount;
      });
    
    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  getMonthlyExpenses(): { month: string; amount: number }[] {
    const monthlyData: { [key: string]: number } = {};
    
    this.transactions
      .filter(t => t.type === 'expense' && t.status === 'approved')
      .forEach(t => {
        const month = t.date.toISOString().substring(0, 7); // YYYY-MM
        monthlyData[month] = (monthlyData[month] || 0) + t.amount;
      });
    
    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  getCategoryBreakdown(): { category: string; amount: number; percentage: number }[] {
    const categoryData: { [key: string]: number } = {};
    const totalExpenses = this.getTotalExpenses();
    
    this.transactions
      .filter(t => t.type === 'expense' && t.status === 'approved')
      .forEach(t => {
        categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categoryData)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }
}
