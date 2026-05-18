import React from "react";
import { Pencil, Trash2, Phone, Globe } from "lucide-react";
import { Button } from "./ui/Button";
import { formatPhone } from "../constants";

export function PatientCard({ patient, onManage, onEdit, onDelete }) {
  const initials = patient.name
    ? patient.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "P";
  const phone = formatPhone(patient.whatsapp_number);

  return (
    <div 
      className="flex flex-col gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl hover:border-sky-100 dark:hover:border-sky-900 hover:shadow-md dark:hover:shadow-slate-950/40 transition-all duration-300 cursor-pointer group relative overflow-hidden"
      onClick={() => onManage(patient)}
    >
      {/* Decorative Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-300 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sm font-bold text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50 shadow-sm flex-shrink-0">
            {initials}
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-slate-200 font-bold text-base leading-tight group-hover:text-sky-600 transition-colors">
              {patient.name}
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mt-1">ID #{patient.id}</p>
          </div>
        </div>
        
        {/* Quick action buttons */}
        <div 
          className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
          onClick={e => e.stopPropagation()}
        >
          <Button variant="icon" size="sm" onClick={() => onEdit(patient)} className="dark:bg-slate-950 dark:border-slate-850">
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button variant="icon" size="sm" onClick={() => onDelete(patient.id)} className="hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-100 dark:hover:border-rose-900 dark:bg-slate-950 dark:border-slate-850">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3.5 border-t border-slate-50 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm">
          <div className="text-slate-400 dark:text-slate-550 flex-shrink-0"><Phone className="w-3.5 h-3.5" /></div>
          <span className="font-medium">+91 {phone}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm">
          <div className="text-slate-400 dark:text-slate-550 flex-shrink-0"><Globe className="w-3.5 h-3.5" /></div>
          <span className="font-medium">{patient.preferred_language}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 mt-1">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100/50 dark:border-sky-900/30">
          {patient.preferred_language}
        </span>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-sky-500 transition-colors flex items-center gap-1">
          Manage <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
        </span>
      </div>
    </div>
  );
}
