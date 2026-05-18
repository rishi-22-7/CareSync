import React from "react";
import { motion } from "framer-motion";
import { Button } from "./Button";

export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[200] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white border border-slate-100 rounded-3xl p-6 max-w-sm w-full text-center shadow-xl shadow-slate-200/50"
      >
        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-xl text-rose-500 mx-auto mb-4">
          ⚠️
        </div>
        <h3 className="text-slate-800 font-semibold text-lg mb-2">Are you sure?</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onCancel} className="w-full">
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
