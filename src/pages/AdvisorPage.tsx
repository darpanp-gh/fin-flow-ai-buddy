
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Lightbulb, Send, TrendingUp, BadgeDollarSign, PiggyBank, Zap } from "lucide-react";

// Mock AI insights
const mockInsights = [
  {
    id: 1,
    title: "Spending Pattern Analysis",
    description: "Your weekend spending has increased by 30% this month. Consider creating a separate weekend budget to manage these expenses better.",
    icon: <TrendingUp size={18} />
  },
  {
    id: 2,
    title: "Savings Opportunity",
    description: "Based on your consistent income, you could potentially save an additional $250 per month by reducing dining out expenses.",
    icon: <PiggyBank size={18} />
  },
  {
    id: 3,
    title: "Subscription Alert",
    description: "You have 5 active subscriptions totaling $63.45 monthly. You haven't used 2 of them in the past 30 days.",
    icon: <BadgeDollarSign size={18} />
  }
];

// Mock chat messages
const initialMessages = [
  {
    id: 1,
    sender: "ai",
    content: "Hi there! I'm your personal finance AI advisor. How can I help you manage your money better today?",
    timestamp: new Date(Date.now() - 60000)
  }
];

const AdvisorPage = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
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

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response;
      
      if (inputMessage.toLowerCase().includes("budget") || inputMessage.toLowerCase().includes("spending")) {
        response = "Based on your spending patterns, I recommend allocating 50% of your income to necessities, 30% to discretionary spending, and 20% to savings. Your current allocation is 60% to necessities, 35% to discretionary, and only 5% to savings.";
      } else if (inputMessage.toLowerCase().includes("save") || inputMessage.toLowerCase().includes("saving")) {
        response = "I see potential to increase your savings by $320 monthly. Your subscription services cost $95/month, and your dining out expenses are $430/month, which is 40% higher than average for your income level.";
      } else if (inputMessage.toLowerCase().includes("invest") || inputMessage.toLowerCase().includes("investment")) {
        response = "Based on your risk profile and financial goals, consider a portfolio with 60% index funds, 30% bonds, and 10% individual stocks. Start with automatic monthly investments of $200 to build the habit.";
      } else {
        response = "Thanks for your message. To provide specific financial advice, I'd need to know more about your budget, spending patterns, or financial goals. Could you provide more details about what you're looking to achieve?";
      }
      
      const aiMessage = {
        id: messages.length + 2,
        sender: "ai",
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <MobileLayout>
      <motion.div
        initial="initial"
        animate="in"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.3 }}
        className="px-4 pt-6 pb-4 flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="p-2 rounded-lg bg-primary/10 mr-3">
            <Lightbulb size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Finance AI Advisor</h1>
            <p className="text-muted-foreground">Personalized insights for your finances</p>
          </div>
        </div>
        
        {/* AI Insights */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Smart Insights</h3>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {mockInsights.map((insight) => (
              <motion.div
                key={insight.id}
                variants={itemVariants}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-4 rounded-xl card-shadow">
                  <div className="flex">
                    <div className="p-2 bg-primary/10 rounded-lg mr-3 h-min">
                      {insight.icon}
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Chat Section */}
        <div className="bg-card rounded-t-xl flex-grow overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Ask Your Financial Assistant</h3>
          </div>
          
          <div 
            id="chat-container"
            className="flex-grow overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`
                    max-w-[80%] rounded-2xl p-3 
                    ${message.sender === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground"
                    }
                  `}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`
                    text-xs mt-1 
                    ${message.sender === "user" 
                      ? "text-primary-foreground/70" 
                      : "text-muted-foreground"
                    }
                  `}>
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-2xl p-3 max-w-[80%]">
                  <div className="flex space-x-1">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-muted-foreground"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-muted-foreground"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-muted-foreground"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t bg-background">
            <div className="flex">
              <Input
                placeholder="Ask about your finances..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="rounded-l-xl"
              />
              <Button 
                variant="default" 
                onClick={handleSendMessage}
                className="rounded-r-xl"
                disabled={!inputMessage.trim()}
              >
                <Send size={18} />
              </Button>
            </div>
            <div className="flex justify-center mt-2">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Zap size={12} />
                <span>Powered by FinFlow AI</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </MobileLayout>
  );
};

export default AdvisorPage;
