import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "../styles/DashboardScreen.styles";
import BottomNavBar from "../components/BottomNavBar";
import DecorativeBackground from "../components/DecorativeBackground";
import { getBinAsset } from "../utils/binAssets";
import { saveCity, loadCity } from "../utils/cityStorage";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import LottieView from "lottie-react-native";

const binsByMunicipality: Record<string, any[]> = {
  Maribor: [
    { id: "yellow", label: "Embalaža", image: "zutaKanta" },
    { id: "red", label: "Papir", image: "rdecaKanta" },
    { id: "white", label: "Steklo", image: "belaKanta" },
    { id: "brown", label: "BIO", image: "rjavaKanta" },
    { id: "mixed", label: "Mešani", image: "crnaKanta" },
  ],
  Ljubljana: [
    { id: "yellow", label: "Embalaža", image: "zutaKanta" },
    { id: "blue", label: "Papir", image: "modraKanta" },
    { id: "green", label: "Steklo", image: "zelenaKanta" },
    { id: "brown", label: "BIO", image: "rjavaKanta" },
    { id: "mixed", label: "Mešani", image: "sivaKanta" },
  ],
  Kranj: [
    { id: "yellow", label: "Embalaža", image: "kantaZRumenimPokrovom" },
    { id: "blue", label: "Papir", image: "modraKanta" },
    { id: "green", label: "Steklo", image: "zelenaKanta" },
    { id: "brown", label: "BIO", image: "rjavaKanta" },
    { id: "mixed", label: "Mešani", image: "sivaKanta" },
  ],
  Koper: [
    { id: "yellow", label: "Embalaža", image: "zutaKanta" },
    { id: "red", label: "Papir", image: "rdecaKanta" },
    { id: "green", label: "Steklo", image: "zelenaKanta" },
    { id: "brown", label: "BIO", image: "rjavaKanta" },
    { id: "mixed", label: "Mešani", image: "crnaKanta" },
  ],
  Celje: [
    { id: "yellow", label: "Embalaža", image: "zutaKanta" },
    { id: "red", label: "Papir", image: "rdecaKanta" },
    { id: "white", label: "Steklo", image: "belaKanta" },
    { id: "brown", label: "BIO", image: "rjavaKanta" },
    { id: "mixed", label: "Mešani", image: "zelenaKanta" },
  ],
};

const quickExamples = [
  {
    title: "Plastenka",
    bin: "Embalaža",
    itemImg: require("../assets/plastic-bottle.png"),
    image: "zutaKanta",
  },
  {
    title: "Papir",
    bin: "Papir",
    itemImg: require("../assets/paper.png"),
    image: "modraKanta",
  },
  {
    title: "Steklenica",
    bin: "Steklo",
    itemImg: require("../assets/glass-bottle.png"),
    image: "zelenaKanta",
  },
  {
    title: "Bio odpadki",
    bin: "BIO",
    itemImg: require("../assets/banana.png"),
    image: "rjavaKanta",
  },
];

const DashboardScreen = ({ navigation, route }: any) => {
  const [selectedCity, setSelectedCity] = useState<string>("Maribor");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("Eko Junak");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Состојба за dropdown менито

  const citiesList = Object.keys(binsByMunicipality);

  useFocusEffect(
    useCallback(() => {
      const cityFromParams = route?.params?.selectedCity;
      if (cityFromParams) {
        setSelectedCity(cityFromParams);
        saveCity(cityFromParams);
      } else {
        loadCity().then((city) => setSelectedCity(city));
      }
    }, [route?.params?.selectedCity]),
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        if (user.displayName) {
          setUserName(user.displayName);
        } else {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const name = userData.firstName || userData.name || "Eko Junak";
              setUserName(name);
            }
          } catch (error) {
            console.log("Error fetching user name:", error);
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    });

    return unsubscribe;
  }, []);

  const bins =
    binsByMunicipality[selectedCity] ?? binsByMunicipality["Maribor"];

  return (
    <SafeAreaView style={styles.container}>
      <DecorativeBackground variant="home_auth" />
      {/* ГОРНА ЛЕНТА: Додадено копче за враќање на почетниот HomeScreen */}
      <View style={styles.topBrandRow}>
        <TouchableOpacity
          style={styles.topBackButton}
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.7}
        >
          <Text style={styles.topBackText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.brandLogoWrapper}>
          <Image
            source={require("../assets/icon-logo.png")}
            style={styles.topBrandIcon}
            resizeMode="contain"
          />
          <Text style={styles.topBrandText}>
            <Text style={styles.topBrandGreen}>Recyc</Text>
            <Text style={styles.topBrandPurple}>LAR</Text>
          </Text>
        </View>
        <View style={styles.placeholderSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            {isLoggedIn && userName
              ? `Pozdravljeni, ${userName}! 👋`
              : "Pozdravljeni!"}
          </Text>
          <Text style={styles.welcomeSub}>
            {isLoggedIn
              ? "Pripravljeni ste na pravilno ločevanje odpadkov in zbiranje točk."
              : "Pripravljeni ste za hitro ločevanje odpadkov brez prijave."}
          </Text>
        </View>

        {/* КАРТИЧКА ЗА ЛОКАЦИЈА: Сега го отвора/затвора Dropdown-от на клик */}
        <TouchableOpacity
          style={styles.locationCard}
          activeOpacity={0.85}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <View style={styles.locationIconBg}>
            <Image
              source={require("../assets/location-icon.png")}
              style={styles.locationIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.locationTextWrap}>
            <Text style={styles.locationLabel}>Izbrana občina</Text>
            <Text style={styles.locationName}>{selectedCity}</Text>
            <Text style={styles.changeLocation}>
              {isDropdownOpen ? "Zapri izbor ▴" : "Spremeni občino ▾"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* МОДЕРЕН DROPDOWN: Се прикажува веднаш под картичката */}
        {isDropdownOpen && (
          <View style={styles.dropdownContainer}>
            {citiesList.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.dropdownItem,
                  selectedCity === city && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setSelectedCity(city);
                  saveCity(city);
                  setIsDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedCity === city && styles.dropdownItemTextActive,
                  ]}
                >
                  {city}
                </Text>
                {selectedCity === city && (
                  <Text style={styles.dropdownCheckmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.mascotArea}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              <Text style={styles.speechStrong}>Skeniraj odpadek</Text> in
              {"\n"}takoj preveri, kam spada!
            </Text>

            <View style={styles.speechBubbleTailShadow} />
            <View style={styles.speechBubbleTail} />
          </View>
         <View style={styles.mascotShadowWrap}>
            <LottieView
              source={require("../assets/animations/MahanjeAnimacija.json")}
              style={styles.mascotImage}
              autoPlay
              loop
              resizeMode="contain"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          activeOpacity={0.92}
          onPress={() => navigation.navigate("Scanner")}
        >
          <View style={styles.scanGlowCircle} />

          <View style={styles.scanIconCircle}>
            <Image
              source={require("../assets/camera-icon.png")}
              style={styles.scanCameraIcon}
              resizeMode="contain"
            />
          </View>

          <View style={styles.scanTextWrap}>
            <View style={styles.scanBadge}>
              <Text style={styles.scanBadgeText}>SKENER Z AI-TEHNOLOGIJO</Text>
            </View>

            <Text style={styles.scanButtonText}>Začni skeniranje</Text>
            <Text style={styles.scanButtonSubtext}>
              Fotografiraj odpadek in takoj preveri kam spada
            </Text>
          </View>

          <View style={styles.scanArrowCircle}>
            <Text style={styles.scanArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Zabojniki</Text>
          <Text style={styles.sectionSubtitle}>Tapni za pravila</Text>
        </View>

        <View style={styles.binsRow}>
          {bins.map((bin) => (
            <TouchableOpacity
              key={bin.id}
              style={styles.binCard}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("BinDetail", {
                  binId: bin.id,
                  municipality: selectedCity,
                })
              }
            >
              <Image
                source={getBinAsset(bin.image)}
                style={styles.binImg}
                resizeMode="contain"
              />
              <Text style={styles.binLabel} numberOfLines={1}>
                {bin.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.rulesHint}>
          Pravila: <Text style={styles.allowedText}>Dovoljeno</Text>
          {" / "}
          <Text style={styles.notAllowedText}>Ni dovoljeno</Text>
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hitri primeri</Text>
          <Text style={styles.sectionSubtitle}>Za lažji začetek</Text>
        </View>

        <View style={styles.examplesGrid}>
          {quickExamples.map((example) => (
            <View key={example.title} style={styles.exampleCard}>
              <View style={styles.exampleVisualRow}>
                <View style={styles.exampleIconBox}>
                  <Image
                    source={example.itemImg}
                    style={styles.exampleWasteImg}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.exampleArrowCircle}>
                  <Text style={styles.exampleArrow}>→</Text>
                </View>

                <View style={styles.exampleIconBox}>
                  <Image
                    source={getBinAsset(example.image)}
                    style={styles.exampleBinImg}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <Text style={styles.exampleTitle}>Hiter primer</Text>

              <Text
                style={styles.exampleName}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {example.title}
              </Text>

              <Text style={styles.exampleBinName} numberOfLines={1}>
                {example.bin}
              </Text>
            </View>
          ))}
        </View>

        {!isLoggedIn && (
          <TouchableOpacity
            style={styles.loginHint}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginHintIcon}>🎓</Text>
            <Text style={styles.loginHintText}>
              Želiš preveriti svoje znanje?{" "}
              <Text style={styles.loginHintLink}>Prijavi se</Text>
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <BottomNavBar
        navigation={navigation}
        activeRoute="Dashboard"
        municipality={selectedCity}
      />
    </SafeAreaView>
  );
};

export default DashboardScreen;
