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
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { styles } from "../styles/ProfileScreen.styles";

type UserData = {
  name: string;
  email: string;
  municipalityId: string;
  groupId: string;
  schoolId: string;
  totalPoints: number;
  weeklyPoints: number;
  scanCount: number;
  quizCompleted: number;
  streakDays: number;
  role: string;
};

type GroupData = {
  id: string;
  name: string;
  totalPoints: number;
  rank?: number;
};

const studentAchievements = [
  {
    title: "Eko junak",
    description: "Zberi 1000 eko točk",
    ribbon: "EKO JUNAK",
    image: require("../assets/bin-green.png"),
    requiredPoints: 1000,
  },
  {
    title: "Varuh planeta",
    description: "Skeniraj 30 različnih odpadkov",
    ribbon: "VARUH PLANETA",
    image: require("../assets/icon-logo.png"),
    requiredScans: 30,
  },
  {
    title: "Plastika? Ne!",
    description: "Skeniraj 20 plastenk",
    ribbon: "PLASTIKA? NE!",
    image: require("../assets/plastic-bottle.png"),
    requiredScans: 20,
  },
];

const teacherAchievements = [
  {
    title: "Super mentor",
    description: "Najbolj angažiran učitelj tega meseca",
    ribbon: "SUPER MENTOR",
    emoji: "⭐",
  },
  {
    title: "Eko vodja",
    description: "Vodi z zgledom in spodbuja zelene navade",
    ribbon: "EKO VODJA",
    emoji: "🌱",
  },
  {
    title: "Kviz mojster",
    description: "Ustvaril/a 10 odličnih kvizov",
    ribbon: "KVIZ MOJSTER",
    emoji: "📋",
  },
];

const MOCK_TEACHER_STATS = {
  totalClassPoints: 3480,
  studentCount: 48,
  quizzesCreated: 12,
  activeDays: 18,
};

const MOCK_CLASSES: GroupData[] = [
  { id: "7b", name: "7.B razred", totalPoints: 1520, rank: 1 },
  { id: "6a", name: "6.A razred", totalPoints: 1180, rank: 2 },
  { id: "8c", name: "8.C razred", totalPoints: 780, rank: 3 },
];

const MOCK_TEACHER_ACTIVITY = [
  {
    icon: "📋",
    iconBg: "#EDE9FE",
    title: "Pregledal/a rezultate kviza",
    description: "Kviz: Ločevanje odpadkov – Nivo 2",
    points: "24 učencev",
    time: "Danes, 09:35",
    pointsColor: "#6B35C9",
  },
  {
    icon: "⌗",
    iconBg: "#F0FDF4",
    title: "Seja skeniranja v razredu 7.B",
    description: "Skenirano 38 odpadkov",
    points: "+95 točk",
    time: "Danes, 08:50",
    pointsColor: "#35A936",
  },
  {
    icon: "⭐",
    iconBg: "#FEF3C7",
    title: "Dodelil/a bonus točke",
    description: "Eko izziv: Brez plastike teden dni",
    points: "+30 točk",
    time: "Včeraj, 15:10",
    pointsColor: "#35A936",
  },
];

const MOCK_STUDENT_ACTIVITY = [
  {
    icon: "♻️",
    iconBg: "#F0FDF4",
    title: "Skeniran odpadek",
    description: "Plastenka PET",
    points: "+15 točk",
    time: "Danes, 09:15",
    pointsColor: "#35A936",
  },
  {
    icon: "❓",
    iconBg: "#EDE9FE",
    title: "Zaključen kviz",
    description: "Ločevanje odpadkov – Nivo 1",
    points: "+10 točk",
    time: "Danes, 08:42",
    pointsColor: "#35A936",
  },
  {
    icon: "🌱",
    iconBg: "#F0FDF4",
    title: "Eko točke za aktivnost",
    description: "Dnevni bonus",
    points: "+5 točk",
    time: "Včeraj, 20:10",
    pointsColor: "#35A936",
  },
];

const getRankMedal = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `${rank}.`;
};

const getRankColor = (rank: number) => {
  if (rank === 1) return "#F59E0B";
  if (rank === 2) return "#9CA3AF";
  if (rank === 3) return "#CD7F32";
  return "#6B7280";
};

const formatMunicipality = (value?: string) => {
  if (!value) return "Ni izbrano";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function ProfileScreen({ navigation }: any) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadUserData(user.uid);
      } else {
        navigation.navigate("Login");
      }
    });

    return unsubscribe;
  }, []);

  const loadUserData = async (uid: string) => {
    setLoading(true);

    try {
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#35A936" />
          <Text style={styles.loadingText}>Nalagam profil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingBox}>
          <Text style={styles.emptyText}>Ni podatkov. Prosimo, prijavi se.</Text>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.9}
          >
            <Text style={styles.loginBtnText}>Prijavi se</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (userData.role === "teacher") {
    return (
      <TeacherProfile
        userData={userData}
        navigation={navigation}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <StudentProfile
      userData={userData}
      navigation={navigation}
      onSignOut={handleSignOut}
    />
  );
}

function StudentProfile({ userData, navigation, onSignOut }: any) {
  const isAchievementUnlocked = (achievement: any) => {
    if (achievement.requiredPoints) {
      return userData.totalPoints >= achievement.requiredPoints;
    }

    if (achievement.requiredScans) {
      return userData.scanCount >= achievement.requiredScans;
    }

    return false;
  };

  const stats = [
    {
      label: "Eko točke",
      value: String(userData.totalPoints ?? 0),
      icon: "🌱",
      color: "#35A936",
    },
    {
      label: "Skeniranja",
      value: String(userData.scanCount ?? 0),
      icon: "⌗",
      color: "#6B35C9",
    },
    {
      label: "Pravilni kvizi",
      value: String(userData.quizCompleted ?? 0),
      icon: "🏆",
      color: "#35A936",
    },
    {
      label: "Streak",
      value: `${userData.streakDays ?? 0} dni`,
      icon: "🔥",
      color: "#6B35C9",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />

        <Text style={styles.screenTitle}>Profil ✦</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image
              source={require("../assets/lari-hello.png")}
              style={styles.avatar}
              resizeMode="contain"
            />

            <TouchableOpacity style={styles.cameraBadge} activeOpacity={0.85}>
              <Text style={styles.cameraBadgeText}>📷</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {userData.name}
              </Text>

              <TouchableOpacity activeOpacity={0.8}>
                <Text style={styles.editIcon}>✎</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.profileMetaRow}>
              <View style={styles.metaBlock}>
                <Text style={styles.metaEmoji}>📍</Text>
                <View>
                  <Text style={styles.metaLabel}>Občina</Text>
                  <Text style={styles.metaValue}>
                    {formatMunicipality(userData.municipalityId)}
                  </Text>
                </View>
              </View>

              <View style={styles.metaDivider} />

              <View style={styles.metaBlock}>
                <Text style={styles.metaEmoji}>🏫</Text>
                <View>
                  <Text style={styles.metaLabel}>Skupina</Text>
                  <Text style={styles.metaValue}>
                    {userData.groupId || "Ni skupine"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <View style={styles.statIconCircle}>
                <Text style={styles.statIcon}>{item.icon}</Text>
              </View>

              <Text style={styles.statLabel}>{item.label}</Text>

              <Text style={[styles.statValue, { color: item.color }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dosežki</Text>

            <TouchableOpacity activeOpacity={0.85}>
              <Text style={styles.viewAll}>Poglej vse ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.achievementsRow}>
            {studentAchievements.map((achievement) => {
              const unlocked = isAchievementUnlocked(achievement);

              return (
                <View
                  key={achievement.title}
                  style={[
                    styles.achievementItem,
                    !unlocked && styles.lockedAchievement,
                  ]}
                >
                  <View style={styles.achievementBadge}>
                    <Image
                      source={achievement.image}
                      style={[
                        styles.achievementImage,
                        !unlocked && styles.lockedImage,
                      ]}
                      resizeMode="contain"
                    />

                    <View style={styles.ribbon}>
                      <Text style={styles.ribbonText}>
                        {achievement.ribbon}
                      </Text>
                    </View>

                    {!unlocked && (
                      <View style={styles.lockOverlay}>
                        <Text style={styles.lockIcon}>🔒</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>

                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <ActivityCard title="Zadnja aktivnost" items={MOCK_STUDENT_ACTIVITY} />

        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={onSignOut}
          activeOpacity={0.85}
        >
          <Text style={styles.signOutText}>Odjava</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar navigation={navigation} activeRoute="Profile" />
    </SafeAreaView>
  );
}

function TeacherProfile({ userData, navigation, onSignOut }: any) {
  const teacherStats = [
    {
      label: "Točke razredov",
      value: String(MOCK_TEACHER_STATS.totalClassPoints),
      icon: "🏆",
      color: "#35A936",
    },
    {
      label: "Učenci",
      value: String(MOCK_TEACHER_STATS.studentCount),
      icon: "👥",
      color: "#6B35C9",
    },
    {
      label: "Kvizi",
      value: String(MOCK_TEACHER_STATS.quizzesCreated),
      icon: "📋",
      color: "#35A936",
    },
    {
      label: "Aktivni dnevi",
      value: String(MOCK_TEACHER_STATS.activeDays),
      icon: "📅",
      color: "#6B35C9",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />

        <Text style={styles.screenTitle}>Profil učitelja ✦</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image
              source={require("../assets/lari-hello.png")}
              style={styles.avatar}
              resizeMode="contain"
            />

            <TouchableOpacity style={styles.cameraBadge} activeOpacity={0.85}>
              <Text style={styles.cameraBadgeText}>📷</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {userData.name}
              </Text>

              <TouchableOpacity activeOpacity={0.8}>
                <Text style={styles.editIcon}>✎</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.teacherMetaRow}>
              <Text style={styles.teacherMetaEmoji}>👩‍🏫</Text>
              <Text style={styles.teacherMetaText}>Učitelj/ica</Text>
            </View>

            <View style={styles.teacherMetaRow}>
              <Text style={styles.teacherMetaEmoji}>📍</Text>
              <Text style={styles.teacherMetaText} numberOfLines={1}>
                {userData.schoolId || "Ni šole"}
              </Text>
            </View>

            <View style={styles.teacherMetaRow}>
              <Text style={styles.teacherMetaEmoji}>👥</Text>
              <Text style={styles.teacherMetaText} numberOfLines={1}>
                Razredi{" "}
                <Text style={styles.teacherMetaHighlight}>
                  {MOCK_CLASSES.map((item) => item.name.split(" ")[0]).join(
                    ", "
                  )}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {teacherStats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <View style={styles.statIconCircle}>
                <Text style={styles.statIcon}>{item.icon}</Text>
              </View>

              <Text style={styles.statLabel}>{item.label}</Text>

              <Text style={[styles.statValue, { color: item.color }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Moji razredi</Text>

            <TouchableOpacity activeOpacity={0.85}>
              <Text style={styles.viewAll}>Poglej vse ›</Text>
            </TouchableOpacity>
          </View>

          {MOCK_CLASSES.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.classRow}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.classCircle,
                  {
                    backgroundColor: `${getRankColor(group.rank ?? 99)}22`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.classCircleText,
                    { color: getRankColor(group.rank ?? 99) },
                  ]}
                >
                  {group.name.split(" ")[0]}
                </Text>
              </View>

              <View style={styles.classInfo}>
                <Text style={styles.className}>{group.name}</Text>
                <Text style={styles.classPoints}>
                  {group.totalPoints} točk
                </Text>
              </View>

              <Text style={styles.classMedal}>
                {getRankMedal(group.rank ?? 99)}
              </Text>

              <Text style={styles.classArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dosežki učitelja</Text>

            <TouchableOpacity activeOpacity={0.85}>
              <Text style={styles.viewAll}>Poglej vse ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.achievementsRow}>
            {teacherAchievements.map((achievement) => (
              <View key={achievement.title} style={styles.achievementItem}>
                <View style={styles.achievementBadge}>
                  <Text style={styles.teacherAchievementEmoji}>
                    {achievement.emoji}
                  </Text>

                  <View style={styles.ribbon}>
                    <Text style={styles.ribbonText}>{achievement.ribbon}</Text>
                  </View>
                </View>

                <Text style={styles.achievementTitle}>{achievement.title}</Text>

                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <ActivityCard title="Zadnja aktivnost" items={MOCK_TEACHER_ACTIVITY} />

        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={onSignOut}
          activeOpacity={0.85}
        >
          <Text style={styles.signOutText}>Odjava</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar navigation={navigation} activeRoute="Profile" />
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Image
          source={require("../assets/icon-logo.png")}
          style={styles.brandIcon}
          resizeMode="contain"
        />

        <Image
          source={require("../assets/logo.png")}
          style={styles.brandLogo}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.85}>
        <Text style={styles.notificationText}>🔔</Text>
        <View style={styles.notificationDot} />
      </TouchableOpacity>
    </View>
  );
}

function ActivityCard({ title, items }: any) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>

        <TouchableOpacity activeOpacity={0.85}>
          <Text style={styles.viewAll}>Poglej vse ›</Text>
        </TouchableOpacity>
      </View>

      {items.map((item: any, index: number) => (
        <View key={`${item.title}-${index}`}>
          <View style={styles.activityRow}>
            <View
              style={[
                styles.activityIconWrap,
                { backgroundColor: item.iconBg },
              ]}
            >
              <Text style={styles.activityIconEmoji}>{item.icon}</Text>
            </View>

            <View style={styles.activityTextWrap}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityDescription}>{item.description}</Text>
            </View>

            <View style={styles.activityRight}>
              <Text
                style={[
                  styles.activityPoints,
                  { color: item.pointsColor },
                ]}
              >
                {item.points}
              </Text>

              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          </View>

          {index !== items.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
}