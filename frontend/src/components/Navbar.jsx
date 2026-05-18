import React from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function Navbar({ adminName, onLogout }) {
  const { theme, toggleTheme } = useTheme();

  const initials = adminName
    ? adminName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 border-b border-slate-100 dark:border-slate-800 shadow-sm backdrop-blur-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Brand */}
          <Link to="/dashboard" className="flex items-center">
            <img src="/caresync-logo.png" alt="CareSync" className="h-8.5 w-auto object-contain dark:brightness-110" />
          </Link>
        </div>
        
        <div className="flex items-center gap-4.5">
          {/* Shifting Theme Selector */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 cursor-pointer shadow-inner focus:outline-none flex items-center justify-center"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
            )}
          </button>

          {/* Profile pill */}
          <Link 
            to="/profile"
            className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-3.5 py-1.5 rounded-full shadow-inner hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-bold border border-sky-200/50 dark:border-sky-800/50">
              {initials}
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm max-w-[150px] truncate">
              {adminName || "Admin"}
            </span>
          </Link>

          <button 
            onClick={onLogout}
            className="px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-450 border border-rose-100/50 dark:border-rose-900/30 rounded-xl transition-all duration-200 cursor-pointer shadow-sm shadow-rose-100/10 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}
