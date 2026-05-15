import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { styles } from "../styles/MapScreen.styles";

const DUMMY_LOCATIONS = [
  {
    id: "1",
    title: "EKO otok Tabor",
    lat: 46.558,
    lng: 15.646,
    type: "eco",
    address: "Ulica heroja Šlandra",
    items: "Papir, steklo, embalaža",
    distance: "350 m",
  },
  {
    id: "2",
    title: "Zbirno mesto Center",
    lat: 46.552,
    lng: 15.642,
    type: "glass",
    address: "Partizanska cesta",
    items: "Steklo",
    distance: "520 m",
  },
  {
    id: "3",
    title: "Zabojnik za papir",
    lat: 46.56,
    lng: 15.65,
    type: "paper",
    address: "Titova cesta",
    items: "Papir",
    distance: "700 m",
  },
  {
    id: "4",
    title: "EKO točka Lent",
    lat: 46.557,
    lng: 15.64,
    type: "plastic",
    address: "Dravska ulica",
    items: "Plastika, embalaža",
    distance: "850 m",
  },
  {
    id: "5",
    title: "Bio zabojnik Tabor",
    lat: 46.554,
    lng: 15.651,
    type: "bio",
    address: "Pobreška cesta",
    items: "Bio odpadki",
    distance: "1.1 km",
  },
];

const getMarkerStyle = (type: string) => {
  switch (type) {
    case "paper":
      return { backgroundColor: "#2B7DE9" };
    case "plastic":
      return { backgroundColor: "#F3B400" };
    case "glass":
      return { backgroundColor: "#36A936" };
    case "bio":
      return { backgroundColor: "#8A5A32" };
    case "eco":
    default:
      return { backgroundColor: "#6B35C9" };
  }
};

const getMarkerIcon = (type: string) => {
  switch (type) {
    case "paper":
      return "▤";
    case "plastic":
      return "▣";
    case "glass":
      return "♙";
    case "bio":
      return "♧";
    case "eco":
    default:
      return "⌂";
  }
};

const MapScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(DUMMY_LOCATIONS);
  const [selectedPlace, setSelectedPlace] = useState(DUMMY_LOCATIONS[0]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    const filtered = DUMMY_LOCATIONS.filter(
      (loc) =>
        loc.title.toLowerCase().includes(text.toLowerCase()) ||
        loc.address.toLowerCase().includes(text.toLowerCase()) ||
        loc.items.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredLocations(filtered);
  };

  const initialRegion = {
    latitude: 46.5547,
    longitude: 15.6459,
    latitudeDelta: 0.035,
    longitudeDelta: 0.035,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Image
            source={require("../assets/icon-logo.png")}
            style={styles.brandIcon}
            resizeMode="contain"
          />

          <Text style={styles.brandText}>
            <Text style={styles.brandGreen}>Recyc</Text>
            <Text style={styles.brandPurple}>LAR</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.8}>
          <Text style={styles.notificationText}>⌕</Text>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <View style={styles.titleTextWrap}>
          <Text style={styles.mainTitle}>Zemljevid</Text>
          <Text style={styles.subTitle}>
            Poišči najbližje zbiralnike{"\n"}in EKO otoke v svoji okolici.
          </Text>
        </View>

        <Image
          source={require("../assets/lari-hello.png")}
          style={styles.mascotSmall}
          resizeMode="contain"
        />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            placeholder="Išči naslov, kraj ali lokacijo"
            placeholderTextColor="#8A8A96"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
          />

          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
            <Text style={styles.filterText}>☷</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapWrapper}>
        <MapView style={styles.map} initialRegion={initialRegion}>
          {filteredLocations.map((loc) => (
            <Marker
              key={loc.id}
              coordinate={{ latitude: loc.lat, longitude: loc.lng }}
              onPress={() => setSelectedPlace(loc)}
            >
              <View style={[styles.customMarker, getMarkerStyle(loc.type)]}>
                <Text style={styles.markerIcon}>{getMarkerIcon(loc.type)}</Text>
              </View>
            </Marker>
          ))}
        </MapView>

        <View style={styles.floatingMapButtons}>
          <TouchableOpacity style={styles.mapCircleBtn}>
            <Text style={styles.mapCircleIcon}>⌖</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mapCircleBtn}>
            <Text style={styles.mapCircleIcon}>◎</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesOverlay}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip label="Papir" icon="▤" color="#2B7DE9" />
            <FilterChip label="Plastika" icon="▣" color="#F3B400" />
            <FilterChip label="Steklo" icon="♙" color="#36A936" />
            <FilterChip label="Bio" icon="♧" color="#8A5A32" />
            <FilterChip label="EKO otoki" icon="⌂" color="#6B35C9" active />
          </ScrollView>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.locationImgWrap}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=300",
            }}
            style={styles.locationImg}
          />

          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>↘ {selectedPlace.distance}</Text>
          </View>
        </View>

        <View style={styles.infoDetails}>
          <Text style={styles.closestTag}>Najbližje</Text>
          <Text style={styles.locationTitle}>{selectedPlace.title}</Text>

          <View style={styles.typeDotsRow}>
            <View style={[styles.typeDot, { backgroundColor: "#2B7DE9" }]} />
            <View style={[styles.typeDot, { backgroundColor: "#36A936" }]} />
            <View style={[styles.typeDot, { backgroundColor: "#F3B400" }]} />
          </View>

          <Text style={styles.locationItems}>{selectedPlace.items}</Text>
          <Text style={styles.openStatus}>◷ Odprto 24/7</Text>
        </View>

        <TouchableOpacity style={styles.favoriteBtn} activeOpacity={0.8}>
          <Text style={styles.favoriteIcon}>♡</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.arrowBtn} activeOpacity={0.9}>
          <Text style={styles.arrowText}>↗</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomTab}>
        <TabItem
          label="Domov"
          icon="⌂"
          onPress={() => navigation.navigate("Dashboard")}
        />
        <TabItem label="Skeniraj" icon="⌗" />
        <TabItem label="Zemljevid" icon="⌖" active />
        <TabItem label="Lestvica" icon="♕" />
        <TabItem
        label="Profil"
        icon="♙"
        onPress={() => navigation.navigate("Profile")}
        />
      </View>
    </SafeAreaView>
  );
};

const FilterChip = ({ label, icon, color, active }: any) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive]}
    activeOpacity={0.8}
  >
    <Text style={[styles.chipIcon, { color }]}>{icon}</Text>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const TabItem = ({ label, icon, active, onPress }: any) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.8}>
    <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{icon}</Text>
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default MapScreen;