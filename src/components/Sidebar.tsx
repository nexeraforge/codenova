import React from "react";
import { useAuth } from "./AuthContext";
import { BookOpen, Trophy, User, LogOut, X } from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isMobileOpen = false, 
  onCloseMobile 
}) => {
  const { logout, user } = useAuth();

  const menuItems = [
    {
      id: "learn",
      label: "Learn",
      icon: BookOpen,
      activeClass: "bg-[#DDF4FF] border-2 border-[#84D8FF] text-[#1899D6]",
      inactiveClass: "text-slate-500 hover:bg-slate-100 border-2 border-transparent",
      iconClass: "text-[#1899D6]"
    },
    {
      id: "leaderboard",
      label: "Leaderboards",
      icon: Trophy,
      activeClass: "bg-[#FFF4D0] border-2 border-[#FFC800] text-[#E0A000]",
      inactiveClass: "text-slate-500 hover:bg-slate-100 border-2 border-transparent",
      iconClass: "text-[#FFC800]"
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      activeClass: "bg-[#E8F8FF] border-2 border-[#84D8FF] text-blue-500",
      inactiveClass: "text-slate-500 hover:bg-slate-100 border-2 border-transparent",
      iconClass: "text-blue-500"
    }
  ];

  const currentDailyXP = user ? (user.xp % 50) : 15;
  const targetDailyXP = 50;
  const progressPercent = Math.min((currentDailyXP / targetDailyXP) * 100, 100);

  // Common side elements layout renderer
  const renderSidebarElements = (isMobileLayout: boolean) => (
    <>
      {/* Brand logo & tagline & Optional Close Button for mobile */}
      <div className="flex items-center justify-between px-3 py-4 mb-4 select-none">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-[#58CC02] rounded-xl flex items-center justify-center shadow-[0_4px_0_0_#46a302] cursor-pointer text-xl font-black"
            onClick={() => {
              setActiveTab("learn");
              if (onCloseMobile) onCloseMobile();
            }}
          >
            🚀
          </motion.div>
          <span className="text-2xl font-black text-[#58CC02] tracking-tighter uppercase">
            Code<span className="text-[#3b8a01]">Nova</span>
          </span>
        </div>
        {isMobileLayout && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 outline-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation list */}
      <div className="flex-1 flex flex-col space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => {
                setActiveTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`flex items-center space-x-4 px-4 py-3 rounded-xl font-black transition-all text-left uppercase tracking-wide text-sm outline-none cursor-pointer ${
                isActive ? item.activeClass : item.inactiveClass
              }`}
            >
              <Icon className={`w-7 h-7 shrink-0 ${isActive ? "" : item.iconClass}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Daily Goal card block */}
      {user && (
        <div className="mt-auto pb-4">
          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Daily Goal</p>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#58CC02] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-xs font-black text-slate-700 mt-2">{currentDailyXP} / {targetDailyXP} XP</p>
          </div>
        </div>
      )}

      {/* User Mini status and Logout action */}
      <div className="flex flex-col gap-3 pt-2 border-t-2 border-slate-100">
        {user && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/50">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-lg shrink-0 select-none">
              🧑‍🚀
            </div>
            <div className="overflow-hidden">
              <p className="font-extrabold text-xs text-slate-705 truncate">{user.name}</p>
              <p className="text-[10px] text-[#58CC02] font-black uppercase tracking-wider leading-none">
                LVL {user.level} • {user.xp} XP
              </p>
            </div>
          </div>
        )}

        <button
          id="btn-logout"
          onClick={() => {
            logout();
            if (onCloseMobile) onCloseMobile();
          }}
          className="flex items-center space-x-4 px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all text-xs uppercase tracking-wider text-left outline-none cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Backdrop overlay for mobile View */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
        />
      )}

      {/* 2. Slide Drawer for mobile View */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col p-4 shadow-2xl transition-transform duration-300 ease-out border-r-2 border-slate-105 lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {renderSidebarElements(true)}
      </div>

      {/* 3. Standard Desktop Sidebar (Full-size / Compact-size responsive) */}
      <nav className="w-64 max-lg:w-20 border-r-2 border-slate-200 flex flex-col p-4 space-y-2 h-screen sticky top-0 bg-white shrink-0 max-lg:hidden">
        {/* Brand logo & tagline */}
        <div className="flex items-center space-x-3 px-3 py-4 mb-4 select-none">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-[#58CC02] rounded-xl flex items-center justify-center shadow-[0_4px_0_0_#46a302] cursor-pointer text-xl"
            onClick={() => setActiveTab("learn")}
          >
            🚀
          </motion.div>
          <span className="text-2xl font-black text-[#58CC02] tracking-tighter uppercase max-lg:hidden">
            Code<span className="text-[#3b8a01]">Nova</span>
          </span>
        </div>

        {/* Navigation list */}
        <div className="flex-1 flex flex-col space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-4 px-4 py-3 rounded-xl font-black transition-all text-left uppercase tracking-wide text-sm outline-none cursor-pointer ${
                  isActive ? item.activeClass : item.inactiveClass
                }`}
              >
                <Icon className={`w-7 h-7 shrink-0 ${isActive ? "" : item.iconClass}`} />
                <span className="max-lg:hidden">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Daily Goal card block */}
        {user && (
          <div className="mt-auto pb-4 max-lg:hidden">
            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Daily Goal</p>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#58CC02] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-xs font-black text-slate-700 mt-2">{currentDailyXP} / {targetDailyXP} XP</p>
            </div>
          </div>
        )}

        {/* User Mini status and Logout action */}
        <div className="flex flex-col gap-3 pt-2 border-t-2 border-slate-100">
          {user && (
            <div className="flex items-center gap-3 p-2 rounded-xl max-lg:hidden bg-slate-50/50">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-lg shrink-0">
                🧑‍🚀
              </div>
              <div className="overflow-hidden">
                <p className="font-extrabold text-xs text-slate-700 truncate">{user.name}</p>
                <p className="text-[10px] text-[#58CC02] font-black uppercase tracking-wider leading-none">
                  LVL {user.level} • {user.xp} XP
                </p>
              </div>
            </div>
          )}

          <button
            id="btn-logout"
            onClick={() => logout()}
            className="flex items-center space-x-4 px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all text-xs uppercase tracking-wider text-left outline-none cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="max-lg:hidden">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};
