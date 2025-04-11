
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, BarChart, DollarSign, Utensils, Car, Film, ShoppingBag, Home, Wifi, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BudgetCharts from "@/components/BudgetCharts";
import TransactionForm from "@/components/TransactionForm";
import { useBudgets } from "@/hooks/useBudgets";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction } from "@/db/database";

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Helper to calculate percentage
const calculatePercentage = (spent: number, limit: number) => {
  return Math.min(Math.round((spent / limit) * 100), 100);
};

const BudgetPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  
  // Get budgets and transactions from hooks
  const { budgets, loading: budgetsLoading, getTotalStats } = useBudgets();
  const { transactions, addTransaction } = useTransactions();
  
  // Get total stats
  const { totalSpent, totalLimit, overBudgetCount } = getTotalStats();
  
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
        staggerChildren: 0.07
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Get list of categories for the transaction form
  const categories = budgets.map(budget => budget.category);

  // Handle adding a new transaction
  const handleAddTransaction = async (transaction: Omit<Transaction, 'createdAt'>) => {
    return await addTransaction(transaction);
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Budget</h1>
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-full"
            onClick={() => setIsTransactionFormOpen(true)}
          >
            <Plus size={16} className="mr-1" /> Add Transaction
          </Button>
        </div>
        
        {/* Budget Overview Card */}
        <Card className="p-5 mb-6 rounded-xl card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Monthly Budget</h3>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
              <p className="text-xl font-semibold">{formatCurrency(totalSpent)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Budget Limit</p>
              <p className="text-xl font-semibold">{formatCurrency(totalLimit)}</p>
            </div>
          </div>
          
          <div className="mb-1">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium">Overall Progress</p>
              <p className="text-sm font-medium">{calculatePercentage(totalSpent, totalLimit)}%</p>
            </div>
            <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={`absolute top-0 left-0 h-full rounded-full 
                  ${calculatePercentage(totalSpent, totalLimit) > 90 ? "bg-finance-expense" : "bg-finance-budget"}`}
                initial={{ width: "0%" }}
                animate={{ width: `${calculatePercentage(totalSpent, totalLimit)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <div className="flex justify-between text-sm mt-4">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-finance-budget mr-2"></span>
              <span className="text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-finance-expense mr-2"></span>
              <span className="text-muted-foreground">
                {overBudgetCount} {overBudgetCount === 1 ? "category" : "categories"} over budget
              </span>
            </div>
          </div>
        </Card>
        
        {/* Tabs */}
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="overview">
              <PieChart size={16} className="mr-2" /> 
              Overview
            </TabsTrigger>
            <TabsTrigger value="details">
              <BarChart size={16} className="mr-2" /> 
              Details
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Charts for Overview Tab */}
        <BudgetCharts budgets={budgets} activeTab={activeTab} />
        
        {/* Budget Categories - Show in both tabs */}
        <h3 className="text-lg font-semibold mb-4">Budget Categories</h3>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {budgetsLoading ? (
            <p>Loading budgets...</p>
          ) : (
            budgets.map((budget) => (
              <motion.div 
                key={budget.id}
                variants={itemVariants}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 rounded-xl card-shadow card-hover">
                  <div className="flex items-start mb-3">
                    <div className={`p-2 rounded-lg mr-3`} style={{ backgroundColor: `${budget.color}20` }}>
                      <div className="text-foreground">
                        {budget.iconName === "Utensils" && <Utensils size={18} />}
                        {budget.iconName === "Car" && <Car size={18} />}
                        {budget.iconName === "Film" && <Film size={18} />}
                        {budget.iconName === "ShoppingBag" && <ShoppingBag size={18} />}
                        {budget.iconName === "Home" && <Home size={18} />}
                        {budget.iconName === "Wifi" && <Wifi size={18} />}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{budget.category}</h4>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${budget.spent > budget.limit ? "text-finance-expense" : ""}`}>
                            {formatCurrency(budget.spent)} 
                            <span className="text-muted-foreground"> / {formatCurrency(budget.limit)}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="relative h-2.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className={`absolute top-0 left-0 h-full rounded-full ${budget.color}`}
                            initial={{ width: "0%" }}
                            animate={{ width: `${calculatePercentage(budget.spent, budget.limit)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {calculatePercentage(budget.spent, budget.limit)}% used
                        </p>
                        
                        {budget.spent > budget.limit ? (
                          <p className="text-xs text-finance-expense">
                            Over by {formatCurrency(budget.spent - budget.limit)}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(budget.limit - budget.spent)} left
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
        
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

export default BudgetPage;
