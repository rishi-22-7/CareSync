import React from "react";
import { motion } from "framer-motion";
import { 
  X, 
  Check, 
  UploadCloud, 
  Trash2, 
  Sunrise, 
  Sun, 
  Sunset, 
  Moon, 
  ChevronDown 
} from "lucide-react";
import { Button } from "./ui/Button";
import { DOSAGE_SLOTS, getDosagePlaceholder } from "../constants";

// Helper to resolve slot icons to gorgeous Lucide icons dynamically
const getSlotIcon = (key) => {
  switch (key) {
    case "pre_breakfast":
      return <Sunrise className="w-4 h-4 text-amber-500" />;
    case "morning":
      return <Sun className="w-4 h-4 text-yellow-500" />;
    case "afternoon":
      return <Sunset className="w-4 h-4 text-orange-500" />;
    case "night":
      return <Moon className="w-4 h-4 text-indigo-500" />;
    default:
      return <Sun className="w-4 h-4 text-slate-500" />;
  }
};

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
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      
      {/* Side-by-Side Spacious Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Basic Details & Media */}
        <div className="flex flex-col gap-5">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-4">
            <h4 className="text-slate-700 font-extrabold text-xs uppercase tracking-wider mb-1">General Info</h4>
            
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Medicine Name</label>
              <input 
                type="text" 
                placeholder="e.g. Vitamin D3" 
                value={data.name}
                onChange={e => setData(prev => ({ ...prev, name: e.target.value }))} 
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-sky-500 placeholder-slate-400 transition-colors" 
              />
            </div>

            {/* Type & Dosage Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</label>
                <div className="relative">
                  <select 
                    value={data.type} 
                    onChange={e => setData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-sky-500 transition-colors appearance-none cursor-pointer pr-10"
                  >
                    {["Pill", "Syrup", "Injection", "Capsule", "Drops", "Cream", "Patch", "Other"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Dosage Quantity */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dosage Quantity</label>
                <input 
                  type="text" 
                  placeholder={getDosagePlaceholder(data.type)} 
                  value={data.dosage_quantity}
                  onChange={e => setData(prev => ({ ...prev, dosage_quantity: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-sky-500 placeholder-slate-400 transition-colors" 
                />
              </div>
            </div>
          </div>

          {/* Pill Image Dropzone */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-3">
            <h4 className="text-slate-700 font-extrabold text-xs uppercase tracking-wider">Visual Identification</h4>
            
            <label 
              className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 bg-white ${
                imageFile || data.pill_image_url 
                  ? "border-sky-300 bg-sky-50/10" 
                  : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
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
                  <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center flex-shrink-0 shadow-sm shadow-sky-200">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-700 text-xs font-semibold truncate">{imageFile.name}</p>
                    <p className="text-sky-500 text-[10px] font-bold mt-0.5">Click to replace image</p>
                  </div>
                </div>
              ) : data.pill_image_url ? (
                <div className="flex items-center gap-3 w-full">
                  <img 
                    src={data.pill_image_url} 
                    alt="Medication" 
                    className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-slate-200 shadow-sm" 
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-700 text-xs font-semibold truncate">Existing medicine image</p>
                    <p className="text-slate-400 text-[10px] font-medium mt-0.5">Drag a file here to replace</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-500">
                  <UploadCloud className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">Browse image or drag here</span>
                  <span className="text-[10px] text-slate-400 font-semibold">JPG, PNG, WebP</span>
                </div>
              )}
            </label>
            
            {(imageFile || data.pill_image_url) && (
              <button 
                type="button" 
                className="flex items-center gap-1 text-[11px] font-extrabold text-rose-500 hover:text-rose-600 active:text-rose-700 self-start cursor-pointer transition-colors"
                onClick={e => { e.preventDefault(); setImageFile(null); if(data.pill_image_url) setData(prev=>({...prev, pill_image_url:""})); }}
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Image
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Dosage Schedule slots */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-4">
          <h4 className="text-slate-700 font-extrabold text-xs uppercase tracking-wider">Dosage Schedule & Reminders</h4>
          
          <div className="flex flex-col gap-3">
            {DOSAGE_SLOTS.map(slot => {
              const s = data.slots[slot.key];
              return (
                <div 
                  key={slot.key}
                  className={`flex flex-col gap-3 p-3.5 rounded-xl border transition-all duration-200 bg-white ${
                    s.checked 
                      ? "border-sky-100 bg-sky-50/15 shadow-sm" 
                      : "border-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer select-none">
                      <div className="relative flex items-center justify-center flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={s.checked}
                          onChange={e => updateSlot(slot.key, "checked", e.target.checked)}
                          className="appearance-none w-5 h-5 flex-shrink-0 border border-slate-300 rounded-lg bg-white checked:bg-sky-500 checked:border-sky-500 cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-sky-500"
                        />
                        {s.checked && (
                          <Check className="absolute pointer-events-none w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      <span className="text-slate-700 font-bold ml-3 text-xs flex items-center gap-2">
                        {getSlotIcon(slot.key)} {slot.label}
                      </span>
                    </label>
                  </div>
                  
                  {s.checked && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-center gap-2.5 pt-1.5 border-t border-slate-50 mt-1"
                    >
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Trigger Time</span>
                        <input 
                          type="time" 
                          value={s.time} 
                          onChange={e => updateSlot(slot.key, "time", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 outline-none cursor-pointer focus:border-sky-500" 
                        />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Instruction</span>
                        <div className="relative">
                          <select 
                            value={s.instruction} 
                            onChange={e => updateSlot(slot.key, "instruction", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 outline-none cursor-pointer focus:border-sky-500 appearance-none pr-8"
                          >
                            <option>Before Food</option>
                            <option>After Food</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Action Buttons Row */}
      <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
        <Button variant="secondary" onClick={onCancel} className="px-6 py-2.5">
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="px-8 py-2.5">
          {submitLabel}
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
        className="bg-white border border-slate-100 rounded-3xl w-full max-w-4xl shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header container */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-slate-800 font-extrabold text-sm uppercase tracking-wider">{title}</h3>
          <Button variant="icon" onClick={onClose} className="rounded-full w-8 h-8 p-0">
            <X className="w-4 h-4 text-slate-500" />
          </Button>
        </div>
        
        {/* Content container - wide layout has no overflow scrollbar on standard screens */}
        <div className="p-6 overflow-y-auto max-h-[85vh]">
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
