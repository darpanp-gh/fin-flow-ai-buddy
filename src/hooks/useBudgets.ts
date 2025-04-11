
import { useState, useEffect } from 'react';
import { Budget, getBudgets, getBudgetStats, db } from '@/db/database';

export type BudgetWithSpent = Budget & { spent: number };

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<BudgetWithSpent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await getBudgetStats();
      setBudgets(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch budgets'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBudgets();
    
    // Refresh budgets when transactions change
    db.transactions.hook('creating', () => {
      fetchBudgets();
    });
    
    // No need to unsubscribe as the hook doesn't return unsubscribe function
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  const getTotalStats = () => {
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    const totalLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
    const overBudgetCount = budgets.filter(budget => budget.spent > budget.limit).length;
    
    return { totalSpent, totalLimit, overBudgetCount };
  };
  
  return {
    budgets,
    loading,
    error,
    refreshBudgets: fetchBudgets,
    getTotalStats
  };
};
