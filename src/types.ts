/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface AssignmentChallenge {
  title: string;
  description: string;
  starterCode: string;
  goalDescription: string;
  testInput?: string;
  expectedOutputPrefix?: string;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "OOP" | "Advanced" | "Projects";
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  coinsReward: number;
  estimatedTime: string;
  explanation: string;
  snippet: string;
  solutionCode: string;
  interactiveTask: string;
  interactiveGoal: string;
  quizzes: QuizQuestion[];
  assignment: AssignmentChallenge;
}

export interface UserStats {
  name: string;
  email: string;
  rank: string;
  streak: number;
  coins: number;
  xp: number;
  completedLessons: { [languageId: string]: number[] }; // completed chapter IDs
  purchasedItems: string[]; // item IDs
  activeLanguage: "python";
  completedQuizzes: { [languageId: string]: number[] }; // quiz chapters completed
  completedAssignments: { [languageId: string]: number[] }; // assignment chapters completed
  unlockedBadges: string[];
  level: number;
  lastStreakUpdate?: string;
}

export interface LeaderboardMember {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  coins: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: string;
  category: "freeze" | "hearts" | "skins" | "badge";
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}
