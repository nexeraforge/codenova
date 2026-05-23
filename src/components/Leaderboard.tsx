import React from "react";
import { useAuth } from "./AuthContext";
import { Trophy, Award, Crown, Zap } from "lucide-react";
import { motion } from "motion/react";

export const Leaderboard: React.FC = () => {
  const { leaderboard, user } = useAuth();

  // Pick top 3 for podium visualization
  const podiumMembers = leaderboard.slice(0, 3);
  // Rest of the list
  const listMembers = leaderboard.slice(3);

  // Re-order podium for typical [2nd, 1st, 3rd] physical layout represent
  const physicallyOrderedPoints = [
    podiumMembers[1], // 2nd place
    podiumMembers[0], // 1st place
    podiumMembers[2] // 3rd place
  ].filter(Boolean);

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 md:px-8 space-y-10 select-none">
      <div className="text-center space-y-3">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="inline-flex p-4 rounded-2xl bg-[#FFF4D0] border-2 border-[#FFC800] shadow-[0_4px_0_0_#d1a100]"
        >
          <Trophy className="w-8 h-8 text-[#FFC800] fill-[#FFF4D0]" />
        </motion.div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Silver League</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">
            Top 3 gain bonus certificates! Updates after every NovaCoins transaction
          </p>
        </div>
      </div>

      {/* Podium Top 3 Visualization */}
      {podiumMembers.length > 0 && (
        <div className="grid grid-cols-3 gap-3 md:gap-4 items-end justify-center pt-6 max-w-md mx-auto min-h-[240px]">
          {physicallyOrderedPoints.map((item, idx) => {
            const isFirst = item.rank === 1;
            const isSecond = item.rank === 2;
            const isThird = item.rank === 3;

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex flex-col items-center justify-end h-full"
              >
                {/* Competitor Profile Sphere */}
                <div className="flex flex-col items-center gap-2 mb-3 relative">
                  {isFirst && (
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-7 z-10 text-xl"
                    >
                      👑
                    </motion.div>
                  )}
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl border-4 bg-white shadow-sm z-10 ${
                      isFirst
                        ? "border-[#FFC800] ring-4 ring-[#FFC800]/20"
                        : isSecond
                        ? "border-slate-300"
                        : "border-[#CD7F32]"
                    }`}
                  >
                    {item.avatar}
                  </div>
                  {/* Rank Badge Indicator */}
                  <span
                    className={`absolute bottom-[-6px] px-3 py-0.5 rounded-full font-black text-[10px] text-white shadow-sm uppercase leading-none z-20 ${
                      isFirst ? "bg-[#FFC800]" : isSecond ? "bg-slate-400" : "bg-[#CD7F32]"
                    }`}
                  >
                    #{item.rank}
                  </span>
                </div>

                {/* Vertical Podium Column Pedestal */}
                <div
                  className={`w-full text-center p-3 rounded-t-2xl shadow-sm border-2 border-slate-200/60 border-b-0 flex flex-col items-center justify-center gap-1 bg-slate-50 ${
                    isFirst
                      ? "h-36 border-t-4 border-t-[#FFC800] bg-[#FFFDE7]"
                      : isSecond
                      ? "h-28 border-t-4 border-t-slate-400 bg-slate-50"
                      : "h-20 border-t-4 border-t-[#CD7F32] bg-[#FFFBF0]"
                  }`}
                >
                  <p className="font-extrabold text-xs text-slate-700 truncate max-w-full px-1">{item.name}</p>
                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 select-none">
                    <span className="font-mono font-black">🪙 {item.coins} <span className="text-[7px] font-bold">coins</span></span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Scrollable list of other ranks */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 md:p-4 space-y-2 max-w-md mx-auto">
        {listMembers.map((item, index) => {
          const isUser = item.isCurrentUser;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              id={`leaderboard-rank-${item.rank}`}
              className={`flex items-center justify-between p-3 rounded-xl transition-all border-2 ${
                isUser
                  ? "bg-[#E8F8FF] border-[#84D8FF] pr-4 shadow-[0_3px_0_0_#84D8FF]"
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3.5">
                {/* Ranking indices */}
                <span className="font-mono text-sm font-black text-slate-400 w-6 text-center select-none">
                  {item.rank}
                </span>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0 select-none">
                  {item.avatar}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-700 leading-none">{item.name}</span>
                    <span className="text-[8px] font-black bg-slate-100 px-1.5 py-0.5 rounded-md text-slate-400 uppercase tracking-wider">{item.badge}</span>
                  </div>
                  <p className="text-[8px] font-black text-slate-400 mt-1 uppercase tracking-wider">Active Challenger</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pr-1 select-none">
                <span className="font-mono font-black text-amber-500 text-sm flex items-center gap-1">
                  <span>🪙</span>
                  <span>{item.coins}</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
