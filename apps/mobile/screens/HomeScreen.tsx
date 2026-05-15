import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/HomeScreen.styles";

const municipalities = ["Maribor", "Celje", "Ljubljana", "Kranj", "Koper"];

export default function HomeScreen({ navigation }: any) {
  const [selectedCity, setSelectedCity] = useState("Maribor");
  const [modalVisible, setModalVisible] = useState(false);

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
            Pametno recikliranje za{"\n"}domove, šole in občine.
          </Text>
        </View>

        <View style={styles.heroSection}>
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

            <Text style={styles.dropdownLabel}>
              Občina:{" "}
              <Text style={styles.selectedCityText}>{selectedCity}</Text>
            </Text>
          </View>

          <Text style={styles.chevron}>⌄</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainButton}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("Dashboard", { selectedCity: selectedCity })
          }
        >
          <Text style={styles.mainButtonLeaf}>⌁</Text>

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
          <Text style={styles.loginIcon}>♙</Text>
          <Text style={styles.loginButtonText}>Prijava</Text>
        </TouchableOpacity>

        <View style={styles.bottomInfo}>
          <Text style={styles.bottomInfoIcon}>♡</Text>
          <Text style={styles.bottomInfoText}>
            Lokalna pravila. Pametni nasveti. Boljši svet.
          </Text>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Izberi občino</Text>

            {municipalities.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityOption,
                  selectedCity === city && styles.cityOptionActive,
                ]}
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
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}