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
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
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

const getProgressValue = (badge: BadgeData, userData: UserData) => {
  if (userData.earnedBadges?.includes(badge.id)) {
    return badge.conditionValue;
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

const isBadgeUnlocked = (badge: BadgeData, userData: UserData) => {
  if (userData.earnedBadges?.includes(badge.id)) {
    return true;
  }

  const progress = getProgressValue(badge, userData);
  return progress >= badge.conditionValue;
};

export default function AchievementsScreen({ navigation }: any) {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigation.navigate("Login");
        return;
      }

      await Promise.all([loadUserData(user.uid), loadBadges()]);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    } catch (err) {
      console.log("Error loading user data:", err);
    }
  };

  const loadBadges = async () => {
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
      const userRole = (userData as any).role ?? "student";
      const filtered = loaded.filter((badge: any) => {
        const badgeRole = badge.role ?? "student";
        return badgeRole === userRole;
      });
      filtered.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
      setBadges(filtered);
    } catch (err) {
      console.log("Error loading badges:", err);
      setBadges(fallbackBadges);
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
    isBadgeUnlocked(badge, userData),
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
            const unlocked = isBadgeUnlocked(badge, userData);
            const progress = getProgressValue(badge, userData);
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
