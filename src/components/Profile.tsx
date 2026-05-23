import React from "react";
import { useAuth } from "./AuthContext";
import { Award, Zap, Flame, Coins, Check, RefreshCw, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export const Profile: React.FC = () => {
  const { user, badges, resetProgress } = useAuth();

  if (!user) return null;

  const handleReset = () => {
    if (window.confirm("Are you sure you want to delete all learning data and reset your CodeNova developer scores? This action is permanent!")) {
      resetProgress();
    }
  };

  const completedPythonCount = user.completedLessons.python?.length || 0;

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 md:px-8 space-y-8 select-none">
      {/* Visual top banner */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-slate-200 flex items-center justify-center text-4xl shrink-0 select-none shadow-inner">
          🧑‍🚀
        </div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
            <h2 className="text-2xl font-black text-slate-800 leading-none">{user.name}</h2>
            <span className="text-[9px] bg-emerald-50 border-2 border-[#58CC02]/20 font-black text-[#3b8a01] uppercase px-2 py-0.5 rounded-md tracking-wider">
              {user.rank} League
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono tracking-wide">{user.email}</p>
          <p className="text-xs text-slate-500 font-bold leading-none">CodeNova Certified Sandbox Engineer</p>
        </div>

        {/* Dashboard Actions */}
        <div className="shrink-0">
          <button
            id="btn-profile-recompile"
            onClick={handleReset}
            className="px-4 py-2 bg-white border-2 border-rose-500 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_3px_0_0_#be123c] active:translate-y-0.5 active:shadow-none outline-none"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* Stats counter squares with custom Sleek color layouts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Level Tracker", val: `LVL ${user.level}`, themeClass: "bg-[#E8F8FF] border-[#84D8FF] text-[#1899D6]", emoji: "⭐" },
          { label: "Day Streak", val: `${user.streak} Days`, themeClass: "bg-[#FFE8E8] border-[#FF8484] text-[#FF4B4B]", emoji: "🔥" },
          { label: "Total Coins", val: `${user.coins}`, themeClass: "bg-[#FFFDE7] border-[#FFC800] text-[#E0A000]", emoji: "🪙" },
          { label: "Earned XP", val: `${user.xp} XP`, themeClass: "bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32]", emoji: "⚡" }
        ].map((stat, i) => {
          return (
            <div key={i} className={`p-4 border-2 rounded-2xl flex flex-col justify-between h-24 ${stat.themeClass}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-black/30 leading-none">{stat.label}</span>
                <span className="text-sm select-none">{stat.emoji}</span>
              </div>
              <p className="font-black text-lg uppercase tracking-tight leading-none">{stat.val}</p>
            </div>
          );
        })}
      </div>

      {/* Progression details track levels */}
      <div className="w-full">
        {/* Python Track Progression */}
        <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl select-none">🐍</span>
            <div>
              <h4 className="font-black text-sm text-slate-800 uppercase leading-none">Python Program Pathway</h4>
              <p className="text-[9px] text-[#58CC02] font-black uppercase tracking-widest leading-none mt-1">Syllabus Milestones</p>
            </div>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <span>Chapters Executed</span>
              <span className="text-[#58CC02] font-black">{completedPythonCount} / 30 modules</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200/50">
              <div
                className="h-full bg-[#58CC02] rounded-full"
                style={{ width: `${Math.min((completedPythonCount / 30) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Badge Trophy Cabinet Showcase */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="font-black text-lg text-slate-800 border-b-2 border-slate-100 pb-3 flex items-center gap-2.5 uppercase tracking-wide">
          <Award className="w-5 h-5 text-[#FFC800] fill-[#FFF3CC]" />
          <span>Award Trophy Showcase</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const isUnlocked = user.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                id={`badge-trophy-${badge.id}`}
                className={`p-4 rounded-xl border-2 text-center flex flex-col items-center justify-center gap-2 transition-all relative select-none ${
                  isUnlocked
                    ? "bg-[#FFFDE7] border-[#FFC800] text-slate-800 shadow-[0_3px_0_0_#FFC800]"
                    : "bg-slate-50 border-slate-200/60 text-slate-300"
                }`}
              >
                <div className={`text-4xl mb-1 ${isUnlocked ? "filter drop-shadow" : "opacity-30 filter grayscale"}`}>
                  {badge.icon}
                </div>
                <h5 className="font-extrabold text-xs uppercase leading-tight line-clamp-1 text-slate-700">
                  {badge.title}
                </h5>
                <p className="text-[9px] font-medium leading-normal text-slate-400 line-clamp-2 px-1">
                  {badge.description}
                </p>

                {isUnlocked && (
                  <span className="absolute top-1.5 right-1.5 bg-[#FFC800]/20 p-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5 text-[#E0A000] stroke-[4]" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
