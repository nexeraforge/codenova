import React from "react";
import { useAuth } from "./AuthContext";
import { Flame, Coins, Award, Sparkles, BookOpen, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, changeLanguage } = useAuth();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 h-20 w-full bg-white border-b-2 border-slate-200 px-3 sm:px-4 md:px-8 flex flex-row items-center justify-between gap-2 sm:gap-4 select-none">
      {/* Dynamic Course Pathway Toggles */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onMenuToggle && (
          <button
            id="btn-mobile-menu-toggle"
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl border-2 border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-705 transition-all outline-none cursor-pointer shrink-0"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-50 text-[#58CC02] border-2 border-emerald-100/80 px-2 sm:px-4 py-1.5 sm:py-2 rounded-2xl">
          <span className="text-lg sm:text-xl">🐍</span>
          <span className="font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-sans select-none whitespace-nowrap">
            Python<span className="hidden sm:inline"> Pathway</span>
          </span>
        </div>
      </div>

      {/* Gamification indicators */}
      <div className="flex items-center gap-4 sm:gap-6 md:gap-8 font-black">
        {/* Streak 🔥 */}
        <motion.div
          id="indicator-streak"
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-help shrink-0"
          title="Daily Learning Streak"
        >
          <span className="text-[#FF4B4B] text-base sm:text-lg md:text-xl flex items-center gap-1 sm:gap-1.5 font-black uppercase">
            <span>🔥</span>
            <span>{user.streak}</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 hidden md:inline ml-0.5">streak</span>
          </span>
        </motion.div>

        {/* NovaCoins 🪙 */}
        <motion.div
          id="indicator-coins"
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 shrink-0"
          title="NovaCoins Wallet"
        >
          <span className="text-[#FFC800] text-base sm:text-lg md:text-xl flex items-center gap-1 sm:gap-1.5 font-black uppercase">
            <span>🪙</span>
            <span>{user.coins}</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 hidden md:inline ml-0.5">coins</span>
          </span>
        </motion.div>

        {/* XP Progress Bar to next Level (adapted style) */}
        <div className="hidden lg:flex flex-col items-end gap-1.5 w-36">
          <div className="flex items-center justify-between w-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>LVL {user.level}</span>
            <span className="text-[#1899D6] font-black">{user.xp % 250}/250 XP</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border-2 border-slate-200/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((user.xp % 250) / 250) * 100}%` }}
              transition={{ duration: 0.6 }}
              className="h-full bg-[#1CB0F6] rounded-full"
            />
          </div>
        </div>

        {/* User profile identifier (hidden on tiny screens for maximum spacing safety) */}
        <div className="hidden sm:flex items-center gap-3 border-l-2 border-slate-200 pl-4 sm:pl-6 h-8 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-slate-200 overflow-hidden flex items-center justify-center bg-orange-100 shrink-0 select-none text-xl">
            🦊
          </div>
          <div className="hidden xl:block text-left">
            <p className="font-extrabold text-sm text-slate-800 leading-none mb-1">{user.name}</p>
            <p className="font-black text-[9px] text-[#58CC02] uppercase tracking-widest leading-none">
              {user.rank} LEAGUE
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
