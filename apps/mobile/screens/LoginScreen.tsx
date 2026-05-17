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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { styles } from "../styles/LoginScreen.styles";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
  if (!email || !password) {
    setError("Prosimo, vnesi e-pošto in geslo.");
    return;
  }
  setLoading(true);
  setError("");
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigation.navigate("Dashboard");
  } catch (err: any) {
    switch (err.code) {
      case "auth/user-not-found":
        setError("Uporabnik ne obstaja.");
        break;
      case "auth/wrong-password":
        setError("Napačno geslo.");
        break;
      case "auth/invalid-email":
        setError("Neveljaven email.");
        break;
      default:
        setError("Napaka pri prijavi. Poskusi znova.");
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
            <Text style={styles.title}>Prijava</Text>
            <Text style={styles.subtitle}>
              Prijavi se in zbiraj eko točke, rešuj kvize ter tekmuj s svojo
              skupino.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-pošta</Text>
              <TextInput
                style={styles.input}
                placeholder="vnesi e-pošto"
                placeholderTextColor="#A0A0AA"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Geslo</Text>
              <TextInput
                style={styles.input}
                placeholder="vnesi geslo"
                placeholderTextColor="#A0A0AA"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
                secureTextEntry
              />
            </View>

            {/* Error message */}
            {error ? (
              <View style={errorStyles.errorBox}>
                <Text style={errorStyles.errorText}>⚠ {error}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.forgotButton} activeOpacity={0.8}>
              <Text style={styles.forgotText}>Pozabljeno geslo?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Prijavi se</Text>
                  <View style={styles.arrowCircle}>
                    <Text style={styles.arrowText}>›</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>🌱</Text>
            <Text style={styles.infoText}>
              Za hitro skeniranje odpadkov prijava ni potrebna. Prijava je
              namenjena kvizom, točkam in šolskim skupinam.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.switchAuth}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.8}
          >
            <Text style={styles.switchText}>
              Še nimaš računa?{" "}
              <Text style={styles.switchLink}>Ustvari račun</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Simple inline error styles
const errorStyles = {
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
  },
};