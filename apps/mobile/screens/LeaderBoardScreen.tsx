import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import BottomNavBar from "../components/BottomNavBar";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { styles as s } from "../styles/LeaderBoardScreen.styles";
import { getAvatarAsset } from "../utils/avatarAssets";
import { getIconAsset } from "../utils/iconAssets";
import { loadCity } from "../utils/cityStorage";
import DecorativeBackground from "../components/DecorativeBackground";

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

const getDisplayName = (item: SchoolItem | UserItem) => {
  if ("displayName" in item && item.displayName) {
    return item.displayName;
  }

  return item.name;
};

const getFilterLabel = (filter: FilterType) => {
  if (filter === "weekly") return "Tedensko";
  if (filter === "monthly") return "Mesečno";
  return "Vsi časi";
};

const getFilterIcon = (filter: FilterType) => {
  if (filter === "weekly") return getIconAsset("leaderboardWeekly");
  if (filter === "monthly") return getIconAsset("leaderboardMonthly");
  return getIconAsset("leaderboardAllTime");
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
  const [cityLoaded, setCityLoaded] = useState(false); // Guards data fetch until city resolves from AsyncStorage

  // ── Animation refs ────────────────────────────────────────────────────────
  const ROW_ANIM_COUNT = 30;

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;

  const blockHeights = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const infoOpacities = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const infoTranslates = useRef([
    new Animated.Value(-15),
    new Animated.Value(-15),
    new Animated.Value(-15),
  ]).current;

  const rowOpacities = useRef(
    Array.from({ length: ROW_ANIM_COUNT }, () => new Animated.Value(0)),
  ).current;
  const rowTranslates = useRef(
    Array.from({ length: ROW_ANIM_COUNT }, () => new Animated.Value(30)),
  ).current;

  // Ref avoids adding the unstable 'rest' array to useEffect deps, which would cause infinite re-renders
  const restLengthRef = useRef(0);

  useEffect(() => {
    if (loading) {
      headerOpacity.setValue(0);
      headerTranslateY.setValue(-20);
      blockHeights.forEach((v) => v.setValue(0));
      infoOpacities.forEach((v) => v.setValue(0));
      infoTranslates.forEach((v) => v.setValue(-15));
      rowOpacities.forEach((v) => v.setValue(0));
      rowTranslates.forEach((v) => v.setValue(30));
      return;
    }

    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(headerTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();

    // Podium: block grows from ground up, then user info fades in above it
    // Reveal order: rank3 (idx 2) → rank2 (idx 0) → rank1 (idx 1)
    const animatePodium = (idx: number, targetHeight: number, delay: number) => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(blockHeights[idx], {
          toValue: targetHeight,
          duration: 400,
          useNativeDriver: false, // height is a layout property — cannot run on the native thread
        }),
      ]).start(() => {
        Animated.parallel([
          Animated.timing(infoOpacities[idx], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(infoTranslates[idx], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    };

    animatePodium(0, 120, 0);
    animatePodium(1, 90, 500);
    animatePodium(2, 70, 1000);

    for (let i = 0; i < restLengthRef.current && i < ROW_ANIM_COUNT; i++) {
      Animated.sequence([
        Animated.delay(i * 100),
        Animated.parallel([
          Animated.timing(rowOpacities[i], { toValue: 1, duration: 250, useNativeDriver: true }),
          Animated.timing(rowTranslates[i], { toValue: 0, duration: 250, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [loading]);

  useFocusEffect(
    useCallback(() => {
      if (!currentUser) return;
      setMyUserId(currentUser.uid);

      loadCity().then((city) => {
        setMyMunicipality(city.charAt(0).toUpperCase() + city.slice(1));
        setCityLoaded(true);
      });

      getDoc(doc(db, "users", currentUser.uid)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();

          setMySchoolId(data.groupId ?? data.schoolId ?? null);
        }
      });
    }, [currentUser]),
  );

  useEffect(() => {
    if (currentUser && cityLoaded) {
      if (activeTab === "razredi") loadSchools();
      else loadUsers();
    }
  }, [activeTab, currentUser, myMunicipality, cityLoaded]);

  const loadSchools = async () => {
    setLoading(true);

    try {
      const municipalityId = (myMunicipality || "Maribor")
        .toLowerCase()
        .trim();

      const groupsQuery = query(
        collection(db, "groups"),
        where("municipalityId", "==", municipalityId),
      );

      const snap = await getDocs(groupsQuery);
      const list: SchoolItem[] = [];

      snap.forEach((d) => {
        const data = d.data();
        const schoolName = data.schoolName ?? data.schoolId ?? "";

        list.push({
          id: d.id,
          name: data.name ?? d.id,
          displayName:
            data.displayName ??
            (schoolName
              ? `${data.name ?? d.id} · ${schoolName}`
              : data.name ?? d.id),
          schoolName,
          weeklyPoints: Number(data.weeklyPoints ?? 0),
          monthlyPoints: Number(data.monthlyPoints ?? 0),
          totalPoints: Number(data.totalPoints ?? 0),
          streakDays: Number(data.streakDays ?? 0),
        });
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
      const municipalityId = (myMunicipality || "Maribor")
        .toLowerCase()
        .trim();

      const usersQuery = query(
        collection(db, "users"),
        where("municipalityId", "==", municipalityId),
        where("role", "==", "student"),
      );

      const snap = await getDocs(usersQuery);
      const list: UserItem[] = [];

      snap.forEach((d) => {
        const data = d.data();

        if (!data.groupId || data.groupId.trim() === "") {
          return;
        }

        list.push({
          id: d.id,
          name:
            data.displayName ??
            data.name ??
            data.email?.split("@")[0] ??
            "Učenec",
          weeklyPoints: Number(data.weeklyPoints ?? 0),
          monthlyPoints: Number(data.monthlyPoints ?? 0),
          totalPoints: Number(data.totalPoints ?? 0),
          streakDays: Number(data.streakDays ?? 0),
          avatarKey: data.avatarKey,
          schoolName: data.schoolName,
        });
      });

      setUsers(list);
    } catch (e) {
      console.log("loadUsers error:", e);
      setUsers([]);
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

    restLengthRef.current = rest.length;

    if (!currentUser)
      return (
        <SafeAreaView style={s.whiteContainer}>
          <View style={s.lockedContent}>
            <Image
              source={getIconAsset("trophy")}
              style={s.lockedImage}
              resizeMode="contain"
            />
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
      <View style={s.podiumColumn}>
        <Animated.View
          style={[
            s.podiumInfo,
            {
              opacity: infoOpacities[index],
              transform: [{ translateY: infoTranslates[index] }],
            },
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
          <View style={[s.podiumAvatarWrap, rank === 1 && s.podiumAvatarWrap1]}>
            {renderAvatar(item, index, rank === 1 ? 72 : 56)}
          </View>
          <Text style={s.podiumName} numberOfLines={2}>
            {getDisplayName(item)}
          </Text>
          <Text style={s.podiumPts}>{pts.toLocaleString()} točk</Text>
        </Animated.View>
        <Animated.View
          style={[
            s.podiumCard,
            rank === 1
              ? s.podiumCard1
              : rank === 2
                ? s.podiumCard2
                : s.podiumCard3,
            isMe && s.podiumCardMe,
            { height: blockHeights[index] },
          ]}
        />
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
            {getDisplayName(item)}
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
      <DecorativeBackground variant="leaderboard" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        <Animated.View
          style={[
            s.filterRow,
            { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] },
          ]}
        >
          {(["weekly", "monthly", "allTime"] as FilterType[]).map((f) => {
            const isActive = activeFilter === f;

            return (
              <TouchableOpacity
                key={f}
                style={[s.filterBtn, isActive && s.filterBtnActive]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.85}
              >
                <Image
                  source={getFilterIcon(f)}
                  style={[s.filterIcon, isActive && s.filterIconActive]}
                  resizeMode="contain"
                />

                <Text style={[s.filterText, isActive && s.filterTextActive]}>
                  {getFilterLabel(f)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
        <Animated.View
          style={[
            s.tabRow,
            { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] },
          ]}
        >
          <TouchableOpacity
            style={[s.tabBtn, activeTab === "posamezniki" && s.tabBtnActive]}
            onPress={() => setActiveTab("posamezniki")}
            activeOpacity={0.85}
          >
            <Image
              source={getIconAsset("leaderboardUsers")}
              style={s.tabIcon}
              resizeMode="contain"
            />

            <Text
              style={[
                s.tabText,
                activeTab === "posamezniki" && s.tabTextActive,
              ]}
            >
              Posamezniki
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.tabBtn, activeTab === "razredi" && s.tabBtnActive]}
            onPress={() => setActiveTab("razredi")}
            activeOpacity={0.85}
          >
            <Image
              source={getIconAsset("school")}
              style={s.tabIcon}
              resizeMode="contain"
            />

            <Text
              style={[s.tabText, activeTab === "razredi" && s.tabTextActive]}
            >
              Razredi
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {loading ? (
          <View style={s.loadingBox}>
            <ActivityIndicator size="large" color="#35A936" />
            <Text style={s.loadingText}>Nalagam lestvico...</Text>
          </View>
        ) : sortedList.length === 0 ? (
          <View style={s.emptyCard}>
            <Text style={{ fontSize: 42, marginBottom: 8 }}>🌱</Text>
            <Text style={s.emptyTitle}>Lestvica je prazna</Text>
            <Text style={s.emptyText}>
              Za izbrano občino ni podatkov za prikaz.
            </Text>
          </View>
        ) : (
          <>
            <View style={s.podiumWrapper}>
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
            </View>

            <View style={s.listSection}>
              {rest.map((item, i) => {
                const opacityAnim = rowOpacities[i];
                const translateAnim = rowTranslates[i];

                if (!opacityAnim || !translateAnim) {
                  return (
                    <View key={item.id}>
                      {renderRow(item, i + 4, i)}
                    </View>
                  );
                }

                return (
                  <Animated.View
                    key={item.id}
                    style={{
                      opacity: opacityAnim,
                      transform: [{ translateX: translateAnim }],
                    }}
                  >
                    {renderRow(item, i + 4, i)}
                  </Animated.View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
      <BottomNavBar navigation={navigation} activeRoute="Leaderboard" />
    </SafeAreaView>
  );
}
