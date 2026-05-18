import React from "react";
import { motion } from "framer-motion";
import { Button } from "./Button";

export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl shadow-slate-950/40 transition-colors"
      >
        <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/40 rounded-full flex items-center justify-center text-xl text-rose-500 dark:text-rose-450 mx-auto mb-4 border border-rose-100/50 dark:border-rose-900/40">
          ⚠️
        </div>
        <h3 className="text-slate-800 dark:text-slate-100 font-semibold text-lg mb-2">Are you sure?</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onCancel} className="w-full dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} className="w-full bg-rose-500 hover:bg-rose-600 text-white border-transparent">
            Delete
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
