import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { authService } from "../services/api";
import { Button } from "../components/ui/Button";

export function LoginPage({ onAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Read query params to determine if we should show register form by default
  const params = new URLSearchParams(location.search);
  const startAsRegister = params.get("register") === "true";

  const [isLogin, setIsLogin]   = useState(!startAsRegister);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    setIsLogin(!startAsRegister);
  }, [startAsRegister]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading(isLogin ? "Signing in..." : "Creating account...");
    
    try {
      let data;
      if (isLogin) {
        data = await authService.login(email, password);
        toast.success(`Welcome back, ${data.name || "Admin"}!`, { id: loadingToast });
      } else {
        data = await authService.register(name, email, password);
        toast.success("Account created successfully! Logging you in...", { id: loadingToast });
      }
      
      onAuth(data);
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Authentication failed. Please verify your details.";
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Side: Branded Design Accent */}
        <div className="md:w-1/2 bg-gradient-to-tr from-sky-400 to-blue-600 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Glowing blur details */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <Link to="/" className="flex items-center gap-2.5 z-10 self-start">
            <div className="w-9 h-9 rounded-xl bg-white text-sky-500 flex items-center justify-center font-extrabold shadow-md">
              C
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight">
              CareSync
            </span>
          </Link>
          
          <div className="my-10 z-10 flex flex-col gap-3">
            <span className="text-sky-100 text-xs font-bold uppercase tracking-wider">Secure Portal</span>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Intelligent medicine monitoring starts here.
            </h2>
            <p className="text-sky-100/80 text-sm font-semibold mt-1">
              Access patients database, configure twilio automated dispatchers, and monitor status live in your safe database.
            </p>
          </div>

          <p className="text-xs text-sky-100/60 font-semibold z-10">
            © 2026 CareSync Systems. All Rights Reserved.
          </p>
        </div>

        {/* Right Side: Auth Inputs Form */}
        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {isLogin ? "Sign In" : "Get Started"}
            </h3>
            <p className="text-slate-400 text-xs font-semibold mt-1.5 mb-6">
              {isLogin ? "Enter credentials to access admin database" : "Set up your medical manager credentials"}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <div className="flex flex-col gap-1.5 animate-fadeIn">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dr. Ramesh" 
                    value={name}
                    onChange={e => setName(e.target.value)} 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-sky-500 focus:bg-white placeholder-slate-400 transition-colors"
                  />
                </div>
              )}
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@clinic.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)} 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-sky-500 focus:bg-white placeholder-slate-400 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Secure Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)} 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-sky-500 focus:bg-white placeholder-slate-400 transition-colors"
                />
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                disabled={loading}
                className="w-full py-3 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  isLogin ? "Sign In to Portal" : "Create Admin Account"
                )}
              </Button>
            </form>

            <p className="text-center text-xs font-semibold text-slate-400 mt-6">
              {isLogin ? "Don't have an admin profile?" : "Already registered as admin?"}{" "}
              <button 
                onClick={toggle} 
                className="text-sky-500 hover:text-sky-600 transition-colors cursor-pointer font-bold ml-0.5"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
