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

import { db } from "../firebase/firebase";
import BottomNavBar from "../components/BottomNavBar";
import DecorativeBackground from "../components/DecorativeBackground";
import { getIconAsset } from "../utils/iconAssets";
import { styles } from "../styles/TeacherClassDetailScreen.styles";

type StudentData = {
  id: string;
  name: string;
  email?: string;
  totalPoints?: number;
  quizCompleted?: number;
  scanCount?: number;
  streakDays?: number;
  role?: string;
};

export default function TeacherClassDetailScreen({ navigation, route }: any) {
  const { groupId, groupName, schoolName, inviteCode } = route.params;

  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);

      const studentsQuery = query(
        collection(db, "users"),
        where("groupId", "==", groupId),
      );

      const snapshot = await getDocs(studentsQuery);
      const loaded: StudentData[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        if (data.role && data.role !== "student") {
          return;
        }

        loaded.push({
          id: docSnap.id,
          name: data.name ?? "Učenec",
          email: data.email ?? "",
          totalPoints: data.totalPoints ?? 0,
          quizCompleted: data.quizCompleted ?? 0,
          scanCount: data.scanCount ?? 0,
          streakDays: data.streakDays ?? 0,
          role: data.role ?? "student",
        });
      });

      loaded.sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0));

      setStudents(loaded);
    } catch (error) {
      console.log("Error loading class students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = students.reduce(
    (sum, student) => sum + (student.totalPoints ?? 0),
    0,
  );

  const totalScans = students.reduce(
    (sum, student) => sum + (student.scanCount ?? 0),
    0,
  );

  const totalQuizzes = students.reduce(
    (sum, student) => sum + (student.quizCompleted ?? 0),
    0,
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#35A936" />
          <Text style={styles.loadingText}>Nalagam razred...</Text>
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

        <Text style={styles.screenTitle}>{groupName}</Text>

        <Text style={styles.screenSubtitle}>
          {schoolName || "Šola"} · pregled učencev
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{students.length}</Text>
            <Text style={styles.summaryLabel}>Učenci</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalPoints}</Text>
            <Text style={styles.summaryLabel}>Točke</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalQuizzes}</Text>
            <Text style={styles.summaryLabel}>Kvizi</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalScans}</Text>
            <Text style={styles.summaryLabel}>Skeni</Text>
          </View>
        </View>

        {!!inviteCode && (
            <View style={styles.inviteCodeCard}>
                <View style={styles.inviteCodeIconCircle}>
                <Text style={styles.inviteCodeIcon}>🔑</Text>
                </View>

                <View style={styles.inviteCodeContent}>
                <Text style={styles.inviteCodeLabel}>Koda za učence</Text>
                <Text style={styles.inviteCodeValue}>{inviteCode}</Text>
                <Text style={styles.inviteCodeHelp}>
                    Učenci to kodo vnesejo pri registraciji, da se pridružijo razredu.
                </Text>
                </View>
            </View>
        )}

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Učenci</Text>
            <Text style={styles.sectionHint}>Skupno: {students.length}</Text>
          </View>

          {students.length === 0 ? (
            <View style={styles.emptyBox}>
              <Image
                source={getIconAsset("teacherStudents")}
                style={styles.emptyIcon}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>Ni učencev</Text>
              <Text style={styles.emptyText}>
                Ko se učenci pridružijo temu razredu, bodo prikazani tukaj.
              </Text>
            </View>
          ) : (
            students.map((student, index) => (
              <View key={student.id}>
                <View style={styles.studentRow}>
                  <View style={styles.rankCircle}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>

                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentMeta}>
                      {student.quizCompleted ?? 0} kvizov ·{" "}
                      {student.scanCount ?? 0} skeniranj
                    </Text>
                  </View>

                  <View style={styles.studentPointsBox}>
                    <Text style={styles.studentPoints}>
                      {student.totalPoints ?? 0}
                    </Text>
                    <Text style={styles.studentPointsLabel}>točk</Text>
                  </View>
                </View>

                {index !== students.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNavBar navigation={navigation} activeRoute="Profile" />
    </SafeAreaView>
  );
}