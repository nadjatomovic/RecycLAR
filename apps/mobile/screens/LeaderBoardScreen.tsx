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
import { styles } from "../styles/LeaderBoardScreen.styles";

type LeaderboardType = "ucenci" | "razredi";

type LeaderboardItem = {
  name: string;
  points: number;
  razred?: string;
};

const STATIC_STUDENTS: LeaderboardItem[] = [
  { name: "Anže Novak", points: 250, razred: "7.B" },
  { name: "Ema Horvat", points: 180, razred: "6.A" },
  { name: "Luka Krajnc", points: 120, razred: "8.C" },
];

const STATIC_GROUPS: LeaderboardItem[] = [
  { name: "7.B", points: 1240 },
  { name: "6.A", points: 980 },
  { name: "8.C", points: 760 },
];

const getRankContent = (index: number) => {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `${index + 1}.`;
};

const getRankBoxStyle = (index: number) => {
  if (index === 0) return styles.rankBoxTop1;
  if (index === 1) return styles.rankBoxTop2;
  if (index === 2) return styles.rankBoxTop3;
  return null;
};

export default function LeaderboardScreen({ navigation }: any) {
  const currentUser = auth.currentUser;

  const [leaderboardType, setLeaderboardType] =
    useState<LeaderboardType>("ucenci");
  const [dataList, setDataList] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadLeaderboard();
    }
  }, [leaderboardType, currentUser]);

  const loadLeaderboard = async () => {
    setLoading(true);

    try {
      if (leaderboardType === "ucenci") {
        const usersQuery = query(
          collection(db, "users"),
          orderBy("totalPoints", "desc"),
          limit(20)
        );

        const snapshot = await getDocs(usersQuery);
        const fetchedUsers: LeaderboardItem[] = [];

        snapshot.forEach((document) => {
          const userData = document.data();

          fetchedUsers.push({
            name:
              userData.displayName ||
              userData.name ||
              userData.email?.split("@")[0] ||
              "Anonimni učenec",
            points: userData.totalPoints || 0,
            razred: userData.razred || userData.class || userData.groupId || "",
          });
        });

        setDataList(fetchedUsers.length > 0 ? fetchedUsers : STATIC_STUDENTS);
      } else {
        const groupsQuery = query(
          collection(db, "groups"),
          orderBy("totalPoints", "desc"),
          limit(10)
        );

        const snapshot = await getDocs(groupsQuery);
        const fetchedGroups: LeaderboardItem[] = [];

        snapshot.forEach((document) => {
          const groupData = document.data();

          fetchedGroups.push({
            name: groupData.name || "Neznan razred",
            points: groupData.totalPoints || 0,
          });
        });

        setDataList(fetchedGroups.length > 0 ? fetchedGroups : STATIC_GROUPS);
      }
    } catch (err) {
      console.log("Napaka pri nalaganju lestvice:", err);

      setDataList(
        leaderboardType === "ucenci" ? STATIC_STUDENTS : STATIC_GROUPS
      );
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.whiteContainer}>
        <View style={styles.lockedContent}>
          <Text style={styles.lockedIcon}>🏆</Text>

          <Text style={styles.lockedTitle}>Poglej lestvico</Text>

          <Text style={styles.lockedText}>
            Želiš videti, kateri učenci in razredi so reciklirali največ?
            Prijavi se in pomagaj svojemu timu do zmage.
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.9}
          >
            <Text style={styles.loginButtonText}>
              Prijavi se v svoj profil
            </Text>
          </TouchableOpacity>
        </View>

        <BottomNavBar navigation={navigation} activeRoute="Leaderboard" />
      </SafeAreaView>
    );
  }

  const topItem = dataList[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.title}>Lestvica</Text>
              <Text style={styles.subtitle}>
                Najboljši učenci in razredi v aplikaciji RecycLAR.
              </Text>
            </View>

            <View style={styles.trophyCircle}>
              <Text style={styles.trophyText}>🏆</Text>
            </View>
          </View>
        </View>

        <View style={styles.switchWrap}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              leaderboardType === "ucenci" && styles.switchButtonActive,
            ]}
            onPress={() => setLeaderboardType("ucenci")}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.switchText,
                leaderboardType === "ucenci" && styles.switchTextActive,
              ]}
            >
              Učenci
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchButton,
              leaderboardType === "razredi" && styles.switchButtonActive,
            ]}
            onPress={() => setLeaderboardType("razredi")}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.switchText,
                leaderboardType === "razredi" && styles.switchTextActive,
              ]}
            >
              Razredi
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#35A936" />
            <Text style={styles.loadingText}>Nalagam lestvico...</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {topItem && (
              <View style={styles.topCard}>
                <Text style={styles.topCardLabel}>
                  Trenutno vodi
                </Text>
                <Text style={styles.topCardName}>{topItem.name}</Text>
                <Text style={styles.topCardPoints}>
                  ⭐ {topItem.points} točk
                </Text>
              </View>
            )}

            {dataList.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>🌱</Text>
                <Text style={styles.emptyTitle}>Lestvica je prazna</Text>
                <Text style={styles.emptyText}>
                  Ko uporabniki začnejo zbirati točke, se bodo rezultati
                  prikazali tukaj.
                </Text>
              </View>
            ) : (
              dataList.map((item, index) => (
                <View key={`${item.name}-${index}`} style={styles.rowCard}>
                  <View style={[styles.rankBox, getRankBoxStyle(index)]}>
                    <Text
                      style={
                        index < 3 ? styles.rankMedal : styles.rankNumber
                      }
                    >
                      {getRankContent(index)}
                    </Text>
                  </View>

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>

                    {leaderboardType === "ucenci" && item.razred ? (
                      <Text style={styles.itemClass}>
                        Razred: {item.razred}
                      </Text>
                    ) : (
                      <Text style={styles.itemClass}>
                        {leaderboardType === "razredi"
                          ? "Skupinski rezultat"
                          : "Učenec"}
                      </Text>
                    )}
                  </View>

                  <View style={styles.pointsPill}>
                    <Text style={styles.pointsText}>{item.points} t</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>

      <BottomNavBar navigation={navigation} activeRoute="Leaderboard" />
    </SafeAreaView>
  );
}