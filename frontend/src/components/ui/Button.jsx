import React from "react";

export function Button({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  size = "md", 
  disabled = false, 
  className = "" 
}) {
  const base = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm cursor-pointer";
  
  const sizes = { 
    sm: "px-3 py-1.5 text-xs font-semibold", 
    md: "px-4.5 py-2 text-sm font-semibold", 
    lg: "px-6 py-3 text-base font-semibold" 
  };
  
  const variants = {
    primary: "bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white focus:ring-sky-500 border border-transparent shadow-sky-100",
    secondary: "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 focus:ring-slate-300 shadow-sm",
    danger: "bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 border border-rose-100 focus:ring-rose-500",
    ghost: "bg-transparent hover:bg-slate-50 active:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent shadow-none",
    icon: "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 p-2 rounded-xl focus:ring-slate-300",
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
