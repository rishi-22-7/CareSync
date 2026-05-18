import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { patientService } from "../services/api";
import { Navbar } from "../components/Navbar";
import { PatientCard } from "../components/PatientCard";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Plus, X, ChevronDown, Search } from "lucide-react";

export function DashboardPage({ currentAdmin, onLogout }) {
  const navigate = useNavigate();
  
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  
  // Patient Creation Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", phone: "", preferred_language: "English" });
  const [submittingPatient, setSubmittingPatient] = useState(false);

  // Search state for premium search experience
  const [searchTerm, setSearchTerm] = useState("");

  // Patient editing state (inline from the card triggers)
  const [editingPatient, setEditingPatient] = useState(null);
  
  // Confirmation state
  const [confirm, setConfirm] = useState(null);

  const fetchPatients = async () => {
    if (!currentAdmin) return;
    try {
      const data = await patientService.getPatients(currentAdmin.admin_id);
      setPatients(data);
      setLastSync(new Date().toLocaleTimeString());
    } catch (err) {
      toast.error("Failed to sync patients list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [currentAdmin]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setSubmittingPatient(true);
    const loadingToast = toast.loading("Adding ward...");
    
    try {
      await patientService.createPatient({
        caretaker_id: currentAdmin.admin_id,
        name: newPatient.name,
        whatsapp_number: `whatsapp:+91${newPatient.phone}`,
        preferred_language: newPatient.preferred_language,
      });
      
      toast.success(`${newPatient.name} successfully registered!`, { id: loadingToast });
      setNewPatient({ name: "", phone: "", preferred_language: "English" });
      setShowAddForm(false);
      fetchPatients();
    } catch (err) {
      toast.error("Could not register ward profile.", { id: loadingToast });
    } finally {
      setSubmittingPatient(false);
    }
  };

  const handleStartEditPatient = (patient) => {
    // Format patient phone to standard 10-digits for editing
    const cleanPhone = patient.whatsapp_number.replace(/\D/g, "").slice(-10);
    setEditingPatient({
      id: patient.id,
      name: patient.name,
      phone: cleanPhone,
      preferred_language: patient.preferred_language
    });
  };

  const handleSavePatientEdit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Saving changes...");
    try {
      await patientService.updatePatient(editingPatient.id, {
        whatsapp_number: `whatsapp:+91${editingPatient.phone}`,
        preferred_language: editingPatient.preferred_language,
      });
      toast.success("Profile updated successfully!", { id: loadingToast });
      setEditingPatient(null);
      fetchPatients();
    } catch (err) {
      toast.error("Failed to update profile.", { id: loadingToast });
    }
  };

  const handleDeletePatient = (id) => {
    setConfirm({
      message: "Are you sure you want to delete this patient profile and all scheduled medication reminders? This action is irreversible.",
      onConfirm: async () => {
        setConfirm(null);
        const loadingToast = toast.loading("Deleting patient profile...");
        try {
          await patientService.deletePatient(id);
          toast.success("Patient profile permanently deleted.", { id: loadingToast });
          fetchPatients();
        } catch (err) {
          toast.error("Failed to delete patient.", { id: loadingToast });
        }
      }
    });
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.whatsapp_number.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar adminName={currentAdmin?.name} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-6 py-10 flex-1 w-full">
        {/* Header Summary */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-slate-800 dark:text-slate-100 text-3xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold mt-1">
              Active wards medication logs and triggers • Sync:{" "}
              {lastSync ? (
                <span className="text-sky-500 font-bold">{lastSync}</span>
              ) : (
                <span className="text-slate-400 dark:text-slate-600 font-bold">connecting...</span>
              )}
            </p>
          </div>
          
          <Button 
            variant={showAddForm ? "secondary" : "primary"}
            onClick={() => setShowAddForm(!showAddForm)}
            className="shadow-md"
          >
            {showAddForm ? (
              <><X className="w-4 h-4" /> Close</>
            ) : (
              <><Plus className="w-4 h-4" /> Add New Ward</>
            )}
          </Button>
        </div>

        {/* Dynamic Patient Form Slideout */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 mb-8 shadow-sm overflow-hidden transition-colors"
            >
              <h2 className="text-slate-800 dark:text-slate-200 font-bold text-base mb-4">Register New Ward</h2>
              <form className="grid grid-cols-1 md:grid-cols-3 gap-5" onSubmit={handleAddPatient}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ward Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Grandma Sharma" 
                    value={newPatient.name}
                    onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} 
                    required
                    className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm outline-none focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-colors" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">WhatsApp Phone (10 digits)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 font-bold text-sm select-none">+91</span>
                    <input 
                      type="tel" 
                      pattern="[0-9]{10}"
                      maxLength="10"
                      placeholder="e.g. 9876543210" 
                      value={newPatient.phone}
                      onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })} 
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm outline-none focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-colors" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Preferred Language</label>
                  <div className="relative">
                    <select 
                      value={newPatient.preferred_language} 
                      onChange={e => setNewPatient({ ...newPatient, preferred_language: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm outline-none focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-colors appearance-none cursor-pointer pr-10"
                    >
                      {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam"].map(l => (
                        <option key={l} value={l} className="dark:bg-slate-900 dark:text-slate-200">{l}</option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                  <Button type="submit" variant="primary" disabled={submittingPatient}>
                    Register Profile
                  </Button>
                  <Button variant="secondary" onClick={() => setShowAddForm(false)} className="dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Edit Dialog Modal */}
        <AnimatePresence>
          {editingPatient && (
            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4" onClick={() => setEditingPatient(null)}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-slate-800 dark:text-slate-100 font-bold text-lg mb-4">Edit Info for {editingPatient.name}</h3>
                <form onSubmit={handleSavePatientEdit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone (10 digits)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-400 font-bold text-sm">+91</span>
                      <input 
                        type="tel"
                        pattern="[0-9]{10}"
                        maxLength="10"
                        value={editingPatient.phone}
                        onChange={e => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm outline-none focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Language</label>
                    <div className="relative">
                      <select 
                        value={editingPatient.preferred_language}
                        onChange={e => setEditingPatient({ ...editingPatient, preferred_language: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm outline-none focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-colors appearance-none cursor-pointer pr-10"
                      >
                        {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam"].map(l => (
                          <option key={l} value={l} className="dark:bg-slate-900 dark:text-slate-200">{l}</option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" variant="primary" className="w-full">
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={() => setEditingPatient(null)} className="w-full dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Search Bar filter */}
        {patients.length > 0 && (
          <div className="mb-6 relative flex items-center">
            <Search className="absolute left-4 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search ward by name or phone..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-200 outline-none focus:border-sky-300 placeholder-slate-400 dark:placeholder-slate-550 shadow-sm transition-colors"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-4 text-slate-400 hover:text-slate-650 font-bold text-xs flex items-center gap-1 cursor-pointer select-none"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col gap-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-slate-100 rounded-2xl" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-4 bg-slate-100 rounded-md w-24" />
                    <div className="h-3 bg-slate-100 rounded-md w-12" />
                  </div>
                </div>
                <div className="h-0.5 bg-slate-50 w-full pt-1" />
                <div className="flex flex-col gap-2">
                  <div className="h-3.5 bg-slate-100 rounded-md w-32" />
                  <div className="h-3.5 bg-slate-100 rounded-md w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPatients.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {filteredPatients.map(patient => (
              <PatientCard 
                key={patient.id} 
                patient={patient}
                onManage={(p) => navigate(`/patient/${p.id}`)}
                onEdit={handleStartEditPatient}
                onDelete={handleDeletePatient}
              />
            ))}
          </motion.div>
        ) : (
          <EmptyState 
            message={searchTerm ? "No matching wards found" : "No patient profiles created yet"} 
            subMessage={
              searchTerm 
                ? "Try searching another query terms"
                : "Create your first patient profile to begin scheduling twilio automated whatsapp triggers."
            } 
            icon="🧑‍⚕️"
          />
        )}
      </main>

      {/* Confirmation notices */}
      <AnimatePresence>
        {confirm && (
          <ConfirmDialog 
            message={confirm.message} 
            onConfirm={confirm.onConfirm} 
            onCancel={() => setConfirm(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
