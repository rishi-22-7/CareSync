import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };


  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
    hover: { 
      y: -6, 
      boxShadow: "0 12px 20px -8px rgb(15 23 42 / 0.08)",
      borderColor: "#e2e8f0",
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm shadow-slate-100/40">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/caresync-logo.png" alt="CareSync" className="h-8.5 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/login?register=true" 
              className="px-5 py-2.5 text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-700 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 active:scale-95"
            >
              Get Started Free
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="flex flex-col gap-6"
        >
          {/* Badge */}
          <span className="self-start px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-600 border border-sky-100 text-xs font-bold tracking-wide uppercase">
            🚀 Next-Gen Caregiving
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight">
            Smart medication <br />
            reminders for <br />
            <span className="text-sky-500 bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">caregivers</span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-md font-medium">
            Manage your patients, schedule their medications, and keep their loved ones notified with automated WhatsApp reminders in their native language.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link 
              to="/login?register=true" 
              className="px-8 py-4 text-center font-bold text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-700 rounded-2xl shadow-xl shadow-sky-200 transition-all duration-200 active:scale-95 text-base"
            >
              Start Free Trial
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 text-center font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all duration-200 active:scale-95 text-base"
            >
              Sign In to Portal
            </Link>
          </div>
          {/* Social Proof info */}
          <div className="flex items-center gap-6 mt-8 pt-8 border-t border-slate-200/60">
            <div>
              <p className="text-2xl font-extrabold text-slate-800">100%</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Delivery Rate</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div>
              <p className="text-2xl font-extrabold text-slate-800">24/7</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Automated Monitor</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div>
              <p className="text-2xl font-extrabold text-slate-800">5+</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Native Languages</p>
            </div>
          </div>
        </motion.div>

        {/* Hero Illustration Graphic */}
        <motion.div 
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
          className="relative"
        >
          {/* Floating UI Elements */}
          <div className="absolute -top-6 -left-6 bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-3.5 z-10 animate-bounce" style={{ animationDuration: "3s" }}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-lg text-white">💊</div>
            <div>
              <p className="text-slate-800 text-xs font-bold">Grandma Sharma</p>
              <p className="text-emerald-500 text-[10px] font-bold">Reminder Sent • 09:00 AM</p>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-3.5 z-10 animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-lg text-white">📱</div>
            <div>
              <p className="text-slate-800 text-xs font-bold">WhatsApp Notice</p>
              <p className="text-sky-500 text-[10px] font-bold">Translated to Hindi</p>
            </div>
          </div>

          {/* Main Visual */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-2xl shadow-sky-100/50 bg-gradient-to-tr from-sky-400 to-blue-500 aspect-video md:aspect-[4/3] flex items-center justify-center text-white p-8">
            {/* Visual Design Elements */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative text-center flex flex-col items-center gap-4 max-w-sm">
              <span className="text-6xl animate-pulse">👨‍⚕️</span>
              <h3 className="text-2xl font-bold tracking-tight">CareSync Dashboard</h3>
              <p className="text-sky-100 text-sm font-medium">
                Restructured using high-performance MVC architecture, backed by secure cloud storage on Supabase.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Cards Grid */}
      <section className="bg-white border-y border-slate-100/80 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-md mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Designed for effortless, safe caregiving
            </h2>
            <p className="text-slate-500 text-sm mt-3 font-medium">
              We automate the complex scheduling workflows so you can focus on what matters most — health and care.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="p-8 bg-slate-50 rounded-3xl border border-transparent transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-xl text-sky-500 mb-6 border border-sky-100">
                🧑‍⚕️
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-3">Patient Database</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Add, edit, and organize multiple wards in one sleek card-based directory. Track contact details and language preferences.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="p-8 bg-slate-50 rounded-3xl border border-transparent transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl text-emerald-500 mb-6 border border-emerald-100">
                💊
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-3">Precision Scheduling</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Set custom dosage hours, meal guidelines, and upload pill images. Our backend engine schedules tasks down to the minute.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              variants={cardVariants}
              whileHover="hover"
              className="p-8 bg-slate-50 rounded-3xl border border-transparent transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl text-indigo-500 mb-6 border border-indigo-100">
                📱
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-3">Multi-Language Reminders</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Reminders automatically translate into patients' preferred languages (Hindi, Telugu, Tamil, etc.) before hitting their WhatsApp.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Banner */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-md mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Automating safety in 3 steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 hidden md:block z-0" />
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-14 h-14 rounded-full bg-sky-500 text-white font-extrabold flex items-center justify-center text-lg border-4 border-slate-50 shadow-md">
              1
            </div>
            <h4 className="text-slate-800 font-bold text-base mt-5 mb-2">Register Ward Profile</h4>
            <p className="text-slate-500 text-xs font-semibold max-w-[200px] leading-relaxed">
              Create profiles with names, languages, and direct WhatsApp numbers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-14 h-14 rounded-full bg-sky-500 text-white font-extrabold flex items-center justify-center text-lg border-4 border-slate-50 shadow-md">
              2
            </div>
            <h4 className="text-slate-800 font-bold text-base mt-5 mb-2">Set Schedule & Pills</h4>
            <p className="text-slate-500 text-xs font-semibold max-w-[200px] leading-relaxed">
              Define daily times, dosage instructions, and attach images.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-14 h-14 rounded-full bg-sky-500 text-white font-extrabold flex items-center justify-center text-lg border-4 border-slate-50 shadow-md">
              3
            </div>
            <h4 className="text-slate-800 font-bold text-base mt-5 mb-2">Auto-Send Reminders</h4>
            <p className="text-slate-500 text-xs font-semibold max-w-[200px] leading-relaxed">
              The worker schedules checking triggers, translates alerts, and delivers them instantly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gradient-to-tr from-sky-500 to-sky-600 text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-2xl mx-auto px-6 relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Ready to upgrade your care?
          </h2>
          <p className="text-sky-100 text-base max-w-md font-semibold leading-relaxed">
            Sign up for your secure CareSync admin portal today. Zero setup fees, cloud-hosted DB, and full automation dashboard.
          </p>
          <Link 
            to="/login?register=true" 
            className="px-8 py-4 font-bold text-sky-600 bg-white hover:bg-slate-50 rounded-2xl shadow-xl transition-all duration-200 active:scale-95 mt-2"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center bg-white/95 px-3 py-1.5 rounded-xl">
            <img src="/caresync-logo.png" alt="CareSync" className="h-7 w-auto object-contain" />
          </div>
          <p className="font-semibold text-slate-500">© 2026 CareSync. Intelligent Care Automations.</p>
        </div>
      </footer>
    </div>
  );
}
