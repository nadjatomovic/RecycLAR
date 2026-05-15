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
import { styles } from "../styles/LoginScreen.styles";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Kasnije ovde povezujemo Firebase Auth
    console.log("Login:", email, password);

    // Za sada može da vodi na Dashboard ili školski dashboard kada ga napravite
    navigation.navigate("Dashboard");
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
                onChangeText={setEmail}
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
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.forgotButton} activeOpacity={0.8}>
              <Text style={styles.forgotText}>Pozabljeno geslo?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleLogin}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Prijavi se</Text>
              <View style={styles.arrowCircle}>
                <Text style={styles.arrowText}>›</Text>
              </View>
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