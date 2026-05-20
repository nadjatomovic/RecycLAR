import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { styles } from "../styles/RegisterScreen.styles";

const schoolRoles = [
  { id: "student", label: "Učenec" },
  { id: "teacher", label: "Učitelj" },
];

export default function RegisterScreen({ navigation }: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [municipality, setMunicipality] = useState("Maribor");
  const [password, setPassword] = useState("");
  const [isSchoolAccount, setIsSchoolAccount] = useState(false);
  const [selectedSchoolRole, setSelectedSchoolRole] = useState<
    "student" | "teacher"
  >("student");
  const [groupCode, setGroupCode] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    // Validation
    if (!fullName || !email || !password) {
      setError("Prosimo, izpolni vsa obvezna polja.");
      return;
    }
    if (!isSchoolAccount) {
      setError("Prosimo, izberi vlogo (Učenec ali Učitelj).");
      return;
    }
    if (selectedSchoolRole === "student" && !groupCode) {
      setError("Prosimo, vnesi kodo skupine.");
      return;
    }
    if (selectedSchoolRole === "teacher" && !schoolName) {
      setError("Prosimo, vnesi ime šole.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1 — Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Step 2 — Save user data to Firestore users collection
      // This matches your existing database structure exactly!
      await setDoc(doc(db, "users", user.uid), {
        name: fullName,
        email: email,
        municipalityId: municipality,
        role: isSchoolAccount ? selectedSchoolRole : "user",
        groupId:
          isSchoolAccount && selectedSchoolRole === "student" ? groupCode : "",
        schoolId:
          isSchoolAccount && selectedSchoolRole === "teacher" ? schoolName : "",
        totalPoints: 0,
        weeklyPoints: 0,
        scanCount: 0,
        quizCompleted: 0,
        streakDays: 0,
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      });

      // Step 3 — Navigate to Login to confirm sign in
      navigation.navigate("Login");
    } catch (err: any) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Ta e-poštni naslov je že v uporabi.");
          break;
        case "auth/invalid-email":
          setError("Neveljaven e-poštni naslov.");
          break;
        case "auth/weak-password":
          setError("Geslo je prešibko. Uporabi vsaj 6 znakov.");
          break;
        default:
          setError("Napaka pri registraciji. Poskusi znova.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.logoSection}>
            <Image
              source={require("../assets/icon-logo.png")}
              style={styles.logoIcon}
              resizeMode="contain"
            />
            <Text style={styles.brandText}>
              <Text style={styles.brandGreen}>Recyc</Text>
              <Text style={styles.brandPurple}>LAR</Text>
            </Text>
          </View>

          <View style={styles.headerSection}>
            <Text style={styles.title}>Ustvari račun</Text>
            <Text style={styles.subtitle}>
              Ustvari račun za spremljanje aktivnosti. Če si del šole, lahko
              spodaj vključiš šolski način.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ime in priimek</Text>
              <TextInput
                style={styles.input}
                placeholder="npr. Nika Zupančič"
                placeholderTextColor="#A0A0AA"
                value={fullName}
                onChangeText={(t) => {
                  setFullName(t);
                  setError("");
                }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-pošta</Text>
              <TextInput
                style={styles.input}
                placeholder="npr. nika@gmail.com"
                placeholderTextColor="#A0A0AA"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Občina</Text>
              <TextInput
                style={styles.input}
                placeholder="Maribor"
                placeholderTextColor="#A0A0AA"
                value={municipality}
                onChangeText={setMunicipality}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Geslo</Text>
              <TextInput
                style={styles.input}
                placeholder="vsaj 6 znakov"
                placeholderTextColor="#A0A0AA"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setError("");
                }}
                secureTextEntry
              />
            </View>

            {/* Error message */}
            {error ? (
              <View style={errorStyle.box}>
                <Text style={errorStyle.text}>⚠ {error}</Text>
              </View>
            ) : null}

            {/* Required role selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Vloga <Text style={{ color: "#DC2626" }}>*</Text>
              </Text>
              <Text
                style={{ fontSize: 12, color: "#7A7A86", marginBottom: 10 }}
              >
                Izberi svojo vlogo v aplikaciji
              </Text>
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[
                    styles.roleCard,
                    selectedSchoolRole === "student" &&
                      isSchoolAccount &&
                      styles.roleCardActive,
                  ]}
                  onPress={() => {
                    setSelectedSchoolRole("student");
                    setIsSchoolAccount(true);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={{ fontSize: 22, marginBottom: 4 }}>🎒</Text>
                  <Text
                    style={[
                      styles.roleText,
                      selectedSchoolRole === "student" &&
                        isSchoolAccount &&
                        styles.roleTextActive,
                    ]}
                  >
                    Učenec
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleCard,
                    selectedSchoolRole === "teacher" &&
                      isSchoolAccount &&
                      styles.roleCardActive,
                  ]}
                  onPress={() => {
                    setSelectedSchoolRole("teacher");
                    setIsSchoolAccount(true);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={{ fontSize: 22, marginBottom: 4 }}>👩‍🏫</Text>
                  <Text
                    style={[
                      styles.roleText,
                      selectedSchoolRole === "teacher" &&
                        isSchoolAccount &&
                        styles.roleTextActive,
                    ]}
                  >
                    Učitelj
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Show fields based on role */}
            {isSchoolAccount && selectedSchoolRole === "student" && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Koda skupine <Text style={{ color: "#DC2626" }}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="npr. 7B-RECYCLE"
                  placeholderTextColor="#A0A0AA"
                  value={groupCode}
                  onChangeText={setGroupCode}
                  autoCapitalize="characters"
                />
                <Text style={styles.helperText}>
                  Kodo dobiš od učitelja ali mentorja skupine.
                </Text>
              </View>
            )}

            {isSchoolAccount && selectedSchoolRole === "teacher" && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Ime šole <Text style={{ color: "#DC2626" }}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="npr. OŠ Franceta Prešerna"
                  placeholderTextColor="#A0A0AA"
                  value={schoolName}
                  onChangeText={setSchoolName}
                />
                <Text style={styles.helperText}>
                  Po registraciji lahko učitelj ustvari razred ali skupino.
                </Text>
              </View>
            )}

            {isSchoolAccount && (
              <View style={styles.schoolBox}>
                <Text style={styles.schoolBoxTitle}>Izberi vlogo</Text>
                <View style={styles.roleRow}>
                  {schoolRoles.map((role) => (
                    <TouchableOpacity
                      key={role.id}
                      style={[
                        styles.roleCard,
                        selectedSchoolRole === role.id && styles.roleCardActive,
                      ]}
                      onPress={() =>
                        setSelectedSchoolRole(role.id as "student" | "teacher")
                      }
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.roleText,
                          selectedSchoolRole === role.id &&
                            styles.roleTextActive,
                        ]}
                      >
                        {role.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {selectedSchoolRole === "student" && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Koda skupine</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="npr. 7B-RECYCLE"
                      placeholderTextColor="#A0A0AA"
                      value={groupCode}
                      onChangeText={setGroupCode}
                      autoCapitalize="characters"
                    />
                    <Text style={styles.helperText}>
                      Kodo dobiš od učitelja ali mentorja skupine.
                    </Text>
                  </View>
                )}

                {selectedSchoolRole === "teacher" && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Ime šole</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="npr. OŠ Franceta Prešerna"
                      placeholderTextColor="#A0A0AA"
                      value={schoolName}
                      onChangeText={setSchoolName}
                    />
                    <Text style={styles.helperText}>
                      Po registraciji lahko učitelj ustvari razred ali skupino.
                    </Text>
                  </View>
                )}
              </View>
            )}

            <TouchableOpacity
              style={[styles.primaryButton, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Ustvari račun</Text>
                  <View style={styles.arrowCircle}>
                    <Text style={styles.arrowText}>›</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.switchAuth}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.8}
          >
            <Text style={styles.switchText}>
              Že imaš račun? <Text style={styles.switchLink}>Prijavi se</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const errorStyle = {
  box: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  text: { color: "#DC2626", fontSize: 13 },
};
