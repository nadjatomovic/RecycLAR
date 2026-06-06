import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/Bindetailscreen.styles";
import { getBinAsset } from "../utils/binAssets";
import BottomNavBar from "../components/BottomNavBar";
import DecorativeBackground from "../components/DecorativeBackground";

const BIN_DATA: Record<string, any> = {
  yellow: {
    label: "Zabojnik za embalažo",
    shortLabel: "Embalaža",
    color: "#F5B400",
    bgColor: "#FFF8E6",
    borderColor: "#F6D77A",
    image: "zutaKanta",
    allowed: [
      "Plastenke",
      "Pločevinke",
      "Tetrapak",
      "Plastična embalaža",
      "Kovinska embalaža",
    ],
    notAllowed: [
      "Ostanki hrane",
      "Steklo",
      "Papirnati robčki",
      "Nevarni odpadki",
      "Umazana embalaža",
    ],
    quickExamples: [
      { label: "Jogurtov lonček", value: "Dovoljeno", allowed: true },
      { label: "Pločevinka", value: "Dovoljeno", allowed: true },
      { label: "Mastna embalaža", value: "Ni dovoljeno", allowed: false },
    ],
    lariTip: "Embalažo prej izprazni in po potrebi stisni.",
  },

  blue: {
    label: "Zabojnik za papir",
    shortLabel: "Papir",
    color: "#2F80ED",
    bgColor: "#EBF4FF",
    borderColor: "#90C4F9",
    image: "modraKanta",
    allowed: [
      "Časopisi",
      "Revije",
      "Zvezki",
      "Karton",
      "Pisarniški papir",
      "Letaki",
    ],
    notAllowed: [
      "Masten papir",
      "Mokri papir",
      "Papirnati robčki",
      "Tetrapak",
      "Plastificiran papir",
    ],
    quickExamples: [
      { label: "Kartonska škatla", value: "Dovoljeno", allowed: true },
      { label: "Časopis", value: "Dovoljeno", allowed: true },
      { label: "Papirnati robček", value: "Ni dovoljeno", allowed: false },
    ],
    lariTip: "Papir in karton naj bosta čista in suha. Večje škatle zloži.",
  },

  red: {
    label: "Zabojnik za papir",
    shortLabel: "Papir",
    color: "#E54848",
    bgColor: "#FFF1F1",
    borderColor: "#F3B4B4",
    image: "rdecaKanta",
    allowed: [
      "Časopisi",
      "Revije",
      "Zvezki",
      "Karton",
      "Pisarniški papir",
      "Letaki",
    ],
    notAllowed: [
      "Masten papir",
      "Mokri papir",
      "Papirnati robčki",
      "Tetrapak",
      "Plastificiran papir",
    ],
    quickExamples: [
      { label: "Zvezek", value: "Dovoljeno", allowed: true },
      { label: "Karton", value: "Dovoljeno", allowed: true },
      { label: "Moker papir", value: "Ni dovoljeno", allowed: false },
    ],
    lariTip: "Papir naj bo čist in suh. Kartonske škatle pred odlaganjem zloži.",
  },

  green: {
    label: "Zabojnik za steklo",
    shortLabel: "Steklo",
    color: "#2FA84F",
    bgColor: "#EDFAF3",
    borderColor: "#92D9A8",
    image: "zelenaKanta",
    allowed: [
      "Steklenice",
      "Stekleni kozarci",
      "Steklena embalaža",
      "Kozarci za vlaganje",
    ],
    notAllowed: [
      "Pokrovčki",
      "Keramika",
      "Porcelan",
      "Ogledala",
      "Žarnice",
      "Okensko steklo",
    ],
    quickExamples: [
      { label: "Steklenica", value: "Dovoljeno", allowed: true },
      { label: "Kozarec za vlaganje", value: "Dovoljeno", allowed: true },
      { label: "Žarnica", value: "Ni dovoljeno", allowed: false },
    ],
    lariTip: "Stekleno embalažo izprazni. Pokrovčke odstrani in jih odloži med embalažo.",
  },

  white: {
    label: "Zabojnik za steklo",
    shortLabel: "Steklo",
    color: "#7A7A86",
    bgColor: "#F8F8FB",
    borderColor: "#DADAE3",
    image: "belaKanta",
    allowed: [
      "Steklenice",
      "Stekleni kozarci",
      "Steklena embalaža živil in pijač",
      "Kozarci za vlaganje",
    ],
    notAllowed: [
      "Pokrovčki",
      "Keramika",
      "Porcelan",
      "Ogledala",
      "Žarnice",
      "Ravno steklo",
    ],
    quickExamples: [
      { label: "Steklenica soka", value: "Dovoljeno", allowed: true },
      { label: "Kozarec za vlaganje", value: "Dovoljeno", allowed: true },
      { label: "Ogledalo", value: "Ni dovoljeno", allowed: false },
    ],
    lariTip: "Stekleno embalažo izprazni. Pokrovčke odstrani ter jih odloži med embalažo.",
  },

  brown: {
    label: "Zabojnik za BIO odpadke",
    shortLabel: "BIO",
    color: "#8B572A",
    bgColor: "#F9F0E8",
    borderColor: "#C8996A",
    image: "rjavaKanta",
    allowed: [
      "Olupki sadja",
      "Ostanki zelenjave",
      "Kavna usedlina",
      "Čajne vrečke",
      "Vrtni odpadki",
    ],
    notAllowed: [
      "Plastika",
      "Plastične vrečke",
      "Pepel",
      "Steklo",
      "Kovine",
    ],
    quickExamples: [
      { label: "Bananin olupek", value: "Dovoljeno", allowed: true },
      { label: "Kavna usedlina", value: "Dovoljeno", allowed: true },
      { label: "Plastična vrečka", value: "Ni dovoljeno", allowed: false },
    ],
    lariTip: "BIO odpadkov ne odlagaj v plastičnih vrečkah.",
  },

  mixed: {
    label: "Mešani komunalni odpadki",
    shortLabel: "Mešani",
    color: "#555555",
    bgColor: "#F4F4F4",
    borderColor: "#B8B8B8",
    image: "crnaKanta",
    allowed: [
      "Plenice",
      "Keramika",
      "Ohlajen pepel",
      "Umazani odpadki",
      "Manjši nereciklabilni odpadki",
    ],
    notAllowed: [
      "Elektronika",
      "Baterije",
      "Zdravila",
      "Nevarni odpadki",
      "Uporabna embalaža",
    ],
    quickExamples: [
      { label: "Stara plenica", value: "Dovoljeno", allowed: true },
      { label: "Keramična skodelica", value: "Dovoljeno", allowed: true },
      { label: "Baterija", value: "Ni dovoljeno", allowed: false },
    ],
    lariTip: "Mešani zabojnik je zadnja možnost — najprej preveri ostale zabojnike.",
  },

  special: {
    label: "Posebni odpadki",
    shortLabel: "Posebno",
    color: "#6B35C9",
    bgColor: "#F3EEFF",
    borderColor: "#D8C6FF",
    image: "specialDropoff",
    allowed: [
      "Baterije",
      "Elektronski odpadki",
      "Zdravila",
      "Barve in laki",
      "Olja",
    ],
    notAllowed: [
      "Običajna embalaža",
      "Čist papir",
      "BIO odpadki",
      "Steklena embalaža",
    ],
    quickExamples: [
      { label: "Baterija", value: "Zbirni center", allowed: true },
      { label: "Telefon", value: "Zbirni center", allowed: true },
      { label: "Plastenka", value: "Ni tukaj", allowed: false },
    ],
    lariTip: "Posebne in nevarne odpadke oddaj v zbirnem centru ali na posebnem zbirnem mestu.",
  },
};

const imageByMunicipalityAndBin: Record<string, Record<string, string>> = {
  Maribor: {
    yellow: "zutaKanta",
    red: "rdecaKanta",
    white: "belaKanta",
    brown: "rjavaKanta",
    mixed: "crnaKanta",
    special: "specialDropoff",
  },
  Ljubljana: {
    yellow: "zutaKanta",
    blue: "modraKanta",
    green: "zelenaKanta",
    brown: "rjavaKanta",
    mixed: "sivaKanta",
    special: "specialDropoff",
  },
  Kranj: {
    yellow: "kantaZRumenimPokrovom",
    blue: "modraKanta",
    green: "zelenaKanta",
    brown: "rjavaKanta",
    mixed: "sivaKanta",
    special: "specialDropoff",
  },
  Koper: {
    yellow: "zutaKanta",
    red: "rdecaKanta",
    green: "zelenaKanta",
    brown: "rjavaKanta",
    mixed: "crnaKanta",
    special: "specialDropoff",
  },
  Celje: {
    yellow: "zutaKanta",
    red: "rdecaKanta",
    white: "belaKanta",
    brown: "rjavaKanta",
    mixed: "zelenaKanta",
    special: "specialDropoff",
  },
};

export default function BinDetailScreen({ route, navigation }: any) {
  const binId = route?.params?.binId ?? "yellow";
  const municipality = route?.params?.municipality ?? "Maribor";

  const bin = BIN_DATA[binId] ?? BIN_DATA.yellow;
  const imageKey =
    imageByMunicipalityAndBin[municipality]?.[binId] ?? bin.image;

  return (
    <SafeAreaView style={styles.container}>
      <DecorativeBackground variant="default" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backText}>‹</Text>
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

          <View style={styles.headerSpacer} />
        </View>

        <View
          style={[
            styles.binHeroCard,
            {
              borderColor: bin.borderColor,
              backgroundColor: bin.bgColor,
            },
          ]}
        >
          <View style={styles.binHeroText}>
            <Text style={styles.overline}>Pravila ločevanja</Text>

            <Text style={[styles.binTitleText, { color: bin.color }]}>
              {bin.label}
            </Text>

            <Text style={styles.binMunicipality}>
              Občina{" "}
              <Text style={styles.binMunicipalityName}>{municipality}</Text>
            </Text>
          </View>

          <Image
            source={getBinAsset(imageKey)}
            style={styles.binTitleImg}
            resizeMode="contain"
          />
        </View>

        <View style={styles.rulesRow}>
          <View style={[styles.rulesCard, styles.allowedCard]}>
            <View style={styles.rulesCardHeader}>
              <View style={styles.allowedIconCircle}>
                <Text style={styles.allowedIcon}>✓</Text>
              </View>
              <Text style={styles.allowedTitle}>Dovoljeno</Text>
            </View>

            {bin.allowed.map((item: string) => (
              <View key={item} style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>•</Text>
                <Text style={styles.ruleLabel}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.rulesCard, styles.notAllowedCard]}>
            <View style={styles.rulesCardHeader}>
              <View style={styles.notAllowedIconCircle}>
                <Text style={styles.notAllowedIcon}>×</Text>
              </View>
              <Text style={styles.notAllowedTitle}>Ni dovoljeno</Text>
            </View>

            {bin.notAllowed.map((item: string) => (
              <View key={item} style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>•</Text>
                <Text style={styles.ruleLabel}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.examplesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hitri primeri</Text>
            <Text style={styles.sectionSubtitle}>Preveri v sekundi</Text>
          </View>

          <View style={styles.examplesRow}>
            {bin.quickExamples.map((ex: any) => (
              <View key={ex.label} style={styles.exampleCard}>
                <Text style={styles.exampleLabel}>{ex.label}</Text>
                <Text
                  style={[
                    styles.exampleBin,
                    { color: ex.allowed ? bin.color : "#E53935" },
                  ]}
                >
                  {ex.allowed ? "✓ " : "× "}
                  {ex.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.lariRow}>
          <Image
            source={require("../assets/lari-hello.png")}
            style={styles.lariImg}
            resizeMode="contain"
          />

          <View style={styles.lariBubble}>
            <Text style={styles.lariLabel}>Larijev nasvet</Text>
            <Text style={styles.lariTipText}>{bin.lariTip}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.loginHint}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.85}
        >
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar
        navigation={navigation}
        activeRoute="Dashboard"
        municipality={municipality}
      />
    </SafeAreaView>
  );
}