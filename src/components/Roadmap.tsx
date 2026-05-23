import React, { useState } from "react";
import { Chapter } from "../types";
import { Play, Check, Lock, Award, ShieldAlert, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RoadmapProps {
  chapters: Chapter[];
  completedChapters: number[];
  completedQuizzes: number[];
  completedAssignments: number[];
  onSelectChapterElement: (chapter: Chapter, element: "lesson" | "quiz" | "assignment") => void;
}

export const Roadmap: React.FC<RoadmapProps> = ({
  chapters,
  completedChapters,
  completedQuizzes,
  completedAssignments,
  onSelectChapterElement
}) => {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 768);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const waveXMultiplier = isMobile ? 48 : 115;

  // Group chapters by Level representing Units
  const unitsMap: { [unitKey: string]: Chapter[] } = {};
  chapters.forEach((ch) => {
    if (!unitsMap[ch.level]) {
      unitsMap[ch.level] = [];
    }
    unitsMap[ch.level].push(ch);
  });

  const levelColorConfig: { [key: string]: { border: string; bg: string; text: string; lightBg: string; shadow: string; shadowHex: string } } = {
    Beginner: { border: "border-[#58CC02]", bg: "bg-[#58CC02]", text: "text-[#3b8a01]", lightBg: "bg-emerald-50", shadow: "shadow-[0_6px_0_0_#46a302]", shadowHex: "#46a302" },
    Intermediate: { border: "border-[#1CB0F6]", bg: "bg-[#1CB0F6]", text: "text-[#148abf]", lightBg: "bg-sky-50", shadow: "shadow-[0_6px_0_0_#148abf]", shadowHex: "#148abf" },
    OOP: { border: "border-[#FFC800]", bg: "bg-[#FFC800]", text: "text-[#d1a100]", lightBg: "bg-amber-50", shadow: "shadow-[0_6px_0_0_#d1a100]", shadowHex: "#d1a100" },
    Advanced: { border: "border-[#FF4B4B]", bg: "bg-[#FF4B4B]", text: "text-[#c23232]", lightBg: "bg-rose-50", shadow: "shadow-[0_6px_0_0_#c23232]", shadowHex: "#c23232" },
    Projects: { border: "border-[#8A2BE2]", bg: "bg-[#8A2BE2]", text: "text-[#5f13a3]", lightBg: "bg-purple-50", shadow: "shadow-[0_6px_0_0_#5f13a3]", shadowHex: "#5f13a3" }
  };

  const levelsSequence: ("Beginner" | "Intermediate" | "OOP" | "Advanced" | "Projects")[] = [
    "Beginner",
    "Intermediate",
    "OOP",
    "Advanced",
    "Projects"
  ];

  // A chapter is unlocked if and only if all preceding chapters are fully completed
  const isChapterUnlocked = (ch: Chapter): boolean => {
    const globalIdx = chapters.findIndex((c) => c.id === ch.id);
    if (globalIdx <= 0) return true;

    // Direct mathematical scan ensuring strict chronological mastery
    for (let i = 0; i < globalIdx; i++) {
      const prevCh = chapters[i];
      const isPrevCompleted =
        completedChapters.includes(prevCh.id) &&
        completedQuizzes.includes(prevCh.id) &&
        completedAssignments.includes(prevCh.id);

      if (!isPrevCompleted) {
        return false;
      }
    }

    return true;
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 flex flex-col items-center selection:bg-sky-100">
      {/* Background decorative path line connector */}
      <div className="absolute top-0 bottom-0 w-2.5 bg-slate-100 -z-0 rounded-full left-1/2 -translate-x-1/2 pointer-events-none block"></div>

      {/* Dynamic Unit lists mapping */}
      {levelsSequence.map((levelName, unitIdx) => {
        const levelChapters = unitsMap[levelName];
        if (!levelChapters || levelChapters.length === 0) return null;

        const colors = levelColorConfig[levelName] || levelColorConfig.Beginner;

        return (
          <div key={levelName} className="w-full mb-16 flex flex-col items-center relative z-10">
            {/* Unit Header Block in 2.5D */}
            <div className={`w-full ${colors.bg} ${colors.shadow} border-2 border-black/10 text-white rounded-2xl p-6 mb-12 flex justify-between items-center select-none`}>
              <div className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-wider text-white/80">Unit {unitIdx + 1}</h2>
                <h3 className="text-xl font-black uppercase tracking-tight">{levelName} Core Foundations</h3>
                <p className="text-xs font-bold text-white/90">
                  Modules: {levelChapters.filter((c) => completedChapters.includes(c.id)).length} / {levelChapters.length} accomplished
                </p>
              </div>
              <div className="text-3xl bg-white/20 p-3 rounded-xl border border-white/10 shrink-0">
                {levelName === "Beginner" && "🌱"}
                {levelName === "Intermediate" && "🧭"}
                {levelName === "OOP" && "🧩"}
                {levelName === "Advanced" && "🤖"}
                {levelName === "Projects" && "🏆"}
              </div>
            </div>

            {/* Path Serpentine Line Connector System */}
            <div className="flex flex-col items-center space-y-12 relative w-full">
              {levelChapters.map((ch, idx) => {
                const isUnlocked = isChapterUnlocked(ch);
                const isLessonDone = completedChapters.includes(ch.id);
                const isQuizDone = completedQuizzes.includes(ch.id);
                const isAssignmentDone = completedAssignments.includes(ch.id);

                const isFullyMastered = isLessonDone && isQuizDone && isAssignmentDone;

                // Calculate serpentine horizontal offset mimicking Duolingo
                const waveOffsetDeg = idx * 60;
                const waveX = Math.round(Math.sin((waveOffsetDeg * Math.PI) / 180) * waveXMultiplier);

                const isOpen = selectedNode === ch.id;

                // Configure node core color & shadow values
                let nodeBg = "bg-[#E5E7EB]";
                let nodeShadow = "shadow-[0_6px_0_0_#D1D5DB] border-gray-300";
                let circlePartColor = "border-gray-200";

                if (isFullyMastered) {
                  // completed chapters are in green color
                  nodeBg = "bg-[#58CC02]";
                  nodeShadow = "shadow-[0_6px_0_0_#46a302] border-[#7AD03A]";
                  circlePartColor = "border-[#58CC02]";
                } else if (isUnlocked) {
                  // unlocked/in-progress chapters are in yellow color
                  nodeBg = "bg-[#FFC800]";
                  nodeShadow = "shadow-[0_6px_0_0_#d1a100] border-amber-300";
                  circlePartColor = "border-[#FFC800]";
                }

                return (
                  <div
                    key={ch.id}
                    className={`relative flex flex-col items-center select-none ${isOpen ? "z-50" : "z-10"}`}
                    style={{ transform: `translateX(${waveX}px)`, zIndex: isOpen ? 50 : 10 }}
                  >
                    {/* Circle Wrapper matching Duolingo progress look */}
                    <div className="relative w-24 h-24 flex items-center justify-center group">
                      {/* Outer gray track rim */}
                      <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                      
                      {/* Interactive Colored Active rim segment */}
                      {isUnlocked && (
                        <div
                          className={`absolute inset-0 border-8 ${circlePartColor} rounded-full`}
                          style={{
                            clipPath: isFullyMastered
                              ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                              : isQuizDone
                              ? "polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%)"
                              : isLessonDone
                              ? "polygon(50% 50%, 50% 0, 100% 0, 100% 50%)"
                              : "polygon(50% 50%, 50% 0, 100% 0, 100% 0)" // light active
                          }}
                        ></div>
                      )}

                      {/* Circular Interactive Node Button */}
                      <motion.button
                        id={`node-chapter-${ch.id}`}
                        whileTap={isUnlocked ? { y: 4 } : {}}
                        onClick={() => {
                          if (isUnlocked) {
                            setSelectedNode(isOpen ? null : ch.id);
                          }
                        }}
                        className={`w-16 h-16 rounded-full flex items-center justify-center relative cursor-pointer outline-none border-2 text-white active:translate-y-1 active:shadow-none transition-all ${nodeBg} ${nodeShadow}`}
                      >
                        {isFullyMastered ? (
                          <Check className="w-8 h-8 stroke-[4.5]" />
                        ) : isUnlocked ? (
                          <span className="text-2xl font-bold leading-none">
                            {levelName === "Beginner" && "🐍"}
                            {levelName === "Intermediate" && "☕"}
                            {levelName === "OOP" && "🧩"}
                            {levelName === "Advanced" && "🤖"}
                            {levelName === "Projects" && "🏆"}
                          </span>
                        ) : (
                          <Lock className="w-6 h-6 text-slate-400" />
                        )}

                        {/* Floating node label banner */}
                        {isUnlocked && !isLessonDone && (
                          <div className="absolute top-[-36px] bg-white border-2 border-slate-200 text-slate-700 text-[10px] font-black py-1 px-3 rounded-xl shadow-lg uppercase whitespace-nowrap tracking-wide leading-none select-none pointer-events-none z-30">
                            {ch.title.split(" ")[0] || "Start"}
                          </div>
                        )}
                      </motion.button>
                    </div>

                    {/* Expandable Action Popovers Modals */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          id={`popover-node-${ch.id}`}
                          initial={{ opacity: 0, y: 15, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.9 }}
                          className="absolute top-24 z-50 bg-white border-2 border-slate-200 p-5 rounded-2xl shadow-xl w-64 text-center flex flex-col items-center gap-4"
                        >
                          {/* Anchor arrow indicator */}
                          <div className="absolute top-[-9px] left-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-white border-t-2 border-l-2 border-slate-200 rotate-45" />

                          <div className="text-center w-full">
                            <h4 className="font-extrabold text-sm text-slate-800 leading-snug line-clamp-1 uppercase">
                              {ch.title}
                            </h4>
                            <p className="text-[10px] font-black text-[#58CC02] uppercase tracking-wider mt-0.5">
                              Chapter {ch.id} • {ch.difficulty}
                            </p>
                          </div>

                          <span className="text-xs text-slate-500 font-medium line-clamp-2 px-1 leading-relaxed">
                            {ch.description}
                          </span>

                          <div className="flex items-center justify-center gap-2 bg-[#FFFDE7] rounded-xl px-3 py-1.5 font-bold text-[10px] text-[#A07000] border-2 border-[#FFC800]/30 w-full">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
                            <span>First reward: +{ch.coinsReward} coins</span>
                          </div>

                          {/* Individual task checkpoints in Sleek button layout */}
                          <div className="w-full flex flex-col gap-2.5">
                            {/* Step 1: Coding Lesson */}
                            <button
                              id={`node-btn-lesson-${ch.id}`}
                              onClick={() => onSelectChapterElement(ch, "lesson")}
                              className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-between border-2 transition-all text-left cursor-pointer ${
                                isLessonDone
                                  ? "bg-slate-50 text-slate-400 border-slate-200"
                                  : "bg-[#58CC02] text-white border-[#58CC02] hover:brightness-105 shadow-[0_3px_0_0_#46a302] active:translate-y-0.5 active:shadow-none"
                              }`}
                            >
                              <span>1. Concept Lesson</span>
                              {isLessonDone ? <Check className="w-3.5 h-3.5 stroke-[4]" /> : <Play className="w-3 h-3 fill-current" />}
                            </button>

                            {/* Step 2: Adaptive Quiz */}
                            <button
                              id={`node-btn-quiz-${ch.id}`}
                              onClick={() => {
                                if (isLessonDone) {
                                  onSelectChapterElement(ch, "quiz");
                                }
                              }}
                              disabled={!isLessonDone}
                              className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-between border-2 transition-all text-left ${
                                isQuizDone
                                  ? "bg-slate-50 text-slate-400 border-slate-200"
                                  : isLessonDone
                                  ? "bg-[#1CB0F6] text-white border-[#1CB0F6] hover:brightness-105 shadow-[0_3px_0_0_#148abf] active:translate-y-0.5 active:shadow-none cursor-pointer"
                                  : "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed"
                              }`}
                            >
                              <span>2. Concept Quiz</span>
                              {isQuizDone ? <Check className="w-3.5 h-3.5 stroke-[4]" /> : null}
                            </button>

                            {/* Step 3: AI Evaluated Code Assignment */}
                            <button
                              id={`node-btn-assignment-${ch.id}`}
                              onClick={() => {
                                if (isQuizDone) {
                                  onSelectChapterElement(ch, "assignment");
                                }
                              }}
                              disabled={!isQuizDone}
                              className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-between border-2 transition-all text-left ${
                                isAssignmentDone
                                  ? "bg-slate-50 text-slate-400 border-slate-200"
                                  : isQuizDone
                                  ? "bg-[#FFC800] text-slate-800 border-[#FFC800] hover:brightness-105 shadow-[0_3px_0_0_#d1a100] active:translate-y-0.5 active:shadow-none cursor-pointer"
                                  : "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed"
                              }`}
                            >
                              <span>3. AI Review Task</span>
                              {isAssignmentDone ? <Check className="w-3.5 h-3.5 stroke-[4]" /> : null}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
