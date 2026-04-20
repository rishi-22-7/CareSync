import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8000";

// ─── helpers ────────────────────────────────────────────────
const DOSAGE_SLOTS = [
  { key: "pre_breakfast", label: "Pre-Breakfast", defaultTime: "07:00", icon: "🌅" },
  { key: "morning",       label: "Morning",       defaultTime: "09:00", icon: "☀️" },
  { key: "afternoon",     label: "Afternoon",     defaultTime: "14:00", icon: "🌤️" },
  { key: "night",         label: "Night",         defaultTime: "21:00", icon: "🌙" },
];

const makeInitialMedForm = () => ({
  name: "", type: "Pill", dosage_quantity: "", pill_image_url: "",
  slots: {
    pre_breakfast: { checked: false, time: "07:00", instruction: "Before Food" },
    morning:       { checked: false, time: "09:00", instruction: "After Food"  },
    afternoon:     { checked: false, time: "14:00", instruction: "After Food"  },
    night:         { checked: false, time: "21:00", instruction: "After Food"  },
  },
});

/** Strip whatsapp prefix and country code, return clean 10-digit number */
const formatPhone = (raw = "") => {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : raw;
};

/** Get dynamic dosage placeholder based on medication type */
const getDosagePlaceholder = (type = "Pill") => {
  const placeholders = {
    "Pill": "e.g., 1 pill, 0.5 pill",
    "Capsule": "e.g., 1 pill, 0.5 pill",
    "Syrup": "e.g., 5ml, 10ml",
    "Drops": "e.g., 2 drops",
    "Cream": "e.g., Apply a thin layer",
    "Patch": "e.g., Apply a thin layer",
    "Injection": "e.g., 1 vial, 10mg",
  };
  return placeholders[type] || "e.g., specify quantity";
};

// ─── SVG Icons ──────────────────────────────────────────────
const IconEdit   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconClose  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconBack   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconPlus   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconPencil = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const IconPhone  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.39 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.94-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconGlobe  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const Chevron    = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;


// ════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ════════════════════════════════════════════════════════════

/** Primary branded button */
function Button({ children, onClick, type = "button", variant = "primary", size = "md", disabled = false, className = "" }) {
  const base = "inline-flex items-center gap-2 font-semibold rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-base" };
  const variants = {
    primary:  "bg-[#426b89] hover:bg-[#32546d] text-white",
    danger:   "bg-transparent hover:bg-red-500/10 text-red-400 border border-red-500/20 hover:border-red-500/40",
    ghost:    "bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800",
    icon:     "bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 p-1.5",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

/** Top navigation bar */
function Navbar({ adminName, onLogout }) {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-zinc-800">
      <div className="flex items-center">
        <img src="/caresync-logo.png" alt="CareSync" className="h-9 w-auto object-contain" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-white font-semibold text-lg tracking-wide mr-4 max-w-[200px] truncate">{adminName}</span>
        <button onClick={onLogout}
          className="px-4 py-2 text-sm text-red-400 border border-red-700/40 rounded-lg hover:bg-red-600 hover:text-white transition-colors cursor-pointer">
          Log Out
        </button>
      </div>
    </nav>
  );
}

/** Single patient card on the dashboard grid */
function PatientCard({ patient, onManage, onEdit, onDelete }) {
  const initials = patient.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const phone = formatPhone(patient.whatsapp_number);
  return (
    <div className="flex flex-col gap-3 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors cursor-pointer group"
      onClick={() => onManage(patient)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#426b89] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{patient.name}</p>
            <p className="text-zinc-500 text-xs mt-0.5">ID #{patient.id}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          <Button variant="icon" size="sm" onClick={() => onEdit(patient)}><IconPencil /></Button>
          <Button variant="icon" size="sm" onClick={() => onDelete(patient.id)}><IconTrash /></Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-400 text-xs">
          <IconPhone />
          <span>+91 {phone}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400 text-xs">
          <IconGlobe />
          <span>{patient.preferred_language}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#426b89]/15 text-[#7eb3d5] border border-[#426b89]/20">
          {patient.preferred_language}
        </span>
        <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">Manage →</span>
      </div>
    </div>
  );
}

/** Empty state placeholder */
function EmptyState({ message, subMessage }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/50 border border-dashed border-zinc-700 rounded-2xl text-center">
      <div className="text-3xl mb-3">📋</div>
      <p className="text-zinc-300 font-semibold">{message}</p>
      {subMessage && <p className="text-zinc-500 text-sm mt-1.5">{subMessage}</p>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// AuthPortal
// ════════════════════════════════════════════════════════════
function AuthPortal({ onAuth }) {
  const [isLogin, setIsLogin]   = useState(true);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const url  = isLogin ? `${API}/admin/login` : `${API}/admin/register`;
      const body = isLogin ? { email, password } : { name, email, password };
      const res  = await axios.post(url, body);
      onAuth(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const toggle = () => { setIsLogin(!isLogin); setError(""); setName(""); setEmail(""); setPassword(""); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl modal-enter">
        <img src="/caresync-logo.png" alt="CareSync" className="h-14 w-auto object-contain mx-auto mb-6" />
        <p className="text-center text-sm text-zinc-400 mb-6">
          {isLogin ? "Sign in to your admin portal" : "Create your admin account"}
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Full Name</label>
              <input type="text" placeholder="e.g. Dr. Ramesh" value={name}
                onChange={e => setName(e.target.value)} required
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm outline-none focus:border-[#426b89] placeholder-zinc-600 transition-colors" />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email</label>
            <input type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} required
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm outline-none focus:border-[#426b89] placeholder-zinc-600 transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Password</label>
            <input type="password" placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)} required
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm outline-none focus:border-[#426b89] placeholder-zinc-600 transition-colors" />
          </div>

          {error && (
            <div className="px-3 py-2.5 bg-red-500/8 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-[#426b89] hover:bg-[#32546d] text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mt-1">
            {loading ? <span className="auth-spinner" /> : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-5">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={toggle} className="text-[#7eb3d5] hover:text-white font-semibold transition-colors">{isLogin ? "Create Account" : "Sign In"}</button>
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ConfirmDialog
// ════════════════════════════════════════════════════════════
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4" onClick={onCancel}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full text-center modal-enter shadow-2xl" onClick={e => e.stopPropagation()}>
        <p className="text-zinc-300 text-sm leading-relaxed mb-5">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MedForm — inside modal
// ════════════════════════════════════════════════════════════
function MedForm({ data, setData, imageFile, setImageFile, onSubmit, onCancel, submitLabel }) {
  const updateSlot = (key, field, value) =>
    setData(prev => ({ ...prev, slots: { ...prev.slots, [key]: { ...prev.slots[key], [field]: value } } }));

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Medicine Name</label>
        <input type="text" placeholder="e.g. Vitamin D" value={data.name}
          onChange={e => setData(prev => ({ ...prev, name: e.target.value }))} required
          className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm outline-none focus:border-[#426b89] placeholder-zinc-600 transition-colors" />
      </div>

      {/* Type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Type</label>
        <div className="styled-select">
          <select value={data.type} onChange={e => setData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm outline-none focus:border-[#426b89] transition-colors">
            {["Pill","Syrup","Injection","Capsule","Drops","Cream","Patch","Other"].map(t => <option key={t}>{t}</option>)}
          </select>
          <span className="styled-select-arrow"><Chevron /></span>
        </div>
      </div>

      {/* Dosage Quantity */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Dosage Quantity</label>
        <input type="text" placeholder={getDosagePlaceholder(data.type)} value={data.dosage_quantity}
          onChange={e => setData(prev => ({ ...prev, dosage_quantity: e.target.value }))}
          className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm outline-none focus:border-[#426b89] placeholder-zinc-600 transition-colors" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Pill Image</label>
        <label className={`upload-dropzone ${imageFile || data.pill_image_url ? "upload-dropzone--has-file" : ""}`} htmlFor="med-image-upload">
          <input id="med-image-upload" type="file" accept="image/*" className="upload-dropzone-input"
            onChange={e => setImageFile(e.target.files[0] || null)} />
          {imageFile ? (
            <span className="upload-dropzone-success">
              <span className="upload-dropzone-check">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span className="upload-dropzone-success-text">
                <span className="upload-dropzone-filename">{imageFile.name}</span>
                <span className="upload-dropzone-change">Click to change file</span>
              </span>
            </span>
          ) : data.pill_image_url ? (
            <span className="upload-dropzone-success">
              <img src={data.pill_image_url} alt="Medication" className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
              <span className="upload-dropzone-success-text">
                <span className="upload-dropzone-filename">Existing image</span>
                <span className="upload-dropzone-change">Click to replace</span>
              </span>
            </span>
          ) : (
            <span className="upload-dropzone-prompt">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              Click to browse or drag an image here
            </span>
          )}
        </label>
        {(imageFile || data.pill_image_url) && (
          <button type="button" className="upload-dropzone-clear" onClick={e => { e.preventDefault(); setImageFile(null); }}>✕ Remove file</button>
        )}
      </div>

      {/* Dosage Slots */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Dosage Schedule</label>
        <div className="flex flex-col gap-2">
          {DOSAGE_SLOTS.map(slot => {
            const s = data.slots[slot.key];
            return (
              <div key={slot.key}
                className={`flex items-center justify-between bg-slate-800/30 p-3 rounded-xl border mb-2 transition-colors ${
                  s.checked ? "border-[#426b89]/50" : "border-slate-700/50"
                }`}>
                <label className="flex items-center cursor-pointer">
                  {/* Custom checkbox: appearance-none + brand fill + SVG checkmark */}
                  <div className="relative flex items-center justify-center flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={s.checked}
                      onChange={e => updateSlot(slot.key, "checked", e.target.checked)}
                      className="appearance-none w-5 h-5 flex-shrink-0 border-2 border-slate-600 rounded-md bg-slate-800 checked:bg-[#426b89] checked:border-[#426b89] cursor-pointer transition-colors"
                    />
                    {s.checked && (
                      <svg className="absolute pointer-events-none" width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-slate-200 font-medium ml-3 text-sm">{slot.icon} {slot.label}</span>
                </label>
                {s.checked && (
                  <div className="flex items-center gap-2">
                    <input type="time" value={s.time} onChange={e => updateSlot(slot.key, "time", e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none cursor-pointer [color-scheme:dark]" />
                    <select value={s.instruction} onChange={e => updateSlot(slot.key, "instruction", e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none cursor-pointer [color-scheme:dark]">
                      <option>Before Food</option><option>After Food</option>
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" variant="primary">{submitLabel}</Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════════════════════
// MedModal
// ════════════════════════════════════════════════════════════
function MedModal({ title, data, setData, imageFile, setImageFile, onSubmit, onClose, submitLabel }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col modal-enter" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h3 className="text-white font-bold">{title}</h3>
          <Button variant="icon" onClick={onClose}><IconClose /></Button>
        </div>
        <div className="p-6 overflow-y-auto">
          <MedForm data={data} setData={setData} imageFile={imageFile} setImageFile={setImageFile}
            onSubmit={onSubmit} onCancel={onClose} submitLabel={submitLabel} />
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// App — state + orchestration only
// ════════════════════════════════════════════════════════════
export default function App() {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const handleAuth   = (admin) => setCurrentAdmin(admin);
  const handleLogout = () => { setCurrentAdmin(null); setView("dashboard"); };

  const [patients, setPatients]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [lastSync, setLastSync]     = useState(null);
  const [view, setView]             = useState("dashboard");
  const [activePatient, setActivePatient] = useState(null);
  const [medications, setMedications] = useState([]);

  const [showForm, setShowForm]     = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", phone: "", preferred_language: "English" });

  const [editingPatient, setEditingPatient] = useState(false);
  const [patientEdit, setPatientEdit]       = useState({ phone: "", preferred_language: "" });

  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [newMed, setNewMed]                   = useState(makeInitialMedForm());
  const [newMedImageFile, setNewMedImageFile] = useState(null);

  const [editMedModal, setEditMedModal]   = useState(false);
  const [editingMedId, setEditingMedId]   = useState(null);
  const [editMed, setEditMed]             = useState(makeInitialMedForm());
  const [editMedImageFile, setEditMedImageFile] = useState(null);

  const [confirm, setConfirm] = useState(null);
  const askConfirm  = (message, onConfirm) => setConfirm({ message, onConfirm });
  const closeConfirm = () => setConfirm(null);

  // ── fetch helpers ──
  const fetchPatients = (admin = currentAdmin) => {
    if (!admin) return;
    axios.get(`${API}/patients/${admin.admin_id}`)
      .then(r => { setPatients(r.data); setLoading(false); setLastSync(new Date().toLocaleTimeString()); })
      .catch(() => setLoading(false));
  };
  const fetchMedications = (pid) => axios.get(`${API}/medications/${pid}`).then(r => setMedications(r.data));

  useEffect(() => { if (!currentAdmin) return; fetchPatients(currentAdmin); }, [currentAdmin]);

  if (!currentAdmin) return <AuthPortal onAuth={handleAuth} />;

  // ── patient CRUD ──
  const handleSubmitPatient = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/patients`, {
      caretaker_id: currentAdmin.admin_id, name: newPatient.name,
      whatsapp_number: `whatsapp:+91${newPatient.phone}`, preferred_language: newPatient.preferred_language,
    });
    setNewPatient({ name: "", phone: "", preferred_language: "English" });
    setShowForm(false); fetchPatients();
  };

  const handleDeletePatient = (id) => askConfirm("Delete this patient and all their data? This cannot be undone.", async () => {
    closeConfirm();
    await axios.delete(`${API}/patients/${id}`);
    if (view === "manage" && activePatient?.id === id) setView("dashboard");
    fetchPatients();
  });

  const openManage = (patient) => {
    setActivePatient(patient); setMedications([]); setEditingPatient(false);
    fetchMedications(patient.id); setView("manage");
  };

  const savePatientEdit = async () => {
    const res = await axios.put(`${API}/patients/${activePatient.id}`, {
      whatsapp_number: `whatsapp:+91${patientEdit.phone}`, preferred_language: patientEdit.preferred_language,
    });
    setActivePatient(res.data.patient); setEditingPatient(false); fetchPatients();
  };

  // ── medication helpers ──
  const buildSchedules = (slots) =>
    DOSAGE_SLOTS.filter(s => slots[s.key].checked).map(s => ({
      label: s.label, time: slots[s.key].time, instruction: slots[s.key].instruction,
    }));

  const uploadImageIfNeeded = async (file, existingUrl) => {
    if (!file) return existingUrl || null;
    const fd = new FormData(); fd.append("image", file);
    const res = await axios.post(`${API}/upload-image`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data.image_url;
  };

  const handleAddMed = async (e) => {
    e.preventDefault();
    const pill_image_url = await uploadImageIfNeeded(newMedImageFile, null);
    await axios.post(`${API}/medications`, { 
      patient_id: activePatient.id, 
      name: newMed.name, 
      type: newMed.type, 
      pill_image_url, 
      dosage_quantity: newMed.dosage_quantity || null,
      schedules: buildSchedules(newMed.slots) 
    });
    setNewMed(makeInitialMedForm()); setNewMedImageFile(null); setShowAddMedModal(false);
    fetchMedications(activePatient.id);
  };

  // Helper: Convert time to strict HH:mm format for HTML time input
  const formatTimeToHHmm = (timeStr) => {
    if (!timeStr) return "09:00";
    // If already HH:mm format, return as-is
    if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
      const [h, m] = timeStr.split(":");
      return `${String(h).padStart(2, "0")}:${m}`;
    }
    // Handle 12-hour format (e.g., "12:57 PM")
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
    
    // Build a map of schedules by their label for easy lookup
    const scheduleMap = {};
    if (med.schedules && Array.isArray(med.schedules)) {
      med.schedules.forEach(schedule => {
        const label = schedule.label || "";
        scheduleMap[label] = schedule;
      });
    }
    
    const slots = {};
    keys.forEach((k, i) => {
      const slotLabel = DOSAGE_SLOTS[i].label;
      const savedSchedule = scheduleMap[slotLabel];
      
      // Use saved time if available, otherwise use default
      const time = savedSchedule ? formatTimeToHHmm(savedSchedule.time) : DOSAGE_SLOTS[i].defaultTime;
      // Use per-slot instruction if available, otherwise fallback to med-level instruction
      const instruction = savedSchedule?.instruction || med.instruction || "After Food";
      
      slots[k] = {
        checked: bits[i] === "1",
        time: time,
        instruction: instruction
      };
    });
    
    setEditMed({ 
      name: med.name, 
      type: med.type, 
      pill_image_url: med.pill_image_url || "", 
      dosage_quantity: med.dosage_quantity || "",
      slots 
    });
    if (med.pill_image_url) setEditMedImageFile(null);
    setEditingMedId(med.id);
    setEditMedModal(true);
  };

  const saveEditMed = async (e) => {
    e.preventDefault();
    const pill_image_url = await uploadImageIfNeeded(editMedImageFile, editMed.pill_image_url);
    await axios.put(`${API}/medications/${editingMedId}`, { 
      name: editMed.name, 
      type: editMed.type, 
      pill_image_url, 
      dosage_quantity: editMed.dosage_quantity || null,
      schedules: buildSchedules(editMed.slots) 
    });
    setEditMedModal(false); setEditingMedId(null); setEditMedImageFile(null);
    fetchMedications(activePatient.id);
  };

  const handleDeleteMed = (id) => askConfirm("Delete this medication and all its schedules?", async () => {
    closeConfirm();
    await axios.delete(`${API}/medications/${id}`);
    fetchMedications(activePatient.id);
  });

  const parseQuantity = (q = "") => {
    const slot_order = ["Pre-Breakfast","Morning","Afternoon","Night"];
    const bits = q.split("-");
    const active = slot_order.filter((_, i) => bits[i] === "1");
    return active.length ? active.join(" · ") : "None";
  };

  // ════════════════════════════════
  // MANAGE PATIENT VIEW
  // ════════════════════════════════
  if (view === "manage" && activePatient) return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar adminName={currentAdmin.name} onLogout={handleLogout} />
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back */}
        <Button variant="ghost" size="sm" onClick={() => setView("dashboard")} className="mb-6">
          <IconBack /> Back to Dashboard
        </Button>

        {/* Patient header card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#426b89] flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                {activePatient.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">{activePatient.name}</h1>
                <p className="text-zinc-500 text-sm mt-0.5">Ward ID #{activePatient.id}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setPatientEdit({ phone: formatPhone(activePatient.whatsapp_number), preferred_language: activePatient.preferred_language }); setEditingPatient(true); }}>
                <IconPencil /> Edit Info
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDeletePatient(activePatient.id)}>
                <IconTrash /> Delete
              </Button>
            </div>
          </div>

          {/* Details or Edit form */}
          {editingPatient ? (
            <div className="mt-5 pt-5 border-t border-zinc-800 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Phone (10 digits)</label>
                <input type="text" value={patientEdit.phone} onChange={e => setPatientEdit(p => ({...p, phone: e.target.value}))}
                  className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm outline-none focus:border-[#426b89] transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Language</label>
                <div className="styled-select">
                  <select value={patientEdit.preferred_language} onChange={e => setPatientEdit(p => ({...p, preferred_language: e.target.value}))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm outline-none focus:border-[#426b89] transition-colors">
                    {["English","Hindi","Telugu","Tamil","Kannada","Malayalam"].map(l => <option key={l}>{l}</option>)}
                  </select>
                  <span className="styled-select-arrow"><Chevron /></span>
                </div>
              </div>
              <div className="col-span-2 flex gap-2">
                <Button variant="primary" size="sm" onClick={savePatientEdit}>Save Changes</Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingPatient(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 pt-5 border-t border-zinc-800 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Phone</span>
                <span className="flex items-center gap-2 text-white text-sm"><IconPhone />+91 {formatPhone(activePatient.whatsapp_number)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Language</span>
                <span className="flex items-center gap-2 text-white text-sm"><IconGlobe />{activePatient.preferred_language}</span>
              </div>
            </div>
          )}
        </div>

        {/* Medications */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Medications</h2>
          <Button variant="primary" size="sm" onClick={() => setShowAddMedModal(true)}>
            <IconPlus /> Add Medication
          </Button>
        </div>

        {medications.length === 0 ? (
          <EmptyState message="No medications yet" subMessage="Click 'Add Medication' to get started." />
        ) : (
          <div className="flex flex-col gap-3">
            {medications.map(med => (
              <div key={med.id} className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  {med.pill_image_url
                    ? <img className="w-full h-full object-cover" src={med.pill_image_url} alt={med.name} />
                    : <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xl">💊</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{med.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#426b89]/15 text-[#7eb3d5] border border-[#426b89]/20">{med.type}</span>
                    {parseQuantity(med.quantity) !== "None" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">{parseQuantity(med.quantity)}</span>
                    )}
                  </div>
                  {med.instruction && <p className="text-zinc-500 text-xs mt-1">{med.instruction}</p>}
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <Button variant="icon" size="sm" onClick={() => startEditMed(med)}><IconEdit /></Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteMed(med.id)}><IconTrash /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showAddMedModal && <MedModal title="New Medication" data={newMed} setData={setNewMed} imageFile={newMedImageFile} setImageFile={setNewMedImageFile} onSubmit={handleAddMed} onClose={() => { setShowAddMedModal(false); setNewMedImageFile(null); }} submitLabel="Add Medication" />}
      {editMedModal    && <MedModal title="Edit Medication" data={editMed} setData={setEditMed} imageFile={editMedImageFile} setImageFile={setEditMedImageFile} onSubmit={saveEditMed} onClose={() => { setEditMedModal(false); setEditingMedId(null); setEditMedImageFile(null); }} submitLabel="Save Changes" />}
      {confirm && <ConfirmDialog message={confirm.message} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />}
    </div>
  );

  // ════════════════════════════════
  // DASHBOARD VIEW
  // ════════════════════════════════
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar adminName={currentAdmin.name} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Manage your wards and medication schedules
              {lastSync && <span className="text-zinc-600"> · Last sync: {lastSync}</span>}
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? <><IconClose /> Cancel</> : <><IconPlus /> Add New Ward</>}
          </Button>
        </div>

        {/* Add patient form */}
        {showForm && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
            <h2 className="text-white font-semibold mb-4">Add New Ward</h2>
            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmitPatient}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ward Name</label>
                <input type="text" placeholder="e.g. Grandma Sharma" value={newPatient.name}
                  onChange={e => setNewPatient({...newPatient, name: e.target.value})} required
                  className="px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm outline-none focus:border-[#426b89] placeholder-zinc-600 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Phone (10 digits)</label>
                <input type="text" placeholder="9876543210" value={newPatient.phone}
                  onChange={e => setNewPatient({...newPatient, phone: e.target.value})} required
                  className="px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm outline-none focus:border-[#426b89] placeholder-zinc-600 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Language</label>
                <div className="styled-select">
                  <select value={newPatient.preferred_language} onChange={e => setNewPatient({...newPatient, preferred_language: e.target.value})}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm outline-none focus:border-[#426b89] transition-colors">
                    {["English","Hindi","Telugu","Tamil","Kannada","Malayalam"].map(l => <option key={l}>{l}</option>)}
                  </select>
                  <span className="styled-select-arrow"><Chevron /></span>
                </div>
              </div>
              <div className="flex items-end">
                <Button type="submit" variant="primary">Add New Ward</Button>
              </div>
            </form>
          </div>
        )}

        {/* Patient grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-500 gap-3">
            <div className="w-5 h-5 border-2 border-zinc-700 border-t-[#426b89] rounded-full animate-spin" />
            Loading patients…
          </div>
        ) : patients.length === 0 ? (
          <EmptyState message="No wards yet" subMessage="Click 'Add New Ward' to add your first ward." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map(p => (
              <PatientCard key={p.id} patient={p}
                onManage={openManage}
                onEdit={pt => { setPatientEdit({ phone: formatPhone(pt.whatsapp_number), preferred_language: pt.preferred_language }); setActivePatient(pt); setView("manage"); setEditingPatient(true); fetchMedications(pt.id); }}
                onDelete={handleDeletePatient} />
            ))}
          </div>
        )}
      </main>

      {confirm && <ConfirmDialog message={confirm.message} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />}
    </div>
  );
}
