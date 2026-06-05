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
import { saveCity } from "../utils/cityStorage";
import DecorativeBackground from "../components/DecorativeBackground"; 
import { Ionicons } from "@expo/vector-icons";
import { getIconAsset } from "../utils/iconAssets";

const municipalities = ["Maribor", "Ljubljana", "Kranj", "Koper", "Celje"];

const schoolRoles = [
  { id: "student", label: "Učenec", iconKey: "roleStudent" },
  { id: "teacher", label: "Učitelj", iconKey: "roleTeacher" },
];

const municipalityToId: Record<string, string> = {
  Maribor: "maribor",
  Ljubljana: "ljubljana",
  Kranj: "kranj",
  Koper: "koper",
  Celje: "celje",
};

export default function RegisterScreen({ navigation }: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [municipality, setMunicipality] = useState("Maribor");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSchoolAccount, setIsSchoolAccount] = useState(false);
  const [selectedSchoolRole, setSelectedSchoolRole] = useState<
    "student" | "teacher"
  >("student");

  const [groupCode, setGroupCode] = useState("");
  const [schoolName, setSchoolName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Prosimo, izpolni vsa obvezna polja.");
      return;
    }

    if (password.length < 6) {
      setError("Geslo mora imeti vsaj 6 znakov.");
      return;
    }

    if (
      isSchoolAccount &&
      selectedSchoolRole === "student" &&
      !groupCode.trim()
    ) {
      setError("Prosimo, vnesi kodo skupine.");
      return;
    }

    if (
      isSchoolAccount &&
      selectedSchoolRole === "teacher" &&
      !schoolName.trim()
    ) {
      setError("Prosimo, vnesi ime šole.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const user = userCredential.user;
      const municipalityId = municipalityToId[municipality] ?? "maribor";

      // Зачувување во Firestore базата
      await setDoc(doc(db, "users", user.uid), {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        municipalityId,
        municipalityName: municipality,
        role: isSchoolAccount ? selectedSchoolRole : "user",
        accountType: isSchoolAccount ? "school" : "regular",
        groupId:
          isSchoolAccount && selectedSchoolRole === "student"
            ? groupCode.trim().toUpperCase()
            : "",
        schoolId:
          isSchoolAccount && selectedSchoolRole === "teacher"
            ? schoolName.trim()
            : "",
        totalPoints: 0,
        weeklyPoints: 0,
        scanCount: 0,
        quizCompleted: 0,
        streakDays: 0,
        earnedBadges: [],
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      });

      // 2. КЛУЧЕН ЧЕКОР: Го зачувуваме градот и локално на телефонот веднаш по регистрација
      await saveCity(municipality);

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
      <DecorativeBackground variant="default" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
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

            <Image
              source={require("../assets/logo.png")}
              style={styles.logoText}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerSection}>
            <Text style={styles.title}>Ustvari račun</Text>
            <Text style={styles.subtitle}>
              Ustvari račun za spremljanje aktivnosti, točk in kvizov.
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
                onChangeText={(text) => {
                  setFullName(text);
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
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Občina</Text>

              <View style={styles.municipalityGrid}>
                {municipalities.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.municipalityChip,
                      municipality === city && styles.municipalityChipActive,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => {
                      setMunicipality(city);
                      setError("");
                    }}
                  >
                    <Text
                      style={[
                        styles.municipalityChipText,
                        municipality === city &&
                          styles.municipalityChipTextActive,
                      ]}
                    >
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Geslo</Text>

              <View style={styles.passwordInputWrap}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="vsaj 6 znakov"
                  placeholderTextColor="#A0A0AA"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError("");
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

               <TouchableOpacity
                  style={styles.eyeButton}
                  activeOpacity={0.75}
                  onPress={() => setShowPassword((previous) => !previous)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#6B35C9"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.schoolToggle,
                isSchoolAccount && styles.schoolToggleActive,
              ]}
              activeOpacity={0.85}
              onPress={() => {
                setIsSchoolAccount(!isSchoolAccount);
                setError("");
              }}
            >
              <View style={styles.schoolToggleTextWrap}>
                <Text
                  style={[
                    styles.schoolToggleTitle,
                    isSchoolAccount && styles.schoolToggleTitleActive,
                  ]}
                >
                  Šolski račun
                </Text>
                <Text style={styles.schoolToggleSubtitle}>
                  Vključi, če si učenec ali učitelj in uporabljaš aplikacijo v
                  šoli.
                </Text>
              </View>

              <Text
                style={[
                  styles.schoolToggleIcon,
                  isSchoolAccount && styles.schoolToggleIconActive,
                ]}
              >
                {isSchoolAccount ? "✓" : "+"}
              </Text>
            </TouchableOpacity>

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
                      onPress={() => {
                        setSelectedSchoolRole(role.id as "student" | "teacher");
                        setError("");
                      }}
                      activeOpacity={0.85}
                    >
                      <Image
                        source={getIconAsset(role.iconKey)}
                        style={styles.roleIcon}
                        resizeMode="contain"
                      />
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
                  <View style={styles.inputGroupLast}>
                    <Text style={styles.label}>Koda skupine</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="npr. 7B-RECYCLE"
                      placeholderTextColor="#A0A0AA"
                      value={groupCode}
                      onChangeText={(text) => {
                        setGroupCode(text);
                        setError("");
                      }}
                      autoCapitalize="characters"
                    />
                    <Text style={styles.helperText}>
                      Kodo dobiš od učitelja ali mentorja skupine.
                    </Text>
                  </View>
                )}

                {selectedSchoolRole === "teacher" && (
                  <View style={styles.inputGroupLast}>
                    <Text style={styles.label}>Ime šole</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="npr. OŠ Franceta Prešerna"
                      placeholderTextColor="#A0A0AA"
                      value={schoolName}
                      onChangeText={(text) => {
                        setSchoolName(text);
                        setError("");
                      }}
                    />
                    <Text style={styles.helperText}>
                      Po registraciji lahko učitelj ustvari razred ali skupino.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleRegister}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
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
