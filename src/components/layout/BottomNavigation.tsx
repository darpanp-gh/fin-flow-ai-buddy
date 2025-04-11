
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  PieChart, 
  ArrowRightLeft, 
  Target, 
  Lightbulb
} from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const tabs = [
    { name: "Home", icon: <LayoutDashboard size={24} />, path: "/" },
    { name: "Budget", icon: <PieChart size={24} />, path: "/budget" },
    { name: "Transactions", icon: <ArrowRightLeft size={24} />, path: "/transactions" },
    { name: "Goals", icon: <Target size={24} />, path: "/goals" },
    { name: "AI Advisor", icon: <Lightbulb size={24} />, path: "/advisor" },
  ];

  const handleTabChange = (path: string) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            className={`flex flex-col items-center justify-center w-full h-full relative
              ${activeTab === tab.path ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => handleTabChange(tab.path)}
          >
            {activeTab === tab.path && (
              <motion.div
                className="absolute top-0 left-0 right-0 h-0.5 bg-primary"
                layoutId="indicator"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="mb-0.5">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
