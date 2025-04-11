
import Dexie, { Table } from 'dexie';

// Define transaction types
export interface Transaction {
  id?: number;
  title: string;
  amount: number;
  date: string;
  category: string;
  paymentMode: 'cash' | 'bank' | 'card';
  createdAt: Date;
}

// Define budget types
export interface Budget {
  id?: number;
  category: string;
  limit: number;
  color: string;
  iconName: string;
}

// Create database class
class FinanceDatabase extends Dexie {
  transactions!: Table<Transaction>;
  budgets!: Table<Budget>;

  constructor() {
    super('financeDatabase');
    this.version(1).stores({
      transactions: '++id, category, date, paymentMode',
      budgets: '++id, category'
    });
  }
}

// Create and export database instance
export const db = new FinanceDatabase();

// Initialize with the mock budgets if not already present
export const initializeDatabase = async () => {
  const budgetCount = await db.budgets.count();
  
  if (budgetCount === 0) {
    // Initial budget data
    const initialBudgets = [
      { category: "Food & Dining", limit: 600, color: "bg-violet-500", iconName: "Utensils" },
      { category: "Transportation", limit: 150, color: "bg-blue-500", iconName: "Car" },
      { category: "Entertainment", limit: 200, color: "bg-pink-500", iconName: "Film" },
      { category: "Shopping", limit: 300, color: "bg-emerald-500", iconName: "ShoppingBag" },
      { category: "Housing", limit: 1200, color: "bg-amber-500", iconName: "Home" },
      { category: "Utilities", limit: 250, color: "bg-indigo-500", iconName: "Wifi" },
    ];
    
    await db.budgets.bulkAdd(initialBudgets);
  }
};

// Function to add a transaction
export const addTransaction = async (transaction: Omit<Transaction, 'createdAt'>) => {
  const newTransaction = {
    ...transaction,
    createdAt: new Date()
  };
  
  return await db.transactions.add(newTransaction);
};

// Function to get all transactions
export const getTransactions = async () => {
  return await db.transactions.orderBy('date').reverse().toArray();
};

// Function to get transactions by category
export const getTransactionsByCategory = async (category: string) => {
  return await db.transactions
    .where('category')
    .equals(category)
    .toArray();
};

// Function to get all budgets
export const getBudgets = async () => {
  return await db.budgets.toArray();
};

// Function to calculate spent amount by category
export const getSpentByCategory = async (category: string) => {
  const transactions = await getTransactionsByCategory(category);
  return transactions.reduce((total, t) => total + (t.amount < 0 ? Math.abs(t.amount) : 0), 0);
};

// Function to get budget statistics
export const getBudgetStats = async () => {
  const budgets = await getBudgets();
  const budgetStats = [];

  for (const budget of budgets) {
    const spent = await getSpentByCategory(budget.category);
    budgetStats.push({
      ...budget,
      spent
    });
  }

  return budgetStats;
};

// Initialize the database
initializeDatabase();
