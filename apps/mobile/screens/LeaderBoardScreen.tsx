import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../components/BottomNavBar";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Static fallback data for Monday demo if Firebase is empty
const STATIC_CLASSES = [
  { name: "7.B", points: 1240 },
  { name: "6.A", points: 980 },
  { name: "8.C", points: 760 },
  { name: "5.A", points: 640 },
  { name: "7.A", points: 520 },
  { name: "6.B", points: 430 },
  { name: "8.A", points: 310 },
  { name: "5.B", points: 210 },
];

const STATIC_STUDENTS = [
  { name: "Nadja", group: "7.B", points: 1240 },
  { name: "Luka", group: "6.A", points: 980 },
  { name: "Ana", group: "8.C", points: 760 },
  { name: "Maja", group: "5.A", points: 640 },
  { name: "Rok", group: "7.A", points: 520 },
  { name: "Eva", group: "6.B", points: 430 },
  { name: "Tim", group: "8.A", points: 310 },
  { name: "Sara", group: "5.B", points: 210 },
];

type Tab = "classes" | "students";

export default function LeaderboardScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<Tab>("classes");
  const [classes, setClasses] = useState(STATIC_CLASSES);
  const [students, setStudents] = useState(STATIC_STUDENTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFromFirebase();
  }, []);

  const loadFromFirebase = async () => {
    setLoading(true);
    try {
      // Load groups from Firebase
      const groupsQuery = query(
        collection(db, "groups"),
        orderBy("totalPoints", "desc"),
        limit(20)
      );
      const groupsSnap = await getDocs(groupsQuery);
      if (!groupsSnap.empty) {
        const groupsData = groupsSnap.docs.map((doc) => ({
          name: doc.data().name,
          points: doc.data().totalPoints ?? 0,
        }));
        setClasses(groupsData);
      }

      // Load users from Firebase
      const usersQuery = query(
        collection(db, "users"),
        orderBy("points", "desc"),
        limit(20)
      );
      const usersSnap = await getDocs(usersQuery);
      if (!usersSnap.empty) {
        const usersData = usersSnap.docs.map((doc) => ({
          name: doc.data().name ?? "Uporabnik",
          group: doc.data().group ?? "",
          points: doc.data().points ?? 0,
        }));
        setStudents(usersData);
      }
    } catch (err) {
      // Firebase failed — static data is already set
      console.log("Using static leaderboard data");
    } finally {
      setLoading(false);
    }
  };

  const data = activeTab === "classes" ? classes : students;
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  const medalColor = (i: number) =>
    i === 0 ? "#F59E0B" : i === 1 ? "#9CA3AF" : "#CD7F32";

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>
          <Text style={s.headerGreen}>Recyc</Text>
          <Text style={s.headerPurple}>LAR</Text>
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        {/* Title section */}
        <View style={s.titleSection}>
          <View>
            <View style={s.titleRow}>
              <Text style={s.trophyIcon}>🏆</Text>
              <Text style={s.title}>Lestvica</Text>
            </View>
            <Text style={s.subtitle}>Skupaj recikliramo,{"\n"}skupaj zmagujemo! 🌿</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={s.tabs}>
          <TouchableOpacity
            style={[s.tab, activeTab === "classes" && s.tabActive]}
            onPress={() => setActiveTab("classes")}
          >
            <Text style={[s.tabText, activeTab === "classes" && s.tabTextActive]}>
              👥 Razredi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, activeTab === "students" && s.tabActive]}
            onPress={() => setActiveTab("students")}
          >
            <Text style={[s.tabText, activeTab === "students" && s.tabTextActive]}>
              👤 Učenci
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#22C55E" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Top 3 podium */}
            <View style={s.podium}>
              {/* 2nd place */}
              {top3[1] && (
                <View style={[s.podiumItem, s.podiumSecond]}>
                  <Text style={s.podiumMedal}>🥈</Text>
                  <View style={[s.podiumIcon, { backgroundColor: "#EDE9FE" }]}>
                    <Text style={s.podiumIconText}>🏫</Text>
                  </View>
                  <Text style={s.podiumName}>{top3[1].name}</Text>
                  <Text style={[s.podiumPoints, { color: "#7C3AED" }]}>
                    {top3[1].points}
                  </Text>
                  <Text style={s.podiumLabel}>točk</Text>
                  <View style={[s.podiumBar, { height: 80, backgroundColor: "#7C3AED" }]} />
                </View>
              )}

              {/* 1st place */}
              {top3[0] && (
                <View style={[s.podiumItem, s.podiumFirst]}>
                  <Text style={s.podiumTrophy}>🏆</Text>
                  <Text style={s.podiumMedal}>🥇</Text>
                  <View style={[s.podiumIcon, { backgroundColor: "#F0FDF4" }]}>
                    <Text style={s.podiumIconText}>🏫</Text>
                  </View>
                  <Text style={[s.podiumName, { color: "#22C55E", fontWeight: "700" as const }]}>
                    {top3[0].name}
                  </Text>
                  <Text style={[s.podiumPoints, { color: "#22C55E", fontSize: 20 }]}>
                    {top3[0].points}
                  </Text>
                  <Text style={s.podiumLabel}>točk</Text>
                  <View style={[s.podiumBar, { height: 100, backgroundColor: "#22C55E" }]} />
                </View>
              )}

              {/* 3rd place */}
              {top3[2] && (
                <View style={[s.podiumItem, s.podiumThird]}>
                  <Text style={s.podiumMedal}>🥉</Text>
                  <View style={[s.podiumIcon, { backgroundColor: "#FEF3C7" }]}>
                    <Text style={s.podiumIconText}>🏫</Text>
                  </View>
                  <Text style={s.podiumName}>{top3[2].name}</Text>
                  <Text style={[s.podiumPoints, { color: "#D97706" }]}>
                    {top3[2].points}
                  </Text>
                  <Text style={s.podiumLabel}>točk</Text>
                  <View style={[s.podiumBar, { height: 60, backgroundColor: "#F59E0B" }]} />
                </View>
              )}
            </View>

            {/* Rest of rankings */}
            <View style={s.rankList}>
              {rest.map((item: any, index: number) => (
                <View key={index} style={s.rankRow}>
                  <Text style={s.rankNum}>{index + 4}.</Text>
                  <View style={s.rankIcon}>
                    <Text style={s.rankIconText}>🏫</Text>
                  </View>
                  <Text style={s.rankName}>{item.name}</Text>
                  {item.group && (
                    <Text style={s.rankGroup}>{item.group}</Text>
                  )}
                  <Text style={s.rankPoints}>{item.points} točk ›</Text>
                </View>
              ))}
            </View>

            {/* Bottom tip */}
            <View style={s.tipBox}>
              <Text style={s.tipIcon}>🌿</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.tipTitle}>Vsaka pravilno reciklirana točka šteje!</Text>
                <Text style={s.tipText}>Nadaljuj tako, Lari je ponosen nate! 💚</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <BottomNavBar navigation={navigation} activeRoute="Leaderboard" />
    </SafeAreaView>
  );
}

const s = {
  container: { flex: 1, backgroundColor: "#F8FAF5" },
  header: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, justifyContent: "center" as const },
  backText: { fontSize: 28, color: "#1F2937" },
  headerTitle: { fontSize: 20, fontWeight: "700" as const },
  headerGreen: { color: "#22C55E" },
  headerPurple: { color: "#7C3AED" },
  scroll: { padding: 20, paddingBottom: 40 },
  titleSection: { flexDirection: "row" as const, justifyContent: "space-between" as const, alignItems: "flex-start" as const, marginBottom: 20 },
  titleRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 8 },
  trophyIcon: { fontSize: 24 },
  title: { fontSize: 26, fontWeight: "700" as const, color: "#1F2937" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 4, lineHeight: 20 },
  tabs: { flexDirection: "row" as const, backgroundColor: "#fff", borderRadius: 14, padding: 4, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" as const, borderRadius: 10 },
  tabActive: { backgroundColor: "#EDE9FE" },
  tabText: { fontSize: 14, color: "#6B7280", fontWeight: "500" as const },
  tabTextActive: { color: "#7C3AED", fontWeight: "700" as const },
  podium: { flexDirection: "row" as const, justifyContent: "center" as const, alignItems: "flex-end" as const, marginBottom: 20, gap: 8 },
  podiumItem: { alignItems: "center" as const, flex: 1 },
  podiumFirst: { marginBottom: 0 },
  podiumSecond: { marginBottom: 0 },
  podiumThird: { marginBottom: 0 },
  podiumTrophy: { fontSize: 20, marginBottom: 2 },
  podiumMedal: { fontSize: 18, marginBottom: 4 },
  podiumIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: "center" as const, alignItems: "center" as const, marginBottom: 6 },
  podiumIconText: { fontSize: 22 },
  podiumName: { fontSize: 13, fontWeight: "600" as const, color: "#1F2937", marginBottom: 2 },
  podiumPoints: { fontSize: 16, fontWeight: "700" as const },
  podiumLabel: { fontSize: 10, color: "#6B7280", marginBottom: 6 },
  podiumBar: { width: "100%" as const, borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  rankList: { backgroundColor: "#fff", borderRadius: 16, padding: 8, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  rankRow: { flexDirection: "row" as const, alignItems: "center" as const, padding: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  rankNum: { width: 24, fontSize: 14, color: "#6B7280", fontWeight: "600" as const },
  rankIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#F0FDF4", justifyContent: "center" as const, alignItems: "center" as const, marginRight: 10 },
  rankIconText: { fontSize: 16 },
  rankName: { flex: 1, fontSize: 14, fontWeight: "600" as const, color: "#1F2937" },
  rankGroup: { fontSize: 12, color: "#6B7280", marginRight: 8 },
  rankPoints: { fontSize: 13, fontWeight: "700" as const, color: "#7C3AED" },
  tipBox: { flexDirection: "row" as const, backgroundColor: "#F0FDF4", borderRadius: 14, padding: 14, gap: 10, alignItems: "center" as const },
  tipIcon: { fontSize: 20 },
  tipTitle: { fontSize: 13, fontWeight: "600" as const, color: "#1F2937" },
  tipText: { fontSize: 12, color: "#6B7280" },
};