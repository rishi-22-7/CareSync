import React from "react";
import { Button } from "./ui/Button";
import { formatPhone } from "../constants";

// Icon SVGs
const IconPencil = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const IconTrash  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconPhone  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.39 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.94-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconGlobe  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;

export function PatientCard({ patient, onManage, onEdit, onDelete }) {
  const initials = patient.name
    ? patient.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "P";
  const phone = formatPhone(patient.whatsapp_number);

  return (
    <div 
      className="flex flex-col gap-4 p-6 bg-white border border-slate-100 rounded-3xl hover:border-sky-100 hover:shadow-md hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
      onClick={() => onManage(patient)}
    >
      {/* Decorative Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-300 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 flex items-center justify-center text-sm font-bold text-sky-600 border border-sky-100 shadow-sm flex-shrink-0">
            {initials}
          </div>
          <div>
            <h3 className="text-slate-800 font-bold text-base leading-tight group-hover:text-sky-600 transition-colors">
              {patient.name}
            </h3>
            <p className="text-slate-400 text-xs font-medium mt-1">ID #{patient.id}</p>
          </div>
        </div>
        
        {/* Quick action buttons */}
        <div 
          className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
          onClick={e => e.stopPropagation()}
        >
          <Button variant="icon" size="sm" onClick={() => onEdit(patient)}>
            <IconPencil />
          </Button>
          <Button variant="icon" size="sm" onClick={() => onDelete(patient.id)} className="hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100">
            <IconTrash />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3.5 border-t border-slate-50">
        <div className="flex items-center gap-2.5 text-slate-500 text-sm">
          <div className="text-slate-400 flex-shrink-0"><IconPhone /></div>
          <span className="font-medium">+91 {phone}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-500 text-sm">
          <div className="text-slate-400 flex-shrink-0"><IconGlobe /></div>
          <span className="font-medium">{patient.preferred_language}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 mt-1">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-600 border border-sky-100/50">
          {patient.preferred_language}
        </span>
        <span className="text-xs font-semibold text-slate-400 group-hover:text-sky-500 transition-colors flex items-center gap-1">
          Manage <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
        </span>
      </div>
    </div>
  );
}
