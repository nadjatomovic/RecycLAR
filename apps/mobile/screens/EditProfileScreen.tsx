import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { styles } from "../styles/EditProfileScreen.styles";
import { getAvatarAsset } from "../utils/avatarAssets";
import DecorativeBackground from "../components/DecorativeBackground";

type UserData = {
  name?: string;
  email?: string;
  municipalityId?: string;
  avatarKey?: string;
  role?: string;
  groupId?: string;
  schoolId?: string;
};

const avatarOptions = [
  { key: "fox", label: "Lisica", image: getAvatarAsset("fox") },
  { key: "raccoon", label: "Rakun", image: getAvatarAsset("raccoon") },
  { key: "hedgehog", label: "Jež", image: getAvatarAsset("hedgehog") },
  { key: "turtle", label: "Želva", image: getAvatarAsset("turtle") },
  { key: "rabbit", label: "Zajec", image: getAvatarAsset("rabbit") },
  { key: "owl", label: "Sova", image: getAvatarAsset("owl") },
];

const municipalities = ["Maribor", "Ljubljana", "Kranj", "Koper", "Celje"];

const normalizeMunicipality = (value?: string) => {
  if (!value) return "Maribor";

  const found = municipalities.find(
    (city) => city.toLowerCase() === value.toLowerCase()
  );

  return found ?? "Maribor";
};

export default function EditProfileScreen({ navigation }: any) {
  const [uid, setUid] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("fox");
  const [selectedMunicipality, setSelectedMunicipality] = useState("Maribor");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigation.navigate("Login");
        return;
      }

      setUid(user.uid);
      await loadUserData(user.uid);
    });

    return unsubscribe;
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      setLoading(true);

      const userSnap = await getDoc(doc(db, "users", userId));

      if (userSnap.exists()) {
        const data = userSnap.data() as UserData;

        setUserData(data);
        setName(data.name ?? "");
        setSelectedAvatar(data.avatarKey ?? "fox");
        setSelectedMunicipality(normalizeMunicipality(data.municipalityId));
      }
    } catch (error) {
      console.log("Edit profile load error:", error);
      Alert.alert("Napaka", "Profila ni bilo mogoče naložiti.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!uid) return;

    const cleanName = name.trim();

    if (!cleanName) {
      Alert.alert("Napaka", "Ime ne sme biti prazno.");
      return;
    }

    try {
      setSaving(true);

      await updateDoc(doc(db, "users", uid), {
        name: cleanName,
        avatarKey: selectedAvatar,
        municipalityId: selectedMunicipality,
        updatedAt: serverTimestamp(),
      });

      Alert.alert("Shranjeno", "Profil je uspešno posodobljen.", [
        {
          text: "V redu",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log("Edit profile save error:", error);
      Alert.alert("Napaka", "Sprememb ni bilo mogoče shraniti.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#35A936" />
          <Text style={styles.loadingText}>Nalagam profil...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.85}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>

            <View style={styles.headerTextWrap}>
              <Text style={styles.screenTitle}>Uredi profil</Text>
              <Text style={styles.screenSubtitle}>
                Posodobi avatar, ime in občino.
              </Text>
            </View>
          </View>

          <View style={styles.avatarPreviewCard}>
            <View style={styles.avatarPreviewCircle}>
              <Image
                source={getAvatarAsset(selectedAvatar)}
                style={styles.avatarPreviewImage}
                resizeMode="cover"
              />
            </View>

            <Text style={styles.avatarPreviewTitle}>
              {name.trim() || "Uporabnik"}
            </Text>

            <Text style={styles.avatarPreviewSub}>
              {userData?.email ?? "Brez e-pošte"}
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Izberi avatar</Text>

            <View style={styles.avatarGrid}>
              {avatarOptions.map((avatar) => {
                const active = selectedAvatar === avatar.key;

                return (
                  <TouchableOpacity
                    key={avatar.key}
                    style={[
                      styles.avatarOption,
                      active && styles.avatarOptionActive,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => setSelectedAvatar(avatar.key)}
                  >
                    <Image
                      source={avatar.image}
                      style={styles.avatarOptionImage}
                      resizeMode="cover"
                    />

                    <Text
                      style={[
                        styles.avatarOptionText,
                        active && styles.avatarOptionTextActive,
                      ]}
                    >
                      {avatar.label}
                    </Text>

                    {active && (
                      <View style={styles.selectedCheck}>
                        <Text style={styles.selectedCheckText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Podatki</Text>

            <Text style={styles.inputLabel}>Ime</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Vnesi ime"
              style={styles.textInput}
              returnKeyType="done"
            />

            <Text style={styles.inputLabel}>Občina</Text>

            <View style={styles.cityGrid}>
              {municipalities.map((city) => {
                const active = selectedMunicipality === city;

                return (
                  <TouchableOpacity
                    key={city}
                    style={[styles.cityOption, active && styles.cityOptionActive]}
                    activeOpacity={0.85}
                    onPress={() => setSelectedMunicipality(city)}
                  >
                    <Text
                      style={[
                        styles.cityOptionText,
                        active && styles.cityOptionTextActive,
                      ]}
                    >
                      {city}
                    </Text>

                    {active && <Text style={styles.cityCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            activeOpacity={0.9}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Shrani spremembe</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Prekliči</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}