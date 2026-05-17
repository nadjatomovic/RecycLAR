import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import BottomNavBar from "../components/BottomNavBar";

type Question = {
  id: string;
  question: string;
  answers: string[];
  correctIndex: number;
  topic: string;
  difficulty: string;
  points: number;
  hint: string;
};

type Screen = "select" | "quiz" | "result";

const TOPICS = [
  { id: "locevanje",   label: "Ločevanje odpadkov", emoji: "🗑",  color: "#22C55E", bg: "#F0FDF4", border: "#22C55E" },
  { id: "recikliranje",label: "Recikliranje",        emoji: "♻️", color: "#7C3AED", bg: "#EDE9FE", border: "#7C3AED" },
  { id: "okolje",      label: "Okolje in narava",    emoji: "🌿",  color: "#0EA5E9", bg: "#E0F2FE", border: "#0EA5E9" },
];

const DIFFICULTIES = [
  { id: "lahko",  label: "Lahko",  points: 10, color: "#22C55E", bg: "#F0FDF4" },
  { id: "srednje",label: "Srednje",points: 20, color: "#F59E0B", bg: "#FEF3C7" },
  { id: "tezko",  label: "Težko",  points: 30, color: "#EF4444", bg: "#FEF2F2" },
];

const LETTERS = ["A", "B", "C", "D"];

const shuffleArray = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function QuizScreen({ navigation }: any) {
  const [screen, setScreen] = useState<Screen>("select");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return unsub;
  }, []);

  const loadQuestions = async () => {
    if (!selectedTopic || !selectedDifficulty) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "quizQuestions"),
        where("topic", "==", selectedTopic),
        where("difficulty", "==", selectedDifficulty)
      );
      const snap = await getDocs(q);
      let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Question));
      docs = shuffleArray(docs).slice(0, 10);
      if (docs.length === 0) {
        alert("Ni vprašanj za to kombinacijo. Poskusi drugo temo ali težavnost!");
        setLoading(false);
        return;
      }
      setQuestions(docs);
      setCurrentQ(0);
      setScore(0);
      setCorrectCount(0);
      setSelected(null);
      setAnswered(false);
      setShowHint(false);
      setScreen("quiz");
    } catch {
      alert("Napaka pri nalaganju vprašanj. Preveri internetno povezavo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === questions[currentQ].correctIndex) {
      setScore((s) => s + questions[currentQ].points);
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = async () => {
    if (currentQ + 1 >= questions.length) {
      await saveResult();
      setScreen("result");
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
      setShowHint(false);
    }
  };

  const saveResult = async () => {
    if (!userId) return;
    try {
      await addDoc(collection(db, "quizResults"), {
        userId,
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        score: correctCount,
        totalQuestions: questions.length,
        pointsEarned: score,
        timestamp: serverTimestamp(),
      });
      await updateDoc(doc(db, "users", userId), {
        totalPoints: increment(score),
        weeklyPoints: increment(score),
        quizCompleted: increment(1),
        lastActiveAt: serverTimestamp(),
      });
    } catch {
      console.log("Error saving result");
    }
  };

  const handleRestart = () => {
    setScreen("select");
    setSelectedTopic(null);
    setSelectedDifficulty(null);
    setQuestions([]);
    setCurrentQ(0);
    setScore(0);
    setCorrectCount(0);
    setSelected(null);
    setAnswered(false);
    setShowHint(false);
  };

  // ── SELECT ──────────────────────────────────────────────
  if (screen === "select") {
    const canStart = selectedTopic && selectedDifficulty && !loading;
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <Text style={s.logo}><Text style={s.green}>Recyc</Text><Text style={s.purple}>LAR</Text></Text>
        </View>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <Text style={s.pageTitle}>Kviz</Text>
          <Text style={s.pageSub}>Izberi temo in težavnost.</Text>

          <Text style={s.groupLabel}>Tema</Text>
          {TOPICS.map((t) => {
            const active = selectedTopic === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[s.topicRow, active && { borderLeftColor: t.color, backgroundColor: t.bg }]}
                onPress={() => setSelectedTopic(t.id)}
                activeOpacity={0.75}
              >
                <Text style={s.topicEmoji}>{t.emoji}</Text>
                <Text style={[s.topicLabel, active && { color: t.color }]}>{t.label}</Text>
                {active && <View style={[s.topicDot, { backgroundColor: t.color }]} />}
              </TouchableOpacity>
            );
          })}

          <Text style={[s.groupLabel, { marginTop: 24 }]}>Težavnost</Text>
          <View style={s.diffRow}>
            {DIFFICULTIES.map((d) => {
              const active = selectedDifficulty === d.id;
              return (
                <TouchableOpacity
                  key={d.id}
                  style={[s.diffChip, active && { backgroundColor: d.bg, borderColor: d.color }]}
                  onPress={() => setSelectedDifficulty(d.id)}
                  activeOpacity={0.75}
                >
                  <Text style={[s.diffChipLabel, active && { color: d.color }]}>{d.label}</Text>
                  <Text style={[s.diffChipPts, { color: active ? d.color : "#9CA3AF" }]}>+{d.points}pt</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[s.startBtn, !canStart && s.startBtnDim]}
            onPress={loadQuestions}
            disabled={!canStart}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.startBtnText}>Začni kviz →</Text>
            }
          </TouchableOpacity>
        </ScrollView>

        <BottomNavBar navigation={navigation} activeRoute="Quiz" />
      </SafeAreaView>
    );
  }

  // ── QUIZ ────────────────────────────────────────────────
  if (screen === "quiz" && questions.length > 0) {
    const question = questions[currentQ];
    const progress = (currentQ / questions.length) * 100;
    const diffConfig = DIFFICULTIES.find((d) => d.id === selectedDifficulty);

    return (
      <SafeAreaView style={s.container}>
        {/* Thin progress bar at very top */}
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${progress}%` as any }]} />
        </View>

        <View style={s.header}>
          <TouchableOpacity onPress={handleRestart} style={s.backBtn}>
            <Text style={s.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={s.logo}><Text style={s.green}>Recyc</Text><Text style={s.purple}>LAR</Text></Text>
          <View style={s.scoreChip}>
            <Text style={s.scoreChipText}>{score}pt</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <Text style={s.qCounter}>{currentQ + 1} / {questions.length}</Text>
          <Text style={s.questionText}>{question.question}</Text>

          <View style={s.answersCol}>
            {question.answers.map((answer, i) => {
              let rowStyle = s.answerRow;
              let letterBg = s.letterCircle;
              let letterColor = s.letterText;
              let answerColor = s.answerLabel;

              if (answered) {
                if (i === question.correctIndex) {
                  rowStyle = { ...s.answerRow, ...s.answerRowCorrect };
                  letterBg = { ...s.letterCircle, backgroundColor: "#22C55E" };
                  letterColor = { ...s.letterText, color: "#fff" };
                  answerColor = { ...s.answerLabel, color: "#166534" };
                } else if (i === selected) {
                  rowStyle = { ...s.answerRow, ...s.answerRowWrong };
                  letterBg = { ...s.letterCircle, backgroundColor: "#EF4444" };
                  letterColor = { ...s.letterText, color: "#fff" };
                  answerColor = { ...s.answerLabel, color: "#991B1B" };
                }
              }

              return (
                <TouchableOpacity
                  key={i}
                  style={rowStyle}
                  onPress={() => handleAnswer(i)}
                  activeOpacity={0.75}
                >
                  <View style={letterBg}>
                    <Text style={letterColor}>{LETTERS[i]}</Text>
                  </View>
                  <Text style={answerColor}>{answer}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {!answered && (
            <TouchableOpacity style={s.hintBtn} onPress={() => setShowHint(!showHint)}>
              <Text style={s.hintBtnText}>{showHint ? "Skrij namig" : "💡 Namig"}</Text>
            </TouchableOpacity>
          )}

          {showHint && (
            <View style={s.hintBox}>
              <Text style={s.hintText}>{question.hint}</Text>
            </View>
          )}

          {answered && (
            <View style={s.nextRow}>
              <View>
                <Text style={s.diffLabel}>{diffConfig?.label}</Text>
                <Text style={[s.diffPts, { color: diffConfig?.color }]}>+{question.points} točk</Text>
              </View>
              <TouchableOpacity style={s.nextBtn} onPress={handleNext}>
                <Text style={s.nextBtnText}>
                  {currentQ + 1 >= questions.length ? "Zaključi →" : "Naprej →"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <BottomNavBar navigation={navigation} activeRoute="Quiz" />
      </SafeAreaView>
    );
  }

  // ── RESULT ──────────────────────────────────────────────
  if (screen === "result") {
    const maxPoints = questions.length * (DIFFICULTIES.find((d) => d.id === selectedDifficulty)?.points ?? 10);
    const percentage = maxPoints > 0 ? Math.round((score / maxPoints) * 100) : 0;
    const grade =
      percentage >= 80 ? "Odlično!" :
      percentage >= 60 ? "Dobro!" :
      "Poskusi znova!";
    const gradeColor =
      percentage >= 80 ? "#22C55E" :
      percentage >= 60 ? "#F59E0B" :
      "#EF4444";

    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <Text style={s.logo}><Text style={s.green}>Recyc</Text><Text style={s.purple}>LAR</Text></Text>
        </View>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <Text style={s.resultSup}>Rezultat</Text>
          <Text style={[s.resultPct, { color: gradeColor }]}>{percentage}%</Text>
          <Text style={[s.resultGrade, { color: gradeColor }]}>{grade}</Text>

          <View style={s.statRow}>
            <View style={s.statBox}>
              <Text style={s.statNum}>{correctCount}</Text>
              <Text style={s.statLabel}>pravilnih</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statBox}>
              <Text style={s.statNum}>{questions.length - correctCount}</Text>
              <Text style={s.statLabel}>napačnih</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statBox}>
              <Text style={[s.statNum, { color: "#7C3AED" }]}>{score}</Text>
              <Text style={s.statLabel}>točk</Text>
            </View>
          </View>

          <TouchableOpacity style={s.retryBtn} onPress={handleRestart} activeOpacity={0.85}>
            <Text style={s.retryBtnText}>Igraj znova</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.homeBtn} onPress={() => navigation.navigate("Dashboard")} activeOpacity={0.85}>
            <Text style={s.homeBtnText}>Nazaj domov</Text>
          </TouchableOpacity>
        </ScrollView>

        <BottomNavBar navigation={navigation} activeRoute="Quiz" />
      </SafeAreaView>
    );
  }

  return <View style={s.container} />;
}

const s = {
  container:       { flex: 1, backgroundColor: "#F8FAF5" },

  // Header
  header:          { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  logo:            { fontSize: 20, fontWeight: "700" as const },
  green:           { color: "#22C55E" },
  purple:          { color: "#7C3AED" },
  backBtn:         { width: 36, height: 36, justifyContent: "center" as const },
  backText:        { fontSize: 28, color: "#1F2937", lineHeight: 32 },
  scoreChip:       { backgroundColor: "#EDE9FE", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  scoreChipText:   { color: "#7C3AED", fontWeight: "700" as const, fontSize: 13 },

  scroll:          { padding: 20, paddingBottom: 32 },

  // Select screen
  pageTitle:       { fontSize: 30, fontWeight: "800" as const, color: "#1F2937", marginBottom: 2 },
  pageSub:         { fontSize: 14, color: "#6B7280", marginBottom: 28 },
  groupLabel:      { fontSize: 12, fontWeight: "700" as const, color: "#9CA3AF", letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 10 },
  topicRow:        { flexDirection: "row" as const, alignItems: "center" as const, backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: "#E5E7EB" },
  topicEmoji:      { fontSize: 22, marginRight: 12 },
  topicLabel:      { flex: 1, fontSize: 15, fontWeight: "600" as const, color: "#374151" },
  topicDot:        { width: 8, height: 8, borderRadius: 4 },
  diffRow:         { flexDirection: "row" as const, gap: 8, marginBottom: 32 },
  diffChip:        { flex: 1, borderRadius: 10, borderWidth: 1.5, borderColor: "#E5E7EB", backgroundColor: "#fff", paddingVertical: 12, alignItems: "center" as const },
  diffChipLabel:   { fontSize: 13, fontWeight: "700" as const, color: "#6B7280", marginBottom: 2 },
  diffChipPts:     { fontSize: 11, fontWeight: "600" as const },
  startBtn:        { backgroundColor: "#22C55E", borderRadius: 14, padding: 18, alignItems: "center" as const },
  startBtnDim:     { opacity: 0.4 },
  startBtnText:    { color: "#fff", fontWeight: "700" as const, fontSize: 17 },

  // Quiz screen
  progressTrack:   { height: 3, backgroundColor: "#E5E7EB" },
  progressFill:    { height: 3, backgroundColor: "#22C55E" },
  qCounter:        { fontSize: 12, fontWeight: "700" as const, color: "#9CA3AF", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" as const },
  questionText:    { fontSize: 20, fontWeight: "700" as const, color: "#1F2937", lineHeight: 28, marginBottom: 20 },
  answersCol:      { gap: 8, marginBottom: 16 },
  answerRow:       { flexDirection: "row" as const, alignItems: "center" as const, backgroundColor: "#fff", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 14, borderWidth: 1.5, borderColor: "#E5E7EB", gap: 12 },
  answerRowCorrect:{ backgroundColor: "#F0FDF4", borderColor: "#22C55E" },
  answerRowWrong:  { backgroundColor: "#FEF2F2", borderColor: "#EF4444" },
  letterCircle:    { width: 28, height: 28, borderRadius: 14, backgroundColor: "#F3F4F6", justifyContent: "center" as const, alignItems: "center" as const },
  letterText:      { fontSize: 12, fontWeight: "700" as const, color: "#6B7280" },
  answerLabel:     { flex: 1, fontSize: 14, color: "#374151", fontWeight: "500" as const },
  hintBtn:         { alignSelf: "flex-start" as const, marginBottom: 8 },
  hintBtnText:     { color: "#7C3AED", fontSize: 13, fontWeight: "600" as const },
  hintBox:         { backgroundColor: "#EDE9FE", borderRadius: 10, padding: 12, marginBottom: 12 },
  hintText:        { color: "#5B21B6", fontSize: 13, lineHeight: 18 },
  nextRow:         { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, marginTop: 8 },
  diffLabel:       { fontSize: 11, color: "#9CA3AF", fontWeight: "600" as const },
  diffPts:         { fontSize: 16, fontWeight: "700" as const },
  nextBtn:         { backgroundColor: "#22C55E", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24 },
  nextBtnText:     { color: "#fff", fontWeight: "700" as const, fontSize: 15 },

  // Result screen
  resultSup:       { fontSize: 12, fontWeight: "700" as const, color: "#9CA3AF", letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 8 },
  resultPct:       { fontSize: 72, fontWeight: "800" as const, lineHeight: 78, marginBottom: 4 },
  resultGrade:     { fontSize: 22, fontWeight: "700" as const, marginBottom: 32 },
  statRow:         { flexDirection: "row" as const, backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 32, alignItems: "center" as const },
  statBox:         { flex: 1, alignItems: "center" as const },
  statNum:         { fontSize: 26, fontWeight: "800" as const, color: "#1F2937" },
  statLabel:       { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  statDivider:     { width: 1, height: 40, backgroundColor: "#F3F4F6" },
  retryBtn:        { backgroundColor: "#22C55E", borderRadius: 14, padding: 16, alignItems: "center" as const, marginBottom: 10 },
  retryBtnText:    { color: "#fff", fontWeight: "700" as const, fontSize: 16 },
  homeBtn:         { borderWidth: 1.5, borderColor: "#D1D5DB", borderRadius: 14, padding: 14, alignItems: "center" as const },
  homeBtnText:     { color: "#6B7280", fontWeight: "600" as const, fontSize: 15 },
};
