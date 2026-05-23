import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Landing } from "./components/Landing";
import { Roadmap } from "./components/Roadmap";
import { Playground } from "./components/Playground";
import { Leaderboard } from "./components/Leaderboard";
import { Shop } from "./components/Shop";
import { Profile } from "./components/Profile";
import { getChaptersByLanguage } from "./data/lessonsData";
import { Chapter } from "./types";
import { Sparkles, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const DAILY_COACH_TIPS = [
  "Python tip: Lists are mutable, but Tuples are faster and consume less system memory!",
  "Python tip: String values can be sliced easily. Try text[0:3] to capture first initials!",
  "Python tip: Indentation defines block scope. Keep 4 spaces standard to prevent runtime syntax issues.",
  "Python tip: Write helper functions to keep code DRY (Don't Repeat Yourself)!",
  "AI tip: Unlock golden badges by completing MCQ quizzes and submitting code assignments!"
];

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("learn");
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [activeElement, setActiveElement] = useState<"lesson" | "quiz" | "assignment" | null>(null);
  const [coachTip, setCoachTip] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Select a random daily tip on component build
  useEffect(() => {
    const randomTip = DAILY_COACH_TIPS[Math.floor(Math.random() * DAILY_COACH_TIPS.length)];
    setCoachTip(randomTip);
  }, [activeTab]);

  if (!user) {
    return <Landing />;
  }

  const chapters = getChaptersByLanguage(user.activeLanguage);

  // Complete array details
  const doneLessons = user.completedLessons[user.activeLanguage] || [];
  const doneQuizzes = user.completedQuizzes[user.activeLanguage] || [];
  const doneAssignments = user.completedAssignments[user.activeLanguage] || [];

  return (
    <div className="flex flex-row min-h-screen bg-slate-50/50">
      {/* Sticky High-Contrast Sidebar Menu */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveChapter(null);
          setActiveElement(null);
        }}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main workspace area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dynamic header stats bar */}
        <Header onMenuToggle={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic primary layout content container */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeChapter && activeElement ? (
              /* Immersive play arena splits */
              <motion.div
                key="playground"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full bg-white"
              >
                <Playground
                  chapter={activeChapter}
                  activeElement={activeElement}
                  onClose={() => {
                    setActiveChapter(null);
                    setActiveElement(null);
                  }}
                />
              </motion.div>
            ) : (
              /* Core dashboard menus */
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full"
              >
                {activeTab === "learn" && (
                  <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left side maps path */}
                    <div className="flex-1 w-full">
                      <Roadmap
                        chapters={chapters}
                        completedChapters={doneLessons}
                        completedQuizzes={doneQuizzes}
                        completedAssignments={doneAssignments}
                        onSelectChapterElement={(ch, element) => {
                          setActiveChapter(ch);
                          setActiveElement(element);
                        }}
                      />
                    </div>

                    {/* Right side floating widgets panels */}
                    <div className="w-full lg:w-72 space-y-6 lg:sticky lg:top-24 shrink-0">
                      {/* Coach speech bubble tip */}
                      <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm text-left relative space-y-3">
                        <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs uppercase tracking-wider">
                          <Compass className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                          <span>AI Coach Advice</span>
                        </div>
                        <p className="text-gray-600 text-xs font-semibold leading-normal">
                          "{coachTip}"
                        </p>
                        <hr className="border-gray-100 my-1" />
                        <div className="flex items-center gap-3">
                          <span className="text-2xl animate-pulse">🚀</span>
                          <div>
                            <p className="font-extrabold text-[10px] text-gray-800">Novabot Rocket Coach</p>
                            <p className="text-[8px] text-emerald-500 font-black tracking-widest uppercase">Verified Mentor</p>
                          </div>
                        </div>
                      </div>

                      {/* Course progress overview card */}
                      <div className="bg-gradient-to-br from-gray-900 to-slate-800 p-5 rounded-3xl text-white shadow-md relative overflow-hidden">
                        <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-white/5 rounded-full blur-lg pointer-events-none" />
                        <h4 className="font-extrabold text-sm tracking-tight mb-2 uppercase text-gray-400">Sandbox Certifications</h4>
                        <div className="space-y-3 pt-1">
                          <div>
                            <div className="flex justify-between items-center text-[10px] text-gray-300 font-bold uppercase mb-1">
                              <span>🐍 Python Pathway</span>
                              <span className="text-emerald-400 font-black">{doneLessons.length} / 30</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-400 rounded-full"
                                style={{ width: `${(doneLessons.length / 30) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "leaderboard" && <Leaderboard />}
                {activeTab === "shop" && <Shop />}
                {activeTab === "profile" && <Profile />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
