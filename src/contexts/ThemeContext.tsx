
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    // Check if user prefers dark theme
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Return saved theme if it exists, otherwise use system preference
    return savedTheme || (prefersDark ? "dark" : "light");
  });

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem("theme", theme);
    
    // Update document class for Tailwind dark mode
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    // Add a body class during the theme transition for animations
    document.body.classList.add('theme-switching');
    
    // Delay the theme change slightly to allow for animations
    setTimeout(() => {
      setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
      
      // Remove the class after transition is complete
      setTimeout(() => {
        document.body.classList.remove('theme-switching');
      }, 500);
    }, 50);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
