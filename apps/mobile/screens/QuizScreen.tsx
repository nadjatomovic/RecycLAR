import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import BottomNavBar from "../components/BottomNavBar";
import { generateAllQuestions } from "../utils/generateQuestions";
import { styles as s } from "../styles/QuizScreen.styles";
import LottieView from "lottie-react-native";

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
  levelPoints: number;
  completedLevels: number[];
};

const LEVELS = [
  {
    level: 1,
    label: "Začetnik",
    emoji: "🌱",
    pointsPerQ: 5,
    pointsToUnlock: 50,
    color: "#22C55E",
    dark: "#16A34A",
  },
  {
    level: 2,
    label: "Raziskovalec",
    emoji: "🌿",
    pointsPerQ: 8,
    pointsToUnlock: 70,
    color: "#10B981",
    dark: "#059669",
  },
  {
    level: 3,
    label: "Učenec",
    emoji: "📚",
    pointsPerQ: 10,
    pointsToUnlock: 90,
    color: "#0EA5E9",
    dark: "#0284C7",
  },
  {
    level: 4,
    label: "Poznavalec",
    emoji: "⭐",
    pointsPerQ: 12,
    pointsToUnlock: 110,
    color: "#6366F1",
    dark: "#4F46E5",
  },
  {
    level: 5,
    label: "Napredni",
    emoji: "⚡",
    pointsPerQ: 15,
    pointsToUnlock: 130,
    color: "#7C3AED",
    dark: "#6D28D9",
  },
  {
    level: 6,
    label: "Specialist",
    emoji: "🔬",
    pointsPerQ: 18,
    pointsToUnlock: 160,
    color: "#EC4899",
    dark: "#DB2777",
  },
  {
    level: 7,
    label: "Strokovnjak",
    emoji: "🔥",
    pointsPerQ: 22,
    pointsToUnlock: 200,
    color: "#F59E0B",
    dark: "#D97706",
  },
  {
    level: 8,
    label: "Ekspert",
    emoji: "💎",
    pointsPerQ: 28,
    pointsToUnlock: 250,
    color: "#EF4444",
    dark: "#DC2626",
  },
  {
    level: 9,
    label: "Mojster",
    emoji: "🚀",
    pointsPerQ: 35,
    pointsToUnlock: 320,
    color: "#8B5CF6",
    dark: "#7C3AED",
  },
  {
    level: 10,
    label: "Eko Junak",
    emoji: "🏆",
    pointsPerQ: 45,
    pointsToUnlock: 999,
    color: "#D97706",
    dark: "#B45309",
  },
];

const TOPICS = [
  {
    id: "locevanje",
    label: "Ločevanje odpadkov",
    emoji: "🗑️",
    color: "#22C55E",
    dark: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    id: "recikliranje",
    label: "Recikliranje",
    emoji: "♻️",
    color: "#7C3AED",
    dark: "#6D28D9",
    bg: "#EDE9FE",
  },
  {
    id: "okoli",
    label: "Okolje in narava",
    emoji: "🌍",
    color: "#0EA5E9",
    dark: "#0284C7",
    bg: "#E0F2FE",
  },
];

const ZIGZAG = [
  { left: 0.5 },
  { left: 0.7 },
  { left: 0.82 },
  { left: 0.7 },
  { left: 0.5 },
  { left: 0.3 },
  { left: 0.18 },
  { left: 0.3 },
  { left: 0.5 },
  { left: 0.5 },
];

const defaultProgress = (): TopicProgress => ({
  currentLevel: 1,
  levelPoints: 0,
  completedLevels: [],
});

export default function QuizScreen({ navigation }: any) {
  const currentUser = auth.currentUser;

  const [currentScreen, setCurrentScreen] = useState<Screen>("topics");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const [totalPoints, setTotalPoints] = useState(0);
  const [userRole, setUserRole] = useState("student");

  const [topicProgress, setTopicProgress] = useState<
    Record<string, TopicProgress>
  >({
    locevanje: defaultProgress(),
    recikliranje: defaultProgress(),
    okoli: defaultProgress(),
  });

  const [generating, setGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState("");
  const [generateCurrent, setGenerateCurrent] = useState(0);
  const [generateTotal, setGenerateTotal] = useState(30);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null,
  );
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gainedPoints, setGainedPoints] = useState(0);
  const [levelUnlocked, setLevelUnlocked] = useState(false);

  const bounceAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser]);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser!.uid));

      if (userDoc.exists()) {
        const data = userDoc.data();

        setTotalPoints(data.totalPoints ?? 0);
        setUserRole(data.role ?? "student");

        if (data.topicProgress) {
          setTopicProgress(data.topicProgress);
        }
      }
    } catch (e) {
      console.log("Quiz user load error:", e);
    }
  };

  const getProgress = (topicId: string): TopicProgress =>
    topicProgress[topicId] ?? defaultProgress();

  const isLevelUnlocked = (topicId: string, level: number): boolean => {
    if (level === 1) return true;

    const progress = getProgress(topicId);

    return (
      progress.completedLevels.includes(level - 1) ||
      progress.currentLevel >= level
    );
  };

  const getLevelProgressPercent = (topicId: string): number => {
    const progress = getProgress(topicId);
    const levelObj = LEVELS.find(
      (levelItem) => levelItem.level === progress.currentLevel,
    );

    if (!levelObj) return 0;

    return Math.min(
      100,
      (progress.levelPoints / levelObj.pointsToUnlock) * 100,
    );
  };

  const getQuestionLevel = (topicId: string, level: number): number => {
    const progress = getProgress(topicId);
    const levelObj = LEVELS.find((levelItem) => levelItem.level === level);

    if (!levelObj) return level;

    const percent = (progress.levelPoints / levelObj.pointsToUnlock) * 100;

    if (
      percent < 30 &&
      level > 1 &&
      progress.completedLevels.includes(level - 1)
    ) {
      return level - 1;
    }

    if (percent > 80 && level < 10) {
      return level + 1;
    }

    return level;
  };

  const getFallbackQuestions = (
    topic: string,
    level: number,
    points: number,
  ): Question[] => [
    {
      id: "f1",
      question: "V kateri zabojnik odvržemo plastično steklenico?",
      answers: ["Rumeni", "Modri", "Zeleni", "Rjavi"],
      correctIndex: 0,
      topic,
      level,
      points,
      hint: "Plastika spada med embalažo.",
    },
    {
      id: "f2",
      question: "Kaj je recikliranje?",
      answers: [
        "Ponovna uporaba materialov",
        "Sežiganje odpadkov",
        "Zakopavanje",
        "Puščanje v naravi",
      ],
      correctIndex: 0,
      topic,
      level,
      points,
      hint: "Recikliranje pomeni, da material ponovno uporabimo.",
    },
    {
      id: "f3",
      question: "Kam običajno odložimo steklenico?",
      answers: ["Zeleni zabojnik", "Rumeni", "Modri", "Rjavi"],
      correctIndex: 0,
      topic,
      level,
      points,
      hint: "Steklo ima poseben zabojnik.",
    },
    {
      id: "f4",
      question: "Kaj spada v zabojnik za papir?",
      answers: ["Papir in karton", "Plastika", "Hrana", "Steklo"],
      correctIndex: 0,
      topic,
      level,
      points,
      hint: "Papir in karton morata biti čista in suha.",
    },
    {
      id: "f5",
      question: "Kaj naredimo s plastenko pred odlaganjem?",
      answers: ["Stisnemo jo", "Napolnimo", "Razbijemo", "Nič"],
      correctIndex: 0,
      topic,
      level,
      points,
      hint: "Stiskanje prihrani prostor v zabojniku.",
    },
  ];

  const startQuiz = async (level: number) => {
    setSelectedLevel(level);
    setLoading(true);

    try {
      const questionLevel = getQuestionLevel(selectedTopic, level);
      const levelObj = LEVELS.find((item) => item.level === level)!;

      const snap = await getDocs(
        query(
          collection(db, "quizQuestions"),
          where("topic", "==", selectedTopic),
          where("level", "==", questionLevel),
        ),
      );

      let list: Question[] = [];

      snap.forEach((document) => {
        list.push({
          id: document.id,
          ...document.data(),
        } as Question);
      });

      if (list.length === 0) {
        const difficultyMap: Record<number, string> = {
          1: "lahko",
          2: "lahko",
          3: "lahko",
          4: "srednje",
          5: "srednje",
          6: "srednje",
          7: "tezko",
          8: "tezko",
          9: "tezko",
          10: "tezko",
        };

        const fallbackSnap = await getDocs(
          query(
            collection(db, "quizQuestions"),
            where("topic", "==", selectedTopic),
            where("difficulty", "==", difficultyMap[questionLevel] ?? "lahko"),
          ),
        );

        fallbackSnap.forEach((document) => {
          list.push({
            id: document.id,
            ...document.data(),
          } as Question);
        });
      }

      if (list.length === 0) {
        list = getFallbackQuestions(
          selectedTopic,
          questionLevel,
          levelObj.pointsPerQ,
        );
      }

      const randomQuestions = list.sort(() => 0.5 - Math.random()).slice(0, 5);

      setQuestions(randomQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
      setScore(0);
      setGainedPoints(0);
      setLevelUnlocked(false);
      setCurrentScreen("quiz");
    } catch (e) {
      console.log("Quiz loading error:", e);
      Alert.alert("Napaka", "Ni se uspelo naložiti vprašanj.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswerIndex(index);
    }
  };

  const submitAnswer = () => {
    if (selectedAnswerIndex === null || isAnswered) return;

    setIsAnswered(true);

    const currentQuestion = questions[currentQuestionIndex];
    const correct = selectedAnswerIndex === currentQuestion.correctIndex;

    if (correct) {
      setScore((previousScore) => previousScore + 1);
      setGainedPoints(
        (previousPoints) => previousPoints + currentQuestion.points,
      );

      Animated.sequence([
        Animated.spring(bounceAnim, {
          toValue: 1.08,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 6,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
      return;
    }

    await saveResults();
    setCurrentScreen("result");
  };

  const saveResults = async () => {
    if (!currentUser) return;

    try {
      const progress = getProgress(selectedTopic);
      const levelObj = LEVELS.find((item) => item.level === selectedLevel)!;

      const newLevelPoints = Math.min(
        progress.levelPoints + gainedPoints,
        levelObj.pointsToUnlock,
      );

      const justCompleted =
        newLevelPoints >= levelObj.pointsToUnlock && selectedLevel < 10;

      let newCurrentLevel = progress.currentLevel;
      let newLevelPointsAfterReset = newLevelPoints;
      const newCompletedLevels = [...progress.completedLevels];

      if (justCompleted) {
        if (!newCompletedLevels.includes(selectedLevel)) {
          newCompletedLevels.push(selectedLevel);
        }

        newCurrentLevel = selectedLevel + 1;
        newLevelPointsAfterReset = 0;
        setLevelUnlocked(true);
      }

      const newProgress: TopicProgress = {
        currentLevel: newCurrentLevel,
        levelPoints: newLevelPointsAfterReset,
        completedLevels: newCompletedLevels,
      };

      setTopicProgress((previousProgress) => ({
        ...previousProgress,
        [selectedTopic]: newProgress,
      }));

      await addDoc(collection(db, "quizResults"), {
        userId: currentUser.uid,
        topic: selectedTopic,
        level: selectedLevel,
        levelLabel: levelObj.label,
        score,
        totalQuestions: questions.length,
        pointsGained: gainedPoints,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "users", currentUser.uid), {
  totalPoints: increment(gainedPoints),
  weeklyPoints: increment(gainedPoints),
  monthlyPoints: increment(gainedPoints),
  quizCompleted: increment(1),
  updatedAt: serverTimestamp(),
  [`topicProgress.${selectedTopic}.currentLevel`]: newCurrentLevel,
  [`topicProgress.${selectedTopic}.levelPoints`]: newLevelPointsAfterReset,
  [`topicProgress.${selectedTopic}.completedLevels`]: newCompletedLevels,
});

      setTotalPoints((previousPoints) => previousPoints + gainedPoints);
    } catch (e) {
      console.log("Save quiz result error:", e);
    }
  };

  const handleGenerateQuestions = () => {
    Alert.alert(
      "🤖 Generiraj AI vprašanja",
      "Gemini bo ustvaril vprašanja za vse nivoje in teme. To lahko traja nekaj minut.",
      [
        {
          text: "Prekliči",
          style: "cancel",
        },
        {
          text: "Generiraj ✨",
          onPress: async () => {
            setGenerating(true);

            try {
              const result = await generateAllQuestions(
                (message, current, total) => {
                  setGenerateProgress(message);
                  setGenerateCurrent(current);
                  setGenerateTotal(total);
                },
              );

              Alert.alert(
                "Končano! ✅",
                `Uspešno: ${result.success}\nNeuspešno: ${result.failed}`,
              );
            } catch (e) {
              console.log("Generate questions error:", e);
              Alert.alert("Napaka", "Generiranje ni uspelo.");
            } finally {
              setGenerating(false);
              setGenerateProgress("");
            }
          },
        },
      ],
    );
  };

  if (!currentUser) {
    return (
      <SafeAreaView style={s.whiteContainer}>
        <View style={s.centeredContent}>
          <Text style={s.lockedIcon}>🎓</Text>

          <Text style={s.lockedTitle}>Kviz je zaklenjen</Text>

          <Text style={s.lockedText}>
            Prijavi se, da zbiraš točke, odklepaš nivoje in spremljaš svoj
            napredek.
          </Text>

          <TouchableOpacity
            style={s.purpleButton}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.9}
          >
            <Text style={s.purpleButtonText}>Prijavi se</Text>
          </TouchableOpacity>
        </View>

        <BottomNavBar navigation={navigation} activeRoute="Quiz" />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={s.centeredContent}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={s.loadingText}>Nalagam vprašanja...</Text>
      </SafeAreaView>
    );
  }

  if (currentScreen === "topics") {
    return (
      <SafeAreaView style={s.container}>
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.topHeader}>
            <View>
              <Text style={s.title}>Eko kviz</Text>
              <Text style={s.subtitle}>Izberi temo in nadaljuj pot.</Text>
            </View>

            <View style={s.pointsPill}>
              <Text style={s.pointsText}>⭐ {totalPoints}</Text>
            </View>
          </View>

          {userRole === "teacher" && (
            <TouchableOpacity
              style={[
                s.teacherButton,
                generating ? s.teacherButtonDisabled : s.teacherButtonActive,
              ]}
              onPress={handleGenerateQuestions}
              disabled={generating}
              activeOpacity={0.85}
            >
              {generating ? (
                <ActivityIndicator size="small" color="#7C3AED" />
              ) : (
                <Text style={s.teacherIcon}>🤖</Text>
              )}

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    s.teacherTitle,
                    generating ? s.teacherTitleDisabled : s.teacherTitleActive,
                  ]}
                >
                  {generating ? "Generiram..." : "Generiraj AI vprašanja"}
                </Text>

                {generating && generateProgress ? (
                  <Text style={s.teacherProgress} numberOfLines={1}>
                    {generateProgress} ({generateCurrent}/{generateTotal})
                  </Text>
                ) : (
                  <Text style={s.teacherSub}>
                    Gemini AI · vprašanja za vse nivoje
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}

          <Text style={s.sectionTitle}>Izberi temo:</Text>

          {/* ── Leaderboard banner ─────────────────────────────────── */}
          <TouchableOpacity
            style={s.leaderboardBanner}
            onPress={() => navigation.navigate("Leaderboard")}
            activeOpacity={0.88}
          >
            <View style={s.leaderboardBannerLeft}>
              <Text style={s.leaderboardBannerEmoji}>🏆</Text>
              <View>
                <Text style={s.leaderboardBannerTitle}>Lestvica šol</Text>
                <Text style={s.leaderboardBannerSub}>
                  Poglej kako se kotirate
                </Text>
              </View>
            </View>
            <Text style={s.leaderboardBannerChevron}>›</Text>
          </TouchableOpacity>

          {TOPICS.map((topic) => {
            const progress = getProgress(topic.id);
            const levelObj = LEVELS.find(
              (item) => item.level === progress.currentLevel,
            )!;
            const progressPercent = getLevelProgressPercent(topic.id);

            return (
              <TouchableOpacity
                key={topic.id}
                style={[
                  s.topicCard,
                  {
                    shadowColor: topic.color,
                    borderColor: `${topic.color}33`,
                  },
                ]}
                onPress={() => {
                  setSelectedTopic(topic.id);
                  setCurrentScreen("path");
                }}
                activeOpacity={0.85}
              >
                <View
                  style={[s.topicStripe, { backgroundColor: topic.color }]}
                />

                <View style={s.topicInner}>
                  <View style={s.topicTopRow}>
                    <View
                      style={[
                        s.topicEmojiCircle,
                        { backgroundColor: topic.bg },
                      ]}
                    >
                      <Text style={s.topicEmoji}>{topic.emoji}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={s.topicLabel}>{topic.label}</Text>

                      <Text style={[s.topicLevel, { color: topic.color }]}>
                        {levelObj.emoji} {levelObj.label} · Nivo{" "}
                        {progress.currentLevel}/10
                      </Text>
                    </View>

                    <View
                      style={[s.topicPointsPill, { backgroundColor: topic.bg }]}
                    >
                      <Text style={[s.topicPointsText, { color: topic.dark }]}>
                        {progress.levelPoints}/{levelObj.pointsToUnlock}t
                      </Text>
                    </View>
                  </View>

                  <View style={s.progressTrack}>
                    <View
                      style={[
                        s.progressFill,
                        {
                          backgroundColor: topic.color,
                          width: `${progressPercent}%`,
                        },
                      ]}
                    />
                  </View>

                  <View style={s.progressInfoRow}>
                    <Text style={s.progressSmallText}>
                      {Math.round(progressPercent)}% do naslednjega nivoja
                    </Text>

                    <Text style={s.progressSmallText}>
                      {levelObj.pointsToUnlock - progress.levelPoints} točk
                      manjka
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

  if (currentScreen === "path") {
    const topic = TOPICS.find((item) => item.id === selectedTopic)!;
    const progress = getProgress(selectedTopic);
    const currentLevelObj = LEVELS.find(
      (item) => item.level === progress.currentLevel,
    );

    return (
      <SafeAreaView style={s.container}>
        <ScrollView
          contentContainerStyle={s.pathContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.pathHeaderCard}>
            <TouchableOpacity
              onPress={() => setCurrentScreen("topics")}
              style={s.pathBack}
              activeOpacity={0.85}
            >
              <Text style={s.pathBackText}>‹</Text>
            </TouchableOpacity>

            <View style={s.pathHeaderText}>
              <Text style={s.pathTitle}>{topic.label}</Text>
              <Text style={s.pathSubtitle}>
                {currentLevelObj?.emoji} Trenutni nivo {progress.currentLevel}
                /10
              </Text>
            </View>

            <View style={s.pathPointsPill}>
              <Text style={s.pathPointsText}>
                {progress.levelPoints}/{currentLevelObj?.pointsToUnlock}t
              </Text>
            </View>
          </View>

          <View style={[s.pathHeroCard, { borderColor: `${topic.color}33` }]}>
            <View style={s.pathHeroTextWrap}>
              <Text style={[s.pathHeroOverline, { color: topic.color }]}>
                EKO POT KVIZA
              </Text>

              <Text style={s.pathHeroTitle}>Napreduj od nivoja do nivoja</Text>

              <Text style={s.pathHeroSubtitle}>
                Rešuj kvize, zbiraj točke in odkleni nove izzive.
              </Text>
            </View>

            <Image
              source={require("../assets/lari-hello.png")}
              style={s.pathLari}
              resizeMode="contain"
            />
          </View>

         <View style={s.levelMap}>
  {[...LEVELS].reverse().map((levelObj, index, arr) => {
    const unlocked = isLevelUnlocked(selectedTopic, levelObj.level);
    const isCurrent = levelObj.level === progress.currentLevel;
    const isDone = progress.completedLevels.includes(levelObj.level);

    const nodePosition = ZIGZAG[index] ?? { left: 0.5 };
    const nextNodePosition = ZIGZAG[index + 1] ?? { left: 0.5 };

    const leftPercent = `${nodePosition.left * 100}%`;
    const rotateDeg =
      nextNodePosition.left > nodePosition.left ? "28deg" : "-28deg";

    const progressText = isDone
      ? "Končano"
      : isCurrent
        ? `${progress.levelPoints}/${levelObj.pointsToUnlock}t`
        : unlocked
          ? `+${levelObj.pointsPerQ}t / vprašanje`
          : "Zaklenjeno";

    return (
      <View key={levelObj.level} style={s.duoStep}>
        <View
  style={[
    s.duoStepInner,
    {
      left: leftPercent as any,
      transform: [{ translateX: -60 }],
    },
  ]}
>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => {
              if (!unlocked) {
                Alert.alert(
                  "Zaklenjeno 🔒",
                  `Najprej zaključi Nivo ${levelObj.level - 1}.`,
                );
                return;
              }

              startQuiz(levelObj.level);
            }}
            style={[
              s.duoNode,
              isCurrent && [
                s.duoNodeCurrent,
                {
                  borderColor: topic.color,
                  shadowColor: topic.color,
                },
              ],
              isDone && s.duoNodeDone,
              !unlocked && s.duoNodeLocked,
            ]}
          >
            <View
              style={[
                s.duoNodeInner,
                {
                  backgroundColor: !unlocked
                    ? "#D1D5DB"
                    : isDone
                      ? "#22C55E"
                      : topic.color,
                },
              ]}
            >
              <Text style={s.duoNodeEmoji}>
                {!unlocked ? "🔒" : isDone ? "✓" : levelObj.emoji}
              </Text>
            </View>
          </TouchableOpacity>

          {isCurrent && (
            <Image
              source={require("../assets/lari-hello.png")}
              style={s.duoLari}
              resizeMode="contain"
            />
          )}

          <Text style={s.duoLevelMini}>NIVO {levelObj.level}</Text>
          <Text style={s.duoLevelTitle}>{levelObj.label}</Text>
          <Text
            style={[
              s.duoLevelMeta,
              { color: unlocked ? topic.color : "#9CA3AF" },
            ]}
          >
            {progressText}
          </Text>
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

  if (currentScreen === "quiz") {
    const topic = TOPICS.find((item) => item.id === selectedTopic)!;
    const currentQuestion = questions[currentQuestionIndex];
    const answerIsCorrect =
    selectedAnswerIndex !== null &&
    selectedAnswerIndex === currentQuestion.correctIndex;

    const progressPercent =
      ((currentQuestionIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;

    const questionLevel = getQuestionLevel(selectedTopic, selectedLevel);
    const isReview = questionLevel < selectedLevel;
    const isChallenge = questionLevel > selectedLevel;

    return (
      <SafeAreaView style={s.whiteContainer}>
        <View style={s.quizHeader}>
          <View style={s.quizProgressRow}>
            <TouchableOpacity
              onPress={() => setCurrentScreen("path")}
              style={s.closeQuizBtn}
              activeOpacity={0.85}
            >
              <Text style={s.closeQuizText}>✕</Text>
            </TouchableOpacity>

            <View style={s.quizProgressTrack}>
              <View
                style={[
                  s.quizProgressFill,
                  {
                    backgroundColor: topic.color,
                    width: `${progressPercent}%`,
                  },
                ]}
              />
            </View>

            <View style={s.quizPointsPill}>
              <Text style={s.quizPointsText}>⭐ +{gainedPoints}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={s.quizContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.quizMetaRow}>
            <Text style={[s.quizMetaText, { color: topic.color }]}>
              {topic.emoji} Nivo {selectedLevel} · {currentQuestionIndex + 1}/
              {questions.length}
            </Text>

            {isReview && (
              <View style={[s.smallBadge, { backgroundColor: "#FEF3C7" }]}>
                <Text style={[s.smallBadgeText, { color: "#D97706" }]}>
                  REVIEW
                </Text>
              </View>
            )}

            {isChallenge && (
              <View style={[s.smallBadge, { backgroundColor: "#FEE2E2" }]}>
                <Text style={[s.smallBadgeText, { color: "#EF4444" }]}>
                  IZZIV
                </Text>
              </View>
            )}
          </View>

          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <Text style={s.questionText}>{currentQuestion.question}</Text>
          </Animated.View>

          {currentQuestion.answers.map((answer, index) => {
            const isSelected = selectedAnswerIndex === index;
            const isCorrect = index === currentQuestion.correctIndex;

            let backgroundColor = "#F9FAFB";
            let borderColor = "#E5E7EB";
            let textColor = "#374151";
            let circleColor = "#E5E7EB";
            let circleTextColor = "#9CA3AF";
            let suffix = "";

            if (isSelected && !isAnswered) {
              backgroundColor = `${topic.color}15`;
              borderColor = topic.color;
              textColor = topic.dark;
              circleColor = topic.color;
              circleTextColor = "#FFFFFF";
            }

            if (isAnswered) {
              if (isCorrect) {
                backgroundColor = "#DCFCE7";
                borderColor = "#22C55E";
                textColor = "#166534";
                circleColor = "#22C55E";
                circleTextColor = "#FFFFFF";
                suffix = " ✓";
              } else if (isSelected) {
                backgroundColor = "#FEE2E2";
                borderColor = "#EF4444";
                textColor = "#991B1B";
                circleColor = "#EF4444";
                circleTextColor = "#FFFFFF";
                suffix = " ✕";
              }
            }

            return (
              <TouchableOpacity
                key={index}
                style={[
                  s.answerCard,
                  {
                    backgroundColor,
                    borderColor,
                  },
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    s.answerLetterCircle,
                    {
                      backgroundColor: circleColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.answerLetter,
                      {
                        color: circleTextColor,
                      },
                    ]}
                  >
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>

                <Text
                  style={[
                    s.answerText,
                    {
                      color: textColor,
                      fontWeight: isSelected ? "800" : "600",
                    },
                  ]}
                >
                  {answer}
                  {suffix}
                </Text>
              </TouchableOpacity>
            );
          })}

{isAnswered && (
  <View
    style={[
      s.answerFeedbackCard,
      {
        borderColor: answerIsCorrect ? "#BBF7D0" : "#FECACA",
        backgroundColor: answerIsCorrect ? "#F0FDF4" : "#FEF2F2",
      },
    ]}
  >
    <LottieView
      key={answerIsCorrect ? "correct" : "wrong"}
      source={
        answerIsCorrect
          ? require("../assets/animations/TacanAnimacija.json")
          : require("../assets/animations/NetacnoAnimacija.json")
      }
      style={s.answerFeedbackAnimation}
      autoPlay
      loop
      resizeMode="contain"
    />

    <Text style={s.answerFeedbackText}>
      {answerIsCorrect
        ? "Super, pravilno si odgovorila. Nadaljuj!"
        : "Pravilen odgovor je označen zeleno. Zapomni si za naslednjič."}
    </Text>
  </View>
)}

          {isAnswered && currentQuestion.hint && (
            <View style={[s.infoBox, { backgroundColor: "#FEF3C7" }]}>
              <Text style={s.infoIcon}>💡</Text>
              <Text style={[s.infoText, { color: "#92400E" }]}>
                {currentQuestion.hint}
              </Text>
            </View>
          )}

          {isAnswered && currentQuestion.explanation && (
            <View style={[s.infoBox, { backgroundColor: "#EFF6FF" }]}>
              <Text style={s.infoIcon}>📖</Text>
              <Text style={[s.infoText, { color: "#1D4ED8" }]}>
                {currentQuestion.explanation}
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={s.quizBottomAction}>
          {!isAnswered ? (
            <TouchableOpacity
              style={[
                s.actionButton,
                {
                  backgroundColor:
                    selectedAnswerIndex !== null ? topic.color : "#E5E7EB",
                },
              ]}
              onPress={submitAnswer}
              disabled={selectedAnswerIndex === null}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  s.actionButtonText,
                  {
                    color: selectedAnswerIndex !== null ? "#FFFFFF" : "#9CA3AF",
                  },
                ]}
              >
                POTRDI
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[s.actionButton, { backgroundColor: "#22C55E" }]}
              onPress={nextQuestion}
              activeOpacity={0.9}
            >
              <Text style={[s.actionButtonText, { color: "#FFFFFF" }]}>
                {currentQuestionIndex + 1 === questions.length
                  ? "ZAKLJUČI ✅"
                  : "NAPREJ →"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const topic = TOPICS.find((item) => item.id === selectedTopic)!;
  const levelObj = LEVELS.find((item) => item.level === selectedLevel)!;
  const progress = getProgress(selectedTopic);
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <SafeAreaView style={s.whiteContainer}>
      <ScrollView
        contentContainerStyle={s.resultContent}
        showsVerticalScrollIndicator={false}
      >
        {levelUnlocked && (
          <View style={s.unlockBanner}>
            <Text style={s.unlockEmoji}>🎉</Text>

            <Text style={s.unlockTitle}>
              Nivo {selectedLevel + 1} odklenjen!
            </Text>

            <Text style={s.unlockSubtitle}>
              {LEVELS.find((item) => item.level === selectedLevel + 1)?.emoji}{" "}
              {LEVELS.find((item) => item.level === selectedLevel + 1)?.label}
            </Text>
          </View>
        )}

        <Text style={s.resultEmoji}>
          {score === questions.length
            ? "🏆"
            : score >= questions.length * 0.6
              ? "⭐"
              : "💪"}
        </Text>

        <Text style={s.resultTitle}>
          {score === questions.length
            ? "Popolno!"
            : score >= questions.length * 0.6
              ? "Odlično!"
              : "Poskusi znova!"}
        </Text>

        <Text style={s.resultSubtitle}>
          {topic.emoji} {topic.label} · {levelObj.emoji} Nivo {selectedLevel}
        </Text>

        <View style={s.statsCard}>
          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Text style={s.statNumber}>
                {score}/{questions.length}
              </Text>
              <Text style={s.statLabel}>Pravilno</Text>
            </View>

            <View style={s.statDivider} />

            <View style={s.statItem}>
              <Text style={[s.statNumber, { color: "#22C55E" }]}>
                +{gainedPoints}
              </Text>
              <Text style={s.statLabel}>Točke</Text>
            </View>

            <View style={s.statDivider} />

            <View style={s.statItem}>
              <Text style={[s.statNumber, { color: topic.color }]}>
                {percentage}%
              </Text>
              <Text style={s.statLabel}>Uspeh</Text>
            </View>
          </View>
        </View>

        {!levelUnlocked && (
          <View
            style={[
              s.resultProgressCard,
              {
                backgroundColor: topic.bg,
                borderColor: `${topic.color}30`,
              },
            ]}
          >
            <View style={s.resultProgressTop}>
              <Text style={s.resultProgressTitle}>
                {topic.emoji} Nivo {progress.currentLevel} napredek
              </Text>

              <Text
                style={[
                  s.resultProgressPoints,
                  {
                    color: topic.color,
                  },
                ]}
              >
                {progress.levelPoints}/{levelObj.pointsToUnlock}t
              </Text>
            </View>

            <View style={s.resultProgressTrack}>
              <View
                style={[
                  s.resultProgressFill,
                  {
                    backgroundColor: topic.color,
                    width: `${getLevelProgressPercent(selectedTopic)}%`,
                  },
                ]}
              />
            </View>

            <Text style={s.resultProgressText}>
              Še {levelObj.pointsToUnlock - progress.levelPoints} točk do
              naslednjega nivoja
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            s.resultPrimaryButton,
            {
              backgroundColor: topic.color,
            },
          ]}
          onPress={() => startQuiz(selectedLevel)}
          activeOpacity={0.9}
        >
          <Text style={s.resultPrimaryText}>IGRAJ ZNOVA 🎮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.resultSecondaryButton}
          onPress={() => setCurrentScreen("path")}
          activeOpacity={0.85}
        >
          <Text style={s.resultSecondaryText}>Nazaj na pot 🗺️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            s.resultOutlineButton,
            {
              borderColor: `${topic.color}70`,
            },
          ]}
          onPress={() => setCurrentScreen("topics")}
          activeOpacity={0.85}
        >
          <Text
            style={[
              s.resultOutlineText,
              {
                color: topic.color,
              },
            ]}
          >
            Vse teme 📚
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar navigation={navigation} activeRoute="Quiz" />
    </SafeAreaView>
  );
}
