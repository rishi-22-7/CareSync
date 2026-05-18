import React from "react";

export function Navbar({ adminName, onLogout }) {
  const initials = adminName
    ? adminName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center font-bold text-white shadow-md shadow-sky-200">
              C
            </div>
            <span className="text-slate-800 font-bold text-lg tracking-tight">
              Care<span className="text-sky-500">Sync</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          {/* Profile pill */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-full shadow-inner">
            <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold border border-sky-200/50">
              {initials}
            </div>
            <span className="text-slate-700 font-semibold text-sm max-w-[150px] truncate">
              {adminName || "Admin"}
            </span>
          </div>

          <button 
            onClick={onLogout}
            className="px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-100/50 rounded-xl transition-all duration-200 cursor-pointer shadow-sm shadow-rose-100/10 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}
