
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  PiggyBank, 
  TrendingUp,
  Bell,
  Wallet,
  BadgeDollarSign,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb
} from "lucide-react";

// Mock data
const mockBalance = {
  current: 3250.85,
  income: 4820.50,
  expenses: 1569.65,
  savings: 850.00,
};

const mockBudgets = [
  { category: "Food & Dining", spent: 420.50, limit: 600, color: "bg-finance-budget" },
  { category: "Entertainment", spent: 85.30, limit: 200, color: "bg-violet-400" },
  { category: "Transportation", spent: 145.20, limit: 150, color: "bg-blue-400" },
];

const mockTransactions = [
  { id: 1, title: "Grocery Store", amount: -84.20, date: "Today", category: "Food" },
  { id: 2, title: "Salary Deposit", amount: 2400.00, date: "Yesterday", category: "Income" },
  { id: 3, title: "Electric Bill", amount: -120.50, date: "Mar 20", category: "Utilities" },
  { id: 4, title: "Subscription", amount: -15.99, date: "Mar 19", category: "Entertainment" },
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

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animate balance counting up
  useEffect(() => {
    if (!isLoading) {
      const duration = 1000; // ms
      const interval = 20; // ms
      const steps = duration / interval;
      const increment = mockBalance.current / steps;
      let count = 0;
      
      const timer = setInterval(() => {
        count += increment;
        if (count >= mockBalance.current) {
          setAnimatedBalance(mockBalance.current);
          clearInterval(timer);
        } else {
          setAnimatedBalance(count);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [isLoading]);
  
  // Page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  const transitionStagger = {
    animate: { transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 relative">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-lg font-medium">Loading your finances...</p>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hello, Alex</h1>
            <p className="text-muted-foreground">Welcome to your finances</p>
          </div>
          <div className="relative">
            <Bell size={24} className="text-foreground" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-finance-alert"></span>
          </div>
        </div>
        
        {/* Main Balance Card */}
        <Card className="p-6 mb-6 rounded-xl card-shadow animated-gradient text-white overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-white/80 text-sm mb-1">Current Balance</p>
            <h2 className="text-3xl font-bold mb-4">{formatCurrency(animatedBalance)}</h2>
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg mr-2">
                  <ArrowUpCircle size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/80">Income</p>
                  <p className="text-sm font-medium">{formatCurrency(mockBalance.income)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg mr-2">
                  <ArrowDownCircle size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/80">Expenses</p>
                  <p className="text-sm font-medium">{formatCurrency(mockBalance.expenses)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg mr-2">
                  <PiggyBank size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/80">Savings</p>
                  <p className="text-sm font-medium">{formatCurrency(mockBalance.savings)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-5 -bottom-20 w-40 h-40 rounded-full bg-white/5" />
        </Card>
        
        {/* AI Insight Card */}
        <Card className="p-4 mb-6 rounded-xl card-shadow border-l-4 border-l-amber-400">
          <div className="flex items-start">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg mr-3">
              <Lightbulb size={22} className="text-amber-500" />
            </div>
            <div>
              <h3 className="font-medium mb-1">AI Insight</h3>
              <p className="text-sm text-muted-foreground">You've spent 28% more on dining out this month compared to your average. Consider adjusting your food budget.</p>
            </div>
          </div>
        </Card>
        
        {/* Budget Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Budget Progress</h3>
            <div className="flex items-center text-primary text-sm">
              <span className="mr-1">View All</span>
              <ChevronRight size={16} />
            </div>
          </div>
          
          <motion.div variants={transitionStagger} initial="hidden" animate="visible">
            {mockBudgets.map((budget, index) => (
              <motion.div 
                key={budget.category} 
                className="mb-4"
                variants={itemVariants}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium">{budget.category}</p>
                  <p className="text-sm">
                    <span className={budget.spent > budget.limit ? "text-finance-expense" : "text-foreground"}>
                      {formatCurrency(budget.spent)}
                    </span>
                    <span className="text-muted-foreground"> / {formatCurrency(budget.limit)}</span>
                  </p>
                </div>
                <div className="relative h-2.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute top-0 left-0 h-full rounded-full ${budget.color}`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${calculatePercentage(budget.spent, budget.limit)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                
                {budget.spent > budget.limit && (
                  <p className="text-xs text-finance-expense mt-1">
                    Over budget by {formatCurrency(budget.spent - budget.limit)}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <div className="flex items-center text-primary text-sm">
              <span className="mr-1">View All</span>
              <ChevronRight size={16} />
            </div>
          </div>
          
          <motion.div variants={transitionStagger} initial="hidden" animate="visible">
            {mockTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                className="flex items-center justify-between p-3 mb-2 bg-card hover:bg-secondary/50 rounded-xl card-shadow"
                variants={itemVariants}
                transition={{ duration: 0.3, delay: index * 0.1 }}
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
                    <p className="text-xs text-muted-foreground">
                      {transaction.date} • {transaction.category}
                    </p>
                  </div>
                </div>
                <p className={`font-medium ${transaction.amount > 0 ? "text-finance-income" : "text-finance-expense"}`}>
                  {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </MobileLayout>
  );
};

export default HomePage;
