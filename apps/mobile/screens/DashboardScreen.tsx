import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/DashboardScreen.styles";
import BottomNavBar from "../components/BottomNavBar";

const bins = [
  { id: "yellow", label: "Rumeni", img: require("../assets/bin-yellow.png") },
  { id: "blue", label: "Modri", img: require("../assets/bin-blue.png") },
  { id: "green", label: "Zeleni", img: require("../assets/bin-green.png") },
  { id: "brown", label: "Rjavi", img: require("../assets/bin-brown.png") },
  { id: "mixed", label: "Mešani", img: require("../assets/bin-black.png") },
];

const quickExamples = [
  {
    title: "Plastenka",
    bin: "Rumeni",
    itemImg: require("../assets/plastic-bottle.png"),
    binImg: require("../assets/bin-yellow.png"),
    color: "#F2B400",
  },
  {
    title: "Papir",
    bin: "Modri",
    itemImg: require("../assets/paper.png"),
    binImg: require("../assets/bin-blue.png"),
    color: "#2B7DE9",
  },
  {
    title: "Steklenica",
    bin: "Zeleni",
    itemImg: require("../assets/glass-bottle.png"),
    binImg: require("../assets/bin-green.png"),
    color: "#32A852",
  },
  {
    title: "Bio odpadki",
    bin: "Rjavi",
    itemImg: require("../assets/banana.png"),
    binImg: require("../assets/bin-brown.png"),
    color: "#8A5A32",
  },
];

const DashboardScreen = ({ navigation, route }: any) => {
  const selectedCity = route?.params?.selectedCity ?? "Maribor";

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
          <Text style={styles.topBrandText}>
            <Text style={styles.topBrandGreen}>Recyc</Text>
            <Text style={styles.topBrandPurple}>LAR</Text>
          </Text>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Pozdravljeni!</Text>
          <Text style={styles.welcomeSub}>
            Pripravljeni ste za hitro ločevanje{"\n"}odpadkov brez prijave.
          </Text>
        </View>

        <View style={styles.locationCard}>
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.changeLocation}>Spremeni občino ›</Text>
            </TouchableOpacity>
          </View>
        </View>

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

        {/* Bins row — tap to see bin details */}
        <View style={styles.binsRow}>
          {bins.map((bin) => (
            <TouchableOpacity
              key={bin.id}
              style={styles.binCard}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("BinDetail", {
                  binId: bin.id,
                  municipality: selectedCity, // ← ПРОМЕНА: пращаме градот
                })
              }
            >
              <Image
                source={bin.img}
                style={styles.binImg}
                resizeMode="contain"
              />
              <Text style={styles.binLabel}>{bin.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.rulesHint}>
          Tapni zabojnik za pravila:{" "}
          <Text style={styles.allowedText}>Dovoljeno</Text>
          {" / "}
          <Text style={styles.notAllowedText}>Ni dovoljeno</Text>
        </Text>

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
                source={example.binImg}
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
          <Text style={styles.loginHintIcon}>♢</Text>
          <Text style={styles.loginHintText}>
            Želiš preveriti svoje znanje?{" "}
            <Text style={styles.loginHintLink}>Prijavi se</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar navigation={navigation} activeRoute="Dashboard" />
    </SafeAreaView>
  );
};

export default DashboardScreen;
