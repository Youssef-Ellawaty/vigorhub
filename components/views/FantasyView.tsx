"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Shield,
  Users,
  Zap,
  Flame,
  Check,
  CheckCheck,
  Dumbbell,
  Lock,
  Crown,
  Sparkles,
  Plus,
  Search,
  X,
  Share2,
  Calendar,
  Compass,
  MapPin,
  ArrowRightLeft,
  Settings,
  PlusCircle,
  Trash2,
  User,
  Info,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// TypeScript Interfaces
interface SetLog {
  id: string;
  weight: number;
  reps: number;
}

interface ExerciseVolumeLog {
  id: string;
  name: string;
  sets: SetLog[];
}

interface DailyPointsCalculation {
  date: string;
  commitmentStatus: string; // 'full' | 'missed2' | 'missed4' | 'missedMore' | 'rest' | 'noTrain'
  commitmentPoints: number;
  weightExercises: ExerciseVolumeLog[];
  weightPoints: number;
  nutritionTarget: number;
  nutritionActual: number;
  nutritionPoints: number;
  totalPoints: number;
}

interface League {
  id: string;
  name: string;
  code: string;
  system: "commitment" | "weights" | "nutrition" | "comprehensive";
  creatorId: string;
  creatorName: string;
  joinedAt: string;
  isMock?: boolean;
}

interface Competitor {
  id: string;
  fullName: string;
  username: string;
  avatar: string;
  country: string;
  isCurrentUser?: boolean;
  dailyPoints: number;
  totalPoints: number;
}

interface Props {
  lang: "en" | "ar";
  isDark: boolean;
  activeUser: any;
  onUpdateUser: (newUser: any) => void;
}

// System types translation
const SYSTEM_LABELS = {
  en: {
    commitment: "Workout Commitment",
    weights: "Weight Volume",
    nutrition: "Nutrition Accuracy",
    comprehensive: "Comprehensive (All 3)",
  },
  ar: {
    commitment: "الالتزام بالتمرين",
    weights: "حجم أوزان التمرين",
    nutrition: "دقة التغذية والسعرات",
    comprehensive: "الشامل (الأنظمة الثلاثة معاً)",
  }
};

export default function FantasyView({ lang, isDark, activeUser, onUpdateUser }: Props) {
  const isRtl = lang === "ar";

  // --- Core State ---
  const [leagues, setLeagues] = useState<League[]>([]);
  const [activeLeagueId, setActiveLeagueId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "leaderboard" | "logger">("dashboard");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  // Create League form
  const [newLeagueName, setNewLeagueName] = useState("");
  const [newLeagueSystem, setNewLeagueSystem] = useState<"commitment" | "weights" | "nutrition" | "comprehensive">("comprehensive");
  
  // Join League form
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");

  // Today's Log Form State
  const [commitmentStatus, setCommitmentStatus] = useState<string>("full");
  const [weightExercises, setWeightExercises] = useState<ExerciseVolumeLog[]>([]);
  const [nutritionTarget, setNutritionTarget] = useState<number>(2000);
  const [nutritionActual, setNutritionActual] = useState<number>(1950);

  // New Exercise helper state
  const [newExerciseName, setNewExerciseName] = useState("");

  // Daily scores & total locked scores database (stored in localStorage)
  const [pointsHistory, setPointsHistory] = useState<DailyPointsCalculation[]>([]);
  const [savingSuccess, setSavingSuccess] = useState(false);

  // --- Get current date string (YYYY-MM-DD) ---
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const todayDateStr = getTodayDateString();

  // --- Seed default / localStorage data ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Load Point Logs
    const savedLogs = localStorage.getItem("vigorhub_fantasy_point_logs");
    let logs: DailyPointsCalculation[] = [];
    if (savedLogs) {
      try {
        logs = JSON.parse(savedLogs);
        setPointsHistory(logs);
      } catch (e) {
        console.error(e);
      }
    }

    // Load today's draft from points history if exists
    const todayLog = logs.find(log => log.date === todayDateStr);
    if (todayLog) {
      setCommitmentStatus(todayLog.commitmentStatus);
      setWeightExercises(todayLog.weightExercises || []);
      setNutritionTarget(todayLog.nutritionTarget);
      setNutritionActual(todayLog.nutritionActual);
    } else {
      // Default initial states
      setCommitmentStatus("full");
      setWeightExercises([
        {
          id: "ex_1",
          name: isRtl ? "ضغط بنش بالبار" : "Flat Barbell Bench Press",
          sets: [
            { id: "s_1", weight: 60, reps: 10 },
            { id: "s_2", weight: 60, reps: 10 },
            { id: "s_3", weight: 70, reps: 8 }
          ]
        },
        {
          id: "ex_2",
          name: isRtl ? "سكوات حر بالبار" : "Barbell Back Squat",
          sets: [
            { id: "s_4", weight: 80, reps: 10 },
            { id: "s_5", weight: 90, reps: 8 }
          ]
        }
      ]);
    }

    // 2. Load Leagues
    const savedLeagues = localStorage.getItem("vigorhub_fantasy_leagues");
    if (savedLeagues) {
      try {
        const parsed = JSON.parse(savedLeagues);
        setLeagues(parsed);
        if (parsed.length > 0) {
          setActiveLeagueId(parsed[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed a default Global League so they are ready to play!
      const defaultLeagues: League[] = [
        {
          id: "league_global",
          name: isRtl ? "الدوري العام لفيغورهاب" : "VigorHub Global Public League",
          code: "VIGOR-GLOBAL",
          system: "comprehensive",
          creatorId: "system",
          creatorName: "VigorHub",
          joinedAt: new Date().toISOString()
        },
        {
          id: "league_commitment",
          name: isRtl ? "دوري أبطال الالتزام" : "Commitment Master League",
          code: "VIGOR-COMMIT",
          system: "commitment",
          creatorId: "system",
          creatorName: "VigorHub",
          joinedAt: new Date().toISOString()
        }
      ];
      setLeagues(defaultLeagues);
      setActiveLeagueId("league_global");
      localStorage.setItem("vigorhub_fantasy_leagues", JSON.stringify(defaultLeagues));
    }
  }, []);

  // --- Points Formulas Implementations ---

  // 1. Commitment Points
  const calculateCommitmentPoints = (status: string): number => {
    switch (status) {
      case "full": return 5;
      case "missed2": return 4;
      case "missed4": return 3;
      case "missedMore": return 1;
      case "rest": return 0;
      case "noTrain": return -2;
      default: return 0;
    }
  };

  // 2. Weights Points
  const calculateWeightVolumeAndPoints = (exercises: ExerciseVolumeLog[]) => {
    let totalVolume = 0;
    exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.weight > 0 && set.reps > 0) {
          totalVolume += set.weight * set.reps;
        }
      });
    });
    const points = Number((totalVolume / 1000).toFixed(2));
    return { volume: totalVolume, points };
  };

  const { volume: todayWeightVolume, points: todayWeightPoints } = calculateWeightVolumeAndPoints(weightExercises);

  // 3. Nutrition Points
  const calculateNutritionPoints = (target: number, actual: number): number => {
    const difference = Math.abs(actual - target);
    if (difference < 100) return 5;
    if (difference >= 100 && difference <= 200) return 4;
    if (difference > 200 && difference <= 250) return 3;
    if (difference > 250 && difference <= 350) return 2;
    if (difference > 350 && difference <= 400) return 0;
    
    // For every additional 100 kcal difference above 400, deduct 1 point (-1)
    const extraDiff = difference - 400;
    const deduction = Math.ceil(extraDiff / 100);
    return -deduction;
  };

  const todayNutritionPoints = calculateNutritionPoints(nutritionTarget, nutritionActual);

  // --- Calculate point totals per mode ---
  const getTodayPointsForSystem = (system: string) => {
    const commit = calculateCommitmentPoints(commitmentStatus);
    const weight = todayWeightPoints;
    const nutrition = todayNutritionPoints;

    switch (system) {
      case "commitment": return commit;
      case "weights": return weight;
      case "nutrition": return nutrition;
      case "comprehensive": return Number((commit + weight + nutrition).toFixed(2));
      default: return 0;
    }
  };

  // --- Get Cumulative Score for User for a specific league system ---
  const getUserCumulativeScoreForSystem = (system: "commitment" | "weights" | "nutrition" | "comprehensive") => {
    // Total from past locked logs + today's currently calculated points
    let cumulative = 0;
    
    // Sum from past days (excluding today's live calculation to prevent double sum if today is already in history)
    const historyWithoutToday = pointsHistory.filter(h => h.date !== todayDateStr);
    
    historyWithoutToday.forEach(log => {
      const commit = log.commitmentPoints;
      const weight = log.weightPoints;
      const nutrition = log.nutritionPoints;

      switch (system) {
        case "commitment": cumulative += commit; break;
        case "weights": cumulative += weight; break;
        case "nutrition": cumulative += nutrition; break;
        case "comprehensive": cumulative += (commit + weight + nutrition); break;
      }
    });

    // Add today's current points
    cumulative += getTodayPointsForSystem(system);

    return Number(cumulative.toFixed(2));
  };

  // --- Generate Leaderboard Competitors dynamically ---
  // We populate the leaderboard with real user + pre-seeded high profile Egyptian & global athletes
  const getLeagueCompetitors = (league: League): Competitor[] => {
    const userScore = getUserCumulativeScoreForSystem(league.system);

    // Mock athletes with realistic deterministic historical scores + daily offsets to keep leaderboard exciting!
    const mockCompetitors: Competitor[] = [
      {
        id: "mock_salah",
        fullName: isRtl ? "محمد صلاح الدين" : "Mohamed Salah",
        username: "@salah_beast",
        avatar: "https://i.pravatar.cc/150?img=12",
        country: "Egypt",
        dailyPoints: 0,
        totalPoints: 0
      },
      {
        id: "mock_ramy",
        fullName: isRtl ? "كابتن رامي السبيعي" : "Big Ramy Jr",
        username: "@big_ramy_jr",
        avatar: "https://i.pravatar.cc/150?img=33",
        country: "Egypt",
        dailyPoints: 0,
        totalPoints: 0
      },
      {
        id: "mock_jasmine",
        fullName: isRtl ? "ياسمين حمدي" : "Jasmine Hamdy",
        username: "@jasmine_fit",
        avatar: "https://i.pravatar.cc/150?img=49",
        country: "Egypt",
        dailyPoints: 0,
        totalPoints: 0
      },
      {
        id: "mock_sherif",
        fullName: isRtl ? "شريف عثمان" : "Sherif Osman",
        username: "@sherif_power",
        avatar: "https://i.pravatar.cc/150?img=60",
        country: "Egypt",
        dailyPoints: 0,
        totalPoints: 0
      },
      {
        id: "mock_marcus",
        fullName: "Marcus Aurelius",
        username: "@marcus_iron",
        avatar: "https://i.pravatar.cc/150?img=15",
        country: "Global",
        dailyPoints: 0,
        totalPoints: 0
      },
      {
        id: "mock_sarah",
        fullName: "Sarah Connor",
        username: "@sarah_terminator",
        avatar: "https://i.pravatar.cc/150?img=43",
        country: "Germany",
        dailyPoints: 0,
        totalPoints: 0
      }
    ];

    // Seed competitor base scores depending on the system chosen
    const baseScores: Record<string, Record<string, { total: number, daily: number }>> = {
      commitment: {
        mock_salah: { total: 42, daily: 5 },
        mock_ramy: { total: 38, daily: 5 },
        mock_jasmine: { total: 45, daily: 5 },
        mock_sherif: { total: 40, daily: 4 },
        mock_marcus: { total: 35, daily: -2 },
        mock_sarah: { total: 39, daily: 4 }
      },
      weights: {
        mock_salah: { total: 24.5, daily: 3.2 },
        mock_ramy: { total: 78.4, daily: 9.5 },
        mock_jasmine: { total: 32.1, daily: 4.1 },
        mock_sherif: { total: 62.3, daily: 8.2 },
        mock_marcus: { total: 54.1, daily: 6.5 },
        mock_sarah: { total: 41.2, daily: 5.0 }
      },
      nutrition: {
        mock_salah: { total: 45, daily: 5 },
        mock_ramy: { total: 38, daily: 4 },
        mock_jasmine: { total: 42, daily: 5 },
        mock_sherif: { total: 35, daily: 3 },
        mock_marcus: { total: 28, daily: -1 },
        mock_sarah: { total: 40, daily: 4 }
      },
      comprehensive: {
        mock_salah: { total: 111.5, daily: 13.2 },
        mock_ramy: { total: 154.4, daily: 18.5 },
        mock_jasmine: { total: 119.1, daily: 14.1 },
        mock_sherif: { total: 137.3, daily: 15.2 },
        mock_marcus: { total: 117.1, daily: 3.3 },
        mock_sarah: { total: 120.2, daily: 13.0 }
      }
    };

    const scaledMockCompetitors = mockCompetitors.map(comp => {
      const stats = baseScores[league.system]?.[comp.id] || { total: 20, daily: 2 };
      return {
        ...comp,
        dailyPoints: stats.daily,
        totalPoints: stats.total
      };
    });

    // Add current user
    const currentCompetitor: Competitor = {
      id: "current_user",
      fullName: activeUser?.fullName || (isRtl ? "المستخدم الحالي" : "Current User"),
      username: activeUser?.username ? `@${activeUser.username}` : "@you",
      avatar: activeUser?.gender === "Female" ? "https://i.pravatar.cc/150?img=47" : "https://i.pravatar.cc/150?img=61",
      country: "Egypt",
      isCurrentUser: true,
      dailyPoints: getTodayPointsForSystem(league.system),
      totalPoints: userScore
    };

    const combined = [currentCompetitor, ...scaledMockCompetitors];
    
    // Sort descending by totalPoints
    return combined.sort((a, b) => b.totalPoints - a.totalPoints);
  };

  const activeLeague = leagues.find(l => l.id === activeLeagueId) || leagues[0];
  const competitorsList = activeLeague ? getLeagueCompetitors(activeLeague) : [];
  const userRank = competitorsList.findIndex(c => c.isCurrentUser) + 1;

  // --- Handlers ---

  // Handle Today's Log submission (Save activity and lock points)
  const handleSaveDailyLog = () => {
    if (typeof window === "undefined") return;

    const commitPoints = calculateCommitmentPoints(commitmentStatus);
    const weightPoints = todayWeightPoints;
    const nutritionPoints = todayNutritionPoints;

    const newLog: DailyPointsCalculation = {
      date: todayDateStr,
      commitmentStatus,
      commitmentPoints: commitPoints,
      weightExercises,
      weightPoints: weightPoints,
      nutritionTarget,
      nutritionActual: nutritionActual,
      nutritionPoints: nutritionPoints,
      totalPoints: Number((commitPoints + weightPoints + nutritionPoints).toFixed(2))
    };

    // Replace if today's log already exists in history, otherwise append
    const updatedHistory = [...pointsHistory.filter(h => h.date !== todayDateStr), newLog];
    
    setPointsHistory(updatedHistory);
    localStorage.setItem("vigorhub_fantasy_point_logs", JSON.stringify(updatedHistory));
    
    setSavingSuccess(true);
    setTimeout(() => {
      setSavingSuccess(false);
    }, 4000);
  };

  // Create League
  const handleCreateLeague = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeagueName.trim()) return;

    const code = `VIGOR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newLeague: League = {
      id: `league_${Date.now()}`,
      name: newLeagueName,
      code,
      system: newLeagueSystem,
      creatorId: activeUser?.id || "user",
      creatorName: activeUser?.fullName || "Vigor Athlete",
      joinedAt: new Date().toISOString()
    };

    const updatedLeagues = [...leagues, newLeague];
    setLeagues(updatedLeagues);
    setActiveLeagueId(newLeague.id);
    localStorage.setItem("vigorhub_fantasy_leagues", JSON.stringify(updatedLeagues));

    // Clear form and modal
    setNewLeagueName("");
    setShowCreateModal(false);
  };

  // Join League via Code
  const handleJoinLeague = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError("");
    const cleanedCode = joinCode.trim().toUpperCase();

    if (!cleanedCode) return;

    // Check if already in the league
    if (leagues.some(l => l.code === cleanedCode)) {
      setJoinError(isRtl ? "أنت بالفعل عضو في هذا الدوري!" : "You are already a member of this league!");
      return;
    }

    // Simulate joining (generate a random named league with the code if not a predefined system code)
    let joined: League;

    if (cleanedCode.startsWith("VIGOR-")) {
      // Find system league types or generate a custom simulated league
      const systems: Array<"commitment" | "weights" | "nutrition" | "comprehensive"> = [
        "commitment", "weights", "nutrition", "comprehensive"
      ];
      const randomSystem = systems[Math.floor(Math.random() * systems.length)];
      joined = {
        id: `league_${Date.now()}`,
        name: isRtl ? `دوري أبطال الساحة (${cleanedCode})` : `Arena Champions League (${cleanedCode})`,
        code: cleanedCode,
        system: randomSystem,
        creatorId: "other_user",
        creatorName: "Ahmed Coach",
        joinedAt: new Date().toISOString()
      };
    } else {
      setJoinError(isRtl ? "رمز الدوري غير صحيح. يجب أن يبدأ بـ -VIGOR" : "Invalid league code. Must start with VIGOR-");
      return;
    }

    const updatedLeagues = [...leagues, joined];
    setLeagues(updatedLeagues);
    setActiveLeagueId(joined.id);
    localStorage.setItem("vigorhub_fantasy_leagues", JSON.stringify(updatedLeagues));

    // Clear
    setJoinCode("");
    setShowJoinModal(false);
  };

  // Leave / Delete League (except default ones)
  const handleDeleteLeague = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === "league_global" || id === "league_commitment") return;

    const filtered = leagues.filter(l => l.id !== id);
    setLeagues(filtered);
    if (activeLeagueId === id && filtered.length > 0) {
      setActiveLeagueId(filtered[0].id);
    }
    localStorage.setItem("vigorhub_fantasy_leagues", JSON.stringify(filtered));
  };

  // --- Weight Volume Builder Helper Functions ---
  const handleAddExercise = () => {
    if (!newExerciseName.trim()) return;
    const newEx: ExerciseVolumeLog = {
      id: `ex_${Date.now()}`,
      name: newExerciseName,
      sets: [{ id: `set_${Date.now()}`, weight: 60, reps: 10 }]
    };
    setWeightExercises([...weightExercises, newEx]);
    setNewExerciseName("");
  };

  const handleRemoveExercise = (exId: string) => {
    setWeightExercises(weightExercises.filter(ex => ex.id !== exId));
  };

  const handleAddSet = (exId: string) => {
    setWeightExercises(weightExercises.map(ex => {
      if (ex.id === exId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              id: `set_${Date.now()}_${Math.random()}`,
              weight: lastSet ? lastSet.weight : 50,
              reps: lastSet ? lastSet.reps : 10
            }
          ]
        };
      }
      return ex;
    }));
  };

  const handleRemoveSet = (exId: string, setId: string) => {
    setWeightExercises(weightExercises.map(ex => {
      if (ex.id === exId) {
        return {
          ...ex,
          sets: ex.sets.filter(s => s.id !== setId)
        };
      }
      return ex;
    }));
  };

  const handleUpdateSet = (exId: string, setId: string, field: "weight" | "reps", val: number) => {
    setWeightExercises(weightExercises.map(ex => {
      if (ex.id === exId) {
        return {
          ...ex,
          sets: ex.sets.map(s => {
            if (s.id === setId) {
              return { ...s, [field]: val };
            }
            return s;
          })
        };
      }
      return ex;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-foreground" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* ─── Header Section ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                {isRtl ? "دوري الفانتازي الرياضي" : "VigorHub Fantasy Leagues"}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {isRtl ? "نقاط الأداء" : "Performance Points"}
                </span>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isRtl
                  ? "حوّل مجهودك الرياضي اليومي إلى نقاط وتنافس مع زملائك في دوريات مخصصة"
                  : "Convert your daily fitness effort into league points and compete head-to-head"}
              </p>
            </div>
          </div>
        </div>

        {/* Create / Join Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-border hover:bg-secondary/40 transition-all"
            id="btn_join_league"
          >
            <Users className="w-3.5 h-3.5" />
            {isRtl ? "انضم لدوري" : "Join League"}
          </button>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/10"
            id="btn_create_league"
          >
            <Plus className="w-3.5 h-3.5" />
            {isRtl ? "أنشئ دوري مخصص" : "Create League"}
          </button>
        </div>
      </div>

      {/* ─── League Selector Bar ─── */}
      <div className="mb-6">
        <label className="block text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-2">
          {isRtl ? "اختر الدوري النشط" : "Select Active League"}
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {leagues.map((league) => {
            const isActive = league.id === activeLeagueId;
            return (
              <button
                key={league.id}
                onClick={() => setActiveLeagueId(league.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all whitespace-nowrap relative group",
                  isActive
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-sm"
                    : "bg-secondary/10 border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <Shield className="w-3.5 h-3.5 text-emerald-500/80" />
                <span>{league.name}</span>
                <span className="text-[9px] opacity-60 bg-black/20 px-1.5 py-0.5 rounded uppercase font-mono">
                  {isRtl ? SYSTEM_LABELS.ar[league.system] : SYSTEM_LABELS.en[league.system]}
                </span>
                
                {/* Delete custom league button */}
                {league.id !== "league_global" && league.id !== "league_commitment" && (
                  <span
                    onClick={(e) => handleDeleteLeague(league.id, e)}
                    className="p-1 rounded hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Sub Navigation (Tabs) ─── */}
      <div className="flex items-center gap-2 border-b border-border/40 mb-6">
        {[
          { id: "dashboard", labelEn: "Leagues Overview", labelAr: "لوحة الصدارة والدوريات", icon: Trophy },
          { id: "logger", labelEn: "Log Points Today", labelAr: "تسجيل نقاط اليوم والدقة", icon: Zap },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 -mb-px transition-all relative",
                isActive
                  ? "border-emerald-500 text-emerald-500"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <TabIcon className="w-4 h-4" />
              {isRtl ? tab.labelAr : tab.labelEn}
            </button>
          );
        })}
      </div>

      {/* ─── TAB CONTENT: 1. DASHBOARD & STANDINGS ─── */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          
          {/* Active League Info & Rank Banner */}
          {activeLeague && (
            <div className={cn(
              "rounded-2xl border p-5 bg-gradient-to-br flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden",
              isDark ? "from-slate-900/40 to-emerald-950/10 border-slate-800" : "from-white to-emerald-50/20 border-slate-200"
            )}>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full inline-block">
                  {isRtl ? "تفاصيل الدوري المحدد" : "ACTIVE LEAGUE DETAILS"}
                </span>
                <h2 className="text-xl font-extrabold text-foreground">{activeLeague.name}</h2>
                
                {/* League rule metadata */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-foreground">
                      {isRtl ? SYSTEM_LABELS.ar[activeLeague.system] : SYSTEM_LABELS.en[activeLeague.system]}
                    </span>
                  </div>
                  <span className="h-3 w-px bg-border" />
                  <div className="flex items-center gap-1">
                    <span>{isRtl ? "رمز الانضمام:" : "League Code:"}</span>
                    <span className="font-mono font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                      {activeLeague.code}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Position Summary */}
              <div className="flex items-center gap-4 bg-secondary/25 p-3.5 rounded-xl border border-border/40 font-mono text-center self-start md:self-auto min-w-[180px]">
                <div className="flex-1">
                  <span className="block text-[9px] text-muted-foreground uppercase font-black mb-0.5">
                    {isRtl ? "ترتيبك بالدوري" : "YOUR RANK"}
                  </span>
                  <span className="text-2xl font-black text-amber-400">#{userRank}</span>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex-1">
                  <span className="block text-[9px] text-muted-foreground uppercase font-black mb-0.5">
                    {isRtl ? "مجموع نقاطك" : "TOTAL PTS"}
                  </span>
                  <span className="text-2xl font-black text-emerald-400">
                    {getUserCumulativeScoreForSystem(activeLeague.system)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Table */}
          <div className={cn(
            "rounded-2xl border overflow-hidden",
            isDark ? "bg-slate-900/20 border-slate-800" : "bg-white border-slate-200"
          )}>
            <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2 text-foreground">
                <Users className="w-4 h-4 text-emerald-500" />
                {isRtl ? "جدول الترتيب والمجموع التراكمي" : "Current Standings & Leaderboard"}
              </h3>
              
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-black font-mono">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>{isRtl ? "التحديث يتم في منتصف الليل" : "Points added at midnight"}</span>
              </div>
            </div>

            {/* List Table Headers */}
            <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-secondary/15 text-[10px] text-muted-foreground uppercase font-black border-b border-border/40">
              <div className="col-span-2 text-center">{isRtl ? "الترتيب" : "RANK"}</div>
              <div className="col-span-6 text-right">{isRtl ? "اللاعب الرياضي" : "ATHLETE"}</div>
              <div className="col-span-2 text-center">{isRtl ? "نقاط اليوم" : "TODAY PTS"}</div>
              <div className="col-span-2 text-center">{isRtl ? "إجمالي النقاط" : "TOTAL POINTS"}</div>
            </div>

            {/* Leaderboard Competitors Rows */}
            <div className="divide-y divide-border/40">
              {competitorsList.map((comp, idx) => {
                const rank = idx + 1;
                return (
                  <div
                    key={comp.id}
                    className={cn(
                      "grid grid-cols-12 gap-2 px-5 py-3.5 items-center text-xs transition-colors",
                      comp.isCurrentUser ? "bg-emerald-500/10 font-bold" : "hover:bg-secondary/10"
                    )}
                  >
                    {/* Rank Badge */}
                    <div className="col-span-2 flex justify-center">
                      {rank === 1 ? (
                        <div className="w-6.5 h-6.5 rounded-lg bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold">
                          <Crown className="w-3.5 h-3.5" />
                        </div>
                      ) : rank === 2 ? (
                        <div className="w-6.5 h-6.5 rounded-lg bg-slate-400/20 text-slate-300 flex items-center justify-center font-bold font-mono">
                          2
                        </div>
                      ) : rank === 3 ? (
                        <div className="w-6.5 h-6.5 rounded-lg bg-amber-700/20 text-amber-500 flex items-center justify-center font-bold font-mono">
                          3
                        </div>
                      ) : (
                        <span className="font-mono text-muted-foreground font-black">{rank}</span>
                      )}
                    </div>

                    {/* Athlete Details */}
                    <div className="col-span-6 flex items-center gap-3 flex-row-reverse text-right">
                      <img
                        src={comp.avatar}
                        alt={comp.fullName}
                        className={cn(
                          "w-9 h-9 rounded-full object-cover ring-2",
                          comp.isCurrentUser ? "ring-emerald-500" : "ring-border"
                        )}
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-foreground flex items-center gap-1.5 justify-end truncate">
                          {comp.fullName}
                          {comp.isCurrentUser && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                              {isRtl ? "أنت" : "YOU"}
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{comp.username}</p>
                      </div>
                    </div>

                    {/* Today's points */}
                    <div className="col-span-2 text-center font-mono font-black text-emerald-400">
                      {comp.dailyPoints > 0 ? `+${comp.dailyPoints}` : comp.dailyPoints}
                    </div>

                    {/* Total points */}
                    <div className="col-span-2 text-center font-mono font-black text-foreground">
                      {comp.totalPoints}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Rules Guide */}
          <div className={cn(
            "p-5 rounded-2xl border",
            isDark ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200"
          )}>
            <h4 className="text-sm font-black flex items-center gap-2 mb-3 text-foreground">
              <Info className="w-4 h-4 text-emerald-400" />
              {isRtl ? "دليل حساب نقاط فانتازي فيغورهاب" : "VigorHub Fantasy Scoring Blueprint"}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Commitment */}
              <div className="space-y-2 p-3.5 rounded-xl bg-secondary/20 border border-border/40">
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  {isRtl ? "1. نظام الالتزام بالتمرين" : "1. Workout Commitment"}
                </p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>{isRtl ? "تمرين كامل: +5XP" : "Complete Workout: +5 XP"}</li>
                  <li>{isRtl ? "نقص تمرينين: +4XP" : "Missed 2 exercises: +4 XP"}</li>
                  <li>{isRtl ? "نقص 4 تمارين: +3XP" : "Missed 4 exercises: +3 XP"}</li>
                  <li>{isRtl ? "أقل من ذلك: +1XP" : "Missed >4 exercises: +1 XP"}</li>
                  <li>{isRtl ? "يوم راحة: 0XP" : "Rest day: 0 XP"}</li>
                  <li>{isRtl ? "يوم تمرين ولم يتمرن: -2XP" : "Workout day, skipped: -2 XP"}</li>
                </ul>
              </div>

              {/* Weights */}
              <div className="space-y-2 p-3.5 rounded-xl bg-secondary/20 border border-border/40">
                <p className="font-bold text-teal-400 flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4" />
                  {isRtl ? "2. نظام الأوزان وحجم التمرين" : "2. Weight Volume"}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {isRtl 
                    ? "يتم حساب الوزن مضروباً في التكرارات لكل مجموعة، ثم نجمع جميع النتائج لكل التمارين، ويقسم المجموع الكلي على 1000."
                    : "Points are calculated based on weight times repetitions for each set, summed across all exercises, divided by 1000."}
                </p>
                <p className="text-[10px] font-bold text-teal-400 bg-teal-400/5 px-2 py-1 rounded inline-block font-mono">
                  Volume / 1000 = Points
                </p>
              </div>

              {/* Nutrition */}
              <div className="space-y-2 p-3.5 rounded-xl bg-secondary/20 border border-border/40">
                <p className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  {isRtl ? "3. نظام التغذية والسعرات" : "3. Nutrition Accuracy"}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {isRtl
                    ? "يقيس مدى القرب من السعرات المستهدفة:"
                    : "Measures accuracy of daily calories vs ideal target:"}
                </p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>{isRtl ? "فرق أقل من 100 سعرة: +5XP" : "Diff < 100 kcal: +5 XP"}</li>
                  <li>{isRtl ? "فرق 100 - 200 سعرة: +4XP" : "Diff 100 - 200 kcal: +4 XP"}</li>
                  <li>{isRtl ? "فرق 200 - 250 سعرة: +3XP" : "Diff 200 - 250 kcal: +3 XP"}</li>
                  <li>{isRtl ? "فرق 250 - 350 سعرة: +2XP" : "Diff 250 - 350 kcal: +2 XP"}</li>
                  <li>{isRtl ? "فرق 350 - 400 سعرة: 0XP" : "Diff 350 - 400 kcal: 0 XP"}</li>
                  <li>{isRtl ? "لكل 100 سعرة إضافية فوق 400: يخصم نقطة (-1)" : "Each extra 100kcal above 400: -1 XP"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENT: 2. LOG DAILY POINTS ─── */}
      {activeTab === "logger" && (
        <div className="space-y-6">
          
          <div className={cn(
            "p-5 rounded-2xl border",
            isDark ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200"
          )}>
            <h3 className="text-lg font-black text-foreground mb-1">
              {isRtl ? "حاسبة ومسجل نقاط اليوم الفورية" : "Daily Activity & Points Logger"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {isRtl 
                ? "قم بتسجيل أداءك وتغذيتك الفعلي لليوم لتحديث نقاطك في الدوري فوراً."
                : "Submit your actual workouts and meals today to calculate and claim your points."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LEFT COLUMN: Input form widgets */}
              <div className="space-y-6">
                
                {/* 1. Commitment Form */}
                <div className="space-y-3 p-4 bg-secondary/15 rounded-xl border border-border/40">
                  <label className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase">
                    <Flame className="w-4 h-4" />
                    {isRtl ? "الالتزام بتمرين اليوم" : "Today's Workout Commitment"}
                  </label>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: "full", labelEn: "Trained Fully (+5 XP)", labelAr: "تمرن بالكامل (+5 نقاط)" },
                      { key: "missed2", labelEn: "Missed 2 Exercises (+4 XP)", labelAr: "نقص تمرينين (+4 نقاط)" },
                      { key: "missed4", labelEn: "Missed 4 Exercises (+3 XP)", labelAr: "نقص 4 تمارين (+3 نقاط)" },
                      { key: "missedMore", labelEn: "Missed more than 4 Exercises (+1 XP)", labelAr: "نقص أكثر من 4 تمارين (+1 نقطة)" },
                      { key: "rest", labelEn: "Rest Day / No Workout (0 XP)", labelAr: "يوم راحة / لا تمرين (0 نقطة)" },
                      { key: "noTrain", labelEn: "Skipped workout on training day (-2 XP)", labelAr: "لم يتمرن في يوم تمرين (-2 نقطة)" }
                    ].map((status) => (
                      <button
                        key={status.key}
                        onClick={() => setCommitmentStatus(status.key)}
                        className={cn(
                          "w-full text-right px-4 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between",
                          commitmentStatus === status.key
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                            : "bg-secondary/20 border-transparent hover:border-border text-muted-foreground hover:text-foreground"
                        )}
                        dir={isRtl ? "rtl" : "ltr"}
                      >
                        <span>{isRtl ? status.labelAr : status.labelEn}</span>
                        {commitmentStatus === status.key && <CheckCheck className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Nutrition Form */}
                <div className="space-y-4 p-4 bg-secondary/15 rounded-xl border border-border/40">
                  <label className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase">
                    <Zap className="w-4 h-4" />
                    {isRtl ? "التغذية والسعرات لليوم" : "Today's Calories Track"}
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="block text-[10px] text-muted-foreground uppercase font-black">
                        {isRtl ? "المستهدف (Ideal Target)" : "Target Calories"}
                      </span>
                      <input
                        type="number"
                        value={nutritionTarget}
                        onChange={(e) => setNutritionTarget(Number(e.target.value))}
                        className="w-full text-center font-mono font-bold bg-secondary/30 border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="block text-[10px] text-muted-foreground uppercase font-black">
                        {isRtl ? "الفعلي المتناول" : "Actual Calories"}
                      </span>
                      <input
                        type="number"
                        value={nutritionActual}
                        onChange={(e) => setNutritionActual(Number(e.target.value))}
                        className="w-full text-center font-mono font-bold bg-secondary/30 border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400/40"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/10 text-[11px] text-muted-foreground leading-relaxed">
                    <p className="font-bold text-amber-400 mb-1">
                      {isRtl ? "تحليل دقة التغذية:" : "Nutrition Accuracy Analysis:"}
                    </p>
                    <div className="flex justify-between items-center text-xs mt-1">
                      <span>{isRtl ? "الفارق الفعلي اليوم:" : "Current Difference:"}</span>
                      <span className="font-bold text-foreground font-mono">
                        {Math.abs(nutritionActual - nutritionTarget)} kcal
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1">
                      <span>{isRtl ? "النقاط المستحقة:" : "Points Reward:"}</span>
                      <span className="font-bold text-amber-400 font-mono">
                        {todayNutritionPoints > 0 ? `+${todayNutritionPoints}` : todayNutritionPoints} XP
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Weight Volume Logger */}
              <div className="space-y-4 p-4 bg-secondary/15 rounded-xl border border-border/40 flex flex-col justify-between">
                <div>
                  <label className="text-xs font-black text-teal-400 flex items-center gap-1.5 uppercase mb-3">
                    <Dumbbell className="w-4 h-4" />
                    {isRtl ? "حجم الأوزان (Weight Volume Logger)" : "Weight Sets & Exercises"}
                  </label>

                  {/* Add Exercise form row */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newExerciseName}
                      onChange={(e) => setNewExerciseName(e.target.value)}
                      placeholder={isRtl ? "مثال: بنش مستوي، سكوات..." : "Add new exercise name..."}
                      className="flex-1 px-3 py-2 bg-secondary/30 border border-border rounded-xl text-xs focus:outline-none focus:border-teal-400/40"
                    />
                    <button
                      onClick={handleAddExercise}
                      className="px-3 py-2 bg-teal-500 text-white rounded-xl font-bold text-xs hover:bg-teal-600 active:scale-95 transition-all"
                    >
                      {isRtl ? "إضافة" : "Add"}
                    </button>
                  </div>

                  {/* Exercise Volume Log List Scroll */}
                  <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
                    {weightExercises.length === 0 ? (
                      <div className="text-center py-10 text-xs text-muted-foreground">
                        {isRtl ? "لا توجد تمارين مضافة لليوم بعد" : "No exercise logs added yet"}
                      </div>
                    ) : (
                      weightExercises.map((ex) => (
                        <div key={ex.id} className="p-3 bg-secondary/20 rounded-xl border border-border/30 relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-extrabold text-foreground">{ex.name}</span>
                            <button
                              onClick={() => handleRemoveExercise(ex.id)}
                              className="text-red-400 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Sets list */}
                          <div className="space-y-2">
                            {ex.sets.map((set, sIdx) => (
                              <div key={set.id} className="flex items-center gap-3 bg-black/10 p-2 rounded-lg text-xs">
                                <span className="font-mono text-[10px] text-muted-foreground">Set {sIdx + 1}</span>
                                
                                <div className="flex-1 flex items-center gap-1.5 justify-end">
                                  <input
                                    type="number"
                                    value={set.weight}
                                    onChange={(e) => handleUpdateSet(ex.id, set.id, "weight", Number(e.target.value))}
                                    className="w-14 text-center font-mono font-bold bg-secondary/45 border border-border/40 rounded px-1.5 py-0.5"
                                  />
                                  <span className="text-[10px] text-muted-foreground">{isRtl ? "كجم" : "kg"}</span>
                                </div>

                                <div className="flex-1 flex items-center gap-1.5 justify-end">
                                  <input
                                    type="number"
                                    value={set.reps}
                                    onChange={(e) => handleUpdateSet(ex.id, set.id, "reps", Number(e.target.value))}
                                    className="w-12 text-center font-mono font-bold bg-secondary/45 border border-border/40 rounded px-1.5 py-0.5"
                                  />
                                  <span className="text-[10px] text-muted-foreground">{isRtl ? "تكرار" : "reps"}</span>
                                </div>

                                <button
                                  onClick={() => handleRemoveSet(ex.id, set.id)}
                                  className="text-muted-foreground hover:text-red-400 p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Add set button */}
                          <button
                            onClick={() => handleAddSet(ex.id)}
                            className="mt-2.5 w-full py-1 border border-dashed border-teal-500/20 hover:border-teal-500/40 rounded-lg text-[10px] text-teal-400 font-bold hover:bg-teal-500/5 transition-all flex items-center justify-center gap-1"
                          >
                            <PlusCircle className="w-3 h-3" />
                            {isRtl ? "إضافة مجموعة جديدة" : "Add Set"}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Total Volume Points Summary */}
                <div className="p-3 rounded-xl bg-teal-400/5 border border-teal-400/10 mt-3 text-xs text-muted-foreground">
                  <div className="flex justify-between items-center">
                    <span>{isRtl ? "مجموع الأوزان المرفوعة (Volume):" : "Total Lifted Volume:"}</span>
                    <span className="font-bold text-foreground font-mono">{todayWeightVolume} kg</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span>{isRtl ? "النقاط المستحقة (الحجم / 1000):" : "Earned Points (Volume/1000):"}</span>
                    <span className="font-bold text-teal-400 font-mono">+{todayWeightPoints} XP</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Claim/Save daily log CTA bar */}
            <div className="mt-6 pt-5 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground uppercase font-black">
                    {isRtl ? "مجموع النقاط المستحقة لليوم" : "TOTAL XP TO ACCRUE TODAY"}
                  </span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {Number((
                      calculateCommitmentPoints(commitmentStatus) +
                      todayWeightPoints +
                      todayNutritionPoints
                    ).toFixed(2))} XP
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDailyLog}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/10 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  {isRtl ? "حفظ وتأكيد نشاط اليوم في الدوري" : "Save Today's Activity"}
                </button>
              </div>
            </div>

            {/* Success feedback animation overlay */}
            <AnimatePresence>
              {savingSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-400 font-bold flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>
                    {isRtl
                      ? "تم تأكيد وحفظ نقاطك في الدوري بنجاح! تم تحديث لوحة الصدارة."
                      : "Points secured and applied to all your active leagues! Check standings."}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      )}

      {/* ─── MODAL: CREATE LEAGUE ─── */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "relative rounded-2xl w-full max-w-md overflow-hidden border shadow-2xl z-10 flex flex-col",
                isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
              )}
            >
              <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-sm font-black text-foreground">
                  {isRtl ? "أنشئ دوري فانتازي جديد" : "Create New Fantasy League"}
                </h3>
                <div className="w-4" />
              </div>

              <form onSubmit={handleCreateLeague} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">
                    {isRtl ? "اسم الدوري" : "League Name"}
                  </label>
                  <input
                    type="text"
                    value={newLeagueName}
                    onChange={(e) => setNewLeagueName(e.target.value)}
                    placeholder={isRtl ? "مثال: شلة الحديد، أبطال الكاردو..." : "Example: Iron Brothers..."}
                    required
                    className="w-full px-3.5 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs focus:outline-none focus:border-emerald-500/40 text-left"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">
                    {isRtl ? "نظام حساب النقاط للدوري" : "Scoring Rule System"}
                  </label>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: "commitment", labelEn: "Commitment Only", labelAr: "نظام الالتزام بالتمرين فقط" },
                      { key: "weights", labelEn: "Weights Volume Only", labelAr: "نظام الأوزان والتكرارات فقط" },
                      { key: "nutrition", labelEn: "Nutrition Calories Only", labelAr: "نظام التغذية والسعرات فقط" },
                      { key: "comprehensive", labelEn: "Comprehensive (All 3 Combined)", labelAr: "نظام الشامل (الالتزام + الأوزان + التغذية)" }
                    ].map((sys) => (
                      <button
                        key={sys.key}
                        type="button"
                        onClick={() => setNewLeagueSystem(sys.key as any)}
                        className={cn(
                          "w-full text-right px-4 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between",
                          newLeagueSystem === sys.key
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                            : "bg-secondary/20 border-transparent hover:border-border text-muted-foreground hover:text-foreground"
                        )}
                        dir={isRtl ? "rtl" : "ltr"}
                      >
                        <span>{isRtl ? sys.labelAr : sys.labelEn}</span>
                        {newLeagueSystem === sys.key && <CheckCheck className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 text-white rounded-xl font-extrabold text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10"
                >
                  {isRtl ? "إنشاء وتفعيل الدوري الآن" : "Create & Launch League"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: JOIN LEAGUE ─── */}
      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJoinModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "relative rounded-2xl w-full max-w-md overflow-hidden border shadow-2xl z-10 flex flex-col",
                isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
              )}
            >
              <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-sm font-black text-foreground">
                  {isRtl ? "انضم لدوري مغلق" : "Join Existing League"}
                </h3>
                <div className="w-4" />
              </div>

              <form onSubmit={handleJoinLeague} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">
                    {isRtl ? "رمز الدوري (Code)" : "League Code"}
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="E.g. VIGOR-KFH87D"
                    required
                    className="w-full px-3.5 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs focus:outline-none focus:border-emerald-500/40 text-center font-mono font-bold tracking-widest"
                  />
                  {joinError && (
                    <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-1 justify-end">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{joinError}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 text-white rounded-xl font-extrabold text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10"
                >
                  {isRtl ? "الانضمام للدوري والدخول فوراً" : "Join League"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
