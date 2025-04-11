
import { useState } from "react";
import { motion } from "framer-motion";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Calendar,
  FileSpreadsheet
} from "lucide-react";

// Mock data
const mockTransactions = [
  { id: 1, title: "Grocery Store", amount: -84.20, date: "Apr 10, 2025", category: "Food" },
  { id: 2, title: "Salary Deposit", amount: 2400.00, date: "Apr 5, 2025", category: "Income" },
  { id: 3, title: "Electric Bill", amount: -120.50, date: "Mar 28, 2025", category: "Utilities" },
  { id: 4, title: "Subscription", amount: -15.99, date: "Mar 25, 2025", category: "Entertainment" },
  { id: 5, title: "Freelance Work", amount: 350.00, date: "Mar 20, 2025", category: "Income" },
  { id: 6, title: "Restaurant", amount: -68.50, date: "Mar 18, 2025", category: "Food" },
  { id: 7, title: "Gas Station", amount: -45.23, date: "Mar 15, 2025", category: "Transportation" },
  { id: 8, title: "Movie Tickets", amount: -32.00, date: "Mar 10, 2025", category: "Entertainment" },
  { id: 9, title: "Interest", amount: 5.21, date: "Mar 5, 2025", category: "Income" },
  { id: 10, title: "Mobile Phone", amount: -65.00, date: "Mar 3, 2025", category: "Utilities" },
];

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Group transactions by date
const groupTransactionsByDate = (transactions: typeof mockTransactions) => {
  const groups: Record<string, typeof mockTransactions> = {};
  
  transactions.forEach(transaction => {
    if (!groups[transaction.date]) {
      groups[transaction.date] = [];
    }
    groups[transaction.date].push(transaction);
  });
  
  return Object.entries(groups);
};

const TransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter transactions based on tab and search
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "income") return transaction.amount > 0 && matchesSearch;
    if (activeTab === "expense") return transaction.amount < 0 && matchesSearch;
    
    return matchesSearch;
  });
  
  const groupedTransactions = groupTransactionsByDate(filteredTransactions);
  
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
        className="px-4 pt-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Calendar size={18} />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <FileSpreadsheet size={18} />
            </Button>
            <Button variant="default" size="icon" className="rounded-full">
              <PlusCircle size={18} />
            </Button>
          </div>
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
        {filteredTransactions.length === 0 ? (
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
                    className="flex items-center justify-between p-3 mb-2 bg-card hover:bg-secondary/50 rounded-xl card-shadow"
                    variants={itemVariants}
                    transition={{ duration: 0.2 }}
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
                          {transaction.category}
                        </p>
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
      </motion.div>
    </MobileLayout>
  );
};

export default TransactionsPage;
