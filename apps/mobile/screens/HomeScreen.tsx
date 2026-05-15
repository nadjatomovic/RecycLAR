import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
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
        {/* Лого секција */}
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

        {/* Hero Слика */}
        <View style={styles.heroSection}>
          <Image
            source={require("../assets/hero-image.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Избор на општина */}
        <TouchableOpacity
          style={styles.dropdownContainer}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.row}>
            <View style={styles.locationIconCircle}>
              <Text style={{ color: "white", fontSize: 14 }}>📍</Text>
            </View>
            <Text style={styles.dropdownLabel}>
              Občina:{" "}
              <Text style={styles.selectedCityText}>{selectedCity}</Text>
            </Text>
          </View>
          <Text style={styles.chevron}>⌄</Text>
        </TouchableOpacity>

        {/* Главно копче */}
        <TouchableOpacity
          style={styles.mainButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.leafIcon}>🍃</Text>
          <Text style={styles.mainButtonText}>Začni</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}>
          <View style={styles.row}>
            <Text style={styles.userIcon}>👤</Text>
            <Text style={styles.loginButtonText}>Prijava</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Поправен Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
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
                style={styles.cityOption}
                onPress={() => {
                  setSelectedCity(city);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cityText}>{city}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
