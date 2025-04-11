
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

const AppHeader = ({ title = "Hello, Alex", subtitle = "Welcome to your finances" }: AppHeaderProps) => {
  return (
    <motion.div 
      className="flex items-center justify-between mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <div className="relative">
          <Bell size={24} className="text-foreground" />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-finance-alert"></span>
        </div>
      </div>
    </motion.div>
  );
};

export default AppHeader;
