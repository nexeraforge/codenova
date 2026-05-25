import React, { createContext, useContext, useState, useEffect } from "react";
import { UserStats, LeaderboardMember, ShopItem, Badge } from "../types";
import {
  isFirebaseActive,
  auth,
  db,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc
} from "../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AuthContextType {
  user: UserStats | null;
  leaderboard: LeaderboardMember[];
  shopItems: ShopItem[];
  badges: Badge[];
  login: (name: string, email: string) => void;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  changeLanguage: (lang: "python") => void;
  completeChapterElement: (chapterId: number, elementType: "lesson" | "quiz" | "assignment", xpEarned: number, coinsEarned: number) => void;
  purchaseItem: (itemId: string, price: number) => boolean;
  replenishHearts: () => void;
  useStreakFreeze: () => boolean;
  resetProgress: () => void;
  updateUserStats: (updated: Partial<UserStats>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_SHOP_ITEMS: ShopItem[] = [
  { id: "streak_freeze", title: "Streak Freeze", description: "Protects your active learning streak for 1 day.", price: 50, icon: "❄️", category: "freeze" },
  { id: "heart_refill", title: "Heart Refill", description: "Instantly refill your lesson hearts up to full capacity.", price: 100, icon: "❤️", category: "hearts" },
  { id: "emerald_theme", title: "Emerald Theme", description: "Apply a premium deep emerald and dark chrome theme look.", price: 250, icon: "🟢", category: "skins" },
  { id: "solar_badge", title: "Solar Master", description: "Unlock a custom shiny cosmic corona nameplate on leaderboards.", price: 400, icon: "👑", category: "badge" }
];

const AVAILABLE_BADGES: Badge[] = [
  { id: "first_steps", title: "First Steps", description: "Completed your first active coding lesson.", icon: "👣", color: "from-blue-400 to-indigo-500" },
  { id: "quiz_wizard", title: "Quiz Wizard", description: "Earned 100% on any chapter assessment questionnaire.", icon: "🧙‍♂️", color: "from-purple-400 to-fuchsia-500" },
  { id: "ai_approved", title: "AI Approved", description: "Gained a perfect 10/10 grade from our Gemini AI Code Grader.", icon: "🤖", color: "from-emerald-400 to-teal-500" },
  { id: "gold_saver", title: "Nova Millionaire", description: "Amassed over 250 NovaCoins in your custom wallet.", icon: "💰", color: "from-amber-400 to-orange-500" },
  { id: "unstoppable", title: "Unstoppable", description: "Maintained a learning streak of 3 days or more.", icon: "🔥", color: "from-rose-400 to-orange-500" }
];

const ensureValidProfile = (parsed: any): UserStats => {
  return {
    name: parsed?.name || "Guest Coder",
    email: parsed?.email || "guest@codenova.edu",
    rank: parsed?.rank || "Bronze",
    streak: typeof parsed?.streak === "number" ? parsed.streak : 1,
    coins: typeof parsed?.coins === "number" ? parsed.coins : 100,
    xp: typeof parsed?.xp === "number" ? parsed.xp : 0,
    completedLessons: {
      python: [],
      ...(parsed?.completedLessons || {})
    },
    purchasedItems: Array.isArray(parsed?.purchasedItems) ? parsed.purchasedItems : [],
    activeLanguage: "python",
    completedQuizzes: {
      python: [],
      ...(parsed?.completedQuizzes || {})
    },
    completedAssignments: {
      python: [],
      ...(parsed?.completedAssignments || {})
    },
    unlockedBadges: Array.isArray(parsed?.unlockedBadges) ? parsed.unlockedBadges : [],
    level: typeof parsed?.level === "number" ? parsed.level : 1,
    lastStreakUpdate: parsed?.lastStreakUpdate || ""
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardMember[]>([]);

  // Load user session on boot and attach onAuthStateChanged
  useEffect(() => {
    const savedSession = localStorage.getItem("codenova_user_session");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setUser(ensureValidProfile(parsed));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }

    if (isFirebaseActive && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            let userSnap;
            try {
              userSnap = await getDoc(userDocRef);
            } catch (err) {
              handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
            }
            if (userSnap && userSnap.exists()) {
              setUser(ensureValidProfile(userSnap.data()));
            } else {
              const newProfile = ensureValidProfile({
                name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Guest Coder",
                email: firebaseUser.email || "developer@codenova.org",
                xp: 0,
                coins: 100,
              });
              try {
                await setDoc(userDocRef, newProfile);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
              }
              setUser(newProfile);
            }
          } catch (err) {
            console.error("Error retrieving user from Firestore:", err);
          }
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Update leaderboard listings dynamically from real registered Firestore users or local fallback accounts
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isFirebaseActive && db && user) {
      const subscribeToLeaderboard = (useOrderBy: boolean) => {
        try {
          const usersRef = collection(db, "users");
          const q = useOrderBy 
            ? query(usersRef, orderBy("coins", "desc"), limit(50))
            : query(usersRef, limit(100)); // fallback without orderBy
          
          const unsub = onSnapshot(q, (snapshot) => {
            const members: LeaderboardMember[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              members.push({
                name: data.name || "Anonymous Coder",
                avatar: data.avatar || "🧑‍🚀",
                xp: typeof data.xp === "number" ? data.xp : 0,
                coins: typeof data.coins === "number" ? data.coins : 0,
                badge: data.unlockedBadges?.includes("solar_badge") ? "👑 Solar Master" : "🚀 CodeNovian",
                rank: 0, // Placeholder mapping below
                isCurrentUser: docSnap.id === auth?.currentUser?.uid
              });
            });

            // Sort client-side by coins desc, and as secondary by xp desc
            members.sort((a, b) => {
              if (b.coins !== a.coins) {
                return b.coins - a.coins;
              }
              return b.xp - a.xp;
            });

            // Sort and assign real rank numbers
            const sorted = members.map((item, index) => ({
              ...item,
              rank: index + 1
            }));

            setLeaderboard(sorted);
          }, (error) => {
            if (useOrderBy) {
              console.warn("Leaderboard query failed with orderBy, falling back to unordered", error);
              if (unsub) unsub();
              subscribeToLeaderboard(false);
            } else {
              handleFirestoreError(error, OperationType.LIST, "users");
            }
          });

          unsubscribe = unsub;
        } catch (err) {
          console.error("Firestore leaderboard subscription failed:", err);
          if (useOrderBy) {
            subscribeToLeaderboard(false);
          }
        }
      };

      subscribeToLeaderboard(true);
    } else if (user) {
      // Local fallback compiler using only real registered local profiles
      const accountsKey = "codenova_local_accounts";
      const accountsStr = localStorage.getItem(accountsKey);
      let localMembers: any[] = [];
      
      if (accountsStr) {
        try {
          const accounts = JSON.parse(accountsStr);
          Object.keys(accounts).forEach((email) => {
            const acc = accounts[email];
            localMembers.push({
              name: acc.name || "Local Coder",
              avatar: acc.avatar || "🧑‍🚀",
              xp: typeof acc.xp === "number" ? acc.xp : 0,
              coins: typeof acc.coins === "number" ? acc.coins : 0,
              badge: acc.unlockedBadges?.includes("solar_badge") ? "👑 Solar Master" : "🚀 CodeNovian",
            });
          });
        } catch (e) {
          console.error("Failed to parse local registry", e);
        }
      }

      // Ensure the active session is included in real users
      const currentUserInLocal = localMembers.find(m => m.name.toLowerCase() === user.name.toLowerCase());
      if (!currentUserInLocal) {
        localMembers.push({
          name: user.name,
          avatar: "🧑‍🚀",
          xp: user.xp,
          coins: user.coins,
          badge: user.unlockedBadges?.includes("solar_badge") ? "👑 Solar Master" : "🚀 CodeNovian"
        });
      } else {
        currentUserInLocal.xp = user.xp;
        currentUserInLocal.coins = user.coins;
        if (user.unlockedBadges?.includes("solar_badge")) {
          currentUserInLocal.badge = "👑 Solar Master";
        }
      }

      // Sort descending by coins primarily, and secondarily by xp
      localMembers.sort((a, b) => {
        if (b.coins !== a.coins) {
          return b.coins - a.coins;
        }
        return b.xp - a.xp;
      });
      const sorted = localMembers.map((item, index) => ({
        ...item,
        rank: index + 1,
        isCurrentUser: item.name.toLowerCase() === user.name.toLowerCase()
      }));

      setLeaderboard(sorted);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const login = (name: string, email: string) => {
    const cleanName = name.trim() || "Guest Coder";
    const cleanEmail = email.trim() || "guest@codenova.edu";

    // Try finding existing progress record in database storage
    const localStoreKey = `codenova_data_${cleanEmail}`;
    const savedData = localStorage.getItem(localStoreKey);

    let profile: UserStats;
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        profile = ensureValidProfile(parsed);
      } catch (e) {
        profile = ensureValidProfile({ name: cleanName, email: cleanEmail });
      }
    } else {
      profile = ensureValidProfile({ name: cleanName, email: cleanEmail });
    }

    setUser(profile);
    localStorage.setItem("codenova_user_session", JSON.stringify(profile));
    localStorage.setItem(localStoreKey, JSON.stringify(profile));
  };

  const logout = () => {
    if (isFirebaseActive && auth) {
      signOut(auth).catch(err => console.error("Signout failed", err));
    }
    setUser(null);
    localStorage.removeItem("codenova_user_session");
  };

  const loginWithGoogle = async () => {
    if (isFirebaseActive && auth) {
      const provider = new GoogleAuthProvider();
      try {
        const credential = await signInWithPopup(auth, provider);
        const userDocRef = doc(db, "users", credential.user.uid);
        
        let userSnap;
        try {
          userSnap = await getDoc(userDocRef);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${credential.user.uid}`);
        }

        let profile: UserStats;
        if (userSnap && userSnap.exists()) {
          profile = ensureValidProfile(userSnap.data());
        } else {
          profile = ensureValidProfile({
            name: credential.user.displayName || credential.user.email?.split("@")[0] || "Google Adventurer",
            email: credential.user.email || "google@codenova.edu",
            xp: 0,
            coins: 100,
          });
          try {
            await setDoc(userDocRef, profile);
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `users/${credential.user.uid}`);
          }
        }
        setUser(profile);
        localStorage.setItem("codenova_user_session", JSON.stringify(profile));
      } catch (err: any) {
        console.error("Google login failed", err);
        const errMsg = err?.message || err?.code || String(err);
        if (errMsg.includes("auth/unauthorized-domain") || errMsg.includes("unauthorized-domain")) {
          throw new Error("unauthorized-domain");
        }
        throw err;
      }
    } else {
      login("Google Adventurer", "google@codenova.edu");
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (isFirebaseActive && auth) {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, pass);
        const userDocRef = doc(db, "users", credential.user.uid);
        
        let userSnap;
        try {
          userSnap = await getDoc(userDocRef);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${credential.user.uid}`);
        }

        let profile: UserStats;
        if (userSnap && userSnap.exists()) {
          profile = ensureValidProfile(userSnap.data());
        } else {
          profile = ensureValidProfile({
            name: credential.user.displayName || credential.user.email?.split("@")[0] || "Guest Coder",
            email: credential.user.email || email,
            xp: 0,
            coins: 100,
          });
          try {
            await setDoc(userDocRef, profile);
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `users/${credential.user.uid}`);
          }
        }
        setUser(profile);
        localStorage.setItem("codenova_user_session", JSON.stringify(profile));
      } catch (err: any) {
        console.error("Email login failed", err);
        throw new Error(err.message || "Email login process failed!");
      }
    } else {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !pass) {
        throw new Error("All credential ports must be filled!");
      }
      const accountsKey = "codenova_local_accounts";
      const accountsStr = localStorage.getItem(accountsKey);
      const accounts = accountsStr ? JSON.parse(accountsStr) : {};

      if (!accounts[cleanEmail]) {
        throw new Error("This email is not registered! Please sign up first.");
      }

      if (accounts[cleanEmail].password !== pass) {
        throw new Error("Incorrect password! Please try again.");
      }

      login(accounts[cleanEmail].name, cleanEmail);
    }
  };

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    if (isFirebaseActive && auth) {
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, pass);
        const userDocRef = doc(db, "users", credential.user.uid);
        const profile = ensureValidProfile({
          name: name || email.split("@")[0],
          email: email,
          xp: 0,
          coins: 100,
        });
        try {
          await setDoc(userDocRef, profile);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${credential.user.uid}`);
        }
        setUser(profile);
        localStorage.setItem("codenova_user_session", JSON.stringify(profile));
      } catch (err: any) {
        console.error("Email registration failed", err);
        throw new Error(err.message || "Email registration process failed!");
      }
    } else {
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanName) {
        throw new Error("Name variable is required for compiling profile memory!");
      }
      if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
        throw new Error("Please enter a valid school or developer email!");
      }
      if (pass.length < 6) {
        throw new Error("Password must be at least 6 characters long!");
      }

      const accountsKey = "codenova_local_accounts";
      const accountsStr = localStorage.getItem(accountsKey);
      const accounts = accountsStr ? JSON.parse(accountsStr) : {};

      if (accounts[cleanEmail]) {
        throw new Error("This email is already registered! Please log in instead.");
      }

      accounts[cleanEmail] = {
        name: cleanName,
        email: cleanEmail,
        password: pass
      };
      localStorage.setItem(accountsKey, JSON.stringify(accounts));

      login(cleanName, cleanEmail);
    }
  };

  const changeLanguage = (lang: "python") => {
    if (!user) return;
    const updated = { ...user, activeLanguage: lang };
    setUser(updated);
    saveUserData(updated);
  };

  const saveUserData = async (profile: UserStats) => {
    localStorage.setItem("codenova_user_session", JSON.stringify(profile));
    localStorage.setItem(`codenova_data_${profile.email}`, JSON.stringify(profile));

    if (isFirebaseActive && db && auth?.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid), profile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser.uid}`);
      }
    }
  };

  const updateUserStats = (updated: Partial<UserStats>) => {
    if (!user) return;
    const newProfile = { ...user, ...updated };
    setUser(newProfile);
    saveUserData(newProfile);
  };

  const completeChapterElement = (
    chapterId: number,
    elementType: "lesson" | "quiz" | "assignment",
    xpEarned: number,
    coinsEarned: number
  ) => {
    if (!user) return;

    const lang = user.activeLanguage;
    const completedArr = { ...user.completedLessons };
    const quizArr = { ...user.completedQuizzes };
    const assignmentArr = { ...user.completedAssignments };

    let firstTimeReward = false;

    if (elementType === "lesson") {
      if (!completedArr[lang]) completedArr[lang] = [];
      if (!completedArr[lang].includes(chapterId)) {
        completedArr[lang].push(chapterId);
        firstTimeReward = true;
      }
    } else if (elementType === "quiz") {
      if (!quizArr[lang]) quizArr[lang] = [];
      if (!quizArr[lang].includes(chapterId)) {
        quizArr[lang].push(chapterId);
        firstTimeReward = true;
      }
    } else if (elementType === "assignment") {
      if (!assignmentArr[lang]) assignmentArr[lang] = [];
      if (!assignmentArr[lang].includes(chapterId)) {
        assignmentArr[lang].push(chapterId);
        firstTimeReward = true;
      }
    }

    const nextXP = user.xp + xpEarned;
    // Level boundary represents 250 XP per level
    const nextLevel = Math.floor(nextXP / 250) + 1;

    // Check Badge achievements
    const nextBadges = [...user.unlockedBadges];

    if (elementType === "lesson" && !nextBadges.includes("first_steps")) {
      nextBadges.push("first_steps");
    }
    if (elementType === "quiz" && !nextBadges.includes("quiz_wizard")) {
      nextBadges.push("quiz_wizard");
    }
    if (elementType === "assignment" && !nextBadges.includes("ai_approved")) {
      nextBadges.push("ai_approved");
    }

    const nextCoins = user.coins + (firstTimeReward ? coinsEarned : Math.floor(coinsEarned / 4));
    if (nextCoins >= 250 && !nextBadges.includes("gold_saver")) {
      nextBadges.push("gold_saver");
    }

    // Streaks and progression increments on daily active calendars
    let nextStreak = user.streak;
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const lastActive = user.lastStreakUpdate;

    if (!lastActive) {
      nextStreak = 1;
    } else if (lastActive === todayStr) {
      // Already recorded activity today; do not increase streak
    } else {
      const lastDate = new Date(lastActive + "T00:00:00");
      const todayDate = new Date(todayStr + "T00:00:00");
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        nextStreak += 1;
      } else if (diffDays > 1) {
        nextStreak = 1;
      }
    }

    if (nextStreak >= 3 && !nextBadges.includes("unstoppable")) {
      nextBadges.push("unstoppable");
    }

    const adjustedProfile: UserStats = {
      ...user,
      xp: nextXP,
      level: nextLevel,
      coins: nextCoins,
      unlockedBadges: nextBadges,
      streak: nextStreak,
      lastStreakUpdate: todayStr,
      completedLessons: completedArr,
      completedQuizzes: quizArr,
      completedAssignments: assignmentArr
    };

    setUser(adjustedProfile);
    saveUserData(adjustedProfile);
  };

  const purchaseItem = (itemId: string, price: number): boolean => {
    if (!user || user.coins < price) return false;

    const currentInventory = [...user.purchasedItems];
    if (!currentInventory.includes(itemId)) {
      currentInventory.push(itemId);
    }

    const nextBadges = [...user.unlockedBadges];
    if (itemId === "solar_badge" && !nextBadges.includes("solar_badge")) {
      nextBadges.push("solar_badge");
    }

    const updatedProfile: UserStats = {
      ...user,
      coins: user.coins - price,
      purchasedItems: currentInventory,
      unlockedBadges: nextBadges
    };

    setUser(updatedProfile);
    saveUserData(updatedProfile);
    return true;
  };

  const replenishHearts = () => {
    if (!user) return;
    updateUserStats({ coins: Math.max(0, user.coins - 50) });
  };

  const useStreakFreeze = (): boolean => {
    if (!user) return false;
    const index = user.purchasedItems.indexOf("streak_freeze");
    if (index !== -1) {
      const updatedPurchased = [...user.purchasedItems];
      updatedPurchased.splice(index, 1);
      updateUserStats({ purchasedItems: updatedPurchased });
      return true;
    }
    return false;
  };

  const resetProgress = () => {
    if (!user) return;
    const restarted: UserStats = {
      name: user.name,
      email: user.email,
      rank: "Bronze",
      streak: 1,
      coins: 100,
      xp: 0,
      completedLessons: { python: [] },
      purchasedItems: [],
      activeLanguage: "python",
      completedQuizzes: { python: [] },
      completedAssignments: { python: [] },
      unlockedBadges: [],
      level: 1
    };
    setUser(restarted);
    saveUserData(restarted);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        leaderboard,
        shopItems: INITIAL_SHOP_ITEMS,
        badges: AVAILABLE_BADGES,
        login,
        logout,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        changeLanguage,
        completeChapterElement,
        purchaseItem,
        replenishHearts,
        useStreakFreeze,
        resetProgress,
        updateUserStats
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
