import React from "react";
import { motion } from "framer-motion";

export function EmptyState({ message, subMessage, icon = "📋" }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center shadow-sm dark:shadow-slate-950/20"
    >
      <div className="text-4xl mb-4 bg-slate-50 dark:bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-850 shadow-inner">
        {icon}
      </div>
      <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-base">{message}</h3>
      {subMessage && <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm leading-relaxed">{subMessage}</p>}
    </motion.div>
  );
}
