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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/RegisterScreen.styles";

const schoolRoles = [
  {
    id: "student",
    label: "Učenec",
  },
  {
    id: "teacher",
    label: "Učitelj",
  },
];

export default function RegisterScreen({ navigation }: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [municipality, setMunicipality] = useState("Maribor");
  const [password, setPassword] = useState("");

  const [isSchoolAccount, setIsSchoolAccount] = useState(false);
  const [selectedSchoolRole, setSelectedSchoolRole] = useState<"student" | "teacher">("student");
  const [groupCode, setGroupCode] = useState("");
  const [schoolName, setSchoolName] = useState("");

  const handleRegister = () => {
    const role = isSchoolAccount ? selectedSchoolRole : "user";

    const registerData = {
      fullName,
      email,
      municipality,
      password,
      role,
      isSchoolAccount,
      groupCode: isSchoolAccount && selectedSchoolRole === "student" ? groupCode : "",
      schoolName: isSchoolAccount && selectedSchoolRole === "teacher" ? schoolName : "",
    };

    console.log("Register:", registerData);

    // Kasnije ovde ide Firebase Auth + Firestore users kolekcija.
    // Za sada šaljemo korisnika nazad na Dashboard.
    navigation.navigate("Dashboard", { selectedCity: municipality });
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
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-pošta</Text>
              <TextInput
                style={styles.input}
                placeholder="npr. nika@gemail.com"
                placeholderTextColor="#A0A0AA"
                value={email}
                onChangeText={setEmail}
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
                placeholder="ustvari geslo"
                placeholderTextColor="#A0A0AA"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[
                styles.schoolToggle,
                isSchoolAccount && styles.schoolToggleActive,
              ]}
              onPress={() => setIsSchoolAccount(!isSchoolAccount)}
              activeOpacity={0.85}
            >
              <View>
                <Text
                  style={[
                    styles.schoolToggleTitle,
                    isSchoolAccount && styles.schoolToggleTitleActive,
                  ]}
                >
                  Registracija za šolo
                </Text>
                <Text style={styles.schoolToggleSubtitle}>
                  Učenci in učitelji lahko zbirajo točke za skupino.
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
              style={styles.primaryButton}
              onPress={handleRegister}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Ustvari račun</Text>
              <View style={styles.arrowCircle}>
                <Text style={styles.arrowText}>›</Text>
              </View>
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