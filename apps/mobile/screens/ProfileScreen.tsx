import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../components/BottomNavBar";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { styles } from "../styles/ProfileScreen.styles";

type UserData = {
  name: string;
  email: string;
  municipalityId: string;
  groupId: string;
  totalPoints: number;
  weeklyPoints: number;
  scanCount: number;
  quizCompleted: number;
  streakDays: number;
  role: string;
};

type Activity = {
  title: string;
  description: string;
  points: string;
  time: string;
};

const achievements = [
  { title: "Eko junak", description: "Zberi 1000 eko točk", ribbon: "EKO JUNAK", image: require("../assets/bin-green.png"), requiredPoints: 1000 },
  { title: "Varuh planeta", description: "Skeniraj 30 različnih odpadkov", ribbon: "VARUH PLANETA", image: require("../assets/icon-logo.png"), requiredScans: 30 },
  { title: "Plastika? Ne!", description: "Skeniraj 20 plastenk", ribbon: "PLASTIKA? NE!", image: require("../assets/plastic-bottle.png"), requiredScans: 20 },
];

export default function ProfileScreen({ navigation }: any) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Listen for auth state — get current logged in user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        loadUserData(user.uid);
      } else {
        // Not logged in — go to login
        navigation.navigate("Login");
      }
    });
    return unsubscribe;
  }, []);

  const loadUserData = async (uid: string) => {
    setLoading(true);
    try {
      // Load user document from users/{uid}
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    } catch (err) {
      console.log("Error loading user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Home");
    } catch (err) {
      console.log("Sign out error:", err);
    }
  };

  const isAchievementUnlocked = (achievement: any) => {
    if (!userData) return false;
    if (achievement.requiredPoints) return userData.totalPoints >= achievement.requiredPoints;
    if (achievement.requiredScans) return userData.scanCount >= achievement.requiredScans;
    return false;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={s.loadingBox}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={s.loadingText}>Nalagam profil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Fallback if not logged in
  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={s.loadingBox}>
          <Text style={s.loadingText}>Ni podatkov. Prosimo, prijavi se.</Text>
          <TouchableOpacity style={s.loginBtn} onPress={() => navigation.navigate("Login")}>
            <Text style={s.loginBtnText}>Prijavi se</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const stats = [
    { label: "Eko točke", value: userData.totalPoints.toString(), icon: "♧", color: "#35A936" },
    { label: "Skeniranja", value: userData.scanCount.toString(), icon: "⌗", color: "#6B35C9" },
    { label: "Pravilni kvizi", value: userData.quizCompleted.toString(), icon: "♕", color: "#35A936" },
    { label: "Streak", value: `${userData.streakDays} dni`, icon: "♨", color: "#6B35C9" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image source={require("../assets/icon-logo.png")} style={styles.brandIcon} resizeMode="contain" />
            <Text style={styles.brandText}>
              <Text style={styles.brandGreen}>Recyc</Text>
              <Text style={styles.brandPurple}>LAR</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.8}>
            <Text style={styles.notificationText}>⌕</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <Text style={styles.screenTitle}>Profil ✦</Text>

        {/* Profile card — real data from Firebase */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image source={require("../assets/lari-hello.png")} style={styles.avatar} resizeMode="contain" />
            <TouchableOpacity style={styles.cameraBadge} activeOpacity={0.8}>
              <Text style={styles.cameraBadgeText}>▣</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{userData.name}</Text>
              <TouchableOpacity activeOpacity={0.8}>
                <Text style={styles.editIcon}>✎</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.profileMetaRow}>
              <View style={styles.metaBlock}>
                <Text style={styles.metaIcon}>⌖</Text>
                <View>
                  <Text style={styles.metaLabel}>Občina</Text>
                  <Text style={styles.metaValue}>{userData.municipalityId}</Text>
                </View>
              </View>

              <View style={styles.metaDivider} />

              <View style={styles.metaBlock}>
                <Text style={styles.metaIcon}>⌂</Text>
                <View>
                  <Text style={styles.metaLabel}>Skupina</Text>
                  <Text style={styles.metaValue}>{userData.groupId || "Ni skupine"}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Stats — real data from Firebase */}
        <View style={styles.statsRow}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <View style={styles.statIconCircle}>
                <Text style={[styles.statIcon, { color: item.color }]}>{item.icon}</Text>
              </View>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Achievements — unlocked based on real points */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dosežki</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.viewAll}>Poglej vse ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.achievementsRow}>
            {achievements.map((achievement) => {
              const unlocked = isAchievementUnlocked(achievement);
              return (
                <View key={achievement.title} style={[styles.achievementItem, !unlocked && s.locked]}>
                  <View style={styles.achievementBadge}>
                    <Image source={achievement.image} style={[styles.achievementImage, !unlocked && s.lockedImage]} resizeMode="contain" />
                    <View style={styles.ribbon}>
                      <Text style={styles.ribbonText}>{achievement.ribbon}</Text>
                    </View>
                    {!unlocked && (
                      <View style={s.lockOverlay}>
                        <Text style={s.lockIcon}>🔒</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Sign out button */}
        <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
          <Text style={s.signOutText}>Odjava</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar navigation={navigation} activeRoute="Profile" />
    </SafeAreaView>
  );
}

const s = {
  loadingBox: { flex: 1, justifyContent: "center" as const, alignItems: "center" as const },
  loadingText: { marginTop: 12, fontSize: 14, color: "#6B7280" },
  loginBtn: { marginTop: 20, backgroundColor: "#22C55E", borderRadius: 12, padding: 14, paddingHorizontal: 32 },
  loginBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 15 },
  locked: { opacity: 0.5 },
  lockedImage: { opacity: 0.4 },
  lockOverlay: { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center" as const, alignItems: "center" as const },
  lockIcon: { fontSize: 20 },
  signOutBtn: { margin: 20, borderWidth: 1.5, borderColor: "#EF4444", borderRadius: 12, padding: 14, alignItems: "center" as const },
  signOutText: { color: "#EF4444", fontWeight: "600" as const, fontSize: 14 },
};