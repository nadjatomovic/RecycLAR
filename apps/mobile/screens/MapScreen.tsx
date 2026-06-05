import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { styles } from "../styles/MapScreen.styles";
import BottomNavBar from "../components/BottomNavBar";
import DecorativeBackground from "../components/DecorativeBackground";
import { loadCity } from "../utils/cityStorage";

const { width, height } = Dimensions.get("window");

const CITY_COORDINATES: Record<string, any> = {
  Maribor: { lat: 46.5547, lng: 15.6459, zoom: 13 },
  Celje: { lat: 46.236, lng: 15.267, zoom: 13 },
  Ljubljana: { lat: 46.0569, lng: 14.5058, zoom: 12 },
  Kranj: { lat: 46.2389, lng: 14.3556, zoom: 13 },
  Koper: { lat: 45.5469, lng: 13.7294, zoom: 13 },
};

const FILTERS = [
  { label: "Vse", type: "all", color: "#6B35C9" },
  { label: "EKO otok", type: "eco_island", color: "#35A936" },
  { label: "Zbirni center", type: "collection_center", color: "#F59E0B" },
  { label: "BIO", type: "bio_bin", color: "#8A5A32" },
  { label: "Embalaža", type: "packaging_bin", color: "#F2B400" },
];

export default function MapScreen({ route, navigation }: any) {
  const [selectedMunicipality, setSelectedMunicipality] =
    useState<string>("Maribor");

  useFocusEffect(
    useCallback(() => {
      loadCity().then((city) => {
        setSelectedMunicipality(city);
      });
    }, []),
  );

  const municipalityIdLower = selectedMunicipality.toLowerCase();
  const currentCoords =
    CITY_COORDINATES[selectedMunicipality] || CITY_COORDINATES.Maribor;

  const webViewRef = useRef<WebView | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [addressResults, setAddressResults] = useState<any[]>([]);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    async function fetchLocations() {
      setLoading(true);
      try {
        const colRef = collection(db, "recyclingLocations");
        const locationsQuery = query(
          colRef,
          where("municipalityId", "==", municipalityIdLower),
        );
        const snapshot = await getDocs(locationsQuery);

        const fetched: any[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetched.push({
            id: docSnap.id,
            title: data.name || "EKO otok",
            lat: Number(data.latitude),
            lng: Number(data.longitude),
            address: data.address || "",
            type: data.type,
            items: data.bins ? data.bins.join(", ") : "Vsi tipi zabojnikov",
            bins: data.bins || [],
            provider: data.provider || "",
            active: data.active ?? true,
          });
        });

        setLocations(fetched);
        if (fetched.length > 0) setSelectedLocation(fetched[0]);
        else setSelectedLocation(null);
      } catch (error) {
        console.log("Firebase Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLocations();
  }, [selectedMunicipality]);

  const filteredLocations = locations.filter((loc) => {
    return activeFilter === "all" || loc.type === activeFilter;
  });

  const sendMarkersToMap = () => {
    if (!webViewRef.current) return;

    webViewRef.current.postMessage(
      JSON.stringify({
        center: currentCoords,
        markers: filteredLocations,
      }),
    );
  };

  useEffect(() => {
    if (isMapReady && !loading) {
      sendMarkersToMap();
    }
  }, [filteredLocations, currentCoords, loading, isMapReady]);

  const searchStreetsOnInternet = async (text: string) => {
    if (text.trim().length < 3) {
      setAddressResults([]);
      return;
    }
    try {
      setSearchingAddress(true);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        `${text}, ${selectedMunicipality}, Slovenia`,
      )}&limit=4`;
      const response = await fetch(url, {
        headers: { "User-Agent": "RecycLAR-Mobile-App" },
      });
      const data = await response.json();
      setAddressResults(data);
    } catch (err) {
      console.log("Search error:", err);
    } finally {
      setSearchingAddress(false);
    }
  };

  const handleSearchTextChange = (text: string) => {
    setSearchQuery(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (text.trim().length === 0) {
      setAddressResults([]);
      return;
    }
    searchTimeoutRef.current = setTimeout(
      () => searchStreetsOnInternet(text),
      600,
    );
  };

  const handleSelectStreet = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          center: { lat, lng: lon, zoom: 16 },
          markers: filteredLocations,
        }),
      );
    }
    setSearchQuery(item.display_name.split(",")[0]);
    setAddressResults([]);
    Keyboard.dismiss();
  };

  const focusLocation = (location: any) => {
    if (!location?.lat || !location?.lng) return;
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          center: { lat: location.lat, lng: location.lng, zoom: 16 },
          markers: filteredLocations,
        }),
      );
    }
  };

  const mapHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" crossOrigin="anonymous" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js" crossOrigin="anonymous"></script>
    <style>
      body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; background: #EFEFF4; }
      .custom-icon { background: transparent !important; border: none !important; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${currentCoords.lat}, ${currentCoords.lng}], ${currentCoords.zoom || 13});
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      var markerGroup = L.layerGroup().addTo(map);
      
      function emitReady() {
        if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({ type: "MAP_READY" }));
        else setTimeout(emitReady, 100);
      }
      window.onload = function() { emitReady(); };
      
     function getMarkerColor(type) {
  if (type === "collection_center") return "#F59E0B";
  if (type === "bio_bin") return "#8A5A32";
  if (type === "packaging_bin") return "#F2B400";
  return "#35A936";
}

      function getMarkerIcon(type) {
        if (type === "collection_center") return "Z";
        if (type === "bio_bin") return "B";
        if (type === "packaging_bin") return "E";
        return "♻";
      }

      function renderMarkers(markers) {
        markerGroup.clearLayers();

        if (!markers || !Array.isArray(markers)) return;

        markers.forEach(function(loc) {
          var lat = Number(loc.lat);
          var lng = Number(loc.lng);

          if (!lat || !lng) return;

          var color = getMarkerColor(loc.type);
          var iconText = getMarkerIcon(loc.type);

          var icon = L.divIcon({
            className: "custom-icon",
            html:
              '<div style="' +
              'background-color:' + color + ';' +
              'width:42px;' +
              'height:42px;' +
              'border-radius:21px;' +
              'border:3px solid white;' +
              'display:flex;' +
              'align-items:center;' +
              'justify-content:center;' +
              'color:white;' +
              'font-weight:900;' +
              'font-size:17px;' +
              'box-shadow:0 4px 10px rgba(0,0,0,0.35);' +
              '">' + iconText + '</div>',
            iconSize: [42, 42],
            iconAnchor: [21, 21]
          });

          L.marker([lat, lng], { icon: icon })
            .addTo(markerGroup)
            .on("click", function() {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: "MARKER_CLICK", location: loc })
              );
            });
        });
      }

      function handleMessage(e) {
        try {
          var rawData = e.data;

          if (typeof rawData !== "string") return;

          var data = JSON.parse(rawData);

          if (data.type === "MAP_READY") return;

          if (data.center) {
            map.setView(
              [Number(data.center.lat), Number(data.center.lng)],
              data.center.zoom || 14
            );
          }

          renderMarkers(data.markers);
        } catch(err) {
          console.log("Map message error", err);
        }
      }

      window.addEventListener("message", handleMessage);
      document.addEventListener("message", handleMessage);
    </script>
  </body>
  </html>
`;

  return (
    <SafeAreaView style={styles.container}>
      <DecorativeBackground variant="map" />
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Poišči ulico ali lokacijo..."
            placeholderTextColor="#7A7A86"
            value={searchQuery}
            onChangeText={handleSearchTextChange}
          />
          {searchingAddress && (
            <ActivityIndicator size="small" color="#6B35C9" />
          )}
        </View>
        {addressResults.length > 0 && (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 8,
              marginTop: 5,
              padding: 5,
              maxHeight: 200,
              borderWidth: 1,
              borderColor: "#EFEFF4",
              zIndex: 999,
            }}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              {addressResults.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#EFEFF4",
                  }}
                  onPress={() => handleSelectStreet(item)}
                >
                  <Text
                    style={{ fontSize: 14, color: "#1C1C1E" }}
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
          <WebView
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: mapHtml }}
            style={styles.map}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoadEnd={() => {
              setTimeout(() => {
                sendMarkersToMap();
              }, 500);
            }}
            onMessage={(event) => {
              try {
                const res = JSON.parse(event.nativeEvent.data);
                if (res.type === "MAP_READY") {
                  setIsMapReady(true);

                  setTimeout(() => {
                    sendMarkersToMap();
                  }, 300);
                } else if (res.type === "MARKER_CLICK")
                  setSelectedLocation(res.location);
              } catch (e) {}
            }}
          />
        )}
        {selectedLocation && (
          <View style={styles.infoCard}>
            <View style={styles.infoIconBox}>
              <Text style={styles.infoIconText}>
                {selectedLocation.type === "collection_center"
                  ? "Z"
                  : selectedLocation.type === "bio_bin"
                    ? "B"
                    : selectedLocation.type === "packaging_bin"
                      ? "E"
                      : "♻"}
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
            </View>
            <TouchableOpacity
              style={styles.arrowBtn}
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
      active && { backgroundColor: color, borderColor: color },
    ]}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);
