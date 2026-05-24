import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/DashboardScreen.styles";
import BottomNavBar from "../components/BottomNavBar";
import { getBinAsset } from "../utils/binAssets";

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
  const selectedCity = route?.params?.selectedCity ?? "Maribor";
  const bins = binsByMunicipality[selectedCity] ?? binsByMunicipality.Maribor;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topBrandRow}>
          <Image
            source={require("../assets/icon-logo.png")}
            style={styles.topBrandIcon}
            resizeMode="contain"
          />

          <Image
            source={require("../assets/logo.png")}
            style={styles.topBrandLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Pozdravljeni!</Text>
          <Text style={styles.welcomeSub}>
            Pripravljeni ste za hitro ločevanje odpadkov brez prijave.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.locationCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Home")}
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
            <Text style={styles.changeLocation}>Spremeni občino ›</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.mascotArea}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              <Text style={styles.speechStrong}>Skeniraj odpadek</Text> in
              {"\n"}takoj preveri, kam spada!
            </Text>
          </View>

          <Image
            source={require("../assets/lari-hello.png")}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Scanner")}
        >
          <Image
            source={require("../assets/camera-icon.png")}
            style={styles.scanCameraIcon}
            resizeMode="contain"
          />

          <Text style={styles.scanButtonText}>Začni skeniranje</Text>

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
              <Image
                source={example.itemImg}
                style={styles.exampleWasteImg}
                resizeMode="contain"
              />

              <View style={styles.exampleMiddle}>
                <Text style={styles.exampleTitle}>Hiter primer</Text>
                <Text style={styles.exampleName}>{example.title}</Text>
              </View>

              <Text style={styles.exampleArrow}>→</Text>

              <Image
                source={getBinAsset(example.image)}
                style={styles.exampleBinImg}
                resizeMode="contain"
              />
            </View>
          ))}
        </View>

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