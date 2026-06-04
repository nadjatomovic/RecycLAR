import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase/firebase";
import { getBadgeAsset } from "../utils/badgeAssets";
import BottomNavBar from "../components/BottomNavBar";
import { styles } from "../styles/AchievementsScreen.styles";
import DecorativeBackground from "../components/DecorativeBackground";

type BadgeData = {
  id: string;
  name: string;
  description: string;
  imageKey: string;
  conditionType: string;
  conditionValue: number;
  order?: number;
};

type UserData = {
  totalPoints?: number;
  scanCount?: number;
  quizCompleted?: number;
  streakDays?: number;
  earnedBadges?: string[];
  role?: string;
};

type GroupData = {
  id: string;
  name: string;
  totalPoints: number;
  weeklyPoints?: number;
  monthlyPoints?: number;
  scanCount?: number;
  quizCompleted?: number;
  memberCount?: number;
  schoolName?: string;
  rank?: number;
};

const fallbackBadges: BadgeData[] = [
  {
    id: "firstScan",
    name: "Prvi sken",
    description: "Skeniraj prvi odpadek.",
    imageKey: "firstScan",
    conditionType: "scan_count",
    conditionValue: 1,
    order: 1,
  },
  {
    id: "ecoHero",
    name: "Eko junak",
    description: "Zberi 1000 eko točk.",
    imageKey: "ecoHero",
    conditionType: "points",
    conditionValue: 1000,
    order: 2,
  },
  {
    id: "quizMaster",
    name: "Mojster kviza",
    description: "Uspešno reši 10 kvizov.",
    imageKey: "quizMaster",
    conditionType: "correct_quiz_answers",
    conditionValue: 10,
    order: 3,
  },
  {
    id: "plasticHunter",
    name: "Plastika? Ne!",
    description: "Skeniraj 20 plastenk.",
    imageKey: "plasticHunter",
    conditionType: "plastic_scans",
    conditionValue: 20,
    order: 4,
  },
  {
    id: "paperSaver",
    name: "Varuh papirja",
    description: "Skeniraj 15 papirnih odpadkov.",
    imageKey: "paperSaver",
    conditionType: "paper_scans",
    conditionValue: 15,
    order: 5,
  },
  {
    id: "glassGuardian",
    name: "Varuh stekla",
    description: "Skeniraj 10 steklenih odpadkov.",
    imageKey: "glassGuardian",
    conditionType: "glass_scans",
    conditionValue: 10,
    order: 6,
  },
  {
    id: "sevenDayStreak",
    name: "7 dni zapored",
    description: "Uporabljaj aplikacijo 7 dni zapored.",
    imageKey: "sevenDayStreak",
    conditionType: "daily_streak",
    conditionValue: 7,
    order: 7,
  },
  {
    id: "classChampion",
    name: "Najboljši razred",
    description: "Tvoj razred je prvi na lestvici.",
    imageKey: "classChampion",
    conditionType: "class_rank",
    conditionValue: 1,
    order: 8,
  },
];

const getProgressValue = (
  badge: BadgeData,
  userData: UserData,
  teacherGroups: GroupData[] = [],
) => {
  if (userData.earnedBadges?.includes(badge.id)) {
    return badge.conditionValue;
  }

  if (userData.role === "teacher") {
    return getTeacherBadgeProgress(badge, teacherGroups);
  }

  if (badge.conditionType === "points") {
    return userData.totalPoints ?? 0;
  }

  if (badge.conditionType === "scan_count") {
    return userData.scanCount ?? 0;
  }

  if (badge.conditionType === "correct_quiz_answers") {
    return userData.quizCompleted ?? 0;
  }

  if (badge.conditionType === "daily_streak") {
    return userData.streakDays ?? 0;
  }

  if (
    badge.conditionType === "plastic_scans" ||
    badge.conditionType === "paper_scans" ||
    badge.conditionType === "glass_scans"
  ) {
    return userData.scanCount ?? 0;
  }

  return 0;
};

const isBadgeUnlocked = (
  badge: BadgeData,
  userData: UserData,
  teacherGroups: GroupData[] = [],
) => {
  if (userData.earnedBadges?.includes(badge.id)) {
    return true;
  }

  const progress = getProgressValue(badge, userData, teacherGroups);
  return progress >= badge.conditionValue;
};

const getTeacherBadgeProgress = (badge: BadgeData, groups: GroupData[]) => {
  const totalClassPoints = groups.reduce(
    (sum, group) => sum + (group.totalPoints ?? 0),
    0,
  );

  const bestWeeklyPoints = groups.reduce(
    (best, group) => Math.max(best, group.weeklyPoints ?? 0),
    0,
  );

  const totalQuizCompleted = groups.reduce(
    (sum, group) => sum + (group.quizCompleted ?? 0),
    0,
  );

  const bestRank = groups.reduce(
    (best, group) => Math.min(best, group.rank ?? 999),
    999,
  );

  const totalScanCount = groups.reduce(
    (sum, group) => sum + (group.scanCount ?? 0),
    0,
  );

  if (badge.conditionType === "teacher_total_class_points") {
    return totalClassPoints;
  }

  if (badge.conditionType === "teacher_best_weekly_class_points") {
    return bestWeeklyPoints;
  }

  if (badge.conditionType === "teacher_total_quiz_completed") {
    return totalQuizCompleted;
  }

  if (badge.conditionType === "teacher_class_top_rank") {
    return bestRank <= badge.conditionValue ? badge.conditionValue : 0;
  }

  if (badge.conditionType === "teacher_total_scan_count") {
    return totalScanCount;
  }

  if (badge.conditionType === "teacher_waste_categories_scanned") {
    return totalScanCount >= badge.conditionValue ? badge.conditionValue : 0;
  }

  return 0;
};

export default function AchievementsScreen({ navigation }: any) {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [userData, setUserData] = useState<UserData>({});
  const [teacherGroups, setTeacherGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      navigation.navigate("Login");
      return;
    }

    const loadedUserData = await loadUserData(user.uid);

    if (loadedUserData?.role === "teacher") {
      await loadTeacherGroups(user.uid);
    }

    await loadBadges(loadedUserData?.role ?? "student");

    setLoading(false);
  });

  return unsubscribe;
}, []);

const loadUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists()) {
      const data = userDoc.data() as UserData;
      setUserData(data);
      return data;
    }
  } catch (err) {
    console.log("Error loading user data:", err);
  }

  return {};
};

const loadBadges = async (role: string) => {
  try {
    const snapshot = await getDocs(collection(db, "badges"));
    const loaded: BadgeData[] = [];

    snapshot.forEach((docSnap) => {
      loaded.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<BadgeData, "id">),
      });
    });

    if (loaded.length === 0) {
      setBadges(fallbackBadges);
      return;
    }

    const filtered = loaded.filter((badge: any) => {
      const badgeRole = badge.role ?? "student";
      return badgeRole === role;
    });

    filtered.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    setBadges(filtered);
  } catch (err) {
    console.log("Error loading badges:", err);
    setBadges(fallbackBadges);
  }
};

const loadTeacherGroups = async (uid: string) => {
  try {
    const groupsQuery = query(
      collection(db, "groups"),
      where("teacherId", "==", uid),
    );

    const snapshot = await getDocs(groupsQuery);
    const loaded: GroupData[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      loaded.push({
        id: docSnap.id,
        name: data.name ?? data.displayName ?? "Razred",
        totalPoints: data.totalPoints ?? 0,
        weeklyPoints: data.weeklyPoints ?? 0,
        monthlyPoints: data.monthlyPoints ?? 0,
        scanCount: data.scanCount ?? 0,
        quizCompleted: data.quizCompleted ?? 0,
        memberCount: data.memberCount ?? 0,
        schoolName: data.schoolName ?? "",
      });
    });

    loaded.sort((a, b) => b.totalPoints - a.totalPoints);

    loaded.forEach((group, index) => {
      group.rank = index + 1;
    });

    setTeacherGroups(loaded);
    return loaded;
  } catch (err) {
    console.log("Error loading teacher groups in achievements:", err);
    setTeacherGroups([]);
    return [];
  }
};

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#35A936" />
          <Text style={styles.loadingText}>Nalagam dosežke...</Text>
        </View>
      </SafeAreaView>
    );
  }

const unlockedCount = badges.filter((badge) =>
  isBadgeUnlocked(badge, userData, teacherGroups),
).length;

  return (
    <SafeAreaView style={styles.container}>
      <DecorativeBackground variant="default" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.brandRow}>
            <Image
              source={require("../assets/icon-logo.png")}
              style={styles.brandIcon}
              resizeMode="contain"
            />

            <Text style={styles.brandText}>
              <Text style={styles.brandGreen}>Recyc</Text>
              <Text style={styles.brandPurple}>LAR</Text>
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.screenTitle}>Dosežki ✦</Text>

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>Odklenjeno</Text>
            <Text style={styles.summaryValue}>
              {unlockedCount}/{badges.length}
            </Text>
          </View>

          <View style={styles.summaryIconCircle}>
            <Text style={styles.summaryIcon}>🏆</Text>
          </View>
        </View>

        <View style={styles.badgesGrid}>
          {badges.map((badge) => {
            const unlocked = isBadgeUnlocked(badge, userData, teacherGroups);
            const progress = getProgressValue(badge, userData, teacherGroups);
            const percent = Math.min(progress / badge.conditionValue, 1);

            return (
              <View
                key={badge.id}
                style={[styles.badgeCard, !unlocked && styles.badgeCardLocked]}
              >
                <View style={styles.badgeImageWrap}>
                  <Image
                    source={getBadgeAsset(badge.imageKey)}
                    style={[
                      styles.badgeImage,
                      !unlocked && styles.badgeImageLocked,
                    ]}
                    resizeMode="contain"
                  />

                  {!unlocked && (
                    <View style={styles.lockOverlay}>
                      <Text style={styles.lockText}>🔒</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeDescription}>{badge.description}</Text>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${percent * 100}%`,
                        backgroundColor: unlocked ? "#35A936" : "#B9A4E8",
                      },
                    ]}
                  />
                </View>

                <Text style={styles.progressText}>
                  {unlocked
                    ? "Odklenjeno"
                    : `${Math.min(progress, badge.conditionValue)}/${
                        badge.conditionValue
                      }`}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <BottomNavBar navigation={navigation} activeRoute="Profile" />
    </SafeAreaView>
  );
}
