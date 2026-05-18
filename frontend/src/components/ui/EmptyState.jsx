import React from "react";
import { motion } from "framer-motion";

export function EmptyState({ message, subMessage, icon = "📋" }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-slate-200 rounded-3xl text-center shadow-sm"
    >
      <div className="text-4xl mb-4 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner">
        {icon}
      </div>
      <h3 className="text-slate-800 font-semibold text-base">{message}</h3>
      {subMessage && <p className="text-slate-500 text-sm mt-2 max-w-sm leading-relaxed">{subMessage}</p>}
    </motion.div>
  );
}
