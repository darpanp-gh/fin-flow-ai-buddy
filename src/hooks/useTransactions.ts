
import { useState, useEffect } from 'react';
import { db, Transaction, getTransactions, addTransaction } from '@/db/database';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTransactions();
    
    // Subscribe to changes in the database
    db.transactions.hook('creating', () => {
      fetchTransactions();
    });
    
    // No need to unsubscribe as the hook doesn't return unsubscribe function
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  const addNewTransaction = async (transaction: Omit<Transaction, 'createdAt'>) => {
    try {
      await addTransaction(transaction);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add transaction'));
      return false;
    }
  };
  
  return {
    transactions,
    loading,
    error,
    addTransaction: addNewTransaction,
    refreshTransactions: fetchTransactions
  };
};
