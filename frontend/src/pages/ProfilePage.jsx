import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { authService, patientService, medicationService } from "../services/api";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/Button";
import { ArrowLeft, Lock, User, BarChart3 } from "lucide-react";

export function ProfilePage({ currentAdmin, onLogout }) {
  const navigate = useNavigate();
  
  // Stats
  const [patientsCount, setPatientsCount] = useState(0);
  const [medicationsCount, setMedicationsCount] = useState(0);
  const [loadingStats, setLoadingStats]   = useState(true);

  // Password fields
  const [oldPassword, setOldPassword]         = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submittingPassword, setSubmittingPassword] = useState(false);

  // Show/Hide password states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const initials = currentAdmin?.name
    ? currentAdmin.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  const fetchStats = async () => {
    if (!currentAdmin) return;
    try {
      const list = await patientService.getPatients(currentAdmin.admin_id);
      setPatientsCount(list.length);
      
      let totalMeds = 0;
      for (const p of list) {
        const meds = await medicationService.getMedications(p.id);
        totalMeds += meds.length;
      }
      setMedicationsCount(totalMeds);
    } catch (err) {
      console.error("Failed to load statistics", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [currentAdmin]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setSubmittingPassword(true);
    const loadingToast = toast.loading("Updating password...");

    try {
      await authService.changePassword(
        currentAdmin.admin_id,
        oldPassword,
        newPassword
      );
      toast.success("Password changed successfully!", { id: loadingToast });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to update password. Verify current password.";
      toast.error(msg, { id: loadingToast });
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar adminName={currentAdmin?.name} onLogout={onLogout} />

      <main className="max-w-4xl mx-auto px-6 py-10 flex-1 w-full">
        {/* Back */}
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => navigate("/dashboard")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Admin details & stats */}
          <div className="md:col-span-1 flex flex-col gap-6">
            
            {/* Profile info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center transition-colors">
              <div className="w-20 h-20 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center text-2xl font-bold border border-sky-100 dark:border-sky-900/50 mb-4 shadow-inner">
                {initials}
              </div>
              <h2 className="text-slate-800 dark:text-slate-100 font-extrabold text-lg truncate w-full">{currentAdmin?.name || "Admin Clinic"}</h2>
              <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold mt-1">Caretaker Account</span>
              
              <div className="w-full border-t border-slate-50 dark:border-slate-800/80 mt-6 pt-5 flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3">
                  <User className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Caretaker ID</p>
                    <p className="text-slate-700 dark:text-slate-350 text-sm font-semibold mt-0.5">#{currentAdmin?.admin_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Secure Access</p>
                    <p className="text-emerald-500 text-xs font-bold mt-0.5">Supabase PostgreSQL Protected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4.5 h-4.5 text-sky-500 flex-shrink-0" />
                <h3 className="text-slate-800 dark:text-slate-200 font-extrabold text-sm uppercase tracking-wider">Live Stats</h3>
              </div>
              
              {loadingStats ? (
                <div className="flex flex-col gap-3">
                  <div className="h-10 bg-slate-50 rounded-xl animate-pulse" />
                  <div className="h-10 bg-slate-50 rounded-xl animate-pulse" />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850/80 rounded-2xl">
                    <span className="text-slate-500 dark:text-slate-450 text-xs font-bold">Wards Registered</span>
                    <span className="text-slate-800 dark:text-slate-200 text-base font-extrabold">{patientsCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850/80 rounded-2xl">
                    <span className="text-slate-500 dark:text-slate-455 text-xs font-bold">Medicines Active</span>
                    <span className="text-slate-800 dark:text-slate-200 text-base font-extrabold">{medicationsCount}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Change Password */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors">
              <h3 className="text-slate-800 dark:text-slate-150 font-extrabold text-base mb-2">Change Account Password</h3>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold mb-6">Update credentials to keep clinic access secure</p>
              
              <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
                
                {/* Old Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Password</label>
                  <div className="relative flex items-center">
                    <input 
                      type={showOld ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)} 
                      required
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm outline-none focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-650 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="absolute right-3 text-sky-500 hover:text-sky-600 focus:outline-none cursor-pointer select-none text-[10px] font-extrabold tracking-wider"
                    >
                      {showOld ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Password</label>
                  <div className="relative flex items-center">
                    <input 
                      type={showNew ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)} 
                      required
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm outline-none focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-650 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 text-sky-500 hover:text-sky-600 focus:outline-none cursor-pointer select-none text-[10px] font-extrabold tracking-wider"
                    >
                      {showNew ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                  <div className="relative flex items-center">
                    <input 
                      type={showConfirm ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)} 
                      required
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm outline-none focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-650 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 text-sky-500 hover:text-sky-600 focus:outline-none cursor-pointer select-none text-[10px] font-extrabold tracking-wider"
                    >
                      {showConfirm ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                  <Button type="submit" variant="primary" disabled={submittingPassword} className="px-8 py-3">
                    {submittingPassword ? "Saving..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
