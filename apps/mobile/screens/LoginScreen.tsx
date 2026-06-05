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
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { styles } from "../styles/LoginScreen.styles";
import { saveCity } from "../utils/cityStorage";
import DecorativeBackground from "../components/DecorativeBackground";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Prosimo, vnesi e-pošto in geslo.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.municipalityName) {
          await saveCity(userData.municipalityName);
        }
      }

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

  const handleResetPasswordEmail = async () => {
    if (!forgotEmail.trim()) {
      setModalError("Prosimo, vnesi e-poštni naslov.");
      return;
    }

    setModalLoading(true);
    setModalError("");

    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      setForgotModalVisible(false);

      Alert.alert(
        "E-pošta poslana",
        `Povezava za ponastavitev gesla je bila uspešno poslana na naslov: ${forgotEmail.trim()}`,
        [{ text: "V redu", onPress: () => setForgotEmail("") }],
      );
    } catch (err: any) {
      switch (err.code) {
        case "auth/invalid-email":
          setModalError("Neveljaven e-poštni naslov.");
          break;
        case "auth/user-not-found":
          setModalError("Uporabnik s tem e-poštnim naslovom ne obstaja.");
          break;
        default:
          setModalError("Napaka. Poskusi znova.");
      }
    } finally {
      setModalLoading(false);
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

          <View style={styles.header}>
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

              <View style={styles.passwordInputWrap}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="vnesi geslo"
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

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.forgotButton}
              activeOpacity={0.8}
              onPress={() => {
                setForgotEmail(email);
                setModalError("");
                setForgotModalVisible(true);
              }}
            >
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

      <Modal visible={forgotModalVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => !modalLoading && setForgotModalVisible(false)}
        >
          <Pressable style={styles.modalContainer}>
            <View style={styles.modalHandle} />

            <Image
              source={require("../assets/icon-logo.png")}
              style={styles.modalLogo}
              resizeMode="contain"
            />

            <Text style={styles.modalTitle}>Ponastavitev gesla</Text>
            <Text style={styles.modalSubtitle}>
              Vnesite svoj e-poštni naslov. Poslali vam bomo varno povezavo za
              spremembo gesla.
            </Text>

            <View style={styles.modalInputWrapper}>
              <TextInput
                style={styles.modalInput}
                placeholder="vnesi e-pošto"
                placeholderTextColor="#A0A0AA"
                value={forgotEmail}
                onChangeText={(text) => {
                  setForgotEmail(text);
                  setModalError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {modalError ? (
              <Text style={styles.modalErrorText}>⚠ {modalError}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.modalSubmitButton,
                modalLoading && styles.disabledButton,
              ]}
              onPress={handleResetPasswordEmail}
              disabled={modalLoading}
            >
              {modalLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.modalSubmitButtonText}>
                  Pošlji povezavo
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setForgotModalVisible(false)}
              disabled={modalLoading}
            >
              <Text style={styles.modalCancelButtonText}>Prekliči</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
