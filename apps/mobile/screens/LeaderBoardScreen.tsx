import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import BottomNavBar from "../components/BottomNavBar";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { styles as s } from "../styles/LeaderBoardScreen.styles";
import { getAvatarAsset } from "../utils/avatarAssets";
import { loadCity } from "../utils/cityStorage";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = "weekly" | "monthly" | "allTime";
type TabType = "posamezniki" | "razredi";

type SchoolItem = {
  id: string;
  name: string;
  displayName?: string;
  schoolName?: string;
  weeklyPoints: number;
  monthlyPoints: number;
  totalPoints: number;
  streakDays?: number;
};

type UserItem = {
  id: string;
  name: string;
  weeklyPoints: number;
  monthlyPoints: number;
  totalPoints: number;
  streakDays?: number;
  avatarKey?: string;
  schoolName?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SCHOOL_AVATAR_KEYS = [
  "fox",
  "raccoon",
  "hedgehog",
  "turtle",
  "rabbit",
  "owl",
];

const getPoints = (item: SchoolItem | UserItem, filter: FilterType): number => {
  if (filter === "weekly") return item.weeklyPoints ?? 0;
  if (filter === "monthly") return item.monthlyPoints ?? 0;
  return item.totalPoints ?? 0;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LeaderboardScreen({ navigation }: any) {
  const currentUser = auth.currentUser;

  const [activeTab, setActiveTab] = useState<TabType>("razredi");
  const [activeFilter, setActiveFilter] = useState<FilterType>("weekly");
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [mySchoolId, setMySchoolId] = useState<string | null>(null);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [myMunicipality, setMyMunicipality] = useState<string>("Maribor");
  const [cityLoaded, setCityLoaded] = useState(false); // Додадено за контрола на вчитување

  useFocusEffect(
    useCallback(() => {
      if (!currentUser) return;
      setMyUserId(currentUser.uid);

      loadCity().then((city) => {
        setMyMunicipality(city.charAt(0).toUpperCase() + city.slice(1));
        setCityLoaded(true); // Обележуваме дека градот е вчитан
      });

      getDoc(doc(db, "users", currentUser.uid)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setMySchoolId(data.schoolId ?? null);
        }
      });
    }, [currentUser]),
  );

  useEffect(() => {
    // Вчитуваме само ако градот е веќе сетиран во state-от
    if (currentUser && cityLoaded) {
      if (activeTab === "razredi") loadSchools();
      else loadUsers();
    }
  }, [activeTab, currentUser, myMunicipality, cityLoaded]);

  const loadSchools = async () => {
    setLoading(true);
    try {
      const municipalityId = myMunicipality.toLowerCase();
      const snap = await getDocs(
        query(
          collection(db, "groups"),
          orderBy("totalPoints", "desc"),
          limit(50),
        ),
      );

      const list: SchoolItem[] = [];
      snap.forEach((d) => {
        const data = d.data();
        const groupMunicipality = (data.municipalityId ?? "").toLowerCase();

        if (groupMunicipality === municipalityId) {
          list.push({
            id: d.id,
            name: data.name ?? d.id,
            displayName: data.displayName ?? data.name ?? d.id,
            schoolName: data.schoolName ?? data.schoolId ?? "",
            weeklyPoints: data.weeklyPoints ?? 0,
            monthlyPoints: data.monthlyPoints ?? 0,
            totalPoints: data.totalPoints ?? 0,
            streakDays: data.streakDays ?? 0,
          });
        }
      });
      setSchools(list);
    } catch (e) {
      console.log("loadSchools error:", e);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(
          collection(db, "users"),
          orderBy("totalPoints", "desc"),
          limit(20),
        ),
      );
      const list: UserItem[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          name:
            data.displayName ??
            data.name ??
            data.email?.split("@")[0] ??
            "Učenec",
          weeklyPoints: data.weeklyPoints ?? 0,
          monthlyPoints: data.monthlyPoints ?? 0,
          totalPoints: data.totalPoints ?? 0,
          streakDays: data.streakDays ?? 0,
          avatarKey: data.avatarKey,
          schoolName: data.schoolName,
        });
      });
      setUsers(list);
    } catch (e) {
      console.log("loadUsers error:", e);
    } finally {
      setLoading(false);
    }
  };

  const rawList = activeTab === "razredi" ? schools : users;
  const sortedList = [...rawList].sort(
    (a, b) => getPoints(b, activeFilter) - getPoints(a, activeFilter),
  );
  const top3 = sortedList.slice(0, 3);
  const rest = sortedList.slice(3);
  const myId = activeTab === "razredi" ? mySchoolId : myUserId;
  const myRank = sortedList.findIndex((item) => item.id === myId);
  const myItem = myRank >= 0 ? sortedList[myRank] : null;

  if (!currentUser)
    return (
      <SafeAreaView style={s.whiteContainer}>
        <View style={s.lockedContent}>
          <Text style={s.lockedIcon}>🏆</Text>
          <Text style={s.lockedTitle}>Poglej lestvico</Text>
          <TouchableOpacity
            style={s.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={s.loginButtonText}>Prijavi se v svoj profil</Text>
          </TouchableOpacity>
        </View>
        <BottomNavBar navigation={navigation} activeRoute="Leaderboard" />
      </SafeAreaView>
    );

  const renderAvatar = (
    item: SchoolItem | UserItem,
    index: number,
    size: number,
  ) => {
    const avatarKey =
      (item as UserItem).avatarKey ??
      SCHOOL_AVATAR_KEYS[index % SCHOOL_AVATAR_KEYS.length];
    return (
      <Image
        source={getAvatarAsset(avatarKey)}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  };

  const renderPodiumCard = (
    item: SchoolItem | UserItem | undefined,
    rank: 1 | 2 | 3,
    index: number,
  ) => {
    if (!item) return <View style={s.podiumPlaceholder} />;
    const pts = getPoints(item, activeFilter);
    const isMe = item.id === myId;
    return (
      <View
        style={[
          s.podiumCard,
          rank === 1
            ? s.podiumCard1
            : rank === 2
              ? s.podiumCard2
              : s.podiumCard3,
          isMe && s.podiumCardMe,
        ]}
      >
        <View
          style={[
            s.medalBadge,
            {
              backgroundColor:
                rank === 1 ? "#FDE68A" : rank === 2 ? "#E5E7EB" : "#FDDBB4",
            },
          ]}
        >
          <Text style={s.medalRank}>{rank}</Text>
        </View>
        <View style={s.podiumAvatarWrap}>
          {renderAvatar(item, index, rank === 1 ? 70 : 56)}
        </View>
        <Text style={s.podiumName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={s.podiumPts}>🌿 {pts.toLocaleString()} točk</Text>
      </View>
    );
  };

  const renderRow = (
    item: SchoolItem | UserItem,
    rank: number,
    index: number,
  ) => {
    const pts = getPoints(item, activeFilter);
    const isMe = item.id === myId;
    return (
      <View key={item.id} style={[s.rowCard, isMe && s.rowCardMe]}>
        <Text style={s.rowRank}>{rank}</Text>
        <View style={s.rowAvatarWrap}>{renderAvatar(item, index + 3, 44)}</View>
        <View style={s.rowInfo}>
          <Text style={s.rowName} numberOfLines={1}>
            {item.name}
          </Text>
          {"schoolName" in item && item.schoolName ? (
            <Text style={s.rowSub}>{item.schoolName}</Text>
          ) : null}
        </View>
        <Text style={s.rowPts}>{pts.toLocaleString()} t</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        <View style={s.header}>
          <Text style={s.title}>Lestvica ✨</Text>
          <View style={s.locationPill}>
            <Text style={s.locationText}>📍 {myMunicipality}</Text>
          </View>
        </View>
        <View style={s.filterRow}>
          {(["weekly", "monthly", "allTime"] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[s.filterBtn, activeFilter === f && s.filterBtnActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text
                style={[s.filterText, activeFilter === f && s.filterTextActive]}
              >
                {f === "weekly"
                  ? "📊 Tedensko"
                  : f === "monthly"
                    ? "📅 Mesečno"
                    : "👑 Vsi časi"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={s.tabRow}>
          <TouchableOpacity
            style={[s.tabBtn, activeTab === "posamezniki" && s.tabBtnActive]}
            onPress={() => setActiveTab("posamezniki")}
          >
            <Text style={s.tabText}>👤 Posamezniki</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tabBtn, activeTab === "razredi" && s.tabBtnActive]}
            onPress={() => setActiveTab("razredi")}
          >
            <Text style={s.tabText}>🏫 Razredi</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <View style={s.podiumRow}>
              <View style={s.podiumSide}>
                {renderPodiumCard(top3[1], 2, 1)}
              </View>
              <View style={s.podiumCenter}>
                {renderPodiumCard(top3[0], 1, 0)}
              </View>
              <View style={s.podiumSide}>
                {renderPodiumCard(top3[2], 3, 2)}
              </View>
            </View>
            <View style={s.listSection}>
              {rest.map((item, i) => renderRow(item, i + 4, i))}
            </View>
          </>
        )}
      </ScrollView>
      <BottomNavBar navigation={navigation} activeRoute="Leaderboard" />
    </SafeAreaView>
  );
}
