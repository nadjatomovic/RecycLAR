import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { styles } from "../styles/MapScreen.styles";
import BottomNavBar from "../components/BottomNavBar";

const { width, height } = Dimensions.get("window");

const CITY_COORDINATES: Record<string, any> = {
  Maribor: {
    latitude: 46.5547,
    longitude: 15.6459,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  },
  Celje: {
    latitude: 46.236,
    longitude: 15.267,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  },
  Ljubljana: {
    latitude: 46.0569,
    longitude: 14.5058,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  },
  Kranj: {
    latitude: 46.2389,
    longitude: 14.3556,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  },
  Koper: {
    latitude: 45.5469,
    longitude: 13.7294,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  },
};

const FILTERS = [
  { label: "Vse", type: "all", color: "#6B35C9" },
  { label: "EKO otok", type: "eco", color: "#35A936" },
  { label: "Zbirni center", type: "collection_center", color: "#F59E0B" },
  { label: "BIO", type: "bio_bin", color: "#8A5A32" },
  { label: "Embalaža", type: "packaging_bin", color: "#F2B400" },
];

const getMarkerColor = (type: string) => {
  if (type === "collection_center") return "#F59E0B";
  if (type === "bio_bin") return "#8A5A32";
  if (type === "packaging_bin") return "#F2B400";
  if (type === "special_dropoff") return "#6B35C9";
  return "#35A936";
};

const getMarkerIcon = (type: string) => {
  if (type === "collection_center") return "Z";
  if (type === "bio_bin") return "B";
  if (type === "packaging_bin") return "E";
  if (type === "special_dropoff") return "P";
  return "♻";
};

export default function MapScreen({ route, navigation }: any) {
  const selectedMunicipality = route.params?.municipality || "Maribor";
  const municipalityIdLower = selectedMunicipality.toLowerCase();

  const mapRef = useRef<MapView | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);

  const [currentRegion, setCurrentRegion] = useState(
    CITY_COORDINATES[selectedMunicipality] || CITY_COORDINATES.Maribor
  );

  useEffect(() => {
    const newRegion =
      CITY_COORDINATES[selectedMunicipality] || CITY_COORDINATES.Maribor;

    setCurrentRegion(newRegion);

    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  }, [selectedMunicipality]);

  useEffect(() => {
    async function fetchLocations() {
      setLoading(true);

      try {
        const colRef = collection(db, "recyclingLocations");

        const locationsQuery = query(
          colRef,
          where("municipalityId", "==", municipalityIdLower)
        );

        const snapshot = await getDocs(locationsQuery);

        const fetched: any[] = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();

          fetched.push({
            id: docSnap.id,
            title: data.name || "EKO otok",
            lat: data.latitude,
            lng: data.longitude,
            address: data.address || "",
            type: data.type === "eco_island" ? "eco" : data.type,
            items: data.bins ? data.bins.join(", ") : "Vsi tipi zabojnikov",
            bins: data.bins || [],
            provider: data.provider || "",
            active: data.active ?? true,
            ...data,
          });
        });

        setLocations(fetched);
        setSelectedLocation(fetched[0] ?? null);
      } catch (error) {
        console.log("Napaka pri nalaganju lokacij:", error);
        setLocations([]);
        setSelectedLocation(null);
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, [selectedMunicipality]);

  const triggerAddressSearch = async (text: string) => {
    if (text.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchingAddress(true);

      const queryUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        `${text}, ${selectedMunicipality}, Slovenia`
      )}&limit=5&addressdetails=1`;

      const response = await fetch(queryUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": "RecycLarSloveniaWasteManagementAppV1",
        },
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.log("Napaka pri iskanju naslova:", err);
    } finally {
      setSearchingAddress(false);
    }
  };

  const handleSearchTextChange = (text: string) => {
    setSearchQuery(text);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (text.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      triggerAddressSearch(text);
    }, 600);
  };

  const handleSelectPrediction = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);

    const newRegion = {
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    setCurrentRegion(newRegion);

    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1200);
    }

    setSearchQuery(item.display_name.split(",")[0]);
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const filteredLocations = locations.filter((loc) => {
    return activeFilter === "all" || loc.type === activeFilter;
  });

  const focusLocation = (location: any) => {
    if (!location?.lat || !location?.lng) return;

    const newRegion = {
      latitude: Number(location.lat),
      longitude: Number(location.lng),
      latitudeDelta: 0.008,
      longitudeDelta: 0.008,
    };

    setSelectedLocation(location);
    setCurrentRegion(newRegion);

    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 800);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={[styles.brandText, styles.brandGreen]}>Recyc</Text>
          <Text style={[styles.brandText, styles.brandPurple]}>LAR</Text>
        </View>

        <View style={styles.cityPill}>
          <Text style={styles.cityPillText}>📍 {selectedMunicipality}</Text>
        </View>
      </View>

      <View style={styles.titleSection}>
        <View style={styles.titleTextWrap}>
          <Text style={styles.mainTitle}>Zemljevid</Text>
          <Text style={styles.subTitle}>
            Poišči najbližji EKO otok ali zbirni center.
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Poišči ulico v tem mestu..."
            placeholderTextColor="#7A7A86"
            value={searchQuery}
            onChangeText={handleSearchTextChange}
          />

          {searchingAddress && (
            <ActivityIndicator size="small" color="#6B35C9" />
          )}
        </View>

        {searchResults.length > 0 && (
          <View style={styles.suggestionsBox}>
            <ScrollView keyboardShouldPersistTaps="handled">
              {searchResults.map((item, index) => (
                <TouchableOpacity
                  key={`${item.place_id}-${index}`}
                  style={[
                    styles.suggestionItem,
                    index === searchResults.length - 1 &&
                      styles.suggestionItemLast,
                  ]}
                  onPress={() => handleSelectPrediction(item)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.suggestionText} numberOfLines={1}>
                    📍 {item.display_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.filtersWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((filter) => (
            <FilterChip
              key={filter.type}
              label={filter.label}
              type={filter.type}
              active={activeFilter === filter.type}
              onPress={setActiveFilter}
              color={filter.color}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.mapWrapper}>
        {loading ? (
          <View style={styles.mapLoader}>
            <ActivityIndicator size="large" color="#6B35C9" />
            <Text style={styles.mapLoaderText}>Nalagam lokacije...</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={currentRegion}
            region={currentRegion}
            onPress={() => setSearchResults([])}
          >
            {filteredLocations.map((loc) => {
              if (!loc.lat || !loc.lng) return null;

              return (
                <Marker
                  key={loc.id}
                  coordinate={{
                    latitude: Number(loc.lat),
                    longitude: Number(loc.lng),
                  }}
                  title={loc.title}
                  description={`Naslov: ${loc.address} | Zabojniki: ${loc.items}`}
                  onPress={() => setSelectedLocation(loc)}
                >
                  <View
                    style={[
                      styles.customMarker,
                      { backgroundColor: getMarkerColor(loc.type) },
                    ]}
                  >
                    <Text style={styles.markerIcon}>
                      {getMarkerIcon(loc.type)}
                    </Text>
                  </View>
                </Marker>
              );
            })}
          </MapView>
        )}

        {!loading && filteredLocations.length === 0 && (
          <View style={styles.emptyMapCard}>
            <Text style={styles.emptyMapIcon}>🌱</Text>
            <Text style={styles.emptyMapTitle}>Ni lokacij</Text>
            <Text style={styles.emptyMapText}>
              Za ta filter trenutno ni prikazanih lokacij.
            </Text>
          </View>
        )}

        {selectedLocation && (
          <View style={styles.infoCard}>
            <View style={styles.infoIconBox}>
              <Text style={styles.infoIconText}>
                {getMarkerIcon(selectedLocation.type)}
              </Text>
            </View>

            <View style={styles.infoDetails}>
              <Text style={styles.closestTag}>Izbrana lokacija</Text>
              <Text style={styles.locationTitle} numberOfLines={1}>
                {selectedLocation.title}
              </Text>
              <Text style={styles.locationItems} numberOfLines={1}>
                {selectedLocation.address || "Naslov ni vpisan"}
              </Text>
              <Text style={styles.openStatus}>
                Zabojniki: {selectedLocation.items}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.arrowBtn}
              activeOpacity={0.85}
              onPress={() => focusLocation(selectedLocation)}
            >
              <Text style={styles.arrowText}>⌖</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <BottomNavBar navigation={navigation} activeRoute={"Map" as any} />
    </SafeAreaView>
  );
}

const FilterChip = ({ label, type, active, onPress, color }: any) => (
  <TouchableOpacity
    onPress={() => onPress(type)}
    style={[
      styles.chip,
      active && {
        backgroundColor: color,
        borderColor: color,
      },
    ]}
    activeOpacity={0.85}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);