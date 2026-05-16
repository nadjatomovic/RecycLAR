import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/Bindetailscreen.styles";

const BIN_DATA: Record<string, any> = {
  yellow: {
    label: "Rumeni zabojnik",
    color: "#F5A623",
    bgColor: "#FFF8ED",
    borderColor: "#FFD580",
    img: require("../assets/bin-yellow.png"),
    allowed: [
      { label: "Plastenke", emoji: "🍶" },
      { label: "Pločevinke", emoji: "🥫" },
      { label: "Tetrapak", emoji: "🧃" },
      { label: "Plastična embalaža", emoji: "📦" },
      { label: "Čista embalaža", emoji: "✨" },
    ],
    notAllowed: [
      { label: "Ostanki hrane", emoji: "🍎" },
      { label: "Steklo", emoji: "🍾" },
      { label: "Papirnati robčki", emoji: "🧻" },
      { label: "Nevarni odpadki", emoji: "☢️" },
      { label: "Umazana embalaža", emoji: "🗑️" },
    ],
    quickExamples: [
      { label: "Jogurtov lonček", bin: "Rumeni", allowed: true },
      { label: "Pločevinka", bin: "Rumeni", allowed: true },
      { label: "Mastna embalaža", bin: "Ni dovoljeno", allowed: false },
    ],
    lariTip: "Embalažo prej izprazni in po potrebi stisni!",
  },
  blue: {
    label: "Modri zabojnik",
    color: "#2F80ED",
    bgColor: "#EBF4FF",
    borderColor: "#90C4F9",
    img: require("../assets/bin-blue.png"),
    allowed: [
      { label: "Časopisi", emoji: "📰" },
      { label: "Karton", emoji: "📦" },
      { label: "Pisarniški papir", emoji: "📄" },
      { label: "Katalogi", emoji: "📚" },
      { label: "Papirnate vrečke", emoji: "🛍️" },
    ],
    notAllowed: [
      { label: "Mokri papir", emoji: "💧" },
      { label: "Plastika", emoji: "🧴" },
      { label: "Steklo", emoji: "🍾" },
      { label: "Papirnati robčki", emoji: "🧻" },
      { label: "Folija", emoji: "🎁" },
    ],
    quickExamples: [
      { label: "Kartonska škatla", bin: "Modri", allowed: true },
      { label: "Časopis", bin: "Modri", allowed: true },
      { label: "Papirnati robček", bin: "Ni dovoljeno", allowed: false },
    ],
    lariTip: "Kartonske škatle prej zloži, da zavzamejo manj prostora!",
  },
  green: {
    label: "Zeleni zabojnik",
    color: "#27AE60",
    bgColor: "#EDFAF3",
    borderColor: "#82D9A8",
    img: require("../assets/bin-green.png"),
    allowed: [
      { label: "Steklene steklenice", emoji: "🍾" },
      { label: "Kozarci", emoji: "🫙" },
      { label: "Steklena embalaža", emoji: "🍶" },
    ],
    notAllowed: [
      { label: "Porcelan", emoji: "🍽️" },
      { label: "Žarnice", emoji: "💡" },
      { label: "Ogledala", emoji: "🪞" },
      { label: "Plastika", emoji: "🧴" },
      { label: "Pokrovi", emoji: "🔩" },
    ],
    quickExamples: [
      { label: "Steklenica vina", bin: "Zeleni", allowed: true },
      { label: "Kozarec za džem", bin: "Zeleni", allowed: true },
      { label: "Žarnica", bin: "Ni dovoljeno", allowed: false },
    ],
    lariTip: "Steklenic ni treba prati, dovolj je da so prazne!",
  },
  brown: {
    label: "Rjavi zabojnik",
    color: "#8B572A",
    bgColor: "#F9F0E8",
    borderColor: "#C8996A",
    img: require("../assets/bin-brown.png"),
    allowed: [
      { label: "Ostanki hrane", emoji: "🍎" },
      { label: "Olupki", emoji: "🍌" },
      { label: "Kavna usedlina", emoji: "☕" },
      { label: "Čajne vrečke", emoji: "🍵" },
      { label: "Ostanki zelenjave", emoji: "🥦" },
    ],
    notAllowed: [
      { label: "Plastika", emoji: "🧴" },
      { label: "Meso in kosti", emoji: "🍖" },
      { label: "Oljna hrana", emoji: "🍟" },
      { label: "Pepel", emoji: "🪨" },
      { label: "Plastične vrečke", emoji: "🛍️" },
    ],
    quickExamples: [
      { label: "Olupki sadja", bin: "Rjavi", allowed: true },
      { label: "Kavna usedlina", bin: "Rjavi", allowed: true },
      { label: "Kosti", bin: "Ni dovoljeno", allowed: false },
    ],
    lariTip: "Biološke odpadke zavij v časopis, ne v plastično vrečko!",
  },
  mixed: {
    label: "Mešani zabojnik",
    color: "#555555",
    bgColor: "#F4F4F4",
    borderColor: "#AAAAAA",
    img: require("../assets/bin-black.png"),
    allowed: [
      { label: "Usnje", emoji: "👜" },
      { label: "Guma", emoji: "🔧" },
      { label: "Plenice", emoji: "👶" },
      { label: "Keramika", emoji: "🏺" },
      { label: "Pepel (ohlajen)", emoji: "🪨" },
    ],
    notAllowed: [
      { label: "Elektronika", emoji: "📱" },
      { label: "Nevarni odpadki", emoji: "☢️" },
      { label: "Zdravila", emoji: "💊" },
      { label: "Akumulatorji", emoji: "🔋" },
      { label: "Barvila", emoji: "🎨" },
    ],
    quickExamples: [
      { label: "Stara plenica", bin: "Mešani", allowed: true },
      { label: "Keramična skodelica", bin: "Mešani", allowed: true },
      { label: "Stara baterija", bin: "Ni dovoljeno", allowed: false },
    ],
    lariTip: "Mešani zabojnik je zadnja možnost — najprej preveri ostale!",
  },
};

export default function BinDetailScreen({ route, navigation }: any) {
  const binId = route?.params?.binId ?? "yellow";
  const municipality = route?.params?.municipality ?? "Maribor";
  const bin = BIN_DATA[binId];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

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

          <View style={{ width: 42 }} />
        </View>

        {/* Bin title card */}
        <View
          style={[
            styles.binTitleCard,
            { borderColor: bin.borderColor, backgroundColor: bin.bgColor },
          ]}
        >
          <Image
            source={bin.img}
            style={styles.binTitleImg}
            resizeMode="contain"
          />
          <View>
            <Text style={[styles.binTitleText, { color: bin.color }]}>
              {bin.label}
            </Text>
            <Text style={styles.binMunicipality}>
              Pravila za občino{" "}
              <Text style={styles.binMunicipalityName}>{municipality}</Text>
            </Text>
          </View>
        </View>

        {/* Allowed / Not allowed */}
        <View style={styles.rulesRow}>
          <View style={[styles.rulesCard, styles.allowedCard]}>
            <View style={styles.rulesCardHeader}>
              <View style={styles.allowedDot} />
              <Text style={styles.allowedTitle}>Dovoljeno</Text>
            </View>
            {bin.allowed.map((item: any) => (
              <View key={item.label} style={styles.ruleItem}>
                <Text style={styles.ruleEmoji}>{item.emoji}</Text>
                <Text style={styles.ruleLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.rulesCard, styles.notAllowedCard]}>
            <View style={styles.rulesCardHeader}>
              <View style={styles.notAllowedDot} />
              <Text style={styles.notAllowedTitle}>Ni dovoljeno</Text>
            </View>
            {bin.notAllowed.map((item: any) => (
              <View key={item.label} style={styles.ruleItem}>
                <Text style={styles.ruleEmoji}>{item.emoji}</Text>
                <Text style={styles.ruleLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Hitri primeri */}
        <View style={styles.examplesSection}>
          <Text style={styles.examplesSectionTitle}>⚡ Hitri primeri</Text>
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
                  → {ex.bin}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Lari tip */}
        <View style={styles.lariRow}>
          <Image
            source={require("../assets/lari-hello.png")}
            style={styles.lariImg}
            resizeMode="contain"
          />
          <View style={styles.lariBubble}>
            <Text style={styles.lariTipText}>{bin.lariTip}</Text>
          </View>
        </View>

        {/* Login hint */}
        <TouchableOpacity
          style={styles.loginHint}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.8}
        >
          <Text style={styles.loginHintText}>
            🎓 Želiš preveriti svoje znanje?{" "}
            <Text style={styles.loginHintLink}>Prijavi se</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom tab */}
      <View style={styles.bottomTab}>
        <TabItem
          label="Domov"
          icon="⌂"
          onPress={() => navigation.navigate("Dashboard")}
        />
        <TabItem label="Skeniraj" icon="⌗" />
        <TabItem
          label="Občina"
          icon="⌖"
          onPress={() => navigation.navigate("Map")}
        />
      </View>
    </SafeAreaView>
  );
}

const TabItem = ({ label, icon, active, onPress }: any) => (
  <TouchableOpacity
    style={styles.tabItem}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{icon}</Text>
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);
