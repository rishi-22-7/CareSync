import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { DOSAGE_SLOTS, getDosagePlaceholder } from "../constants";

// Icon SVGs
const IconClose = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const Chevron   = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;

function MedForm({ data, setData, imageFile, setImageFile, onSubmit, onCancel, submitLabel }) {
  const updateSlot = (key, field, value) => {
    setData(prev => ({
      ...prev,
      slots: {
        ...prev.slots,
        [key]: { ...prev.slots[key], [field]: value }
      }
    }));
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medicine Name</label>
        <input 
          type="text" 
          placeholder="e.g. Vitamin D3" 
          value={data.name}
          onChange={e => setData(prev => ({ ...prev, name: e.target.value }))} 
          required
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-sky-500 focus:bg-white placeholder-slate-400 transition-colors" 
        />
      </div>

      {/* Type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type</label>
        <div className="relative">
          <select 
            value={data.type} 
            onChange={e => setData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-sky-500 focus:bg-white transition-colors appearance-none cursor-pointer"
          >
            {["Pill", "Syrup", "Injection", "Capsule", "Drops", "Cream", "Patch", "Other"].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Chevron />
          </span>
        </div>
      </div>

      {/* Dosage Quantity */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dosage Quantity</label>
        <input 
          type="text" 
          placeholder={getDosagePlaceholder(data.type)} 
          value={data.dosage_quantity}
          onChange={e => setData(prev => ({ ...prev, dosage_quantity: e.target.value }))}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-sky-500 focus:bg-white placeholder-slate-400 transition-colors" 
        />
      </div>

      {/* Pill Image Dropzone */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pill Image</label>
        <label 
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
            imageFile || data.pill_image_url 
              ? "border-sky-300 bg-sky-50/30" 
              : "border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300"
          }`} 
          htmlFor="med-image-upload"
        >
          <input 
            id="med-image-upload" 
            type="file" 
            accept="image/*" 
            className="hidden"
            onChange={e => setImageFile(e.target.files[0] || null)} 
          />
          {imageFile ? (
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-sky-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-700 text-sm font-semibold truncate">{imageFile.name}</p>
                <p className="text-sky-500 text-xs font-bold mt-0.5">Ready to upload • Click to replace</p>
              </div>
            </div>
          ) : data.pill_image_url ? (
            <div className="flex items-center gap-3 w-full">
              <img 
                src={data.pill_image_url} 
                alt="Medication" 
                className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-slate-200 shadow-sm" 
              />
              <div className="min-w-0 flex-1">
                <p className="text-slate-700 text-sm font-semibold truncate">Existing medicine image</p>
                <p className="text-slate-400 text-xs font-medium mt-0.5">Click or drag new file to replace</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-slate-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              <span className="text-sm font-semibold text-slate-600">Browse image or drag here</span>
              <span className="text-[11px] text-slate-400 font-medium">Supports JPG, PNG, WebP</span>
            </div>
          )}
        </label>
        {(imageFile || data.pill_image_url) && (
          <button 
            type="button" 
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 active:text-rose-700 mt-1 self-start cursor-pointer transition-colors"
            onClick={e => { e.preventDefault(); setImageFile(null); if(data.pill_image_url) setData(prev=>({...prev, pill_image_url:""})); }}
          >
            ✕ Remove Image
          </button>
        )}
      </div>

      {/* Dosage Slots */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dosage Schedule</label>
        <div className="flex flex-col gap-2.5">
          {DOSAGE_SLOTS.map(slot => {
            const s = data.slots[slot.key];
            return (
              <div 
                key={slot.key}
                className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl border transition-all duration-200 ${
                  s.checked 
                    ? "border-sky-100 bg-sky-50/20 shadow-sm" 
                    : "border-slate-100 bg-slate-50/50"
                }`}
              >
                <label className="flex items-center cursor-pointer select-none">
                  <div className="relative flex items-center justify-center flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={s.checked}
                      onChange={e => updateSlot(slot.key, "checked", e.target.checked)}
                      className="appearance-none w-5 h-5 flex-shrink-0 border border-slate-300 rounded-lg bg-white checked:bg-sky-500 checked:border-sky-500 cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
                    />
                    {s.checked && (
                      <svg className="absolute pointer-events-none" width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-slate-700 font-semibold ml-3 text-sm flex items-center gap-1.5">
                    <span className="text-base">{slot.icon}</span> {slot.label}
                  </span>
                </label>
                
                {s.checked && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                  >
                    <input 
                      type="time" 
                      value={s.time} 
                      onChange={e => updateSlot(slot.key, "time", e.target.value)}
                      className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-sky-500" 
                    />
                    <select 
                      value={s.instruction} 
                      onChange={e => updateSlot(slot.key, "instruction", e.target.value)}
                      className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-sky-500 appearance-none pr-8 relative"
                    >
                      <option>Before Food</option>
                      <option>After Food</option>
                    </select>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-3 border-t border-slate-100">
        <Button type="submit" variant="primary" className="w-full">
          {submitLabel}
        </Button>
        <Button variant="secondary" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function MedModal({ title, data, setData, imageFile, setImageFile, onSubmit, onClose, submitLabel }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[200] p-4" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg shadow-xl shadow-slate-200/50 max-h-[90vh] flex flex-col overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-slate-800 font-bold text-base">{title}</h3>
          <Button variant="icon" onClick={onClose} className="rounded-full w-8 h-8 p-0">
            <IconClose />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto">
          <MedForm 
            data={data} 
            setData={setData} 
            imageFile={imageFile} 
            setImageFile={setImageFile}
            onSubmit={onSubmit} 
            onCancel={onClose} 
            submitLabel={submitLabel} 
          />
        </div>
      </motion.div>
    </div>
  );
}
