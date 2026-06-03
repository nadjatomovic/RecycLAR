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
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase/firebase";
import BottomNavBar from "../components/BottomNavBar";
import { styles } from "../styles/ActivityHistoryScreen.styles";
import DecorativeBackground from "../components/DecorativeBackground";

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

const fallbackActivities: ActivityData[] = [
  {
    id: "scan-demo",
    icon: "♻️",
    iconBg: "#F0FDF4",
    title: "Skeniran odpadek",
    description: "Plastenka PET",
    points: "+15 točk",
    time: "Danes, 09:15",
    pointsColor: "#35A936",
  },
  {
    id: "quiz-demo",
    icon: "❓",
    iconBg: "#EDE9FE",
    title: "Zaključen kviz",
    description: "Ločevanje odpadkov – Nivo 1",
    points: "+10 točk",
    time: "Danes, 08:42",
    pointsColor: "#35A936",
  },
  {
    id: "bonus-demo",
    icon: "🌱",
    iconBg: "#F0FDF4",
    title: "Eko točke za aktivnost",
    description: "Dnevni bonus",
    points: "+5 točk",
    time: "Včeraj, 20:10",
    pointsColor: "#35A936",
  },
];

export default function ActivityHistoryScreen({ navigation }: any) {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigation.navigate("Login");
        return;
      }

      await loadActivities(user.uid);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadActivities = async (uid: string) => {
    try {
      const activitiesQuery = query(
        collection(db, "users", uid, "activities"),
        orderBy("createdAt", "desc"),
        limit(50)
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

      setActivities(loaded.length > 0 ? loaded : fallbackActivities);
    } catch (err) {
      console.log("Error loading activity history:", err);
      setActivities(fallbackActivities);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#35A936" />
          <Text style={styles.loadingText}>Nalagam aktivnosti...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

        <Text style={styles.screenTitle}>Aktivnost ✦</Text>
        <Text style={styles.subtitle}>
          Pregled vseh točk, skeniranj, kvizov in bonusov.
        </Text>

        <View style={styles.activityCard}>
          {activities.map((item, index) => (
            <View key={item.id ?? `${item.title}-${index}`}>
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
                  <Text style={styles.activityDescription}>
                    {item.description}
                  </Text>
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

              {index !== activities.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNavBar navigation={navigation} activeRoute="Profile" />
    </SafeAreaView>
  );
}