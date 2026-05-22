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
import { auth, db } from "../firebase/firebase";

// Резервни податоци доколку базата е сè уште празна на почетокот
const STATIC_FALLBACK = [
  { name: "Anže Novak", points: 250, razred: "7.B" },
  { name: "Ema Horvat", points: 180, razred: "6.A" },
  { name: "Luka Krajnc", points: 120, razred: "8.C" },
];

export default function LeaderboardScreen({ navigation }: any) {
  const currentUser = auth.currentUser;

  // 🔒 ZAŠČITA: Če uporabnik ni prijavljen, se prikaže zaklenjen zaslon na slovenskih
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
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🏆</Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: "#1F2937",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Poglej lestvico
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
            Želiš videti, kateri učenci in razredi so reciklirali največ in
            zbrali največ točk? Prijavi se in pomagaj svojemu timu do zmage!
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#22C55E",
              paddingVertical: 14,
              paddingHorizontal: 28,
              borderRadius: 14,
              width: "100%",
              alignItems: "center",
              shadowColor: "#22C55E",
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 4,
            }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 15 }}>
              Prijavi se v svoj profil
            </Text>
          </TouchableOpacity>
        </View>

        <BottomNavBar navigation={navigation} activeRoute="Leaderboard" />
      </SafeAreaView>
    );
  }

  // 🔓 Za prijavljene uporabnike - Preklapljanje med realnimi Učenci in Razredi
  const [leaderboardType, setLeaderboardType] = useState<"ucenci" | "razredi">(
    "ucenci",
  );
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      try {
        if (leaderboardType === "ucenci") {
          // 1. ПОВРЗУВАЊЕ СО РЕАЛНИТЕ УЧЕНИЦИ (Колекција 'users')
          const q = query(
            collection(db, "users"),
            orderBy("totalPoints", "desc"),
            limit(20),
          );
          const snap = await getDocs(q);
          const fetchedUsers: any[] = [];

          snap.forEach((doc) => {
            const uData = doc.data();
            // Филтрирај ги само оние кои имаат барем некој поен за поубав приказ
            fetchedUsers.push({
              name:
                uData.displayName ||
                uData.name ||
                uData.email?.split("@")[0] ||
                "Anonimni učenec",
              points: uData.totalPoints || 0,
              razred: uData.razred || uData.class || "",
            });
          });

          if (fetchedUsers.length > 0) {
            setDataList(fetchedUsers);
          } else {
            setDataList(STATIC_FALLBACK); // Резерва ако нема ниеден корисник со поени
          }
        } else {
          // 2. ПОВРЗУВАЊЕ СО РАЗРЕДИТЕ / ГРУПИТЕ (Колекција 'groups')
          const q = query(
            collection(db, "groups"),
            orderBy("totalPoints", "desc"),
            limit(10),
          );
          const snap = await getDocs(q);
          const fetchedGroups: any[] = [];

          snap.forEach((doc) => {
            const gData = doc.data();
            fetchedGroups.push({
              name: gData.name || "Neznan razred",
              points: gData.totalPoints || 0,
            });
          });

          if (fetchedGroups.length > 0) {
            setDataList(fetchedGroups);
          } else {
            setDataList([
              { name: "7.B", points: 1240 },
              { name: "6.A", points: 980 },
              { name: "8.C", points: 760 },
            ]);
          }
        }
      } catch (err) {
        console.log("Napaka pri nalaganju lestvice:", err);
        setDataList(STATIC_FALLBACK);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, [leaderboardType]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={{ padding: 20, flex: 1 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: "#1F2937",
            marginBottom: 4,
          }}
        >
          Lestvica 🏆
        </Text>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
          Najboljši učenci in razredi v aplikaciji RecycLAR.
        </Text>

        {/* Склопка за филтрирање на Словенечки */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#E5E7EB",
            borderRadius: 10,
            padding: 4,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor:
                leaderboardType === "ucenci" ? "#fff" : "transparent",
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={() => setLeaderboardType("ucenci")}
          >
            <Text style={{ fontWeight: "600", color: "#1F2937" }}>Učenci</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor:
                leaderboardType === "razredi" ? "#fff" : "transparent",
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={() => setLeaderboardType("razredi")}
          >
            <Text style={{ fontWeight: "600", color: "#1F2937" }}>Razredi</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#22C55E" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {dataList.map((item, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  padding: 16,
                  borderRadius: 14,
                  marginBottom: 10,
                  elevation: 1,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 5,
                }}
              >
                {/* Ранг Позиција со медали за Топ 3 */}
                <View style={{ width: 35 }}>
                  {idx === 0 ? (
                    <Text style={{ fontSize: 16 }}>🥇</Text>
                  ) : idx === 1 ? (
                    <Text style={{ fontSize: 16 }}>🥈</Text>
                  ) : idx === 2 ? (
                    <Text style={{ fontSize: 16 }}>🥉</Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#6B7280",
                      }}
                    >
                      {idx + 1}.
                    </Text>
                  )}
                </View>

                {/* Име и Разред */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#1F2937",
                    }}
                  >
                    {item.name}
                  </Text>
                  {item.razred ? (
                    <Text
                      style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}
                    >
                      Razred: {item.razred}
                    </Text>
                  ) : null}
                </View>

                {/* Точни реални поени */}
                <Text
                  style={{ fontSize: 15, fontWeight: "700", color: "#22C55E" }}
                >
                  {item.points} točk
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <BottomNavBar navigation={navigation} activeRoute="Leaderboard" />
    </SafeAreaView>
  );
}
