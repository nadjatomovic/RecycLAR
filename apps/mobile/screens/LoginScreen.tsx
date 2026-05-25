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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { styles } from "../styles/LoginScreen.styles";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Prosimo, vnesi e-pošto in geslo.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.navigate("Dashboard");
    } catch (err: any) {
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/invalid-credential":
          setError("Uporabnik ne obstaja ali so podatki napačni.");
          break;
        case "auth/wrong-password":
          setError("Napačno geslo.");
          break;
        case "auth/invalid-email":
          setError("Neveljaven e-poštni naslov.");
          break;
        case "auth/too-many-requests":
          setError("Preveč poskusov. Poskusi znova pozneje.");
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
                autoCorrect={false}
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

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.forgotButton} activeOpacity={0.8}>
              <Text style={styles.forgotText}>Pozabljeno geslo?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
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