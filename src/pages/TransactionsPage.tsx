
import { useState } from "react";
import { motion } from "framer-motion";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Calendar,
  FileSpreadsheet,
  Wallet,
  CreditCard,
  Landmark
} from "lucide-react";
import TransactionForm from "@/components/TransactionForm";
import { useTransactions } from "@/hooks/useTransactions";
import { useBudgets } from "@/hooks/useBudgets";
import { Transaction } from "@/db/database";

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Group transactions by date
const groupTransactionsByDate = (transactions: Transaction[]) => {
  const groups: Record<string, Transaction[]> = {};
  
  transactions.forEach(transaction => {
    if (!groups[transaction.date]) {
      groups[transaction.date] = [];
    }
    groups[transaction.date].push(transaction);
  });
  
  return Object.entries(groups);
};

// Get payment mode icon
const getPaymentModeIcon = (mode: string) => {
  switch (mode) {
    case 'cash':
      return <Wallet size={14} className="ml-1 text-muted-foreground" />;
    case 'bank':
      return <Landmark size={14} className="ml-1 text-muted-foreground" />;
    case 'card':
      return <CreditCard size={14} className="ml-1 text-muted-foreground" />;
    default:
      return null;
  }
};

const TransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  
  // Get transactions from hook
  const { transactions, loading, addTransaction } = useTransactions();
  const { budgets } = useBudgets();
  
  // Filter transactions based on tab and search
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "income") return transaction.amount > 0 && matchesSearch;
    if (activeTab === "expense") return transaction.amount < 0 && matchesSearch;
    
    return matchesSearch;
  });
  
  const groupedTransactions = groupTransactionsByDate(filteredTransactions);
  
  // Get list of categories for the transaction form
  const categories = budgets.map(budget => budget.category);
  
  // Handle adding a new transaction
  const handleAddTransaction = async (transaction: Omit<Transaction, 'createdAt'>) => {
    return await addTransaction(transaction);
  };
  
  // Page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <MobileLayout>
      <motion.div
        initial="initial"
        animate="in"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.3 }}
        className="px-4 pt-6 pb-16"
      >
        {/* Header */}
        <AppHeader title="Transactions" subtitle="Manage your money flow" />
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-2 mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" size="icon" className="rounded-full">
              <Calendar size={18} />
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" size="icon" className="rounded-full">
              <FileSpreadsheet size={18} />
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full"
              onClick={() => setIsTransactionFormOpen(true)}
            >
              <PlusCircle size={18} />
            </Button>
          </motion.div>
        </div>
        
        {/* Search and filter */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Transactions list */}
        {loading ? (
          <div className="flex justify-center py-10">
            <p>Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-muted rounded-full mb-4">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No transactions found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {groupedTransactions.map(([date, transactions]) => (
              <div key={date} className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
                
                {transactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 mb-2 bg-card hover:bg-secondary/50 rounded-xl card-shadow theme-transition dark:shine-effect"
                    variants={itemVariants}
                    transition={{ duration: 0.2 }}
                    whileHover={{ 
                      y: -2,
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" 
                    }}
                  >
                    <div className="flex items-center">
                      <div className={`
                        p-2.5 rounded-full mr-3 
                        ${transaction.amount > 0 ? "bg-finance-income/10" : "bg-finance-expense/10"}
                      `}>
                        {transaction.amount > 0 ? (
                          <ArrowUpRight size={18} className="text-finance-income" />
                        ) : (
                          <ArrowDownRight size={18} className="text-finance-expense" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.title}</p>
                        <div className="flex items-center">
                          <p className="text-xs text-muted-foreground">
                            {transaction.category}
                          </p>
                          {getPaymentModeIcon(transaction.paymentMode)}
                        </div>
                      </div>
                    </div>
                    <p className={`font-medium ${transaction.amount > 0 ? "text-finance-income" : "text-finance-expense"}`}>
                      {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                    </p>
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>
        )}
        
        {/* Transaction Form */}
        <TransactionForm 
          isOpen={isTransactionFormOpen}
          onClose={() => setIsTransactionFormOpen(false)}
          onAddTransaction={handleAddTransaction}
          categories={categories}
        />
      </motion.div>
    </MobileLayout>
  );
};

export default TransactionsPage;
