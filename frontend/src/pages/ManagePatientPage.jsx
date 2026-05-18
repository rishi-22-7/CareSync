import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { patientService, medicationService } from "../services/api";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { MedModal } from "../components/MedModal";
import { DOSAGE_SLOTS, makeInitialMedForm, formatPhone } from "../constants";

// SVGs
const IconBack   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconPencil = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const IconTrash  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconPhone  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.39 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.94-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconGlobe  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IconPlus   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Chevron    = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;

export function ManagePatientPage({ currentAdmin, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit patient details state (header info card)
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [patientEdit, setPatientEdit] = useState({ phone: "", preferred_language: "English" });

  // Add Medication form states
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [newMed, setNewMed] = useState(makeInitialMedForm());
  const [newMedImageFile, setNewMedImageFile] = useState(null);

  // Edit Medication form states
  const [editMedModal, setEditMedModal] = useState(false);
  const [editingMedId, setEditingMedId] = useState(null);
  const [editMed, setEditMed] = useState(makeInitialMedForm());
  const [editMedImageFile, setEditMedImageFile] = useState(null);

  // ConfirmDialog states
  const [confirm, setConfirm] = useState(null);

  const fetchPatientDetails = async () => {
    if (!currentAdmin) return;
    try {
      // Find patient from caretaker list
      const patientsList = await patientService.getPatients(currentAdmin.admin_id);
      const activePatient = patientsList.find(p => p.id === parseInt(id));
      if (!activePatient) {
        toast.error("Ward profile not found.");
        navigate("/dashboard");
        return;
      }
      setPatient(activePatient);
      
      // Fetch related medications
      const medsList = await medicationService.getMedications(activePatient.id);
      setMedications(medsList);
    } catch (err) {
      toast.error("Error retrieving ward information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [id, currentAdmin]);

  const handleStartEditPatient = () => {
    setPatientEdit({
      phone: formatPhone(patient.whatsapp_number),
      preferred_language: patient.preferred_language,
    });
    setIsEditingPatient(true);
  };

  const handleSavePatientEdit = async () => {
    const loadingToast = toast.loading("Saving updates...");
    try {
      const data = await patientService.updatePatient(patient.id, {
        whatsapp_number: `whatsapp:+91${patientEdit.phone}`,
        preferred_language: patientEdit.preferred_language,
      });
      setPatient(data.patient);
      setIsEditingPatient(false);
      toast.success("Profile saved successfully!", { id: loadingToast });
      fetchPatientDetails();
    } catch (err) {
      toast.error("Could not update profile info.", { id: loadingToast });
    }
  };

  const handleDeletePatient = () => {
    setConfirm({
      message: `Permanently delete ${patient.name} and all medication logs? This cannot be undone.`,
      onConfirm: async () => {
        setConfirm(null);
        const loadingToast = toast.loading("Deleting patient profile...");
        try {
          await patientService.deletePatient(patient.id);
          toast.success("Patient successfully removed.", { id: loadingToast });
          navigate("/dashboard");
        } catch (err) {
          toast.error("Failed to delete patient profile.", { id: loadingToast });
        }
      }
    });
  };

  // Medication actions
  const uploadImageIfNeeded = async (file, existingUrl) => {
    if (!file) return existingUrl || null;
    return await medicationService.uploadImage(file);
  };

  const buildSchedules = (slots) => {
    return DOSAGE_SLOTS.filter(s => slots[s.key].checked).map(s => ({
      label: s.label, 
      time: slots[s.key].time, 
      instruction: slots[s.key].instruction,
    }));
  };

  const handleAddMed = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Adding scheduled medicine...");
    
    try {
      const pill_image_url = await uploadImageIfNeeded(newMedImageFile, null);
      await medicationService.createMedication({
        patient_id: patient.id,
        name: newMed.name,
        type: newMed.type,
        pill_image_url,
        dosage_quantity: newMed.dosage_quantity || null,
        schedules: buildSchedules(newMed.slots)
      });
      
      toast.success(`${newMed.name} successfully scheduled!`, { id: loadingToast });
      setNewMed(makeInitialMedForm());
      setNewMedImageFile(null);
      setShowAddMedModal(false);
      fetchPatientDetails();
    } catch (err) {
      toast.error("Failed to schedule medication.", { id: loadingToast });
    }
  };

  const formatTimeToHHmm = (timeStr) => {
    if (!timeStr) return "09:00";
    if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
      const [h, m] = timeStr.split(":");
      return `${String(h).padStart(2, "0")}:${m}`;
    }
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match) {
      let [, hours, minutes, period] = match;
      hours = parseInt(hours, 10);
      if (period) {
        const isPM = period.toUpperCase() === "PM";
        if (isPM && hours !== 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;
      }
      return `${String(hours).padStart(2, "0")}:${minutes}`;
    }
    return "09:00";
  };

  const startEditMed = (med) => {
    const keys = ["pre_breakfast", "morning", "afternoon", "night"];
    const bits = (med.quantity || "0-0-0-0").split("-");
    
    const scheduleMap = {};
    if (med.schedules && Array.isArray(med.schedules)) {
      med.schedules.forEach(schedule => {
        scheduleMap[schedule.label || ""] = schedule;
      });
    }
    
    const slots = {};
    keys.forEach((k, i) => {
      const slotLabel = DOSAGE_SLOTS[i].label;
      const savedSchedule = scheduleMap[slotLabel];
      
      slots[k] = {
        checked: bits[i] === "1",
        time: savedSchedule ? formatTimeToHHmm(savedSchedule.time) : DOSAGE_SLOTS[i].defaultTime,
        instruction: savedSchedule?.instruction || med.instruction || "After Food"
      };
    });
    
    setEditMed({
      name: med.name,
      type: med.type,
      pill_image_url: med.pill_image_url || "",
      dosage_quantity: med.dosage_quantity || "",
      slots
    });
    setEditingMedId(med.id);
    if (med.pill_image_url) setEditMedImageFile(null);
    setEditMedModal(true);
  };

  const saveEditMed = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating scheduled medicine...");
    
    try {
      const pill_image_url = await uploadImageIfNeeded(editMedImageFile, editMed.pill_image_url);
      await medicationService.updateMedication(editingMedId, {
        name: editMed.name,
        type: editMed.type,
        pill_image_url,
        dosage_quantity: editMed.dosage_quantity || null,
        schedules: buildSchedules(editMed.slots)
      });
      
      toast.success("Medication updated successfully!", { id: loadingToast });
      setEditMedModal(false);
      setEditingMedId(null);
      setEditMedImageFile(null);
      fetchPatientDetails();
    } catch (err) {
      toast.error("Failed to update medication.", { id: loadingToast });
    }
  };

  const handleDeleteMed = (id) => {
    setConfirm({
      message: "Are you sure you want to remove this medication and delete all scheduled whatsapp reminder tasks?",
      onConfirm: async () => {
        setConfirm(null);
        const loadingToast = toast.loading("Removing scheduled medication...");
        try {
          await medicationService.deleteMedication(id);
          toast.success("Medication successfully removed.", { id: loadingToast });
          fetchPatientDetails();
        } catch (err) {
          toast.error("Failed to remove medication.", { id: loadingToast });
        }
      }
    });
  };

  const parseQuantity = (q = "") => {
    const slot_order = ["Pre-Breakfast", "Morning", "Afternoon", "Night"];
    const bits = q.split("-");
    const active = slot_order.filter((_, i) => bits[i] === "1");
    return active.length ? active.join(" · ") : "None";
  };

  const initials = patient?.name
    ? patient.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "P";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar adminName={currentAdmin?.name} onLogout={onLogout} />

      <main className="max-w-4xl mx-auto px-6 py-10 flex-1 w-full">
        {/* Back */}
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => navigate("/dashboard")}
          className="mb-8"
        >
          <IconBack /> Back to Dashboard
        </Button>

        {/* Patient Profile Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 mb-8 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-xl font-bold text-sky-600 border border-sky-100">
                {initials}
              </div>
              <div>
                <h1 className="text-slate-800 text-2xl font-extrabold tracking-tight">{patient.name}</h1>
                <p className="text-slate-400 text-sm font-semibold mt-1">Ward Profile ID #{patient.id}</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <Button variant="secondary" size="sm" onClick={handleStartEditPatient}>
                <IconPencil /> Edit Info
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeletePatient}>
                <IconTrash /> Delete Profile
              </Button>
            </div>
          </div>

          {/* Inline Edit Form toggle */}
          {isEditingPatient ? (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp Phone (10 digits)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 font-bold text-sm">+91</span>
                  <input 
                    type="tel"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    value={patientEdit.phone}
                    onChange={e => setPatientEdit({ ...patientEdit, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-sky-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Language</label>
                <div className="relative">
                  <select 
                    value={patientEdit.preferred_language} 
                    onChange={e => setPatientEdit({ ...patientEdit, preferred_language: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-sky-500 focus:bg-white transition-colors appearance-none cursor-pointer pr-10"
                  >
                    {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam"].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Chevron />
                  </span>
                </div>
              </div>
              <div className="md:col-span-2 flex gap-3 mt-1">
                <Button variant="primary" size="sm" onClick={handleSavePatientEdit}>
                  Save Changes
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setIsEditingPatient(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">WhatsApp Phone</span>
                <span className="flex items-center gap-2 text-slate-700 text-sm font-semibold mt-1">
                  <IconPhone /> +91 {formatPhone(patient.whatsapp_number)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Preferred Language</span>
                <span className="flex items-center gap-2 text-slate-700 text-sm font-semibold mt-1">
                  <IconGlobe /> {patient.preferred_language}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Medications Logs Section */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-slate-800 text-xl font-bold tracking-tight">Medications & Schedules</h2>
          <Button variant="primary" onClick={() => { setNewMed(makeInitialMedForm()); setShowAddMedModal(true); }}>
            <IconPlus /> Add Medication
          </Button>
        </div>

        {/* Med List Grid */}
        {medications.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {medications.map(med => (
              <motion.div 
                key={med.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row gap-5 items-start justify-between shadow-sm relative overflow-hidden group hover:border-sky-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex gap-4.5 items-start flex-1 min-w-0">
                  {/* Medicine thumbnail preview */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/60 overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl relative shadow-inner">
                    {med.pill_image_url ? (
                      <img src={med.pill_image_url} alt={med.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>💊</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-slate-800 font-extrabold text-base leading-tight truncate">{med.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200/60">
                        {med.type}
                      </span>
                    </div>
                    
                    <p className="text-slate-500 text-xs font-semibold mt-2 flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-400">Dosage:</span> 
                      <span className="text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{med.dosage_quantity || "1 dosage unit"}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400">Triggers:</span>
                      <span className="text-slate-700 font-bold">{parseQuantity(med.quantity)}</span>
                    </p>
                    
                    {med.instruction && (
                      <p className="text-slate-400 text-[11px] font-medium mt-1 leading-relaxed italic">
                        {med.instruction}
                      </p>
                    )}

                    {/* Schedules details lists */}
                    {med.schedules && med.schedules.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 mt-3.5 pt-3.5 border-t border-slate-50">
                        {med.schedules.map(slot => (
                          <div key={slot.id} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 text-xs text-slate-600 font-semibold shadow-inner">
                            <span className="text-sky-500 font-bold">⏰ {slot.time.slice(0, 5)}</span>
                            <span className="text-slate-300">|</span>
                            <span className="text-slate-500">{slot.label}</span>
                            <span className="text-slate-300">|</span>
                            <span className="text-slate-400 text-[10px] font-medium italic">{slot.instruction}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50 md:self-stretch justify-end md:justify-start items-center">
                  <Button variant="ghost" size="sm" onClick={() => startEditMed(med)} className="w-full md:w-auto">
                    <IconPencil /> Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteMed(med.id)} className="w-full md:w-auto">
                    <IconTrash /> Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState 
            message="No medications scheduled yet" 
            subMessage="Set up medication times, quantity instructions, and receive automated WhatsApp notifications."
            icon="💊"
          />
        )}
      </main>

      {/* Adding medicine popup */}
      <AnimatePresence>
        {showAddMedModal && (
          <MedModal 
            title="Add New Medication" 
            data={newMed} 
            setData={setNewMed}
            imageFile={newMedImageFile} 
            setImageFile={setNewMedImageFile}
            onSubmit={handleAddMed} 
            onClose={() => setShowAddMedModal(false)} 
            submitLabel="Schedule Medication" 
          />
        )}
      </AnimatePresence>

      {/* Editing medicine popup */}
      <AnimatePresence>
        {editMedModal && (
          <MedModal 
            title="Edit Medication Schedule" 
            data={editMed} 
            setData={setEditMed}
            imageFile={editMedImageFile} 
            setImageFile={setEditMedImageFile}
            onSubmit={saveEditMed} 
            onClose={() => { setEditMedModal(false); setEditingMedId(null); }} 
            submitLabel="Save Changes" 
          />
        )}
      </AnimatePresence>

      {/* Confirm notices overlay */}
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
