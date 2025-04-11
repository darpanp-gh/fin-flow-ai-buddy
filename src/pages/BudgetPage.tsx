
import { useState } from "react";
import { motion } from "framer-motion";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, BarChart, DollarSign, Utensils, Car, Film, ShoppingBag, Home, Wifi, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data
const mockBudgets = [
  { id: 1, category: "Food & Dining", spent: 420.50, limit: 600, color: "bg-violet-500", icon: <Utensils size={18} /> },
  { id: 2, category: "Transportation", spent: 145.20, limit: 150, color: "bg-blue-500", icon: <Car size={18} /> },
  { id: 3, category: "Entertainment", spent: 85.30, limit: 200, color: "bg-pink-500", icon: <Film size={18} /> },
  { id: 4, category: "Shopping", spent: 250.75, limit: 300, color: "bg-emerald-500", icon: <ShoppingBag size={18} /> },
  { id: 5, category: "Housing", spent: 1200.00, limit: 1200, color: "bg-amber-500", icon: <Home size={18} /> },
  { id: 6, category: "Utilities", spent: 180.25, limit: 250, color: "bg-indigo-500", icon: <Wifi size={18} /> },
];

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

// Total budget stats
const calculateTotalStats = () => {
  const totalSpent = mockBudgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalLimit = mockBudgets.reduce((sum, budget) => sum + budget.limit, 0);
  const overBudgetCount = mockBudgets.filter(budget => budget.spent > budget.limit).length;
  
  return { totalSpent, totalLimit, overBudgetCount };
};

const BudgetPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { totalSpent, totalLimit, overBudgetCount } = calculateTotalStats();
  
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

  return (
    <MobileLayout>
      <motion.div
        initial="initial"
        animate="in"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.3 }}
        className="px-4 pt-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Budget</h1>
          <Button variant="default" size="sm" className="rounded-full">
            <Plus size={16} className="mr-1" /> New Budget
          </Button>
        </div>
        
        {/* Budget Overview Card */}
        <Card className="p-5 mb-6 rounded-xl card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Monthly Budget</h3>
            <span className="text-sm text-muted-foreground">April 2025</span>
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
        
        {/* Budget Categories */}
        <h3 className="text-lg font-semibold mb-4">Budget Categories</h3>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {mockBudgets.map((budget) => (
            <motion.div 
              key={budget.id}
              variants={itemVariants}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 rounded-xl card-shadow card-hover">
                <div className="flex items-start mb-3">
                  <div className={`p-2 rounded-lg mr-3`} style={{ backgroundColor: `${budget.color}20` }}>
                    <div className="text-foreground">{budget.icon}</div>
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
          ))}
        </motion.div>
      </motion.div>
    </MobileLayout>
  );
};

export default BudgetPage;
