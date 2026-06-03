import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../components/BottomNavBar";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { styles } from "../styles/ProfileScreen.styles";
import DecorativeBackground from "../components/DecorativeBackground";
import { getBadgeAsset } from "../utils/badgeAssets";
import { getAvatarAsset } from "../utils/avatarAssets";
import { getIconAsset } from "../utils/iconAssets";

type UserData = {
  name: string;
  email: string;
  municipalityId: string;
  municipalityName?: string;
  groupId?: string;
  schoolId?: string;
  schoolName?: string;
  totalPoints?: number;
  weeklyPoints?: number;
  monthlyPoints?: number;
  scanCount?: number;
  quizCompleted?: number;
  streakDays?: number;
  role?: string;
  earnedBadges?: string[];
  avatarKey?: string;
};

type BadgeData = {
  id: string;
  name: string;
  description: string;
  imageKey: string;
  conditionType: string;
  conditionValue: number;
  order: number;
};

type GroupData = {
  id: string;
  name: string;
  totalPoints: number;
  rank?: number;
};

type ActivityData = {
  id?: string;
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  points: string;
  time: string;
  pointsColor: string;
  createdAt?: any;
};

type NotificationData = {
  id?: string;
  title: string;
  message: string;
  type: string;
  icon: string;
  read: boolean;
  time: string;
  createdAt?: any;
};

const avatarOptions = [
  { key: "fox", label: "Lisica", image: getAvatarAsset("fox") },
  { key: "raccoon", label: "Rakun", image: getAvatarAsset("raccoon") },
  { key: "hedgehog", label: "Jež", image: getAvatarAsset("hedgehog") },
  { key: "turtle", label: "Želva", image: getAvatarAsset("turtle") },
  { key: "rabbit", label: "Zajec", image: getAvatarAsset("rabbit") },
  { key: "owl", label: "Sova", image: getAvatarAsset("owl") },
];

const MOCK_STUDENT_ACTIVITY: ActivityData[] = [
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

const MOCK_TEACHER_ACTIVITY: ActivityData[] = [
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

const formatMunicipality = (value?: string) => {
  if (!value) return "Ni izbrano";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

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

const getAvatarImage = (avatarKey?: string) => {
  return getAvatarAsset(avatarKey ?? "fox");
};

const isBadgeUnlocked = (badge: BadgeData, userData: UserData) => {
  if (userData.earnedBadges?.includes(badge.id)) return true;

  const totalPoints = userData.totalPoints ?? 0;
  const scanCount = userData.scanCount ?? 0;
  const quizCompleted = userData.quizCompleted ?? 0;
  const streakDays = userData.streakDays ?? 0;
  const weeklyPoints = userData.weeklyPoints ?? 0;

  if (badge.conditionType === "points") {
    return totalPoints >= badge.conditionValue;
  }

  if (badge.conditionType === "scan_count") {
    return scanCount >= badge.conditionValue;
  }

  if (badge.conditionType === "correct_quiz_answers") {
    return quizCompleted >= badge.conditionValue;
  }

  if (badge.conditionType === "daily_streak") {
    return streakDays >= badge.conditionValue;
  }

  if (
    badge.conditionType === "plastic_scans" ||
    badge.conditionType === "paper_scans" ||
    badge.conditionType === "glass_scans"
  ) {
    return scanCount >= badge.conditionValue;
  }

  if (badge.conditionType === "teacher_streak") {
    return streakDays >= badge.conditionValue || weeklyPoints >= 1000;
  }

  if (badge.conditionType === "teacher_points") {
    return totalPoints >= badge.conditionValue;
  }

  if (badge.conditionType === "teacher_quiz_count") {
    return quizCompleted >= badge.conditionValue;
  }

  if (badge.conditionType === "teacher_waste_categories_scanned") {
    return scanCount >= badge.conditionValue;
  }

  return false;
};

export default function ProfileScreen({ navigation }: any) {
  const [uid, setUid] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityData[]>([]);
  const [teacherGroups, setTeacherGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);

  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState("");

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationData | null>(null);
  const [notificationsTab, setNotificationsTab] = useState<"unread" | "all">(
    "unread",
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);

        await Promise.all([
          loadUserData(user.uid),
          loadBadges(),
          loadRecentActivities(user.uid),
          loadNotifications(user.uid),
          loadTeacherGroups(user.uid),
        ]);
      } else {
        navigation.navigate("Login");
      }
    });

    return unsubscribe;
  }, []);

  const loadUserData = async (userId: string) => {
    setLoading(true);

    try {
      const userDoc = await getDoc(doc(db, "users", userId));

      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);
        setEditedName(data.name ?? "");
      }
    } catch (err) {
      console.log("Error loading user data:", err);
    } finally {
      setLoading(false);
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

      loaded.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
      setBadges(loaded);
    } catch (err) {
      console.log("Error loading badges:", err);
      setBadges([]);
    }
  };

  const loadRecentActivities = async (userId: string) => {
    try {
      const activitiesQuery = query(
        collection(db, "users", userId, "activities"),
        orderBy("createdAt", "desc"),
        limit(3),
      );

      const snapshot = await getDocs(activitiesQuery);
      const loaded: ActivityData[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        loaded.push({
          id: docSnap.id,
          icon: data.icon ?? "♻️",
          iconBg: data.iconBg ?? "#F0FDF4",
          title: data.title ?? "Aktivnost",
          description: data.description ?? "",
          points: data.points ?? "+0 točk",
          time: data.time ?? "Pravkar",
          pointsColor: data.pointsColor ?? "#35A936",
          createdAt: data.createdAt,
        });
      });

      setRecentActivities(loaded);
    } catch (err) {
      console.log("Error loading activities:", err);
      setRecentActivities([]);
    }
  };

  const loadNotifications = async (userId: string) => {
    try {
      const notificationsQuery = query(
        collection(db, "users", userId, "notifications"),
        orderBy("createdAt", "desc"),
        limit(10),
      );

      const snapshot = await getDocs(notificationsQuery);
      const loaded: NotificationData[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        loaded.push({
          id: docSnap.id,
          title: data.title ?? "Obvestilo",
          message: data.message ?? "",
          type: data.type ?? "info",
          icon: data.icon ?? "🔔",
          read: data.read ?? false,
          time: data.time ?? "Pravkar",
          createdAt: data.createdAt,
        });
      });

      setNotifications(loaded);
    } catch (err) {
      console.log("Error loading notifications:", err);
      setNotifications([]);
    }
  };

  const loadTeacherGroups = async (userId: string) => {
    try {
      const groupsQuery = query(
        collection(db, "groups"),
        where("teacherId", "==", userId),
      );

      const snapshot = await getDocs(groupsQuery);
      const loaded: GroupData[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loaded.push({
          id: docSnap.id,
          name: data.displayName ?? data.name ?? "Razred",
          totalPoints: data.monthlyPoints ?? data.totalPoints ?? 0,
        });
      });

      loaded.sort((a, b) => b.totalPoints - a.totalPoints);

      loaded.forEach((group, index) => {
        group.rank = index + 1;
      });

      setTeacherGroups(loaded);
    } catch (err) {
      console.log("Error loading teacher groups:", err);
      setTeacherGroups([]);
    }
  };

  const handleOpenNotification = async (notification: NotificationData) => {
    setSelectedNotification(notification);

    if (!uid || !notification.id || notification.read) {
      return;
    }

    try {
      await updateDoc(doc(db, "users", uid, "notifications", notification.id), {
        read: true,
        readAt: serverTimestamp(),
      });

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item,
        ),
      );
    } catch (error) {
      console.log("Error marking notification as read:", error);
    }
  };

  const handleCloseNotifications = () => {
    setSelectedNotification(null);
    setNotificationsModalVisible(false);
  };

  const handleBackToNotificationsList = () => {
    setSelectedNotification(null);
  };

  const handleSaveName = async () => {
    if (!uid || !userData) return;

    const cleanName = editedName.trim();

    if (!cleanName) {
      Alert.alert("Napaka", "Ime ne sme biti prazno.");
      return;
    }

    try {
      await updateDoc(doc(db, "users", uid), {
        name: cleanName,
      });

      setUserData({
        ...userData,
        name: cleanName,
      });

      setEditModalVisible(false);
    } catch (err) {
      console.log("Name update error:", err);
      Alert.alert("Napaka", "Imena ni bilo mogoče posodobiti.");
    }
  };

  const handleSelectAvatar = async (avatarKey: string) => {
    if (!uid || !userData) return;

    try {
      await updateDoc(doc(db, "users", uid), {
        avatarKey,
      });

      setUserData({
        ...userData,
        avatarKey,
      });

      setAvatarModalVisible(false);
    } catch (err) {
      console.log("Avatar update error:", err);
      Alert.alert("Napaka", "Avatarja ni bilo mogoče posodobiti.");
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
          <Text style={styles.emptyText}>
            Ni podatkov. Prosimo, prijavi se.
          </Text>

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

  const commonProps = {
    userData,
    badges,
    recentActivities,
    teacherGroups,
    navigation,
    onSignOut: handleSignOut,
    onOpenAvatar: () => navigation.navigate("EditProfile"),
    onOpenEdit: () => navigation.navigate("EditProfile"),
    notifications,
    onOpenNotifications: () => {
      setSelectedNotification(null);
      setNotificationsTab("unread");
      setNotificationsModalVisible(true);
    },
  };

  return (
    <>
      {userData.role === "teacher" ? (
        <TeacherProfile {...commonProps} />
      ) : (
        <StudentProfile {...commonProps} />
      )}

      <AvatarModal
        visible={avatarModalVisible}
        selectedKey={userData.avatarKey}
        onClose={() => setAvatarModalVisible(false)}
        onSelect={handleSelectAvatar}
      />

      <EditProfileModal
        visible={editModalVisible}
        name={editedName}
        onChangeName={setEditedName}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveName}
      />

      <NotificationsModal
        visible={notificationsModalVisible}
        notifications={notifications}
        selectedNotification={selectedNotification}
        activeTab={notificationsTab}
        onChangeTab={setNotificationsTab}
        onOpenNotification={handleOpenNotification}
        onBackToList={handleBackToNotificationsList}
        onClose={handleCloseNotifications}
      />
    </>
  );
}

function Header({ notifications = [], onOpenNotifications }: any) {
  const unreadCount = notifications.filter(
    (item: NotificationData) => !item.read,
  ).length;

  return (
    <View style={styles.header}>
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

      <TouchableOpacity
        style={styles.notificationBtn}
        activeOpacity={0.85}
        onPress={onOpenNotifications}
      >
        <Image
          source={getIconAsset("notification")}
          style={{ width: 46, height: 46 }}
          resizeMode="contain"
        />

        {unreadCount > 0 && (
          <View style={styles.notificationDot}>
            <Text style={styles.notificationDotText}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

function StudentProfile({
  userData,
  badges,
  recentActivities,
  navigation,
  onSignOut,
  onOpenAvatar,
  onOpenEdit,
  notifications,
  onOpenNotifications,
}: any) {
  const stats = [
    {
      label: "Eko točke",
      value: String(userData.totalPoints ?? 0),
      icon: getIconAsset("eco"),
      color: "#35A936",
    },
    {
      label: "Skeniranja",
      value: String(userData.scanCount ?? 0),
      icon: getIconAsset("scan"),
      color: "#6B35C9",
    },
    {
      label: "Pravilni kvizi",
      value: String(userData.quizCompleted ?? 0),
      icon: getIconAsset("quiz"),
      color: "#35A936",
    },
    {
      label: "Streak",
      value: `${userData.streakDays ?? 0} dni`,
      icon: getIconAsset("streak"),
      color: "#6B35C9",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <DecorativeBackground variant="profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          notifications={notifications}
          onOpenNotifications={onOpenNotifications}
        />

        <Text style={styles.screenTitle}>Profil ✦</Text>

        <ProfileCard
          userData={userData}
          onOpenAvatar={onOpenAvatar}
          onOpenEdit={onOpenEdit}
        />

        <StatsRow stats={stats} />

        <BadgesSection
          badges={badges}
          userData={userData}
          onViewAll={() => navigation.navigate("Achievements")}
        />

        <ActivityCard
          title="Zadnja aktivnost"
          items={
            recentActivities.length > 0
              ? recentActivities
              : MOCK_STUDENT_ACTIVITY
          }
          onViewAll={() => navigation.navigate("ActivityHistory")}
        />

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

function TeacherProfile({
  userData,
  badges,
  recentActivities,
  teacherGroups,
  navigation,
  onSignOut,
  onOpenAvatar,
  onOpenEdit,
  notifications,
  onOpenNotifications,
}: any) {
  const totalClassPoints = teacherGroups.reduce(
    (sum: number, g: GroupData) => sum + (g.totalPoints ?? 0),
    0,
  );

  const teacherStats = [
    {
      label: "Točke razredov",
      value: String(totalClassPoints),
      icon: getIconAsset("trophy"),
      color: "#35A936",
    },
    {
      label: "Razredi",
      value: String(teacherGroups.length),
      icon: getIconAsset("school"),
      color: "#6B35C9",
    },
    {
      label: "Kvizi",
      value: String(userData.quizCompleted ?? 0),
      icon: getIconAsset("quiz"),
      color: "#35A936",
    },
    {
      label: "Streak",
      value: `${userData.streakDays ?? 0} dni`,
      icon: getIconAsset("streak"),
      color: "#6B35C9",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <DecorativeBackground variant="profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          notifications={notifications}
          onOpenNotifications={onOpenNotifications}
        />

        <Text style={styles.screenTitle}>Profil učitelja ✦</Text>

        <ProfileCard
          userData={userData}
          onOpenAvatar={onOpenAvatar}
          onOpenEdit={onOpenEdit}
          teacher
        />

        <StatsRow stats={teacherStats} />

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Moji razredi</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Leaderboard")}
            >
              <Text style={styles.viewAll}>Poglej vse ›</Text>
            </TouchableOpacity>
          </View>

          {teacherGroups.length === 0 ? (
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 14,
                paddingVertical: 12,
                fontWeight: "600",
              }}
            >
              Ni razredov.
            </Text>
          ) : (
            teacherGroups.map((group: GroupData) => (
              <TouchableOpacity
                key={group.id}
                style={styles.classRow}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.classCircle,
                    { backgroundColor: `${getRankColor(group.rank ?? 99)}22` },
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
            ))
          )}
        </View>

        <BadgesSection
          badges={badges}
          userData={userData}
          onViewAll={() => navigation.navigate("Achievements")}
        />

        <ActivityCard
          title="Zadnja aktivnost"
          items={
            recentActivities.length > 0
              ? recentActivities
              : MOCK_TEACHER_ACTIVITY
          }
          onViewAll={() => navigation.navigate("ActivityHistory")}
        />

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

function ProfileCard({ userData, onOpenAvatar, onOpenEdit, teacher }: any) {
  return (
    <View style={styles.profileCard}>
      <View style={styles.avatarOuter}>
        <View style={styles.avatarWrap}>
          <Image
            source={getAvatarImage(userData.avatarKey)}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity
          style={styles.cameraBadge}
          activeOpacity={0.85}
          onPress={onOpenAvatar}
        >
          <Image
            source={getIconAsset("scan")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {userData.name || "Uporabnik"}
          </Text>

          <TouchableOpacity activeOpacity={0.8} onPress={onOpenEdit}>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
        </View>

        {teacher ? (
          <>
            <View style={styles.teacherMetaRow}>
              <Text style={styles.teacherMetaEmoji}>👩‍🏫</Text>
              <Text style={styles.teacherMetaText}>Učitelj/ica</Text>
            </View>

            <View style={styles.teacherMetaRow}>
              <Text style={styles.teacherMetaEmoji}>📍</Text>
              <Text style={styles.teacherMetaText} numberOfLines={1}>
                {userData.schoolName || userData.schoolId || "Ni šole"}
              </Text>
            </View>

            <View style={styles.teacherMetaRow}>
              <Text style={styles.teacherMetaEmoji}>🏫</Text>
              <Text style={styles.teacherMetaText} numberOfLines={1}>
                {userData.municipalityName ||
                  formatMunicipality(userData.municipalityId)}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.profileMetaRow}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaEmoji}>📍</Text>

              <View style={styles.metaTextWrap}>
                <Text style={styles.metaLabel}>Občina</Text>
                <Text
                  style={styles.metaValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userData.municipalityName ||
                    formatMunicipality(userData.municipalityId)}
                </Text>
              </View>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaBlock}>
              <Text style={styles.metaEmoji}>🏫</Text>

              <View style={styles.metaTextWrap}>
                <Text style={styles.metaLabel}>Skupina</Text>
                <Text
                  style={styles.metaValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userData.groupName || userData.groupId || "Ni skupine"}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function StatsRow({ stats }: any) {
  return (
    <View style={styles.statsRow}>
      {stats.map((item: any) => (
        <View key={item.label} style={styles.statCard}>
          <View style={styles.statIconCircle}>
            <Image
              source={item.icon}
              style={styles.statIcon}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.statLabel}>{item.label}</Text>

          <Text style={[styles.statValue, { color: item.color }]}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function BadgesSection({ badges, userData, onViewAll }: any) {
  const userRole = userData.role ?? "student";

  const filteredBadges = badges.filter((badge: BadgeData) => {
    const badgeRole = (badge as any).role ?? "student";
    return badgeRole === userRole;
  });

  const sortedBadges = [...filteredBadges].sort(
    (a: BadgeData, b: BadgeData) => {
      const aUnlocked = isBadgeUnlocked(a, userData);
      const bUnlocked = isBadgeUnlocked(b, userData);

      if (aUnlocked && !bUnlocked) return -1;
      if (!aUnlocked && bUnlocked) return 1;

      return (a.order ?? 99) - (b.order ?? 99);
    },
  );

  const visibleBadges = sortedBadges.slice(0, 3);

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Dosežki</Text>

        <TouchableOpacity activeOpacity={0.85} onPress={onViewAll}>
          <Text style={styles.viewAll}>Poglej vse ›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.badgesGrid}>
        {visibleBadges.map((badge: BadgeData) => {
          const unlocked = isBadgeUnlocked(badge, userData);

          return (
            <View
              key={badge.id}
              style={[styles.badgeItem, !unlocked && styles.lockedBadgeItem]}
            >
              <View style={styles.badgeImageWrap}>
                <Image
                  source={getBadgeAsset(badge.imageKey)}
                  style={[styles.badgeImage, !unlocked && styles.lockedImage]}
                  resizeMode="contain"
                />

                {!unlocked && (
                  <View style={styles.lockOverlay}>
                    <Text style={styles.lockIcon}>🔒</Text>
                  </View>
                )}
              </View>

              <Text style={styles.badgeTitle} numberOfLines={2}>
                {badge.name}
              </Text>

              <Text style={styles.badgeDescription} numberOfLines={2}>
                {badge.description}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function ActivityCard({ title, items, onViewAll }: any) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>

        <TouchableOpacity activeOpacity={0.85} onPress={onViewAll}>
          <Text style={styles.viewAll}>Poglej vse ›</Text>
        </TouchableOpacity>
      </View>

      {items.map((item: ActivityData, index: number) => (
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
                style={[styles.activityPoints, { color: item.pointsColor }]}
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

function NotificationsModal({
  visible,
  notifications,
  selectedNotification,
  activeTab,
  onChangeTab,
  onOpenNotification,
  onBackToList,
  onClose,
}: any) {
  const unreadNotifications = notifications.filter(
    (item: NotificationData) => !item.read,
  );

  const visibleNotifications =
    activeTab === "unread" ? unreadNotifications : notifications;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.notificationsModalContent}>
          <View style={styles.modalHandle} />

          {!selectedNotification ? (
            <>
              <Text style={styles.modalTitle}>Obvestila</Text>

              <Text style={styles.modalSubtitle}>
                Spremljaj nove dosežke, kvize, streak in pomembne dogodke.
              </Text>

              <View style={styles.notificationsTabs}>
                <TouchableOpacity
                  style={[
                    styles.notificationTab,
                    activeTab === "unread" && styles.notificationTabActive,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => onChangeTab("unread")}
                >
                  <Text
                    style={[
                      styles.notificationTabText,
                      activeTab === "unread" &&
                        styles.notificationTabTextActive,
                    ]}
                  >
                    Nova
                  </Text>

                  {unreadNotifications.length > 0 && (
                    <View style={styles.notificationTabBadge}>
                      <Text style={styles.notificationTabBadgeText}>
                        {unreadNotifications.length > 9
                          ? "9+"
                          : unreadNotifications.length}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.notificationTab,
                    activeTab === "all" && styles.notificationTabActive,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => onChangeTab("all")}
                >
                  <Text
                    style={[
                      styles.notificationTabText,
                      activeTab === "all" && styles.notificationTabTextActive,
                    ]}
                  >
                    Vsa obvestila
                  </Text>
                </TouchableOpacity>
              </View>

              {visibleNotifications.length === 0 ? (
                <View style={styles.emptyNotificationsBox}>
                  <Text style={styles.emptyNotificationsIcon}>
                    {activeTab === "unread" ? "🎉" : "🔔"}
                  </Text>

                  <Text style={styles.emptyNotificationsTitle}>
                    {activeTab === "unread"
                      ? "Vse si prebrala!"
                      : "Ni obvestil"}
                  </Text>

                  <Text style={styles.emptyNotificationsText}>
                    {activeTab === "unread"
                      ? "Trenutno nimaš novih obvestil. Ko se zgodi kaj pomembnega, se bo prikazalo tukaj."
                      : "Ko zaključiš kviz, odkleneš nivo ali dosežeš streak, se bodo obvestila prikazala tukaj."}
                  </Text>
                </View>
              ) : (
                <ScrollView
                  style={styles.notificationsScroll}
                  contentContainerStyle={styles.notificationsScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {visibleNotifications.map((item: NotificationData) => (
                    <TouchableOpacity
                      key={item.id ?? item.title}
                      activeOpacity={0.85}
                      onPress={() => onOpenNotification(item)}
                      style={[
                        styles.notificationItem,
                        !item.read && styles.notificationItemUnread,
                      ]}
                    >
                      <View style={styles.notificationItemIcon}>
                        <Text style={styles.notificationItemEmoji}>
                          {item.icon}
                        </Text>
                      </View>

                      <View style={styles.notificationItemContent}>
                        <View style={styles.notificationTitleRow}>
                          <Text
                            style={styles.notificationItemTitle}
                            numberOfLines={1}
                          >
                            {item.title}
                          </Text>

                          {!item.read && <View style={styles.unreadMiniDot} />}
                        </View>

                        <Text
                          style={styles.notificationItemMessage}
                          numberOfLines={2}
                        >
                          {item.message}
                        </Text>

                        <Text style={styles.notificationItemTime}>
                          {item.time}
                        </Text>
                      </View>

                      <Text style={styles.notificationChevron}>›</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
                <Text style={styles.modalCloseText}>Zapri</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.notificationBackBtn}
                activeOpacity={0.85}
                onPress={onBackToList}
              >
                <Text style={styles.notificationBackText}>‹ Nazaj</Text>
              </TouchableOpacity>

              <View style={styles.notificationDetailIcon}>
                <Text style={styles.notificationDetailEmoji}>
                  {selectedNotification.icon}
                </Text>
              </View>

              <Text style={styles.notificationDetailTitle}>
                {selectedNotification.title}
              </Text>

              <Text style={styles.notificationDetailMessage}>
                {selectedNotification.message}
              </Text>

              <Text style={styles.notificationDetailTime}>
                {selectedNotification.time}
              </Text>

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={onBackToList}
              >
                <Text style={styles.modalCloseText}>Nazaj na obvestila</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.notificationDetailCloseBtn}
                onPress={onClose}
              >
                <Text style={styles.notificationDetailCloseText}>Zapri</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

function AvatarModal({ visible, selectedKey, onClose, onSelect }: any) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />

          <Text style={styles.modalTitle}>Izberi avatar</Text>
          <Text style={styles.modalSubtitle}>
            Izberi sliko, ki bo prikazana na profilu.
          </Text>

          <View style={styles.avatarOptionsRow}>
            {avatarOptions.map((avatar) => (
              <TouchableOpacity
                key={avatar.key}
                style={[
                  styles.avatarOption,
                  selectedKey === avatar.key && styles.avatarOptionActive,
                ]}
                onPress={() => onSelect(avatar.key)}
                activeOpacity={0.85}
              >
                <Image
                  source={avatar.image}
                  style={styles.avatarOptionImage}
                  resizeMode="cover"
                />
                <Text style={styles.avatarOptionText}>{avatar.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
            <Text style={styles.modalCloseText}>Zapri</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function EditProfileModal({
  visible,
  name,
  onChangeName,
  onClose,
  onSave,
}: any) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={[
            styles.modalContent,
            keyboardHeight > 0 && {
              marginBottom: Platform.OS === "android" ? keyboardHeight - 30 : 0,
            },
          ]}
        >
          <View style={styles.modalHandle} />

          <Text style={styles.modalTitle}>Uredi profil</Text>
          <Text style={styles.modalSubtitle}>
            Trenutno lahko urediš prikazano ime.
          </Text>

          <Text style={styles.inputLabel}>Ime</Text>
          <TextInput
            value={name}
            onChangeText={onChangeName}
            placeholder="Vnesi ime"
            style={styles.textInput}
            returnKeyType="done"
            onSubmitEditing={onSave}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Prekliči</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
              <Text style={styles.saveBtnText}>Shrani</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
