import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, Animated, Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection, query, where, getDocs,
  doc, addDoc, updateDoc, getDoc,
  increment, serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import BottomNavBar from "../components/BottomNavBar";
import { generateAllQuestions } from "../utils/generateQuestions";

const { width } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────
type Question = {
  id: string;
  question: string;
  answers: string[];
  correctIndex: number;
  topic: string;
  level: number;
  points: number;
  hint: string;
  explanation?: string;
};

type Screen = "topics" | "path" | "quiz" | "result";

type TopicProgress = {
  currentLevel: number;
  levelPoints: number;      // točke NA trenutnem levelu (se resetirajo)
  completedLevels: number[]; // zaključeni leveli
};

// ─── Constants ────────────────────────────────────────────────────────────────
const LEVELS = [
  { level: 1,  label: "Začetnik",     emoji: "🌱", pointsPerQ: 5,  pointsToUnlock: 50,  color: "#22C55E", dark: "#16A34A" },
  { level: 2,  label: "Raziskovalec", emoji: "🌿", pointsPerQ: 8,  pointsToUnlock: 70,  color: "#10B981", dark: "#059669" },
  { level: 3,  label: "Učenec",       emoji: "📚", pointsPerQ: 10, pointsToUnlock: 90,  color: "#0EA5E9", dark: "#0284C7" },
  { level: 4,  label: "Poznavalec",   emoji: "⭐", pointsPerQ: 12, pointsToUnlock: 110, color: "#6366F1", dark: "#4F46E5" },
  { level: 5,  label: "Napredni",     emoji: "⚡", pointsPerQ: 15, pointsToUnlock: 130, color: "#7C3AED", dark: "#6D28D9" },
  { level: 6,  label: "Specialist",   emoji: "🔬", pointsPerQ: 18, pointsToUnlock: 160, color: "#EC4899", dark: "#DB2777" },
  { level: 7,  label: "Strokovnjak",  emoji: "🔥", pointsPerQ: 22, pointsToUnlock: 200, color: "#F59E0B", dark: "#D97706" },
  { level: 8,  label: "Ekspert",      emoji: "💎", pointsPerQ: 28, pointsToUnlock: 250, color: "#EF4444", dark: "#DC2626" },
  { level: 9,  label: "Mojster",      emoji: "🚀", pointsPerQ: 35, pointsToUnlock: 320, color: "#8B5CF6", dark: "#7C3AED" },
  { level: 10, label: "Eko Junak",    emoji: "🏆", pointsPerQ: 45, pointsToUnlock: 999, color: "#D97706", dark: "#B45309" },
];

const TOPICS = [
  { id: "locevanje",    label: "Ločevanje odpadkov", emoji: "🗑️", color: "#22C55E", dark: "#16A34A", bg: "#F0FDF4" },
  { id: "recikliranje", label: "Recikliranje",        emoji: "♻️", color: "#7C3AED", dark: "#6D28D9", bg: "#EDE9FE" },
  { id: "okoli",        label: "Okolje in narava",    emoji: "🌍", color: "#0EA5E9", dark: "#0284C7", bg: "#E0F2FE" },
];

const ZIGZAG = [
  { left: 0.50 }, { left: 0.70 }, { left: 0.82 }, { left: 0.70 }, { left: 0.50 },
  { left: 0.30 }, { left: 0.18 }, { left: 0.30 }, { left: 0.50 }, { left: 0.50 },
];

const defaultProgress = (): TopicProgress => ({
  currentLevel: 1, levelPoints: 0, completedLevels: []
});

// ─── Component ────────────────────────────────────────────────────────────────
export default function QuizScreen({ navigation }: any) {
  const currentUser = auth.currentUser;

  const [currentScreen, setCurrentScreen] = useState<Screen>("topics");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [userRole, setUserRole] = useState("student");
  const [topicProgress, setTopicProgress] = useState<Record<string, TopicProgress>>({
    locevanje: defaultProgress(),
    recikliranje: defaultProgress(),
    okoli: defaultProgress(),
  });
  const [generating, setGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState("");
  const [generateCurrent, setGenerateCurrent] = useState(0);
  const [generateTotal, setGenerateTotal] = useState(30);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gainedPoints, setGainedPoints] = useState(0);
  const [levelUnlocked, setLevelUnlocked] = useState(false);

  const bounceAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { if (currentUser) loadUserData(); }, [currentUser]);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser!.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setTotalPoints(data.totalPoints ?? 0);
        setUserRole(data.role ?? "student");
        if (data.topicProgress) setTopicProgress(data.topicProgress);
      }
    } catch (e) {}
  };

  // ─── Progress helpers ───────────────────────────────────────────────────────
  const getProgress = (topicId: string): TopicProgress =>
    topicProgress[topicId] ?? defaultProgress();

  const isLevelUnlocked = (topicId: string, level: number): boolean => {
    if (level === 1) return true;
    const prog = getProgress(topicId);
    return prog.completedLevels.includes(level - 1) || prog.currentLevel >= level;
  };

  const getLevelProgressPercent = (topicId: string): number => {
    const prog = getProgress(topicId);
    const levelObj = LEVELS.find(l => l.level === prog.currentLevel)!;
    return Math.min(100, (prog.levelPoints / levelObj.pointsToUnlock) * 100);
  };

  // ─── Question difficulty based on progress ──────────────────────────────────
  // < 30% → review (level - 1), 30-80% → current level, > 80% → challenge (level + 1)
  const getQuestionLevel = (topicId: string, level: number): number => {
    const prog = getProgress(topicId);
    const levelObj = LEVELS.find(l => l.level === level)!;
    const pct = (prog.levelPoints / levelObj.pointsToUnlock) * 100;

    if (pct < 30 && level > 1 && prog.completedLevels.includes(level - 1)) {
      return level - 1; // review — lažja vprašanja
    }
    if (pct > 80 && level < 10) {
      return level + 1; // challenge — težja vprašanja
    }
    return level;
  };

  // ─── Start quiz ─────────────────────────────────────────────────────────────
  const startQuiz = async (level: number) => {
    setSelectedLevel(level);
    setLoading(true);
    try {
      const questionLevel = getQuestionLevel(selectedTopic, level);
      const prog = getProgress(selectedTopic);
      const levelObj = LEVELS.find(l => l.level === level)!;
      const pct = (prog.levelPoints / levelObj.pointsToUnlock) * 100;

      // Show hint about question difficulty
      if (questionLevel < level) {
        console.log(`Review mode: getting level ${questionLevel} questions (${Math.round(pct)}% progress)`);
      } else if (questionLevel > level) {
        console.log(`Challenge mode: getting level ${questionLevel} questions (${Math.round(pct)}% progress)`);
      }

      // Get questions for this topic + adjusted level
      const snap = await getDocs(
        query(
          collection(db, "quizQuestions"),
          where("topic", "==", selectedTopic),
          where("level", "==", questionLevel)
        )
      );

      let list: Question[] = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() } as Question));

      // Fallback to difficulty
      if (list.length === 0) {
        const diffMap: Record<number, string> = {
          1: "lahko", 2: "lahko", 3: "lahko", 4: "srednje",
          5: "srednje", 6: "srednje", 7: "tezko", 8: "tezko", 9: "tezko", 10: "tezko"
        };
        const snap2 = await getDocs(
          query(
            collection(db, "quizQuestions"),
            where("topic", "==", selectedTopic),
            where("difficulty", "==", diffMap[questionLevel] ?? "lahko")
          )
        );
        snap2.forEach(d => list.push({ id: d.id, ...d.data() } as Question));
      }

      if (list.length === 0) list = getFallbackQuestions(selectedTopic, questionLevel, levelObj.pointsPerQ);

      // Random 5 from pool — different for each student!
      setQuestions(list.sort(() => 0.5 - Math.random()).slice(0, 5));
      setCurrentQuestionIndex(0);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
      setScore(0);
      setGainedPoints(0);
      setLevelUnlocked(false);
      setCurrentScreen("quiz");
    } catch (e) {
      Alert.alert("Napaka", "Ni se uspelo naložiti vprašanj.");
    } finally {
      setLoading(false);
    }
  };

  const getFallbackQuestions = (topic: string, level: number, points: number): Question[] => [
    { id: "f1", question: "V kateri zabojnik odvržemo plastično steklenico?", answers: ["Rumeni", "Modri", "Zeleni", "Rjavi"], correctIndex: 0, topic, level, points, hint: "Plastika = embalaža" },
    { id: "f2", question: "Kaj je recikliranje?", answers: ["Ponovna uporaba materialov", "Sežiganje odpadkov", "Zakopavanje", "Puščanje v naravi"], correctIndex: 0, topic, level, points, hint: "Ponovna uporaba." },
    { id: "f3", question: "Kam odložimo steklenico?", answers: ["Zeleni zabojnik", "Rumeni", "Modri", "Rjavi"], correctIndex: 0, topic, level, points, hint: "Steklo = zeleni." },
    { id: "f4", question: "Kaj spada v modri zabojnik?", answers: ["Papir in karton", "Plastika", "Hrana", "Steklo"], correctIndex: 0, topic, level, points, hint: "Modri = papir." },
    { id: "f5", question: "Kaj storimo s plastenko?", answers: ["Stisnemo jo", "Napolnimo", "Razbijemo", "Nič"], correctIndex: 0, topic, level, points, hint: "Stiskanje prihrani prostor." },
  ];

  // ─── Answer handling ─────────────────────────────────────────────────────────
  const handleAnswerSelect = (idx: number) => { if (!isAnswered) setSelectedAnswerIndex(idx); };

  const submitAnswer = () => {
    if (selectedAnswerIndex === null || isAnswered) return;
    setIsAnswered(true);
    const correct = selectedAnswerIndex === questions[currentQuestionIndex].correctIndex;
    if (correct) {
      setScore(s => s + 1);
      setGainedPoints(p => p + questions[currentQuestionIndex].points);
      Animated.sequence([
        Animated.spring(bounceAnim, { toValue: 1.08, useNativeDriver: true }),
        Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
    } else {
      await saveResults();
      setCurrentScreen("result");
    }
  };

  const saveResults = async () => {
    if (!currentUser) return;
    try {
      const prog = getProgress(selectedTopic);
      const levelObj = LEVELS.find(l => l.level === selectedLevel)!;

      // New level points = old + gained (capped at pointsToUnlock)
      const newLevelPoints = Math.min(
        prog.levelPoints + gainedPoints,
        levelObj.pointsToUnlock
      );

      // Check if level completed
      const justCompleted = newLevelPoints >= levelObj.pointsToUnlock && selectedLevel < 10;
      let newCurrentLevel = prog.currentLevel;
      let newLevelPointsAfterReset = newLevelPoints;
      let newCompletedLevels = [...prog.completedLevels];

      if (justCompleted) {
        // Level completed → unlock next, reset points to 0
        if (!newCompletedLevels.includes(selectedLevel)) {
          newCompletedLevels.push(selectedLevel);
        }
        newCurrentLevel = selectedLevel + 1;
        newLevelPointsAfterReset = 0; // RESET točke!
        setLevelUnlocked(true);
      }

      const newProgress: TopicProgress = {
        currentLevel: newCurrentLevel,
        levelPoints: newLevelPointsAfterReset,
        completedLevels: newCompletedLevels,
      };

      setTopicProgress(prev => ({ ...prev, [selectedTopic]: newProgress }));

      // Save to Firebase
      await addDoc(collection(db, "quizResults"), {
        userId: currentUser.uid,
        topic: selectedTopic,
        level: selectedLevel,
        levelLabel: levelObj.label,
        score, totalQuestions: questions.length,
        pointsGained: gainedPoints,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "users", currentUser.uid), {
        totalPoints: increment(gainedPoints),
        weeklyPoints: increment(gainedPoints),
        quizCompleted: increment(1),
        [`topicProgress.${selectedTopic}.currentLevel`]: newCurrentLevel,
        [`topicProgress.${selectedTopic}.levelPoints`]: newLevelPointsAfterReset,
        [`topicProgress.${selectedTopic}.completedLevels`]: newCompletedLevels,
      });

      setTotalPoints(p => p + gainedPoints);
    } catch (e) { console.log(e); }
  };

  const handleGenerateQuestions = () => {
    Alert.alert("🤖 Generiraj AI vprašanja", "Gemini bo ustvaril vprašanja za vse nivoje in teme (~5-10 min).",
      [
        { text: "Prekliči", style: "cancel" },
        { text: "Generiraj ✨", onPress: async () => {
          setGenerating(true);
          try {
            const result = await generateAllQuestions((msg, current, total) => {
              setGenerateProgress(msg); setGenerateCurrent(current); setGenerateTotal(total);
            });
            Alert.alert("Končano! ✅", `Uspešno: ${result.success}\nNeuspešno: ${result.failed}`);
          } catch (e) { Alert.alert("Napaka", "Generiranje ni uspelo."); }
          finally { setGenerating(false); setGenerateProgress(""); }
        }}
      ]
    );
  };

  // ─── NOT LOGGED IN ─────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30 }}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🎓</Text>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#1F2937", textAlign: "center", marginBottom: 10 }}>Kviz je zaklenjen</Text>
          <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 22, marginBottom: 26 }}>Prijavi se da zbiraš točke!</Text>
          <TouchableOpacity style={{ backgroundColor: "#7C3AED", paddingVertical: 14, borderRadius: 14, width: "100%", alignItems: "center" }} onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Prijavi se</Text>
          </TouchableOpacity>
        </View>
        <BottomNavBar navigation={navigation} activeRoute="Quiz" />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={{ marginTop: 12, color: "#6B7280", fontWeight: "600" }}>Nalagam vprašanja...</Text>
      </SafeAreaView>
    );
  }

  // ─── TOPICS SCREEN ────────────────────────────────────────────────────────
  if (currentScreen === "topics") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <View>
              <Text style={{ fontSize: 26, fontWeight: "800", color: "#1F2937" }}>Eko Kviz 🎓</Text>
              <Text style={{ fontSize: 14, color: "#6B7280" }}>Izberi temo in nadaljuj pot!</Text>
            </View>
            <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#D97706" }}>⭐ {totalPoints}</Text>
            </View>
          </View>

          {userRole === "teacher" && (
            <TouchableOpacity
              style={{ backgroundColor: generating ? "#F3F4F6" : "#1F2937", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 10, marginTop: 16, marginBottom: 8 }}
              onPress={handleGenerateQuestions} disabled={generating}
            >
              {generating ? <ActivityIndicator size="small" color="#7C3AED" /> : <Text style={{ fontSize: 18 }}>🤖</Text>}
              <View style={{ flex: 1 }}>
                <Text style={{ color: generating ? "#6B7280" : "#fff", fontWeight: "700", fontSize: 13 }}>
                  {generating ? "Generiram..." : "Generiraj AI vprašanja"}
                </Text>
                {generating && generateProgress ? (
                  <Text style={{ color: "#7C3AED", fontSize: 11, marginTop: 1 }} numberOfLines={1}>
                    {generateProgress} ({generateCurrent}/{generateTotal})
                  </Text>
                ) : (
                  <Text style={{ color: "#9CA3AF", fontSize: 11 }}>Gemini AI · 600 vprašanj · 10 nivojev</Text>
                )}
              </View>
            </TouchableOpacity>
          )}

          <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F2937", marginTop: 20, marginBottom: 12 }}>Izberi temo:</Text>

          {TOPICS.map(topic => {
            const prog = getProgress(topic.id);
            const levelObj = LEVELS.find(l => l.level === prog.currentLevel)!;
            const progressPct = getLevelProgressPercent(topic.id);

            return (
              <TouchableOpacity
                key={topic.id}
                style={{ backgroundColor: "#fff", borderRadius: 20, marginBottom: 14, overflow: "hidden", shadowColor: topic.color, shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4, borderWidth: 1, borderColor: topic.color + "20" }}
                onPress={() => { setSelectedTopic(topic.id); setCurrentScreen("path"); }}
                activeOpacity={0.85}
              >
                <View style={{ height: 5, backgroundColor: topic.color }} />
                <View style={{ padding: 18 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
                    <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: topic.bg, justifyContent: "center", alignItems: "center", marginRight: 14 }}>
                      <Text style={{ fontSize: 26 }}>{topic.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 17, fontWeight: "800", color: "#1F2937" }}>{topic.label}</Text>
                      <Text style={{ fontSize: 13, color: topic.color, fontWeight: "600", marginTop: 2 }}>
                        {levelObj.emoji} {levelObj.label} · Nivo {prog.currentLevel}/10
                      </Text>
                    </View>
                    <View style={{ backgroundColor: topic.bg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: topic.dark }}>
                        {prog.levelPoints}/{levelObj.pointsToUnlock}t
                      </Text>
                    </View>
                  </View>
                  <View style={{ height: 8, backgroundColor: "#F3F4F6", borderRadius: 4, marginBottom: 6 }}>
                    <View style={{ height: 8, backgroundColor: topic.color, borderRadius: 4, width: `${progressPct}%` }} />
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 11, color: "#9CA3AF" }}>{Math.round(progressPct)}% do naslednjega nivoja</Text>
                    <Text style={{ fontSize: 11, color: "#9CA3AF" }}>
                      {levelObj.pointsToUnlock - prog.levelPoints} točk manjka
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <BottomNavBar navigation={navigation} activeRoute="Quiz" />
      </SafeAreaView>
    );
  }

  // ─── PATH SCREEN ──────────────────────────────────────────────────────────
  if (currentScreen === "path") {
    const topic = TOPICS.find(t => t.id === selectedTopic)!;
    const prog = getProgress(selectedTopic);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={{ backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 16, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
            <TouchableOpacity onPress={() => setCurrentScreen("topics")}>
              <Text style={{ fontSize: 22, color: "#6B7280" }}>←</Text>
            </TouchableOpacity>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: topic.bg, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 22 }}>{topic.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#1F2937" }}>{topic.label}</Text>
              <Text style={{ fontSize: 12, color: topic.color, fontWeight: "600" }}>
                {LEVELS.find(l => l.level === prog.currentLevel)?.emoji} Nivo {prog.currentLevel}/10
              </Text>
            </View>
            <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: "800", color: "#D97706" }}>
                {prog.levelPoints}/{LEVELS.find(l => l.level === prog.currentLevel)?.pointsToUnlock}t
              </Text>
            </View>
          </View>

          <View style={{ paddingTop: 24, paddingHorizontal: 20 }}>
            {[...LEVELS].reverse().map((levelObj, index) => {
              const actualIndex = LEVELS.length - 1 - index;
              const unlocked = isLevelUnlocked(selectedTopic, levelObj.level);
              const isCurrent = levelObj.level === prog.currentLevel;
              const isDone = prog.completedLevels.includes(levelObj.level);
              const zigzag = ZIGZAG[actualIndex];
              const progressPct = isCurrent ? getLevelProgressPercent(selectedTopic) : isDone ? 100 : 0;

              return (
                <View key={levelObj.level} style={{ marginBottom: 28, alignItems: "flex-start" }}>
                  <View style={{ marginLeft: `${(zigzag.left * 100) - 11}%` as any }}>
                    {isCurrent && (
                      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 6, gap: 3 }}>
                        <Text style={{ fontSize: 14 }}>⭐</Text><Text style={{ fontSize: 14 }}>⭐</Text><Text style={{ fontSize: 14 }}>⭐</Text>
                      </View>
                    )}

                    <TouchableOpacity
                      onPress={() => {
                        if (!unlocked) {
                          Alert.alert("Zaklenjeno 🔒", `Najprej zaključi Nivo ${levelObj.level - 1}!`);
                          return;
                        }
                        startQuiz(levelObj.level);
                      }}
                      activeOpacity={0.8}
                    >
                      <Animated.View style={[{
                        width: isCurrent ? 88 : 74,
                        height: isCurrent ? 88 : 74,
                        borderRadius: isCurrent ? 44 : 37,
                        backgroundColor: !unlocked ? "#E5E7EB" : isDone ? topic.color + "CC" : topic.color,
                        justifyContent: "center", alignItems: "center",
                        shadowColor: unlocked ? topic.color : "#000",
                        shadowOpacity: unlocked ? 0.35 : 0.08,
                        shadowRadius: isCurrent ? 14 : 6,
                        shadowOffset: { width: 0, height: isCurrent ? 5 : 2 },
                        elevation: isCurrent ? 10 : 3,
                        borderWidth: isCurrent ? 4 : 2,
                        borderColor: !unlocked ? "#D1D5DB" : topic.dark,
                      }, isCurrent && { transform: [{ scale: bounceAnim }] }]}>
                        <Text style={{ fontSize: isCurrent ? 30 : 24 }}>
                          {!unlocked ? "🔒" : isDone ? "✅" : levelObj.emoji}
                        </Text>
                      </Animated.View>
                    </TouchableOpacity>

                    {isCurrent && (
                      <View style={{ marginTop: 6, width: 88 }}>
                        <View style={{ height: 5, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 3 }}>
                          <View style={{ height: 5, backgroundColor: topic.dark, borderRadius: 3, width: `${progressPct}%` }} />
                        </View>
                        <Text style={{ fontSize: 9, color: "#9CA3AF", textAlign: "center", marginTop: 2 }}>
                          {prog.levelPoints}/{levelObj.pointsToUnlock}t
                        </Text>
                      </View>
                    )}

                    <View style={{ marginTop: 5, alignItems: "center", width: 88 }}>
                      <Text style={{ fontSize: 10, color: "#9CA3AF", textAlign: "center" }}>Nivo {levelObj.level}</Text>
                      <Text style={{ fontSize: 11, fontWeight: "700", textAlign: "center", color: unlocked ? topic.dark : "#9CA3AF" }}>
                        {levelObj.label}
                      </Text>
                      {unlocked ? (
                        <Text style={{ fontSize: 10, color: topic.color, fontWeight: "600" }}>+{levelObj.pointsPerQ}t/Q</Text>
                      ) : (
                        <Text style={{ fontSize: 9, color: "#9CA3AF" }}>🔒 Zaklenjeno</Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <BottomNavBar navigation={navigation} activeRoute="Quiz" />
      </SafeAreaView>
    );
  }

  // ─── QUIZ SCREEN ──────────────────────────────────────────────────────────
  if (currentScreen === "quiz") {
    const topic = TOPICS.find(t => t.id === selectedTopic)!;
    const levelObj = LEVELS.find(l => l.level === selectedLevel)!;
    const currentQ = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;
    const questionLevel = getQuestionLevel(selectedTopic, selectedLevel);
    const isReview = questionLevel < selectedLevel;
    const isChallenge = questionLevel > selectedLevel;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <TouchableOpacity onPress={() => setCurrentScreen("path")}>
              <Text style={{ fontSize: 22, color: "#6B7280" }}>✕</Text>
            </TouchableOpacity>
            <View style={{ flex: 1, height: 10, backgroundColor: "#F3F4F6", borderRadius: 5 }}>
              <View style={{ height: 10, backgroundColor: topic.color, borderRadius: 5, width: `${progress}%` }} />
            </View>
            <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#D97706" }}>⭐ +{gainedPoints}</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: topic.color, textTransform: "uppercase", letterSpacing: 1 }}>
              {topic.emoji} Nivo {selectedLevel} · {currentQuestionIndex + 1}/{questions.length}
            </Text>
            {isReview && (
              <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: "#D97706" }}>📖 REVIEW</Text>
              </View>
            )}
            {isChallenge && (
              <View style={{ backgroundColor: "#FEE2E2", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: "#EF4444" }}>🔥 IZZIV</Text>
              </View>
            )}
          </View>

          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937", lineHeight: 28, marginBottom: 28 }}>
              {currentQ.question}
            </Text>
          </Animated.View>

          {currentQ.answers.map((ans, idx) => {
            const isSelected = selectedAnswerIndex === idx;
            const isCorrect = idx === currentQ.correctIndex;
            let bg = "#F9FAFB", border = "#E5E7EB", textColor = "#374151", icon = "";
            if (isSelected && !isAnswered) { bg = topic.color + "15"; border = topic.color; textColor = topic.dark; }
            if (isAnswered) {
              if (isCorrect) { bg = "#DCFCE7"; border = "#22C55E"; textColor = "#166534"; icon = " ✓"; }
              else if (isSelected) { bg = "#FEE2E2"; border = "#EF4444"; textColor = "#991B1B"; icon = " ✗"; }
            }
            return (
              <TouchableOpacity
                key={idx}
                style={{ backgroundColor: bg, borderWidth: 2, borderColor: border, borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: "row", alignItems: "center" }}
                onPress={() => handleAnswerSelect(idx)}
                disabled={isAnswered}
                activeOpacity={0.8}
              >
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: isAnswered && isCorrect ? "#22C55E" : (isAnswered && isSelected ? "#EF4444" : (isSelected ? topic.color : "#E5E7EB")), justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: (isSelected || (isAnswered && isCorrect)) ? "#fff" : "#9CA3AF" }}>
                    {String.fromCharCode(65 + idx)}
                  </Text>
                </View>
                <Text style={{ fontSize: 15, color: textColor, fontWeight: isSelected ? "600" : "400", flex: 1 }}>{ans}{icon}</Text>
              </TouchableOpacity>
            );
          })}

          {isAnswered && currentQ.hint && (
            <View style={{ backgroundColor: "#FEF3C7", borderRadius: 12, padding: 14, marginTop: 4, marginBottom: 8, flexDirection: "row", gap: 8 }}>
              <Text style={{ fontSize: 16 }}>💡</Text>
              <Text style={{ fontSize: 13, color: "#92400E", flex: 1 }}>{currentQ.hint}</Text>
            </View>
          )}
          {isAnswered && currentQ.explanation && (
            <View style={{ backgroundColor: "#EFF6FF", borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: "row", gap: 8 }}>
              <Text style={{ fontSize: 16 }}>📖</Text>
              <Text style={{ fontSize: 13, color: "#1D4ED8", flex: 1 }}>{currentQ.explanation}</Text>
            </View>
          )}
        </ScrollView>

        <View style={{ paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#F3F4F6" }}>
          {!isAnswered ? (
            <TouchableOpacity
              style={{ backgroundColor: selectedAnswerIndex !== null ? topic.color : "#E5E7EB", borderRadius: 14, padding: 18, alignItems: "center" }}
              onPress={submitAnswer} disabled={selectedAnswerIndex === null}
            >
              <Text style={{ color: selectedAnswerIndex !== null ? "#fff" : "#9CA3AF", fontWeight: "800", fontSize: 16 }}>POTRDI</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ backgroundColor: "#22C55E", borderRadius: 14, padding: 18, alignItems: "center" }}
              onPress={nextQuestion}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                {currentQuestionIndex + 1 === questions.length ? "ZAKLJUČI ✅" : "NAPREJ →"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // ─── RESULT SCREEN ────────────────────────────────────────────────────────
  const topic = TOPICS.find(t => t.id === selectedTopic)!;
  const levelObj = LEVELS.find(l => l.level === selectedLevel)!;
  const prog = getProgress(selectedTopic);
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120, alignItems: "center" }}>

        {/* Level unlocked banner */}
        {levelUnlocked && (
          <View style={{ backgroundColor: "#FEF3C7", borderRadius: 16, padding: 16, width: "100%", marginBottom: 20, borderWidth: 2, borderColor: "#D97706", alignItems: "center" }}>
            <Text style={{ fontSize: 32 }}>🎉</Text>
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#D97706", textAlign: "center" }}>
              Nivo {selectedLevel + 1} odklenjen!
            </Text>
            <Text style={{ fontSize: 13, color: "#92400E", textAlign: "center", marginTop: 4 }}>
              {LEVELS.find(l => l.level === selectedLevel + 1)?.emoji} {LEVELS.find(l => l.level === selectedLevel + 1)?.label}
            </Text>
          </View>
        )}

        <Text style={{ fontSize: 80, marginBottom: 8, marginTop: levelUnlocked ? 0 : 20 }}>
          {score === questions.length ? "🏆" : score >= questions.length * 0.6 ? "⭐" : "💪"}
        </Text>
        <Text style={{ fontSize: 26, fontWeight: "800", color: "#1F2937", marginBottom: 4 }}>
          {score === questions.length ? "Popolno!" : score >= questions.length * 0.6 ? "Odlično!" : "Poskusi znova!"}
        </Text>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 28 }}>
          {topic.emoji} {topic.label} · {levelObj.emoji} Nivo {selectedLevel}
        </Text>

        {/* Stats */}
        <View style={{ backgroundColor: "#F9FAFB", borderRadius: 20, padding: 24, width: "100%", marginBottom: 20, borderWidth: 1, borderColor: "#E5E7EB" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 36, fontWeight: "800", color: "#1F2937" }}>{score}/{questions.length}</Text>
              <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Pravilno</Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#E5E7EB" }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 36, fontWeight: "800", color: "#22C55E" }}>+{gainedPoints}</Text>
              <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Točke</Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#E5E7EB" }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 36, fontWeight: "800", color: topic.color }}>{percentage}%</Text>
              <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Uspeh</Text>
            </View>
          </View>
        </View>

        {/* Level progress */}
        {!levelUnlocked && (
          <View style={{ backgroundColor: topic.bg, borderRadius: 16, padding: 16, width: "100%", marginBottom: 24, borderWidth: 1, borderColor: topic.color + "30" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: "#1F2937" }}>
                {topic.emoji} Nivo {prog.currentLevel} napredek
              </Text>
              <Text style={{ fontSize: 13, fontWeight: "700", color: topic.color }}>
                {prog.levelPoints}/{levelObj.pointsToUnlock}t
              </Text>
            </View>
            <View style={{ height: 8, backgroundColor: "#E5E7EB", borderRadius: 4 }}>
              <View style={{ height: 8, backgroundColor: topic.color, borderRadius: 4, width: `${getLevelProgressPercent(selectedTopic)}%` }} />
            </View>
            <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
              Še {levelObj.pointsToUnlock - prog.levelPoints} točk do naslednjega nivoja
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={{ backgroundColor: topic.color, borderRadius: 14, paddingVertical: 18, width: "100%", alignItems: "center", marginBottom: 12 }}
          onPress={() => startQuiz(selectedLevel)}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>IGRAJ ZNOVA 🎮</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ borderWidth: 2, borderColor: "#E5E7EB", borderRadius: 14, paddingVertical: 16, width: "100%", alignItems: "center", marginBottom: 10 }}
          onPress={() => setCurrentScreen("path")}
        >
          <Text style={{ color: "#6B7280", fontWeight: "700" }}>Nazaj na pot 🗺️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ borderWidth: 2, borderColor: topic.color + "50", borderRadius: 14, paddingVertical: 16, width: "100%", alignItems: "center" }}
          onPress={() => setCurrentScreen("topics")}
        >
          <Text style={{ color: topic.color, fontWeight: "700" }}>Vse teme 📚</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavBar navigation={navigation} activeRoute="Quiz" />
    </SafeAreaView>
  );
}