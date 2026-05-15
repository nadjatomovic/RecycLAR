import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Callout } from "react-native-maps";
import { styles } from "../styles/MapScreen.styles";

// 1. Податоци за сите контејнери во Марибор (Тест податоци)
const DUMMY_LOCATIONS = [
  {
    id: "1",
    title: "EKO otok Tabor",
    lat: 46.558,
    lng: 15.646,
    type: "Bio",
    address: "Ulica heroja Šlandra",
  },
  {
    id: "2",
    title: "Збиралиште Центар",
    lat: 46.552,
    lng: 15.642,
    type: "Glass",
    address: "Partizanska cesta",
  },
  {
    id: "3",
    title: "Контејнер Папир",
    lat: 46.56,
    lng: 15.65,
    type: "Paper",
    address: "Titova cesta",
  },
  {
    id: "4",
    title: "Еко Точка Лент",
    lat: 46.557,
    lng: 15.64,
    type: "Plastic",
    address: "Drava ulica",
  },
];

const MapScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(DUMMY_LOCATIONS);
  const [selectedPlace, setSelectedPlace] = useState(DUMMY_LOCATIONS[0]);

  // Функција за пребарување по име на улица или наслов
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = DUMMY_LOCATIONS.filter(
      (loc) =>
        loc.title.toLowerCase().includes(text.toLowerCase()) ||
        loc.address.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredLocations(filtered);
  };

  const initialRegion = {
    latitude: 46.5547,
    longitude: 15.6459,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image
            source={require("../assets/icon-logo.png")}
            style={styles.miniIcon}
          />
          <Image
            source={require("../assets/logo.png")}
            style={styles.miniLogoText}
          />
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Text style={{ fontSize: 20 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Наслов */}
      <View style={styles.titleSection}>
        <View>
          <Text style={styles.mainTitle}>Zemljevid ✨</Text>
          <Text style={styles.subTitle}>Најди ги сите точки во Марибор.</Text>
        </View>
        <Image
          source={require("../assets/lari-hello.png")}
          style={styles.mascotSmall}
          resizeMode="contain"
        />
      </View>

      {/* Пребарувач */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Пребарај улица (пр. Partizanska)"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Мапа */}
      <View style={styles.mapWrapper}>
        <MapView style={styles.map} initialRegion={initialRegion}>
          {filteredLocations.map((loc) => (
            <Marker
              key={loc.id}
              coordinate={{ latitude: loc.lat, longitude: loc.lng }}
              onPress={() => setSelectedPlace(loc)}
            >
              <View
                style={[
                  styles.customMarker,
                  loc.type === "Bio" && { backgroundColor: "#795548" },
                ]}
              >
                <Text>
                  {loc.type === "Bio"
                    ? "🍂"
                    : loc.type === "Glass"
                      ? "🍾"
                      : "♻️"}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>

        <View style={styles.categoriesOverlay}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip label="Papir" icon="📄" color="#2196F3" />
            <FilterChip label="Plastika" icon="🟡" color="#FFEB3B" />
            <FilterChip label="Steklo" icon="🍾" color="#4CAF50" />
            <FilterChip label="Bio" icon="🍂" color="#795548" />
          </ScrollView>
        </View>
      </View>

      {/* Инфо картичка (Динамична) */}
      <View style={styles.infoCard}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=200",
          }}
          style={styles.locationImg}
        />
        <View style={styles.infoDetails}>
          <Text style={styles.closestTag}>Локација</Text>
          <Text style={styles.locationTitle}>{selectedPlace.title}</Text>
          <Text style={styles.locationItems}>{selectedPlace.address}</Text>
          <Text style={styles.openStatus}>🕒 Отворено 24/7</Text>
        </View>
        <TouchableOpacity style={styles.arrowBtn}>
          <Text style={{ color: "white", fontWeight: "bold" }}>↗</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomTab}>
        <TabItem
          label="Domov"
          icon="🏠"
          onPress={() => navigation.navigate("Dashboard")}
        />
        <TabItem label="Skeniraj" icon="🔍" />
        <TabItem label="Zemljevid" icon="📍" active={true} />
        <TabItem label="Lestvica" icon="🏆" />
        <TabItem label="Profil" icon="👤" />
      </View>
    </SafeAreaView>
  );
};

const FilterChip = ({ label, icon, color }: any) => (
  <TouchableOpacity style={styles.chip}>
    <Text style={{ color: color }}>{icon}</Text>
    <Text style={styles.chipText}>{label}</Text>
  </TouchableOpacity>
);

const TabItem = ({ label, icon, active, onPress }: any) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress}>
    <Text style={[styles.tabIcon, active && { color: "#4CAF50" }]}>{icon}</Text>
    <Text
      style={[
        styles.tabLabel,
        active && { color: "#4CAF50", fontWeight: "bold" },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default MapScreen;
