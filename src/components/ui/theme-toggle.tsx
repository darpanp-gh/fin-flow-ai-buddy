
import { motion } from "framer-motion";
import { Moon, Sun, Stars } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
      aria-label="Toggle Theme"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 0 : 180,
          scale: [1, 0.8, 1]
        }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 200
        }}
        className="relative w-6 h-6 flex items-center justify-center"
      >
        {/* Sun rays for light theme */}
        {theme === 'light' && (
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "linear",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div 
                key={i}
                className="absolute w-0.5 h-1.5 bg-amber-500/70"
                style={{ 
                  left: '50%', 
                  top: '-1px',
                  transformOrigin: 'bottom center',
                  transform: `translateX(-50%) rotate(${i * 45}deg)`,
                }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "0.375rem" }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              />
            ))}
          </motion.div>
        )}
        
        {/* Main icon */}
        <motion.div
          layout
          className="relative z-10 flex items-center justify-center"
          initial={false}
          animate={{
            scale: [0.8, 1],
            opacity: [0.5, 1]
          }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'dark' ? (
            <Moon size={20} className="text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.3)]" />
          ) : (
            <Sun size={20} className="text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
          )}
        </motion.div>
        
        {/* Stars for dark theme */}
        {theme === 'dark' && (
          <>
            {[...Array(10)].map((_, i) => {
              const size = Math.random() * 2 + 1;
              const top = Math.random() * 200 - 100;
              const left = Math.random() * 200 - 100;
              const delay = Math.random() * 0.5;
              
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0.5, 1], 
                    scale: 1 
                  }}
                  transition={{ 
                    delay: delay,
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute w-1 h-1 rounded-full bg-yellow-200"
                  style={{ 
                    width: `${size}px`, 
                    height: `${size}px`,
                    top: `${top}%`,
                    left: `${left}%`,
                    filter: "blur(0.5px)"
                  }}
                />
              );
            })}
          </>
        )}
        
        {/* Circle backdrop that grows/shrinks on theme change */}
        <motion.div
          className="absolute rounded-full z-0"
          initial={false}
          animate={{ 
            scale: theme === 'dark' ? 12 : 0,
            backgroundColor: theme === 'dark' ? "rgba(30, 41, 59, 0.4)" : "rgba(254, 240, 138, 0.4)"
          }}
          transition={{ duration: 0.5 }}
          style={{
            width: "5px",
            height: "5px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(0)"
          }}
        />
      </motion.div>
    </motion.button>
  );
}
