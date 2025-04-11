
import { 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon,
  Utensils,
  Car,
  Film,
  ShoppingBag,
  Home,
  Wifi
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { BudgetWithSpent } from "@/hooks/useBudgets";

// Map for icon lookup
const iconMap: { [key: string]: React.ReactNode } = {
  "Utensils": <Utensils size={18} />,
  "Car": <Car size={18} />,
  "Film": <Film size={18} />,
  "ShoppingBag": <ShoppingBag size={18} />,
  "Home": <Home size={18} />,
  "Wifi": <Wifi size={18} />
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper for pie chart data preparation
const preparePieData = (budgets: BudgetWithSpent[]) => {
  return budgets.map(budget => ({
    name: budget.category,
    value: budget.spent,
    color: budget.color.replace('bg-', ''),
    iconName: budget.iconName
  }));
};

// Helper for bar chart data preparation
const prepareBarData = (budgets: BudgetWithSpent[]) => {
  return budgets.map(budget => ({
    name: budget.category,
    spent: budget.spent,
    limit: budget.limit,
    color: budget.color.replace('bg-', ''),
    iconName: budget.iconName
  }));
};

// Get color class
const getColorClass = (colorName: string) => {
  return colorName.startsWith('bg-') ? colorName : `bg-${colorName}`;
};

// Component properties
interface BudgetChartsProps {
  budgets: BudgetWithSpent[];
  activeTab: string;
}

// Extract real color from Tailwind class
const extractColor = (colorClass: string) => {
  const colorMap: Record<string, string> = {
    'violet-500': '#8B5CF6',
    'blue-500': '#3B82F6',
    'pink-500': '#EC4899',
    'emerald-500': '#10B981',
    'amber-500': '#F59E0B',
    'indigo-500': '#6366F1',
    'red-500': '#EF4444',
    'green-500': '#22C55E',
    'purple-500': '#A855F7',
    'yellow-500': '#EAB308',
    'orange-500': '#F97316',
    'cyan-500': '#06B6D4',
    'finance-income': '#4ade80',
    'finance-expense': '#f87171',
    'finance-budget': '#8b5cf6',
    'finance-alert': '#f59e0b',
  };
  
  const colorKey = colorClass.replace('bg-', '');
  return colorMap[colorKey] || '#888888';
};

const BudgetCharts = ({ budgets, activeTab }: BudgetChartsProps) => {
  // Prepare data for charts
  const pieData = preparePieData(budgets);
  const barData = prepareBarData(budgets);
  
  // Chart configuration
  const chartConfig = budgets.reduce((config, budget) => {
    const colorName = budget.color.replace('bg-', '');
    return {
      ...config,
      [budget.category]: {
        label: budget.category,
        color: extractColor(budget.color),
        icon: () => iconMap[budget.iconName] || null
      }
    };
  }, {});

  // Animation variants
  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (activeTab !== "overview") return null;

  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 mb-6"
    >
      {/* Pie Chart */}
      <Card className="p-4 rounded-xl card-shadow">
        <h3 className="text-lg font-semibold mb-3">Spending by Category</h3>
        <div className="h-[300px]">
          <ChartContainer className="h-full" config={chartConfig}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={extractColor(`bg-${entry.color}`)}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />}
              />
              <ChartLegend
                content={<ChartLegendContent className="flex-wrap justify-center" />}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </Card>

      {/* Bar Chart */}
      <Card className="p-4 rounded-xl card-shadow">
        <h3 className="text-lg font-semibold mb-3">Budget vs. Spending</h3>
        <div className="h-[300px]">
          <ChartContainer className="h-full" config={chartConfig}>
            <BarChart data={barData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />} 
              />
              <Bar 
                dataKey="limit" 
                name="Budget Limit" 
                fill="#94a3b8" 
                radius={[4, 4, 0, 0]}
                className="opacity-70"
                animationBegin={0}
                animationDuration={1500}
              />
              <Bar 
                dataKey="spent" 
                name="Amount Spent" 
                radius={[4, 4, 0, 0]}
                animationBegin={300}
                animationDuration={1500}
              >
                {barData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={extractColor(`bg-${entry.color}`)} 
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default BudgetCharts;
