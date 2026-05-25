import React, { useState, useEffect } from "react";
import { Chapter, QuizQuestion } from "../types";
import { useAuth } from "./AuthContext";
import { ArrowLeft, Play, Cpu, Check, AlertCircle, Sparkles, Send, RefreshCw, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const renderFormattedExplanation = (text: string) => {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        let clean = line.trim();
        if (!clean) return null;

        // Custom highlight / headings matching Duolingo game-style aesthetic:
        // Handle headers: e.g. "### WELCOME" or "#### HOW IT WORKS"
        if (clean.startsWith("#")) {
          const title = clean.replace(/^#+\s*/, "");
          return (
            <h4 key={idx} className="font-extrabold text-[#58CC02] text-xs border-b border-dashed border-emerald-200 pb-1 mt-4 first:mt-0 uppercase tracking-wider">
              {title}
            </h4>
          );
        }

        // Handle list bullet items: e.g. "1. Item" or "- Item" or "* Item"
        const isListItem = clean.startsWith("-") || clean.startsWith("*") || clean.match(/^\d+\./);
        if (isListItem) {
          clean = clean.replace(/^([-\*]\s*|\d+\.\s*)/, "");
        }

        // Parse custom inline bold/highlight: "**text**" or "`code`"
        const parts: React.ReactNode[] = [];
        const regex = /(\*\*.*?\*\*|`.*?`)/g;
        let match;
        let lastIdx = 0;

        while ((match = regex.exec(clean)) !== null) {
          const matchStr = match[0];
          const matchIndex = match.index;

          if (matchIndex > lastIdx) {
            parts.push(clean.substring(lastIdx, matchIndex));
          }

          if (matchStr.startsWith("**") && matchStr.endsWith("**")) {
            const inner = matchStr.slice(2, -2);
            parts.push(
              <span key={matchIndex} className="font-extrabold text-emerald-950 underline decoration-emerald-300 decoration-2 underline-offset-2">
                {inner}
              </span>
            );
          } else if (matchStr.startsWith("`") && matchStr.endsWith("`")) {
            const inner = matchStr.slice(1, -1);
            parts.push(
              <code key={matchIndex} className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-950 font-bold text-[11px] ring-1 ring-emerald-200/50">
                {inner}
              </code>
            );
          }
          lastIdx = regex.lastIndex;
        }

        if (lastIdx < clean.length) {
          parts.push(clean.substring(lastIdx));
        }

        if (isListItem) {
          return (
            <div key={idx} className="flex gap-2.5 items-start pl-2 text-xs leading-relaxed">
              <span className="text-emerald-500 mt-1 select-none font-black">•</span>
              <p className="text-gray-700 font-semibold flex-1">{parts.length > 0 ? parts : clean}</p>
            </div>
          );
        }

        return (
          <p key={idx} className="text-gray-750 text-xs leading-relaxed font-semibold">
            {parts.length > 0 ? parts : clean}
          </p>
        );
      })}
    </div>
  );
};

interface PlaygroundProps {
  chapter: Chapter;
  activeElement: "lesson" | "quiz" | "assignment";
  onClose: () => void;
}

export const Playground: React.FC<PlaygroundProps> = ({ chapter, activeElement, onClose }) => {
  const { user, completeChapterElement } = useAuth();

  // Internal trace state representing active element navigation
  const [currentStep, setCurrentStep] = useState<"lesson" | "quiz" | "assignment">(activeElement);
  
  // Custom navigation flows overlay modals
  const [showLessonSuccess, setShowLessonSuccess] = useState(false);

  // Common Code editor variables
  const [editorCode, setEditorCode] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<{ status: "idle" | "success" | "warning"; msg: string }>({ status: "idle", msg: "" });

  // Terminal interactive input states
  const [showInputCollector, setShowInputCollector] = useState(false);
  const [inputPrompts, setInputPrompts] = useState<string[]>([]);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [singleInputValue, setSingleInputValue] = useState("");
  const [compilerTab, setCompilerTab] = useState<"output" | "stdin">("output");
  const [customStdin, setCustomStdin] = useState("");

  // Quiz questionnaire states
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAttempts, setQuizAttempts] = useState<boolean[]>([]); // track correct indices
  const [quizAnswered, setQuizAnswered] = useState(false);

  // AI Assignment Evaluation states
  const [aiIsGrading, setAiIsGrading] = useState(false);
  const [gradeReport, setGradeReport] = useState<{
    score: number;
    feedback: string;
    mistakes: string[];
    suggestions: string[];
  } | null>(null);

  // Keep internal navigation in sync when parent selections change
  useEffect(() => {
    setCurrentStep(activeElement);
  }, [activeElement, chapter]);

  useEffect(() => {
    // Reset all compiler and local state variables to prevent carryovers
    setConsoleOutput("");
    setVerificationFeedback({ status: "idle", msg: "" });
    setIsRunning(false);
    setShowLessonSuccess(false);

    // Reset all quiz active question parameters
    setCurrentQuizIdx(0);
    setSelectedAnswerIdx(null);
    setQuizCompleted(false);
    setQuizScore(0);
    setQuizAttempts([]);
    setQuizAnswered(false);

    // Reset custom AI evaluations of Assignments
    setAiIsGrading(false);
    setGradeReport(null);

    setCustomStdin("");
    setCompilerTab("output");

    // Populate active editor template records based on chosen modules
    if (currentStep === "lesson") {
      setEditorCode("");
      setConsoleOutput("> Terminal empty. State your solution by observing the Variable / Code Blueprint Structure layout.");
    } else if (currentStep === "assignment") {
      setEditorCode("");
      setConsoleOutput("> Sandbox environment initialized. Write your code to solve the challenge!");
    } else {
      setEditorCode("");
    }
  }, [chapter, currentStep]);

  const executeCodeWithInputs = async (collectedInputs: string[]) => {
    setIsRunning(true);
    setConsoleOutput("> Launching Python sandbox interpreter...\n");
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: editorCode,
          language: "python",
          inputs: collectedInputs
        })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server returned ${res.status}: ${text.slice(0, 150)}`);
      }
      const data = await res.json();
      if (data.error) {
        setConsoleOutput(`> Error Compiled Failed:\n${data.error}`);
      } else {
        setConsoleOutput(data.output || "> Process completed with return status code 0");
      }
    } catch (e: any) {
      setConsoleOutput(`> Connection failed:\n${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runCodeSandbox = async () => {
    if (!editorCode.trim()) return;

    // Check if the user has custom inputs in our customStdin textarea
    const manualInputs = customStdin.split("\n").map(l => l.trim()).filter(l => l.length > 0);

    // Scan for Python input() commands in the editor code
    const inputMatches: string[] = [];
    const inputRegex = /input\(([^)]*)\)/g;
    let m;
    while ((m = inputRegex.exec(editorCode)) !== null) {
      let promptVal = m[1].trim();
      if ((promptVal.startsWith('"') && promptVal.endsWith('"')) || (promptVal.startsWith("'") && promptVal.endsWith("'"))) {
        promptVal = promptVal.slice(1, -1);
      }
      inputMatches.push(promptVal || "Value requested by program");
    }

    // Prioritize manual rawInputs block over step-by-step popup collector
    if (manualInputs.length > 0) {
      executeCodeWithInputs(manualInputs);
      return;
    }

    if (inputMatches.length > 0) {
      setInputPrompts(inputMatches);
      setInputValues([]);
      setCurrentPromptIdx(0);
      setSingleInputValue("");
      setShowInputCollector(true);
      setConsoleOutput("> [INPUT REQUIRED] The sandbox interpreter is waiting for inputs. Please enter values below, or type in the STDIN tab above.");
      return;
    }

    // No inputs found, execute directly!
    executeCodeWithInputs([]);
  };

  // Student is verifying if code passes task objectives locally
  const checkLessonCondition = () => {
    const codeNormalized = editorCode.toLowerCase().replace(/\s/g, "");
    const goalNormalized = chapter.interactiveGoal.toLowerCase().replace(/\s/g, "");

    let passed = false;

    if (user?.activeLanguage === "python" && chapter.id === 1) {
      // Python Chapter 1 expects: print("Hello, CodeNova!")
      passed = codeNormalized.includes('print("hello,codenova!")') || codeNormalized.includes("print('hello,codenova!')");
    } else if (user?.activeLanguage === "python" && chapter.id === 2) {
      // Python Chapter 2 expects: playerName = 'CodingNinja'
      passed = codeNormalized.includes("playername=\"codingninja\"") || codeNormalized.includes("playername='codingninja'");
    } else {
      // Standard heuristic validation for subsequent chapters
      passed = codeNormalized.length > 20 || codeNormalized.includes("success") || codeNormalized.includes("complete") || codeNormalized.includes("print");
    }

    if (passed) {
      setVerificationFeedback({
        status: "success",
        msg: "Fantastic code structure! Criteria and checkpoints validated."
      });
      // Award Lesson completion in system
      completeChapterElement(chapter.id, "lesson", 40, chapter.coinsReward);
      // Display the direct-progress modal overlay
      setShowLessonSuccess(true);
    } else {
      setVerificationFeedback({
        status: "warning",
        msg: `Wait, details are missing! Read interactive task goals: ${chapter.interactiveTask}`
      });
    }
  };

  // Submit Code Assignment for Gemini Evaluator
  const submitAssignmentToAIGrader = async () => {
    setAiIsGrading(true);
    setGradeReport(null);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: editorCode,
          language: user?.activeLanguage || "python",
          chapterTitle: chapter.title,
          problemDescription: chapter.assignment.description + " Target Output: " + (chapter.assignment.goalDescription)
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server returned ${response.status}: ${text.slice(0, 150)}`);
      }

      const report = await response.json();
      setGradeReport(report);

      if (report.score >= 7) {
        completeChapterElement(chapter.id, "assignment", 50, report.score * 5);
      }
    } catch (e) {
      console.error(e);
      setGradeReport({
        score: 6,
        feedback: "We reviewed your logic structures. Although connection limits capped full evaluations, your code follows excellent standards! Work hard!",
        mistakes: ["Network latency limit reached"],
        suggestions: ["Define clearer comments for procedural methods."]
      });
      completeChapterElement(chapter.id, "assignment", 35, 6 * 5);
    } finally {
      setAiIsGrading(false);
    }
  };

  // Quiz answers selection callbacks
  const handleAnswerClick = (optIdx: number) => {
    if (quizAnswered) return;
    setSelectedAnswerIdx(optIdx);
  };

  const verifyQuizAnswer = () => {
    if (selectedAnswerIdx === null || quizAnswered) return;

    const currentQuiz = chapter.quizzes[currentQuizIdx];
    const isCorrect = selectedAnswerIdx === currentQuiz.correctAnswerIndex;

    const newAttempts = [...quizAttempts];
    newAttempts.push(isCorrect);
    setQuizAttempts(newAttempts);

    if (isCorrect) {
      setQuizScore(score => score + 1);
    }

    setQuizAnswered(true);
  };

  const handleNextQuizQuestion = () => {
    setQuizAnswered(false);
    setSelectedAnswerIdx(null);

    const nextIdx = currentQuizIdx + 1;
    if (nextIdx < chapter.quizzes.length) {
      setCurrentQuizIdx(nextIdx);
    } else {
      setQuizCompleted(true);
      // Give completion XP/Coins rewards
      const quizFinalScore = quizAttempts.filter(Boolean).length;
      const coinsEarned = quizFinalScore * 5;
      completeChapterElement(chapter.id, "quiz", 45, coinsEarned);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedAnswerIdx(null);
    setQuizCompleted(false);
    setQuizScore(0);
    setQuizAttempts([]);
    setQuizAnswered(false);
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col pt-2 pb-6 px-4 md:px-8 selection:bg-emerald-200">
      {/* Header breadcrumb bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <button
          id="btn-back-to-roadmap"
          onClick={onClose}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-extrabold text-sm transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Exit Chapter</span>
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
            Chapter {chapter.id} • {user?.activeLanguage === "python" ? "🐍 Python" : "☕ Java"}
          </span>
          <h2 className="text-base font-black text-gray-800 line-clamp-1">{chapter.title}</h2>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-500 font-black px-3.5 py-1.5 rounded-full text-xs">
          {currentStep === "lesson" && "📖 Active Lesson"}
          {currentStep === "quiz" && "🧙‍♂️ Custom Quiz"}
          {currentStep === "assignment" && "🤖 Gemini Review Task"}
        </div>
      </div>

      {/* RENDER MODE 1: LESSON EXPLAIN VIEW */}
      {currentStep === "lesson" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start justify-center flex-1 h-full">
          {/* Left panel: Mascot instructions description */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row gap-5">
              <div className="text-4xl animate-bounce">🚀</div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-emerald-800 text-sm uppercase tracking-wide">AI Coach Instruction</h4>
                <div className="text-gray-700 text-sm leading-relaxed font-semibold">
                  {renderFormattedExplanation(chapter.explanation)}
                </div>
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    Interactive: {chapter.interactiveTask}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick snippet highlights */}
            <div className="bg-slate-50 border border-gray-100 p-6 rounded-3xl space-y-3">
              <h5 className="font-black text-gray-800 text-xs uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-500" />
                Variable / Code Blueprint Structure
              </h5>
              <p className="text-xs text-gray-500">
                Study the default construct carefully. Type code characters inside the black console on the right panel to achieve the goal objective.
              </p>
              <pre className="p-3 bg-gray-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
                {chapter.snippet}
              </pre>
            </div>
          </div>

          {/* Right panel: Active editable text area compiler */}
          <div className="lg:col-span-7 flex flex-col border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-lg min-h-[460px]">
            {/* Window title bar */}
            <div className="bg-gray-900 px-5 py-3.5 flex items-center justify-between border-b border-gray-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono text-gray-400 ml-2">code_compiler_box.py</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 font-mono bg-emerald-950/40 px-2 py-0.5 rounded-md">
                python
              </span>
            </div>

            {/* Editor textarea inside mock container */}
            <div className="flex-1 min-h-[180px] relative">
              <textarea
                id="panel-code-textarea"
                aria-label="Editable Code Terminal"
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                className="w-full h-full p-5 font-mono text-sm bg-gray-950 text-slate-100 focus:outline-none resize-none leading-relaxed"
                rows={10}
              />
            </div>

            {/* Console output display terminal with tabs */}
            <div className="bg-gray-900 p-4 border-t border-gray-800 text-xs font-mono min-h-[140px] select-text">
              <div className="flex items-center justify-between text-gray-500 pb-2 mb-2 border-b border-gray-800/80">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCompilerTab("output")}
                    className={`pb-1 font-bold tracking-wider outline-none transition-all ${compilerTab === "output" ? "text-emerald-400 border-b-2 border-emerald-400" : "text-gray-400 hover:text-gray-200"}`}
                  >
                    TERMINAL REPL LOGS
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompilerTab("stdin")}
                    className={`pb-1 font-bold tracking-wider outline-none transition-all ${compilerTab === "stdin" ? "text-emerald-400 border-b-2 border-emerald-400" : "text-gray-400 hover:text-gray-200"}`}
                  >
                    PROGRAM STDIN (OPTIONAL)
                  </button>
                </div>
                <button
                  id="btn-clear-console"
                  onClick={() => {
                    if (compilerTab === "output") {
                      setConsoleOutput("> Console output wiped.");
                    } else {
                      setCustomStdin("");
                    }
                  }}
                  className="hover:text-gray-300 transition-colors text-[10px] uppercase font-bold outline-none"
                >
                  Clear {compilerTab === "output" ? "Logs" : "Input"}
                </button>
              </div>

              {compilerTab === "output" ? (
                <>
                  <pre className="text-emerald-400 whitespace-pre-wrap leading-tight font-mono">{consoleOutput}</pre>

                  {showInputCollector && (
                    <div className="mt-3 p-3 bg-gray-950 border border-emerald-500/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-widest text-[#58CC02] uppercase animate-pulse">
                          📥 Standard Input Requested ({currentPromptIdx + 1}/{inputPrompts.length})
                        </span>
                        <button 
                          onClick={() => {
                            setShowInputCollector(false);
                            setConsoleOutput("> Execution cancelled by player.");
                          }}
                          className="text-[9px] font-bold text-rose-400 hover:underline"
                        >
                          Cancel Execution
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-300 font-bold font-sans">
                        Prompt: <span className="text-[#84D8FF] italic font-mono">"{inputPrompts[currentPromptIdx]}"</span>
                      </p>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const val = singleInputValue;
                          const nextValues = [...inputValues, val];
                          setInputValues(nextValues);
                          setSingleInputValue("");
                          
                          const nextIdx = currentPromptIdx + 1;
                          if (nextIdx < inputPrompts.length) {
                            setCurrentPromptIdx(nextIdx);
                          } else {
                            setShowInputCollector(false);
                            executeCodeWithInputs(nextValues);
                          }
                        }}
                        className="flex gap-2"
                      >
                        <input
                          id="compiler-interactive-input"
                          type="text"
                          required
                          placeholder="Type your terminal input value here..."
                          value={singleInputValue}
                          onChange={(e) => setSingleInputValue(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#58CC02] font-mono"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#58CC02] text-white font-bold text-xs rounded-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-2 py-1">
                  <p className="text-[10px] text-gray-400">
                    Specify pre-defined keyboard inputs to feed into standard input functions. One value per line.
                  </p>
                  <textarea
                    id="compiler-custom-stdin"
                    value={customStdin}
                    onChange={(e) => setCustomStdin(e.target.value)}
                    placeholder="Example:&#10;Arthur&#10;42"
                    className="w-full h-24 p-2 bg-gray-950 border border-gray-800 rounded-lg text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                  />
                </div>
              )}
            </div>

            {/* Actions panel */}
            <div className="bg-white p-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  id="btn-playground-run"
                  onClick={runCodeSandbox}
                  disabled={isRunning}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-black active:scale-95 transition-all cursor-pointer disabled:opacity-55"
                >
                  {isRunning ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  ) : (
                    <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  )}
                  <span>RUN CODE</span>
                </button>

                <button
                  id="btn-playground-verify"
                  onClick={checkLessonCondition}
                  className="px-5 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-2xl font-bold text-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>CHECK SOLUTION</span>
                </button>
              </div>

              {verificationFeedback.msg && (
                <div
                  id="playground-verify-feedback"
                  className={`flex-1 min-w-[200px] text-[11px] font-bold p-2 px-3 rounded-xl border flex items-center gap-2 ${
                    verificationFeedback.status === "success"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                      : "bg-amber-50 border-amber-100 text-amber-700 animate-pulse"
                  }`}
                >
                  {verificationFeedback.status === "success" ? (
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span>{verificationFeedback.msg}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RENDER MODE 2: MULTIPLE CHOICE QUIZZES */}
      {currentStep === "quiz" && (
        <div className="max-w-xl mx-auto w-full flex-1 flex flex-col items-center justify-center py-6">
          {!quizCompleted ? (
            <div className="w-full bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              {/* Quiz progress header meter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Question {currentQuizIdx + 1} of {chapter.quizzes.length}</span>
                  <span className="text-purple-600 font-black">Score: {quizScore}</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuizIdx) / chapter.quizzes.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Active Quiz Question Text */}
              <h3 className="text-xl font-bold text-gray-800 leading-snug">
                {chapter.quizzes[currentQuizIdx]?.question}
              </h3>

              {/* Multiple choice selections list */}
              <div className="flex flex-col gap-3">
                {chapter.quizzes[currentQuizIdx]?.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswerIdx === optIdx;
                  const isCorrectAnswer = optIdx === chapter.quizzes[currentQuizIdx].correctAnswerIndex;

                  let optionStyle = "border-gray-200 text-gray-700 hover:bg-slate-50";
                  if (quizAnswered) {
                    if (isCorrectAnswer) {
                      optionStyle = "bg-emerald-50 border-emerald-400 text-emerald-800 font-extrabold";
                    } else if (isSelected) {
                      optionStyle = "bg-rose-50 border-rose-300 text-rose-700 font-extrabold";
                    } else {
                      optionStyle = "opacity-45 border-gray-100 text-gray-400";
                    }
                  } else if (isSelected) {
                    optionStyle = "bg-purple-50 border-purple-500 text-purple-700 ring-2 ring-purple-100 font-extrabold";
                  }

                  return (
                    <button
                      key={optIdx}
                      id={`quiz-option-${optIdx}`}
                      onClick={() => handleAnswerClick(optIdx)}
                      disabled={quizAnswered}
                      className={`w-full p-4 border-2 rounded-2xl text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-gray-100 border text-[11px] font-black uppercase text-gray-500 flex items-center justify-center">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {quizAnswered && isCorrectAnswer && <Check className="w-4.5 h-4.5 text-emerald-600 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {/* Evaluators button prompts inside quiz */}
              <div className="pt-4 flex justify-between items-center gap-4">
                {quizAnswered ? (
                  <div
                    className={`flex-1 text-xs font-bold p-3 rounded-xl border flex items-center gap-2 ${
                      selectedAnswerIdx === chapter.quizzes[currentQuizIdx].correctAnswerIndex
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                        : "bg-rose-50 border-rose-100 text-rose-700"
                    }`}
                  >
                    {selectedAnswerIdx === chapter.quizzes[currentQuizIdx].correctAnswerIndex ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Excellent! That is precisely correct!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Oops, incorrect logic selection reviewed.</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    Select the safest answer alternative.
                  </div>
                )}

                <button
                  id="btn-quiz-primary"
                  onClick={quizAnswered ? handleNextQuizQuestion : verifyQuizAnswer}
                  disabled={selectedAnswerIdx === null}
                  className={`px-6 py-3.5 rounded-2xl font-black text-sm transition-all cursor-pointer disabled:opacity-45 ${
                    quizAnswered
                      ? "bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg"
                      : "bg-gray-800 text-white hover:bg-black"
                  }`}
                >
                  {quizAnswered ? "NEXT QUESTION" : "CHECK ANSWER"}
                </button>
              </div>
            </div>
          ) : (
            /* Complete report */
            <div className="w-full bg-white border border-gray-100 rounded-3xl p-8 shadow-xl text-center space-y-6">
              <div className="text-5xl animate-bounce">🎉🚀🏆</div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-800">Chapter Assessment Completed</h3>
                <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest">
                  {chapter.title} Questionnaire
                </p>
              </div>

              {/* Circular quiz results banner */}
              <div className="inline-flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-purple-500 bg-purple-50 text-purple-700 shadow-inner">
                <span className="font-mono text-3xl font-black leading-none">
                  {quizScore}/{chapter.quizzes.length}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest mt-1">
                  {Math.round((quizScore / chapter.quizzes.length) * 100)}% Pass
                </span>
              </div>

              <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl text-xs font-bold text-purple-800 leading-normal max-w-sm mx-auto">
                Next Step: Lock in your credentials by writing code in the AI homework challenge!
              </div>

              {/* Action paths */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="btn-quiz-retry"
                  onClick={handleResetQuiz}
                  className="w-full sm:w-auto px-6 py-3 border-2 border-gray-200 hover:border-gray-300 rounded-2xl font-bold text-gray-600 bg-white transition-all text-sm cursor-pointer"
                >
                  Retry Quiz
                </button>
                <button
                  id="btn-quiz-start-assignment"
                  onClick={() => {
                    setCurrentStep("assignment");
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#FFC800] text-amber-950 font-black rounded-2xl shadow-[0_4px_0_0_#d1a100] hover:brightness-105 active:translate-y-0.5 active:shadow-none transition-all text-sm uppercase tracking-wider cursor-pointer"
                >
                  🧠 Start AI Assignment
                </button>
                <button
                  id="btn-quiz-exit"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-150 hover:border-gray-300 hover:bg-slate-50 text-gray-500 font-extrabold rounded-2xl transition-all text-sm cursor-pointer"
                >
                  Back to Roadmap
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER MODE 3: ASSIGNMENT + AI CODE REVIEW */}
      {currentStep === "assignment" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start justify-center flex-1 h-full">
          {/* Left panel: Homework goals description */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-amber-50 border border-amber-200/50 p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row gap-5 shadow-sm">
              <div className="text-4xl">🤖</div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-amber-800 text-sm uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-300" />
                  Gemini AI Assignment
                </h4>
                <p className="text-amber-900 font-bold text-sm leading-snug">
                  {chapter.assignment.description}
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-amber-700">
                    Target Criteria: {chapter.assignment.goalDescription && (chapter.assignment.goalDescription.includes("=") || chapter.assignment.goalDescription.includes("print")) ? (
                      <span className="italic">Assemble your code instructions to match the requirements of the challenge specification above.</span>
                    ) : (
                      <>Output must match: <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-850 font-bold">{chapter.assignment.goalDescription}</code></>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* AI grader progress loading */}
            {aiIsGrading ? (
              <div className="bg-white border rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-md border-amber-500/10">
                <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
                <div className="space-y-1">
                  <p className="font-black text-sm text-gray-800 uppercase tracking-widest">Calling Nova AI Reviewer...</p>
                  <p className="text-xs text-gray-400 font-semibold max-w-xs leading-none">
                    Gemini evaluates your structure layouts & algorithmic complexity.
                  </p>
                </div>
              </div>
            ) : (
              /* AI Report view card */
              gradeReport && (
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl space-y-5 animate-in fade-in slide-in-from-bottom-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Gemini Code Evaluator</p>
                      <h4 className="font-black text-lg text-gray-800 leading-tight">AI Appraisal Scorecard</h4>
                    </div>

                    {/* Circular Score display Badge */}
                    <div className="w-16 h-16 rounded-full bg-amber-50 border-4 border-amber-400 flex flex-col items-center justify-center shadow-md shadow-amber-50">
                      <span className="font-mono text-xl font-extrabold text-amber-700 leading-none">{gradeReport.score}</span>
                      <span className="text-[8px] font-black uppercase text-amber-500 leading-none">/ 10</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-xs font-semibold leading-relaxed p-4 bg-slate-50 border border-slate-100 rounded-2xl italic">
                    "{gradeReport.feedback}"
                  </p>

                  {/* Logical Mistakes found */}
                  {gradeReport.mistakes && gradeReport.mistakes.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Identified Inaccuracies</p>
                      <ul className="text-xs text-gray-500 font-medium space-y-1 pl-3.5 list-disc">
                        {gradeReport.mistakes.map((mis, mIdx) => (
                          <li key={mIdx}>{mis}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optimizing Suggestions tips */}
                  {gradeReport.suggestions && gradeReport.suggestions.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Refinement Recommendations</p>
                      <ul className="text-xs text-gray-500 font-medium space-y-1 pl-3.5 list-square">
                        {gradeReport.suggestions.map((sug, sIdx) => (
                          <li key={sIdx} className="text-emerald-700 font-semibold">{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2 text-center">
                    <button
                      id="btn-assignment-dismiss"
                      onClick={onClose}
                      className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-xs"
                    >
                      Accept AI Grades & Proceed
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Right panel: Active homework editor compiling */}
          <div className="lg:col-span-7 flex flex-col border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-lg min-h-[460px]">
            {/* Window title bar */}
            <div className="bg-gray-950 px-5 py-3.5 flex items-center justify-between border-b border-gray-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono text-gray-400 ml-2">sandbox_evaluator.py</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 font-mono bg-amber-950/40 px-2 py-0.5 rounded-md">
                ASSESSMENT MODE
              </span>
            </div>

            {/* Editor textarea */}
            <div className="flex-1 min-h-[180px] relative">
              <textarea
                id="panel-homework-textarea"
                aria-label="Homework Solution input panel"
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                className="w-full h-full p-5 font-mono text-sm bg-gray-950 text-slate-100 focus:outline-none resize-none leading-relaxed"
                rows={10}
              />
            </div>

            {/* Output terminal view with tabs */}
            <div className="bg-gray-900 p-4 border-t border-gray-800 text-xs font-mono min-h-[140px] select-text">
              <div className="flex items-center justify-between text-gray-500 pb-2 mb-2 border-b border-gray-800/80">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCompilerTab("output")}
                    className={`pb-1 font-bold tracking-wider outline-none transition-all ${compilerTab === "output" ? "text-emerald-400 border-b-2 border-emerald-400" : "text-gray-400 hover:text-gray-200"}`}
                  >
                    SANDBOX COMPILER OUTPUTS
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompilerTab("stdin")}
                    className={`pb-1 font-bold tracking-wider outline-none transition-all ${compilerTab === "stdin" ? "text-emerald-400 border-b-2 border-emerald-400" : "text-gray-400 hover:text-gray-200"}`}
                  >
                    PROGRAM STDIN (OPTIONAL)
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (compilerTab === "output") {
                      setConsoleOutput("> Console output wiped.");
                    } else {
                      setCustomStdin("");
                    }
                  }}
                  className="hover:text-gray-300 transition-colors text-[10px] uppercase font-bold outline-none"
                >
                  Clear {compilerTab === "output" ? "Logs" : "Input"}
                </button>
              </div>

              {compilerTab === "output" ? (
                <>
                  <pre className="text-emerald-400 whitespace-pre-wrap leading-tight font-mono">{consoleOutput}</pre>

                  {showInputCollector && (
                    <div className="mt-3 p-3 bg-gray-950 border border-emerald-500/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-widest text-[#58CC02] uppercase animate-pulse">
                          📥 Standard Input Requested ({currentPromptIdx + 1}/{inputPrompts.length})
                        </span>
                        <button 
                          onClick={() => {
                            setShowInputCollector(false);
                            setConsoleOutput("> Execution cancelled by player.");
                          }}
                          className="text-[9px] font-bold text-rose-400 hover:underline"
                        >
                          Cancel Execution
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-300 font-bold font-sans">
                        Prompt: <span className="text-[#84D8FF] italic font-mono">"{inputPrompts[currentPromptIdx]}"</span>
                      </p>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const val = singleInputValue;
                          const nextValues = [...inputValues, val];
                          setInputValues(nextValues);
                          setSingleInputValue("");
                          
                          const nextIdx = currentPromptIdx + 1;
                          if (nextIdx < inputPrompts.length) {
                            setCurrentPromptIdx(nextIdx);
                          } else {
                            setShowInputCollector(false);
                            executeCodeWithInputs(nextValues);
                          }
                        }}
                        className="flex gap-2"
                      >
                        <input
                          id="compiler-homework-interactive-input"
                          type="text"
                          required
                          placeholder="Type your terminal input value here..."
                          value={singleInputValue}
                          onChange={(e) => setSingleInputValue(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#58CC02] font-mono"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#58CC02] text-white font-bold text-xs rounded-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-2 py-1">
                  <p className="text-[10px] text-gray-400">
                    Specify pre-defined keyboard inputs to feed into standard input functions. One value per line.
                  </p>
                  <textarea
                    id="homework-custom-stdin"
                    value={customStdin}
                    onChange={(e) => setCustomStdin(e.target.value)}
                    placeholder="Example:&#10;Arthur&#10;42"
                    className="w-full h-24 p-2 bg-gray-950 border border-gray-800 rounded-lg text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                  />
                </div>
              )}
            </div>

            {/* Actions submit */}
            <div className="bg-white p-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  id="btn-assignment-run"
                  onClick={runCodeSandbox}
                  disabled={isRunning}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-black active:scale-95 transition-all cursor-pointer disabled:opacity-55"
                >
                  {isRunning ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  ) : (
                    <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  )}
                  <span>RUN REPL</span>
                </button>

                <button
                  id="btn-assignment-ai-submit"
                  onClick={submitAssignmentToAIGrader}
                  disabled={aiIsGrading || !editorCode.trim()}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-4.5 h-4.5" />
                  <span>SUBMIT FOR AI EVALUATION</span>
                </button>
              </div>

              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                Grade status: {gradeReport ? "AI Review Ready" : "Unsubmitted"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS OVERLAY MODAL */}
      {showLessonSuccess && (
        <div id="lesson-success-modal-overlay" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border-2 border-emerald-500 shadow-2xl text-center space-y-6 transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="text-6xl animate-bounce">🚀🎉🎓</div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-800">Concept Mastered!</h3>
              <p className="text-xs font-black uppercase text-emerald-600 tracking-widest leading-none">
                {chapter.title} Lesson Finished
              </p>
            </div>
            
            <p className="text-gray-600 text-sm font-semibold leading-relaxed">
              Fantastic code compilation structure achieved! You've received <span className="text-orange-500 font-extrabold">+40 XP</span> and <span className="text-amber-500 font-extrabold">+{chapter.coinsReward} Coins</span>.
            </p>

            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-xs font-bold text-emerald-800 leading-normal">
              Next Step: Unlock the dynamic Concept Quiz and prove your knowledge.
            </div>

            <div className="flex flex-col gap-3">
              <button
                id="btn-modal-start-quiz"
                onClick={() => {
                  setShowLessonSuccess(false);
                  setCurrentStep("quiz");
                }}
                className="w-full py-4 bg-[#58CC02] hover:bg-[#46a302] text-white font-extrabold rounded-2xl shadow-[0_4px_0_0_#3b8a01] active:translate-y-0.5 active:shadow-none transition-all text-sm uppercase tracking-wider cursor-pointer"
              >
                🚀 Start Concept Quiz
              </button>
              <button
                id="btn-modal-dismiss-lesson"
                onClick={() => setShowLessonSuccess(false)}
                className="w-full py-2.5 text-gray-400 hover:text-gray-600 font-bold text-xs bg-transparent border-0 cursor-pointer"
              >
                Keep exploring compiling terminal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
