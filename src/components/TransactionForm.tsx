
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CreditCard, 
  Landmark, 
  Wallet,
  CalendarIcon
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Transaction } from "@/db/database";

// Animation variants
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'createdAt'>) => Promise<boolean>;
  categories: string[];
}

const TransactionForm = ({ 
  isOpen, 
  onClose, 
  onAddTransaction,
  categories 
}: TransactionFormProps) => {
  // Form state
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMode, setPaymentMode] = useState<"cash" | "bank" | "card">("cash");
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!amount || isNaN(Number(amount))) newErrors.amount = "Valid amount is required";
    if (!category) newErrors.category = "Category is required";
    
    setErrors(newErrors);
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) return;
    
    setIsSubmitting(true);
    
    // Create transaction object
    const transaction: Omit<Transaction, 'createdAt'> = {
      title,
      // Convert amount to negative if it's an expense
      amount: category === "Income" ? Math.abs(Number(amount)) : -Math.abs(Number(amount)),
      category,
      paymentMode,
      date: format(date, "MMM d, yyyy")
    };
    
    // Submit transaction
    const success = await onAddTransaction(transaction);
    
    if (success) {
      // Reset form
      setTitle("");
      setAmount("");
      setCategory("");
      setPaymentMode("cash");
      setDate(new Date());
      setErrors({});
      onClose();
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Transaction</DialogTitle>
        </DialogHeader>
        
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 py-4"
        >
          {/* Transaction Title */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="title">Description</Label>
            <Input
              id="title"
              placeholder="e.g. Grocery Shopping"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-finance-expense" : ""}
            />
            {errors.title && <p className="text-xs text-finance-expense">{errors.title}</p>}
          </motion.div>
          
          {/* Amount */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`pl-8 ${errors.amount ? "border-finance-expense" : ""}`}
              />
            </div>
            {errors.amount && <p className="text-xs text-finance-expense">{errors.amount}</p>}
          </motion.div>
          
          {/* Category */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category} 
              onValueChange={setCategory}
            >
              <SelectTrigger className={errors.category ? "border-finance-expense" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Income">Income</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-finance-expense">{errors.category}</p>}
          </motion.div>
          
          {/* Date */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </motion.div>
          
          {/* Payment Mode */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label>Payment Method</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={paymentMode === "cash" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => setPaymentMode("cash")}
              >
                <Wallet size={16} />
                Cash
              </Button>
              <Button
                type="button"
                variant={paymentMode === "bank" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => setPaymentMode("bank")}
              >
                <Landmark size={16} />
                Bank
              </Button>
              <Button
                type="button"
                variant={paymentMode === "card" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => setPaymentMode("card")}
              >
                <CreditCard size={16} />
                Card
              </Button>
            </div>
          </motion.div>
        </motion.div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? "Saving..." : "Save Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
