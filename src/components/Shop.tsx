import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { Coins, ShoppingBag, Check, ShieldAlert, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Shop: React.FC = () => {
  const { shopItems, user, purchaseItem } = useAuth();
  const [purchaseStatus, setPurchaseStatus] = useState<{ id: string; success: boolean; msg: string } | null>(null);

  if (!user) return null;

  const handlePurchase = (itemId: string, price: number) => {
    const isOwned = user.purchasedItems.includes(itemId);
    if (isOwned && itemId !== "streak_freeze") { // can buy multiple streak freezes
      setPurchaseStatus({ id: itemId, success: false, msg: "You already own this item!" });
      return;
    }

    if (user.coins < price) {
      setPurchaseStatus({ id: itemId, success: false, msg: "Insufficient NovaCoins!" });
      return;
    }

    const completed = purchaseItem(itemId, price);
    if (completed) {
      setPurchaseStatus({ id: itemId, success: true, msg: "Item unlocked successfully!" });
    } else {
      setPurchaseStatus({ id: itemId, success: false, msg: "Purchase execution error" });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 md:px-8 space-y-8 select-none">
      <div className="text-center space-y-3">
        <div className="inline-flex p-4 rounded-2xl bg-[#FFE8E8] border-2 border-[#FF8484] shadow-[0_4px_0_0_#FF4B4B]">
          <ShoppingBag className="w-8 h-8 text-[#FF4B4B] fill-[#FFE8E8]" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Nova Shop</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">
            Exchange your earned coins for magical items to accelerate your roadmap progress!
          </p>
        </div>
      </div>

      {/* Dynamic item listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {shopItems.map((item) => {
          const isOwned = user.purchasedItems.includes(item.id);
          const isStreakFreeze = item.id === "streak_freeze";
          const countOwned = user.purchasedItems.filter(id => id === item.id).length;

          const buttonDisabled = isOwned && !isStreakFreeze;
          const canAfford = user.coins >= item.price;

          return (
            <div
              key={item.id}
              id={`shop-item-${item.id}`}
              className={`bg-white border-2 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-350 transition-all shadow-sm relative overflow-hidden ${
                buttonDisabled ? "bg-slate-50 border-slate-200" : "border-slate-200"
              }`}
            >
              <div>
                {/* Product icon */}
                <div className="w-12 h-12 rounded-xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-2xl mb-4 select-none shrink-0 shadow-inner">
                  {item.icon}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-800 text-sm leading-tight uppercase">{item.title}</h4>
                    {isOwned && !isStreakFreeze && (
                      <span className="text-[8px] bg-emerald-100 font-extrabold text-[#58CC02] border border-[#58CC02]/30 uppercase px-1.5 py-0.5 rounded-md">
                        OWNED
                      </span>
                    )}
                    {isStreakFreeze && countOwned > 0 && (
                      <span className="text-[8px] bg-blue-100 font-extrabold text-blue-700 border border-blue-200/30 uppercase px-1.5 py-0.5 rounded-md">
                        x{countOwned} Saved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Purchase controls and cost details */}
              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 font-black text-[#FFC800] select-none">
                  <Coins className="w-4.5 h-4.5 fill-amber-300" />
                  <span className="font-black text-sm font-mono">{item.price}</span>
                </div>

                <button
                  id={`btn-shop-buy-${item.id}`}
                  onClick={() => handlePurchase(item.id, item.price)}
                  disabled={buttonDisabled}
                  className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider border-2 transition-all cursor-pointer ${
                    buttonDisabled
                      ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                      : canAfford
                      ? "bg-[#58CC02] text-white border-[#58CC02] shadow-[0_3px_0_0_#46a302] active:translate-y-0.5 active:shadow-none"
                      : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  {buttonDisabled ? "Max Limit" : "Unlock"}
                </button>
              </div>

              {/* Individual notification alert banner overlay */}
              <AnimatePresence>
                {purchaseStatus && purchaseStatus.id === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute bottom-0 inset-x-0 py-2 px-3 text-[10px] font-black text-center flex items-center justify-between border-t-2 ${
                      purchaseStatus.success ? "bg-[#58CC02] text-white border-[#58CC02]" : "bg-rose-500 text-white border-rose-500"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {purchaseStatus.success ? <Check className="w-3.5 h-3.5 stroke-[3.5]" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                      <span>{purchaseStatus.msg}</span>
                    </div>
                    <button
                      onClick={() => setPurchaseStatus(null)}
                      className="text-[9px] uppercase font-black tracking-wider bg-black/10 hover:bg-black/20 px-2 py-0.5 rounded cursor-pointer"
                    >
                      OK
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
