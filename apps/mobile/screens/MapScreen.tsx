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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { styles } from "../styles/MapScreen.styles";
import BottomNavBar from "../components/BottomNavBar";

const { width, height } = Dimensions.get("window");

// Статични податоци за резерва (fallback)
const FALLBACK_LOCATIONS: Record<string, any[]> = {
  Maribor: [
    {
      id: "mb-1",
      title: "EKO otok Tabor",
      lat: 46.548,
      lng: 15.646,
      type: "eco",
      address: "Ulica heroja Šlandra",
      items: "Papir, steklo, embalaža",
    },
    {
      id: "mb-2",
      title: "Zbirno mesto Center",
      lat: 46.559,
      lng: 15.642,
      type: "glass",
      address: "Partizanska cesta",
      items: "Steklo",
    },
    {
      id: "mb-3",
      title: "Zabojnik za papir",
      lat: 46.552,
      lng: 15.65,
      type: "paper",
      address: "Titova cesta",
      items: "Papir",
    },
  ],
  Ljubljana: [
    {
      id: "lj-1",
      title: "EKO otok Tivoli",
      lat: 46.055,
      lng: 14.496,
      type: "eco",
      address: "Celovška cesta",
      items: "Vse vrste odpadkov",
    },
  ],
};

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

export default function MapScreen({ route, navigation }: any) {
  const selectedMunicipality = route.params?.municipality || "Maribor";
  const mapRef = useRef<MapView | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentRegion, setCurrentRegion] = useState(
    CITY_COORDINATES[selectedMunicipality] || CITY_COORDINATES["Maribor"],
  );

  // Тајмер за Debounce пребарувањето
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const newRegion =
      CITY_COORDINATES[selectedMunicipality] || CITY_COORDINATES["Maribor"];
    setCurrentRegion(newRegion);
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  }, [selectedMunicipality]);

  useEffect(() => {
    async function fetchLocations() {
      setLoading(true);
      try {
        const colRef = collection(
          db,
          "municipalities",
          selectedMunicipality,
          "wasteLocations",
        );
        const snapshot = await getDocs(colRef);

        if (!snapshot.empty) {
          const fetched: any[] = [];
          snapshot.forEach((doc) => {
            fetched.push({ id: doc.id, ...doc.data() });
          });
          setLocations(fetched);
        } else {
          setLocations(FALLBACK_LOCATIONS[selectedMunicipality] || []);
        }
      } catch (error) {
        console.log("Error fetching locations, using fallback:", error);
        setLocations(FALLBACK_LOCATIONS[selectedMunicipality] || []);
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, [selectedMunicipality]);

  // Извршување на реалниот повик до серверот (Се активира само кога корисникот ќе застане со пишување)
  const triggerAddressSearch = async (text: string) => {
    if (text.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchingAddress(true);
      const queryUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        text + ", " + selectedMunicipality + ", Slovenia",
      )}&limit=5&addressdetails=1`;

      const response = await fetch(queryUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // Важно: Клучен уникатен User-Agent за да не не блокираат како спам бот
          "User-Agent": "RecycLarSloveniaWasteManagementAppV1",
        },
      });

      // Безбедносна проверка дали одговорот е навистина JSON а не HTML грешка
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.log(
          "Серверот врати невалиден формат (Веројатно привремен лимит).",
        );
      }
    } catch (err) {
      console.log("Napaka pri iskanju naslova:", err);
    } finally {
      setSearchingAddress(false);
    }
  };

  // Функција што реагира додека корисникот внесува букви (Вграден заштитен тајмер)
  const handleSearchTextChange = (text: string) => {
    setSearchQuery(text);

    // Ако има претходно поставен тајмер, откажи го (корисникот уште пишува)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (text.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    // Постави нов тајмер - почекај 600 милисекунди мирно пишување пред да пратиш API повик
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
      latitudeDelta: 0.005, // Повеќе приближено за убаво да се видат контејнерите на таа улица
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={[styles.brandText, styles.brandGreen]}>Recyc</Text>
          <Text style={[styles.brandText, styles.brandPurple]}>Lar</Text>
        </View>
        <View
          style={{
            backgroundColor: "#EFE8FF",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#6B35C9", fontWeight: "700", fontSize: 14 }}>
            📍 {selectedMunicipality}
          </Text>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={{ paddingHorizontal: 22, marginBottom: 10, zIndex: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={{
              flex: 1,
              height: 46,
              backgroundColor: "#F8F8FB",
              borderRadius: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: "#ECECF2",
              fontSize: 14,
              color: "#252733",
            }}
            placeholder="Poišči ulico v tem mestu..."
            placeholderTextColor="#7A7A86"
            value={searchQuery}
            onChangeText={handleSearchTextChange}
          />
          {searchingAddress && (
            <ActivityIndicator
              size="small"
              color="#6B35C9"
              style={{ position: "absolute", right: 16 }}
            />
          )}
        </View>

        {/* Dropdown Suggestions List */}
        {searchResults.length > 0 && (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#ECECF2",
              marginTop: 4,
              maxHeight: 220,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              position: "absolute",
              top: 48,
              left: 22,
              right: 22,
              zIndex: 999,
            }}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              {searchResults.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    padding: 12,
                    borderBottomWidth: idx === searchResults.length - 1 ? 0 : 1,
                    borderBottomColor: "#F4F4F6",
                  }}
                  onPress={() => handleSelectPrediction(item)}
                >
                  <Text
                    style={{ fontSize: 13, color: "#252733" }}
                    numberOfLines={1}
                  >
                    📍 {item.display_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Filter Chips */}
      <View style={{ height: 40, marginBottom: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 22, gap: 8 }}
        >
          <FilterChip
            label="Vse"
            type="all"
            active={activeFilter === "all"}
            onPress={setActiveFilter}
            color="#6B35C9"
          />
          <FilterChip
            label="EKO otok"
            type="eco"
            active={activeFilter === "eco"}
            onPress={setActiveFilter}
            color="#35A936"
          />
          <FilterChip
            label="Papir"
            type="paper"
            active={activeFilter === "paper"}
            onPress={setActiveFilter}
            color="#2B7DE9"
          />
          <FilterChip
            label="Steklo"
            type="glass"
            active={activeFilter === "glass"}
            onPress={setActiveFilter}
            color="#F2B400"
          />
          <FilterChip
            label="Plastika"
            type="plastic"
            active={activeFilter === "plastic"}
            onPress={setActiveFilter}
            color="#EF4444"
          />
        </ScrollView>
      </View>

      {/* Map Content */}
      <View
        style={{
          width: width,
          height: height - 280,
          backgroundColor: "#EFEFF4",
        }}
      >
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#6B35C9" />
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={{ width: "100%", height: "100%" }}
            initialRegion={currentRegion}
          >
            {filteredLocations.map((loc) => (
              <Marker
                key={loc.id}
                coordinate={{ latitude: loc.lat, longitude: loc.lng }}
                title={loc.title}
                description={`${loc.address} - ${loc.items}`}
              />
            ))}
          </MapView>
        )}
      </View>

      <BottomNavBar navigation={navigation} activeRoute="Map" />
    </SafeAreaView>
  );
}

const FilterChip = ({ label, type, active, onPress, color }: any) => (
  <TouchableOpacity
    onPress={() => onPress(type)}
    style={{
      paddingHorizontal: 16,
      height: 34,
      borderRadius: 17,
      backgroundColor: active ? color : "#F8F8FB",
      borderWidth: 1,
      borderColor: active ? color : "#ECECF2",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text
      style={{
        color: active ? "#FFFFFF" : "#7A7A86",
        fontWeight: "600",
        fontSize: 13,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
