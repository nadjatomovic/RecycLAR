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
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase/firebase";
import BottomNavBar from "../components/BottomNavBar";
import DecorativeBackground from "../components/DecorativeBackground";
import { getIconAsset } from "../utils/iconAssets";
import { styles } from "../styles/TeacherClassesScreen.styles";

type GroupData = {
  id: string;
  name: string;
  schoolName?: string;
  totalPoints?: number;
  weeklyPoints?: number;
  monthlyPoints?: number;
  memberCount?: number;
  quizCompleted?: number;
  scanCount?: number;
  inviteCode?: string;
};

export default function TeacherClassesScreen({ navigation }: any) {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigation.navigate("Login");
        return;
      }

      await loadGroups(user.uid);
    });

    return unsubscribe;
  }, []);

  const loadGroups = async (uid: string) => {
    try {
      setLoading(true);

      const groupsQuery = query(
        collection(db, "groups"),
        where("teacherId", "==", uid)
      );

      const snapshot = await getDocs(groupsQuery);
      const loaded: GroupData[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

      loaded.push({
        id: docSnap.id,
        name: data.name ?? "Razred",
        schoolName: data.schoolName ?? "",
        totalPoints: data.totalPoints ?? 0,
        weeklyPoints: data.weeklyPoints ?? 0,
        monthlyPoints: data.monthlyPoints ?? 0,
        memberCount: data.memberCount ?? 0,
        quizCompleted: data.quizCompleted ?? 0,
        scanCount: data.scanCount ?? 0,
        inviteCode: data.inviteCode ?? "",
        });
      });

      loaded.sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0));
      setGroups(loaded);
    } catch (error) {
      console.log("Error loading teacher classes:", error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#35A936" />
          <Text style={styles.loadingText}>Nalagam razrede...</Text>
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
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
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

        <Text style={styles.screenTitle}>Moji razredi ✦</Text>
        <Text style={styles.screenSubtitle}>
          Preglej odeljenja, učence in njihove rezultate.
        </Text>

        {groups.length === 0 ? (
          <View style={styles.emptyCard}>
            <Image
              source={getIconAsset("teacherStudents")}
              style={styles.emptyIcon}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>Ni razredov</Text>
            <Text style={styles.emptyText}>
              Ko bo učitelj povezan z razredi, se bodo prikazali tukaj.
            </Text>
          </View>
        ) : (
          groups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.classCard}
              activeOpacity={0.86}
              onPress={() =>
                navigation.navigate("TeacherClassDetail", {
                  groupId: group.id,
                  groupName: group.name,
                  schoolName: group.schoolName,
                  inviteCode: group.inviteCode,
                })
              }
            >
              <View style={styles.classIconCircle}>
                <Text style={styles.classIconText}>{group.name}</Text>
              </View>

              <View style={styles.classInfo}>
                <Text style={styles.className}>{group.name}</Text>
                <Text style={styles.classSchool} numberOfLines={1}>
                  {group.schoolName || "Šola"}
                </Text>
                {!!group.inviteCode && (
                    <Text style={styles.classInviteCode} numberOfLines={1}>
                        Koda: {group.inviteCode}
                    </Text>
                )}

                <View style={styles.classStatsRow}>
                  <Text style={styles.classStat}>
                    👥 {group.memberCount ?? 0}
                  </Text>
                  <Text style={styles.classStat}>
                    ❓ {group.quizCompleted ?? 0}
                  </Text>
                  <Text style={styles.classStat}>
                    📷 {group.scanCount ?? 0}
                  </Text>
                </View>
              </View>

              <View style={styles.pointsBox}>
                <Text style={styles.pointsValue}>{group.totalPoints ?? 0}</Text>
                <Text style={styles.pointsLabel}>točk</Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <BottomNavBar navigation={navigation} activeRoute="Profile" />
    </SafeAreaView>
  );
}