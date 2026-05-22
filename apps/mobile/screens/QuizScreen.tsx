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

// Додадовме "difficulty" како посебен чекор во навигацијата на квизот
type Screen = "select_topic" | "select_difficulty" | "quiz" | "result";

const TOPICS = [
  {
    id: "locevanje",
    label: "Ločevanje odpadkov",
    emoji: "🗑",
    color: "#22C55E",
    bg: "#F0FDF4",
    border: "#22C55E",
  },
  {
    id: "recikliranje",
    label: "Recikliranje",
    emoji: "♻️",
    color: "#7C3AED",
    bg: "#EDE9FE",
    border: "#7C3AED",
  },
  {
    id: "okoli",
    label: "Okolje in narava",
    emoji: "🌍",
    color: "#3B82F6",
    bg: "#EFF6FF",
    border: "#3B82F6",
  },
];

const DIFFICULTIES = [
  {
    id: "lahko",
    label: "Lahko",
    pointsPerQ: 10,
    emoji: "🌱",
    color: "#22C55E",
    bg: "#F0FDF4",
  },
  {
    id: "srednje",
    label: "Srednje",
    pointsPerQ: 20,
    emoji: "⚡",
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  {
    id: "tezko",
    label: "Težko",
    pointsPerQ: 30,
    emoji: "🔥",
    color: "#EF4444",
    bg: "#FEE2E2",
  },
];

export default function QuizScreen({ navigation }: any) {
  const currentUser = auth.currentUser;

  // 🔒 ZAŠČITA: Če uporabnik ni prijavljen, se prikaže zaklenjen zaslon
  if (!currentUser) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
          }}
        >
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🎓</Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: "#1F2937",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Kviz je zaklenjen
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 26,
            }}
          >
            Če želite preveriti svoje znanje, zbirati točke za svoj razred in
            tekmovati z ostalimi, morate biti prijavljeni v svoj profil.
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#7C3AED",
              paddingVertical: 14,
              paddingHorizontal: 28,
              borderRadius: 14,
              width: "100%",
              alignItems: "center",
              shadowColor: "#7C3AED",
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 4,
            }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 15 }}>
              Prijavi se ali Registriraj se
            </Text>
          </TouchableOpacity>
        </View>

        <BottomNavBar navigation={navigation} activeRoute="Quiz" />
      </SafeAreaView>
    );
  }

  // 🔓 Za prijavljene uporabnike - Kviz se naloži spodaj
  const [currentScreen, setCurrentScreen] = useState<Screen>("select_topic");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDiff, setSelectedDiff] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null,
  );
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gainedPoints, setGainedPoints] = useState(0);

  // Чекор 1: Избор на тема
  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentScreen("select_difficulty");
  };

  // Чекор 2: Избор на тежина и влечење прашања од база
  const startQuiz = async (diffObj: any) => {
    setSelectedDiff(diffObj);
    setLoading(true);
    try {
      // Бараме прашања што одговараат и на темата и на тежината
      const q = query(
        collection(db, "quizQuestions"),
        where("topic", "==", selectedTopic),
        where("difficulty", "==", diffObj.id),
      );

      const snap = await getDocs(q);
      const list: Question[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Question);
      });

      if (list.length === 0) {
        // Резервни прашања (Fallback) доколку базата е празна за таа тежина
        setQuestions([
          {
            id: "fallback-1",
            question: `[${diffObj.label}] V kateri zabojnik odvržemo tetrapak mleka?`,
            answers: ["V rumenega", "V modrega", "V zelenega", "V črnega"],
            correctIndex: 0,
            topic: selectedTopic,
            difficulty: diffObj.id,
            points: diffObj.pointsPerQ,
            hint: "Tetrapak spada med embalažo.",
          },
          {
            id: "fallback-2",
            question: `[${diffObj.label}] Ali je treba plastenke pred odlaganjem stisniti?`,
            answers: ["Da, vedno", "Ne, ni treba", "Samo če so umazane"],
            correctIndex: 0,
            topic: selectedTopic,
            difficulty: diffObj.id,
            points: diffObj.pointsPerQ,
            hint: "S stiskanjem privarčujemo prostor.",
          },
        ]);
      } else {
        // Мешање на прашањата и земање на максимум 5
        setQuestions(list.sort(() => 0.5 - Math.random()).slice(0, 5));
      }

      setCurrentQuestionIndex(0);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
      setScore(0);
      setGainedPoints(0);
      setCurrentScreen("quiz");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswerIndex(idx);
  };

  const submitAnswer = () => {
    if (selectedAnswerIndex === null || isAnswered) return;
    setIsAnswered(true);
    const currentQ = questions[currentQuestionIndex];

    // Поените се доделуваат динамично според тоа што е дефинирано во прашањето/тежината
    const pointsAwarded = currentQ.points || selectedDiff?.pointsPerQ || 10;

    if (selectedAnswerIndex === currentQ.correctIndex) {
      setScore(score + 1);
      setGainedPoints(gainedPoints + pointsAwarded);
    }
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
    } else {
      await saveResults();
      setCurrentScreen("result");
    }
  };

  const saveResults = async () => {
    try {
      await addDoc(collection(db, "quizResults"), {
        userId: currentUser.uid,
        topic: selectedTopic,
        difficulty: selectedDiff?.id,
        score: score,
        totalQuestions: questions.length,
        pointsGained: gainedPoints,
        createdAt: serverTimestamp(),
      });

      // Ажурирање на профилот со новите поени
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        totalPoints: increment(gainedPoints),
        weeklyPoints: increment(gainedPoints),
        quizCompleted: increment(1),
      });
    } catch (e) {
      console.log("Napaka pri shranjevanju rezultata:", e);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* ЧЕКОР 1: ИЗБОР НА ТЕМА */}
        {currentScreen === "select_topic" && (
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: "#1F2937",
                marginBottom: 6,
              }}
            >
              Eko Kviz 🎓
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
              Izberite področje in osvojite točke za svoj profil in razred!
            </Text>

            {TOPICS.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={{
                  backgroundColor: t.bg,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 14,
                  borderWidth: 1,
                  borderColor: t.border + "30",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => handleTopicSelect(t.id)}
              >
                <Text style={{ fontSize: 32, marginRight: 16 }}>{t.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#1F2937",
                      marginBottom: 2,
                    }}
                  >
                    {t.label}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#6B7280" }}>
                    Kliknite za izbiro težavnosti
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ЧЕКОР 2: ИЗБОР НА ТЕЖИНА */}
        {currentScreen === "select_difficulty" && (
          <View>
            <TouchableOpacity
              onPress={() => setCurrentScreen("select_topic")}
              style={{ marginBottom: 16 }}
            >
              <Text style={{ color: "#7C3AED", fontWeight: "600" }}>
                ← Nazaj na izbiro teme
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: "#1F2937",
                marginBottom: 6,
              }}
            >
              Izberite težavnost
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
              Večja kot je težavnost, več točk prejmete za vsak pravilen
              odgovor!
            </Text>

            {DIFFICULTIES.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={{
                  backgroundColor: d.bg,
                  borderRadius: 16,
                  padding: 18,
                  marginBottom: 14,
                  borderWidth: 1,
                  borderColor: d.color + "30",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => startQuiz(d)}
              >
                <Text style={{ fontSize: 28, marginRight: 16 }}>{d.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#1F2937",
                      marginBottom: 2,
                    }}
                  >
                    {d.label}
                  </Text>
                  <Text
                    style={{ fontSize: 13, color: d.color, fontWeight: "600" }}
                  >
                    +{d.pointsPerQ} točk / pravilen odgovor
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ЧЕКОР 3: РЕШАВАЊЕ НА КВИЗОТ */}
        {currentScreen === "quiz" && questions.length > 0 && (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: "#7C3AED",
                  textTransform: "uppercase",
                }}
              >
                Vprašanje {currentQuestionIndex + 1} od {questions.length}
              </Text>
              <View
                style={{
                  backgroundColor: selectedDiff?.bg,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: selectedDiff?.color,
                  }}
                >
                  {selectedDiff?.label} (+{selectedDiff?.pointsPerQ}t)
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#1F2937",
                marginBottom: 24,
              }}
            >
              {questions[currentQuestionIndex].question}
            </Text>

            {questions[currentQuestionIndex].answers.map((ans, idx) => {
              let btnBg = "#fff";
              let borderCol = "#E5E7EB";
              if (selectedAnswerIndex === idx) {
                btnBg = "#F3E8FF";
                borderCol = "#7C3AED";
              }
              if (isAnswered) {
                if (idx === questions[currentQuestionIndex].correctIndex) {
                  btnBg = "#DCFCE7";
                  borderCol = "#22C55E";
                } else if (selectedAnswerIndex === idx) {
                  btnBg = "#FEE2E2";
                  borderCol = "#EF4444";
                }
              }
              return (
                <TouchableOpacity
                  key={idx}
                  style={{
                    backgroundColor: btnBg,
                    borderWidth: 1,
                    borderColor: borderCol,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                  }}
                  onPress={() => handleAnswerSelect(idx)}
                  disabled={isAnswered}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#374151",
                      fontWeight: selectedAnswerIndex === idx ? "600" : "400",
                    }}
                  >
                    {ans}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {!isAnswered ? (
              <TouchableOpacity
                style={{
                  backgroundColor:
                    selectedAnswerIndex !== null ? "#7C3AED" : "#E5E7EB",
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  marginTop: 12,
                }}
                onPress={submitAnswer}
                disabled={selectedAnswerIndex === null}
              >
                <Text
                  style={{
                    color: selectedAnswerIndex !== null ? "#fff" : "#9CA3AF",
                    fontWeight: "700",
                  }}
                >
                  Potrdi odgovor
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: "#22C55E",
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  marginTop: 12,
                }}
                onPress={nextQuestion}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  {currentQuestionIndex + 1 === questions.length
                    ? "Zaključi kviz"
                    : "Naslednje vprašanje"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ЧЕКОР 4: РЕЗУЛТАТИ */}
        {currentScreen === "result" && (
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#9CA3AF",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Kviz Končan!
            </Text>
            <Text
              style={{
                fontSize: 64,
                fontWeight: "800",
                color: "#1F2937",
                marginTop: 10,
              }}
            >
              {Math.round((score / questions.length) * 100)}%
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#4B5563",
                marginBottom: 30,
              }}
            >
              Uspešno rešeno!
            </Text>

            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 20,
                marginBottom: 30,
                elevation: 1,
              }}
            >
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{ fontSize: 22, fontWeight: "800", color: "#1F2937" }}
                >
                  {score}/{questions.length}
                </Text>
                <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Pravilno</Text>
              </View>
              <View style={{ width: 1, backgroundColor: "#E5E7EB" }} />
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{ fontSize: 22, fontWeight: "800", color: "#22C55E" }}
                >
                  +{gainedPoints}
                </Text>
                <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                  Točke dodane
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#7C3AED",
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 32,
              }}
              onPress={() => setCurrentScreen("select_topic")}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Nazaj na kvize
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <BottomNavBar navigation={navigation} activeRoute="Quiz" />
    </SafeAreaView>
  );
}
