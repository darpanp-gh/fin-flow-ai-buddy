
import { useState } from "react";
import { motion } from "framer-motion";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Plus, Bookmark, Car, Home, Plane, Briefcase, GraduationCap } from "lucide-react";

// Mock data
const mockGoals = [
  { 
    id: 1, 
    title: "Vacation Fund", 
    target: 3000, 
    current: 1240, 
    deadline: "Aug 2025", 
    icon: <Plane size={20} />,
    color: "bg-blue-500" 
  },
  { 
    id: 2, 
    title: "Emergency Fund", 
    target: 10000, 
    current: 4500, 
    deadline: "Dec 2025", 
    icon: <Bookmark size={20} />,
    color: "bg-amber-500" 
  },
  { 
    id: 3, 
    title: "New Car", 
    target: 25000, 
    current: 8750, 
    deadline: "Jun 2026", 
    icon: <Car size={20} />,
    color: "bg-emerald-500" 
  },
  { 
    id: 4, 
    title: "Home Down Payment", 
    target: 50000, 
    current: 12500, 
    deadline: "Jan 2027", 
    icon: <Home size={20} />,
    color: "bg-indigo-500" 
  }
];

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper to calculate percentage
const calculatePercentage = (current: number, target: number) => {
  return Math.round((current / target) * 100);
};

const GoalsPage = () => {
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
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg mr-3">
              <Target size={22} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Savings Goals</h1>
          </div>
          <Button variant="default" size="sm" className="rounded-full">
            <Plus size={16} className="mr-1" /> New Goal
          </Button>
        </div>
        
        {/* Goals summary */}
        <Card className="p-5 mb-6 rounded-xl card-shadow">
          <h3 className="font-medium mb-4">Goals Summary</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Saved</p>
              <p className="text-xl font-semibold">
                {formatCurrency(mockGoals.reduce((sum, goal) => sum + goal.current, 0))}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Target Amount</p>
              <p className="text-xl font-semibold">
                {formatCurrency(mockGoals.reduce((sum, goal) => sum + goal.target, 0))}
              </p>
            </div>
          </div>
          
          <div className="mb-1">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium">Overall Progress</p>
              <p className="text-sm font-medium">
                {Math.round(
                  (mockGoals.reduce((sum, goal) => sum + goal.current, 0) / 
                   mockGoals.reduce((sum, goal) => sum + goal.target, 0)) * 100
                )}%
              </p>
            </div>
            <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full bg-finance-budget"
                initial={{ width: "0%" }}
                animate={{ width: `${
                  (mockGoals.reduce((sum, goal) => sum + goal.current, 0) / 
                   mockGoals.reduce((sum, goal) => sum + goal.target, 0)) * 100
                }%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </Card>
        
        {/* Goals list */}
        <h3 className="text-lg font-semibold mb-4">Your Goals</h3>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {mockGoals.map((goal) => (
            <motion.div
              key={goal.id}
              variants={itemVariants}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 rounded-xl card-shadow card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3`} style={{ backgroundColor: `${goal.color}20` }}>
                      <div className="text-foreground">{goal.icon}</div>
                    </div>
                    <div>
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-xs text-muted-foreground">Target: {goal.deadline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {calculatePercentage(goal.current, goal.target)}%
                    </p>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="relative h-2.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className={`absolute top-0 left-0 h-full rounded-full ${goal.color}`}
                      initial={{ width: "0%" }}
                      animate={{ width: `${calculatePercentage(goal.current, goal.target)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{formatCurrency(goal.current)}</span>
                    <span> of {formatCurrency(goal.target)}</span>
                  </p>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-full">
                    Add funds
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Add Goal Card */}
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.3, delay: 0.4 }}
          initial="hidden"
          animate="visible"
          className="mt-4"
        >
          <Card className="p-4 rounded-xl border-dashed card-shadow flex items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors">
            <div className="flex flex-col items-center py-6">
              <div className="p-3 bg-secondary rounded-full mb-3">
                <Plus size={24} className="text-muted-foreground" />
              </div>
              <p className="font-medium">Add New Savings Goal</p>
              <p className="text-xs text-muted-foreground mt-1">Track your progress towards your dreams</p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </MobileLayout>
  );
};

export default GoalsPage;
