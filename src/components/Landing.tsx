import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { 
  Sparkles, 
  Terminal, 
  Code2, 
  ShieldAlert, 
  Award, 
  Star, 
  User, 
  Mail, 
  Lock, 
  HelpCircle, 
  Zap, 
  ArrowRight,
  RefreshCw,
  Layers,
  BookOpen
} from "lucide-react";
import { motion } from "motion/react";

export const Landing: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSignUp, setIsSignUp] = useState(true);
  const [errorStatus, setErrorStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name && isSignUp) {
      setErrorStatus("Name variable is required for compiling profile memory!");
      return;
    }
    if (!formData.email || !formData.password) {
      setErrorStatus("All standard credential ports are required!");
      return;
    }

    try {
      setErrorStatus("");
      setIsLoading(true);
      if (isSignUp) {
        await signUpWithEmail(formData.name, formData.email, formData.password);
      } else {
        await loginWithEmail(formData.email, formData.password);
      }
    } catch (err: any) {
      setErrorStatus(err.message || "Authentication process failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden selection:bg-emerald-100">
      
      {/* Decorative Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-200/20 blur-[120px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400/10 blur-[130px]" />
        <div className="absolute top-[30%] right-[10%] w-[35%] h-[35%] rounded-full bg-amber-100/30 blur-[100px] animate-pulse duration-[12000ms]" />
        
        {/* Subtle grid elements */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-60" />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center justify-center my-8 relative z-10">

        {/* Visual Hero Branding Columns */}
        <div className="lg:col-span-7 space-y-10 text-center lg:text-left px-2">
          
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-100/80 hover:bg-emerald-200/90 text-emerald-800 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-sm border border-emerald-200/50 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-300" />
            <span className="font-display font-bold">AI-Powered Education</span>
          </motion.div>

          {/* Dynamic Hero Headings */}
          <div className="space-y-5">
            <h1 className="text-5xl md:text-6xl font-display font-black text-slate-1500 tracking-tight leading-[1.05]">
              Learn coding <br />
              like a <span className="relative inline-block text-emerald-500">
                game
                <span className="absolute left-0 bottom-1 w-full h-[6px] bg-emerald-200 -z-10 rounded-full" />
              </span>.
            </h1>
            <p className="text-slate-600 text-lg md:text-xl font-medium max-w-lg leading-relaxed font-sans mx-auto lg:mx-0">
              Master <strong className="text-emerald-700 font-extrabold font-display">Python</strong> through bite-sized, gamified roadmaps. Learn
              syntax, solve sandboxed code challenges, and get instant reviews from <strong className="text-amber-500 font-bold">Gemini AI</strong>!
            </p>
            <div className="pt-2 flex justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const inputEl = document.getElementById("input-auth-name") || document.getElementById("input-auth-email");
                  if (inputEl) {
                    inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
                    setTimeout(() => {
                      inputEl.focus();
                    }, 500);
                  } else {
                    const fallbackEl = document.getElementById("tab-auth-signup");
                    if (fallbackEl) {
                      fallbackEl.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }
                }}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#58CC02] hover:brightness-105 text-white font-display font-black text-xs sm:text-sm uppercase tracking-widest rounded-2xl border-b-4 border-[#3ca201] active:border-b-0 active:translate-y-[4px] shadow-sm hover:shadow transition-all cursor-pointer outline-none"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </motion.button>
            </div>
          </div>

          {/* Clean Redesigned 4-Column App statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto lg:mx-0">
            {[
              { 
                label: "Units", 
                value: "5", 
                icon: <Layers className="w-5 h-5 text-emerald-600" />
              },
              { 
                label: "Chapters", 
                value: "30", 
                icon: <BookOpen className="w-5 h-5 text-indigo-500" />
              },
              { 
                label: "Interactive Quizzes", 
                value: "600+", 
                icon: <HelpCircle className="w-5 h-5 text-blue-500" />
              },
              { 
                label: "AI Evaluated", 
                value: "Instant", 
                icon: <Zap className="w-5 h-5 text-amber-500" />
              }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white p-4.5 rounded-2xl border-2 border-slate-100 shadow-sm text-center flex flex-col items-center justify-center relative overflow-hidden group"
              >
                {/* Decorative absolute element */}
                <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-full bg-slate-50 transition-colors group-hover:bg-slate-100" />
                <div className="p-2.5 rounded-full mb-2 bg-slate-100/50">
                  {stat.icon}
                </div>
                <p className="text-xl sm:text-2xl font-display font-black text-slate-900 leading-none mb-1">{stat.value}</p>
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Rocket Mascot Speech Bubble Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative flex flex-col sm:flex-row items-center gap-5 bg-white border-2 border-slate-150/80 rounded-3xl p-6 shadow-sm max-w-lg mx-auto lg:mx-0"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-5xl shrink-0 select-none"
            >
              🚀
            </motion.div>
            <div className="relative bg-slate-50 border border-slate-200/50 p-4 rounded-2xl text-left w-full">
              {/* Speech Bubble Arrow for desktop screens */}
              <div className="hidden sm:block absolute top-[28px] -left-2 w-4.5 h-4.5 bg-slate-50 border-l border-b border-slate-200/50 rotate-45 transform" />
              
              <p className="font-medium text-sm text-slate-700 leading-relaxed">
                "Hi there! I am Nova, your AI Coach booster. Launch your active learning profile, earn NovaCoins, and let's compile loops high into orbit!"
              </p>
              <div className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest mt-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span>Coach Nova (Gemini Rocket Bot)</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Beautiful Modern Redesigned Auth Card Box */}
        <div className="lg:col-span-5 bg-white p-8 md:p-10 rounded-3xl border-2 border-slate-150 shadow-[0_8px_0_0_#e2e8f0] w-full max-w-md mx-auto relative overflow-hidden">
          
          {/* Custom Tabs */}
          <div className="flex border-b-2 border-slate-100 pb-0 mb-8 gap-4 justify-between">
            <button
              id="tab-auth-signup"
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorStatus("");
              }}
              className={`flex-1 text-center pb-4.5 font-display font-black text-xs uppercase tracking-widest transition-all cursor-pointer relative ${
                isSignUp ? "text-[#58CC02]" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign Up
              {isSignUp && (
                <motion.div 
                  layoutId="activeTabIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#58CC02] rounded-full" 
                />
              )}
            </button>
            <button
              id="tab-auth-login"
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorStatus("");
              }}
              className={`flex-1 text-center pb-4.5 font-display font-black text-xs uppercase tracking-widest transition-all cursor-pointer relative ${
                !isSignUp ? "text-[#58CC02]" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Log In
              {!isSignUp && (
                <motion.div 
                  layoutId="activeTabIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#58CC02] rounded-full" 
                />
              )}
            </button>
          </div>

          {/* whitelisting helper if active */}
          {errorStatus === "unauthorized-domain" ? (
            <div className="mb-6 p-5 bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-2xl space-y-3.5">
              <div className="flex items-center gap-2 font-black text-amber-800 text-xs uppercase tracking-wider">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Unauthorized Domain</span>
              </div>
              <p className="text-xs font-semibold text-amber-700 leading-relaxed font-sans">
                Your current workspace url is not whitelisted in the Firebase console for Google Login.
              </p>
              <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Copy this exact domain:</p>
                <div className="flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[10px] text-slate-700 select-all">
                  <span>{typeof window !== "undefined" ? window.location.hostname : "codenova"}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof navigator !== "undefined") {
                        navigator.clipboard.writeText(window.location.hostname);
                      }
                    }}
                    className="text-[10px] text-emerald-600 font-black uppercase tracking-widest hover:underline outline-none cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="text-[11px] space-y-2 font-medium text-slate-700 border-t border-amber-200 pt-3">
                <p className="font-extrabold text-[#3b8a01] uppercase text-[9px] tracking-wider">Quick fix guide:</p>
                <ol className="list-decimal pl-4.5 space-y-1.5 text-[11px] text-slate-600">
                  <li>Go to <a href="https://console.firebase.google.com/project/codenova-78f33/authentication/settings" target="_blank" rel="noopener noreferrer" className="font-bold underline text-amber-900 hover:text-amber-700">Firebase Console Settings</a></li>
                  <li>In **Authorized domains**, click **Add domain**</li>
                  <li>Paste the whitelisted domain and click **Add**</li>
                </ol>
              </div>
              <button
                type="button"
                onClick={() => setErrorStatus("")}
                className="w-full py-2.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-[10px] uppercase tracking-wider rounded-xl outline-none transition-all cursor-pointer shadow-sm"
              >
                Dismiss & Retry
              </button>
            </div>
          ) : errorStatus && (
            <div className="mb-5 p-4 bg-rose-50 border-2 border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-start gap-2.5 leading-relaxed">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorStatus}</span>
            </div>
          )}

          {/* Redesigned Active Credentials Inputs */}
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Your Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-450">
                    <User className="w-4 h-4 text-slate-450" />
                  </div>
                  <input
                    type="text"
                    id="input-auth-name"
                    placeholder="e.g. Code Champion"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 text-sm focus:border-[#58CC02] focus:ring-1 focus:ring-[#58CC02]/20 outline-none transition-all font-medium placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                School/Dev Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-450">
                  <Mail className="w-4 h-4 text-slate-450" />
                </div>
                <input
                  type="email"
                  id="input-auth-email"
                  placeholder="developer@codenova.org"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 text-sm focus:border-[#58CC02] focus:ring-1 focus:ring-[#58CC02]/20 outline-none transition-all font-medium placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Strong Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-450">
                  <Lock className="w-4 h-4 text-slate-450" />
                </div>
                <input
                  type="password"
                  id="input-auth-password"
                  placeholder="••••••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 text-sm focus:border-[#58CC02] focus:ring-1 focus:ring-[#58CC02]/20 outline-none transition-all font-medium placeholder-slate-400"
                />
              </div>
            </div>

            {/* Main Tactile Action Button */}
            <button
              id="submit-auth-form"
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-[#58CC02] text-white font-display font-black text-sm uppercase tracking-widest border-b-4 border-[#3ca201] active:border-b-0 active:translate-y-[4px] shadow-md hover:brightness-105 transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Configuring Engine...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? "INITIALIZE CODING PATH" : "RESUME GAMEPLAY"}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>
          </form>

          {/* Or Divider */}
          <div className="relative my-8 text-center select-none">
            <hr className="border-slate-100" />
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-4 text-[10px] font-bold uppercase tracking-widest text-slate-350 leading-none">
              OR
            </span>
          </div>

          {/* Social login Button */}
          <button
            id="google-mock-login"
            type="button"
            disabled={isLoading}
            onClick={async () => {
              try {
                setErrorStatus("");
                setIsLoading(true);
                await loginWithGoogle();
              } catch (err: any) {
                setErrorStatus(err.message || "Google Authentic Login failed!");
              } finally {
                setIsLoading(false);
              }
            }}
            className="w-full py-3.5 border-2 border-slate-200 text-xs font-display font-black uppercase tracking-wider text-slate-600 flex items-center justify-center gap-2.5 shadow-[0_3px_0_0_#e2e8f0] hover:bg-slate-50 active:translate-y-[2px] active:shadow-none transition-all cursor-pointer outline-none rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Crisp Custom SVG Google 'G' icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Google Authentic Login</span>
          </button>

        </div>

      </div>
    </div>
  );
};
