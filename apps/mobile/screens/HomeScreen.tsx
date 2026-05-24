import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/HomeScreen.styles";

const municipalities = ["Maribor", "Celje", "Ljubljana", "Kranj", "Koper"];

export default function HomeScreen({ navigation }: any) {
  const [selectedCity, setSelectedCity] = useState("Maribor");
  const [modalVisible, setModalVisible] = useState(false);

  const handleStart = () => {
    navigation.navigate("Dashboard", { selectedCity });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Image
            source={require("../assets/icon-logo.png")}
            style={styles.mainIcon}
            resizeMode="contain"
          />

          <Image
            source={require("../assets/logo.png")}
            style={styles.logoText}
            resizeMode="contain"
          />

          <Text style={styles.tagline}>Skeniraj. Loči. Uči se.</Text>

          <Text style={styles.description}>
            Pametno recikliranje za domove, šole in občine.
          </Text>
        </View>

        <View style={styles.heroCard}>
          <Image
            source={require("../assets/hero-image.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          style={styles.dropdownContainer}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <View style={styles.dropdownLeft}>
            <View style={styles.locationIconCircle}>
              <Image
                source={require("../assets/location-icon.png")}
                style={styles.locationIcon}
                resizeMode="contain"
              />
            </View>

            <View>
              <Text style={styles.dropdownSmallLabel}>Izbrana občina</Text>
              <Text style={styles.dropdownLabel}>{selectedCity}</Text>
            </View>
          </View>

          <Text style={styles.chevron}>⌄</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainButton}
          activeOpacity={0.9}
          onPress={handleStart}
        >
          <Text style={styles.mainButtonIcon}>🌿</Text>
          <Text style={styles.mainButtonText}>Začni</Text>

          <View style={styles.arrowCircle}>
            <Text style={styles.arrowText}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginIcon}>👤</Text>
          <Text style={styles.loginButtonText}>Prijava</Text>
        </TouchableOpacity>

        <View style={styles.bottomInfo}>
          <Text style={styles.bottomInfoIcon}>✓</Text>
          <Text style={styles.bottomInfoText}>
            Lokalna pravila. Pametni nasveti. Boljši svet.
          </Text>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalContent}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Izberi občino</Text>
            <Text style={styles.modalSubtitle}>
              Pravila ločevanja se prilagodijo izbrani občini.
            </Text>

            {municipalities.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityOption,
                  selectedCity === city && styles.cityOptionActive,
                ]}
                activeOpacity={0.85}
                onPress={() => {
                  setSelectedCity(city);
                  setModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.cityText,
                    selectedCity === city && styles.cityTextActive,
                  ]}
                >
                  {city}
                </Text>

                {selectedCity === city && (
                  <Text style={styles.cityCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}